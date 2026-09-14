<?php

use App\Enums\ProductUnit;
use App\Models\Order;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

function checkoutPayload(array $overrides = []): array
{
    return array_merge([
        'customer_name' => 'তামিম জিয়া',
        'customer_phone' => '01712345678',
        'customer_email' => 'tamim@example.com',
        'delivery_address' => 'বাড়ি ১২, রোড ৫',
        'delivery_area' => 'সিংগাইর',
        'delivery_district' => 'মানিকগঞ্জ',
        'delivery_instructions' => 'বিকেলের আগে দিন',
    ], $overrides);
}

it('places an order from the guest cart', function () {
    $product = Product::factory()->create([
        'price' => 100,
        'sale_price' => null,
        'stock_quantity' => 10,
        'unit' => ProductUnit::Kilogram,
    ]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);

    $this->post(route('checkout.store'), checkoutPayload())
        ->assertRedirect();

    $order = Order::where('customer_phone', '01712345678')->first();

    expect($order)->not->toBeNull();
    expect((float) $order->subtotal)->toBe(200.0)
        ->and((float) $order->delivery_charge)->toBe(60.0)
        ->and((float) $order->total)->toBe(260.0)
        ->and($order->order_status->value)->toBe('pending')
        ->and($order->payment_method->value)->toBe('cod')
        ->and($order->user_id)->toBeNull();

    $item = $order->items()->first();
    expect($item->product_name)->toBe($product->name)
        ->and((float) $item->unit_price)->toBe(100.0)
        ->and((float) $item->quantity)->toBe(2.0)
        ->and((float) $item->subtotal)->toBe(200.0);

    expect($product->refresh()->stock_quantity)->toBe(8);

    $this->get(route('orders.show', ['order' => $order->order_number]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/show')
            ->where('order.order_number', $order->order_number));
});

it('uses the discounted price when a product is on sale', function () {
    $product = Product::factory()->create([
        'price' => 100,
        'sale_price' => 80,
        'stock_quantity' => 10,
    ]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 3]);
    $this->post(route('checkout.store'), checkoutPayload());

    $item = Order::firstOrFail()->items()->first();

    expect((float) $item->unit_price)->toBe(80.0)
        ->and((float) $item->subtotal)->toBe(240.0);
});

it('waives the delivery charge above the free delivery threshold', function () {
    $product = Product::factory()->create([
        'price' => 1200,
        'sale_price' => null,
        'stock_quantity' => 5,
    ]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 1]);
    $this->post(route('checkout.store'), checkoutPayload());

    $order = Order::firstOrFail();

    expect((float) $order->subtotal)->toBe(1200.0)
        ->and((float) $order->delivery_charge)->toBe(0.0)
        ->and((float) $order->total)->toBe(1200.0);
});

it('clears the cart after a successful order', function () {
    $product = Product::factory()->create(['stock_quantity' => 5]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 1]);
    $this->post(route('checkout.store'), checkoutPayload());

    $this->get(route('cart.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('items', 0)
            ->where('count', 0));
});

it('rejects an empty cart at checkout', function () {
    $this->post(route('checkout.store'), checkoutPayload())
        ->assertRedirect(route('cart.index'))
        ->assertSessionHas('flash.error');

    expect(Order::count())->toBe(0);
});

it('validates the checkout payload', function () {
    $this->post(route('checkout.store'), [])
        ->assertRedirect()
        ->assertSessionHasErrors([
            'customer_name',
            'customer_phone',
            'delivery_address',
            'delivery_district',
        ]);
});

it('rejects an invalid phone number', function () {
    $this->post(route('checkout.store'), checkoutPayload(['customer_phone' => 'abc']))
        ->assertSessionHasErrors('customer_phone');
});

it('fails the order when stock runs out between cart and checkout', function () {
    $product = Product::factory()->create([
        'price' => 100,
        'stock_quantity' => 2,
    ]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
    $product->update(['stock_quantity' => 1]);

    $this->post(route('checkout.store'), checkoutPayload())
        ->assertSessionHasErrors('cart');

    expect(Order::count())->toBe(0)
        ->and($product->refresh()->stock_quantity)->toBe(1);
});

it('fails the order when a product becomes inactive between cart and checkout', function () {
    $product = Product::factory()->create(['stock_quantity' => 5]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 1]);
    $product->update(['is_active' => false]);

    $this->post(route('checkout.store'), checkoutPayload())
        ->assertSessionHasErrors('cart');

    expect(Order::count())->toBe(0);
});
