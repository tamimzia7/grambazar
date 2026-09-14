<?php

use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

it('adds a product to the guest cart', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);

    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ])->assertRedirect()->assertSessionHas('flash.success');

    $this->get(route('cart.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cart/index')
            ->where('items.0.id', $product->id)
            ->where('items.0.quantity', 2)
            ->where('count', 2));
});

it('adds the minimum order quantity when quantity is omitted', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'min_order_quantity' => 3,
    ]);

    $this->post(route('cart.add'), ['product_id' => $product->id])
        ->assertRedirect();

    $this->get(route('cart.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('items.0.quantity', 3));
});

it('merges repeated additions into one cart line', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 3]);

    $this->get(route('cart.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('items', 1)
            ->where('items.0.quantity', 5)
            ->where('count', 5));
});

it('rejects a quantity below the minimum order quantity', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'min_order_quantity' => 3,
    ]);

    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertSessionHasErrors('cart');

    expect(session('errors')->get('cart')[0])->toContain('সর্বনিম্ন 3 কেজি');
});

it('rejects a quantity above the available stock', function () {
    $product = Product::factory()->create(['stock_quantity' => 4]);

    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 5,
    ])->assertSessionHasErrors('cart');

    expect(session('errors')->get('cart')[0])->toContain('শুধু 4 কেজি');
});

it('rejects adding a product that no longer exists', function () {
    $this->post(route('cart.add'), [
        'product_id' => 999999,
        'quantity' => 1,
    ])->assertSessionHasErrors('cart');
});

it('rejects adding an inactive product', function () {
    $product = Product::factory()->inactive()->create();

    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertSessionHasErrors('cart');
});

it('updates the exact quantity of a cart line', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
    $this->post(route('cart.update'), [
        'product_id' => $product->id,
        'quantity' => 6,
    ])->assertRedirect();

    $this->get(route('cart.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('items.0.quantity', 6)
            ->where('count', 6));
});

it('rejects a cart update below the minimum or above the stock', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 5,
        'min_order_quantity' => 2,
    ]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
    $this->post(route('cart.update'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertSessionHasErrors('cart');

    expect(session('errors')->get('cart')[0])->toContain('সর্বনিম্ন 2 কেজি');

    $this->post(route('cart.update'), [
        'product_id' => $product->id,
        'quantity' => 9,
    ])->assertSessionHasErrors('cart');

    expect(session('errors')->get('cart')[0])->toContain('শুধু 5 কেজি');
});

it('removes a product from the cart', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 1]);
    $this->post(route('cart.remove'), ['product_id' => $product->id])->assertRedirect();

    $this->get(route('cart.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('items', 0)
            ->where('count', 0));
});

it('flags an item as unavailable when the stock drops below the cart quantity', function () {
    $product = Product::factory()->create(['stock_quantity' => 5]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 4]);

    $product->update(['stock_quantity' => 2]);

    $this->get(route('cart.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('items', 0)
            ->has('unavailableItems', 1)
            ->where('unavailableItems.0.id', $product->id)
            ->where('subtotal', 0));
});

it('computes subtotals and totals server-side', function () {
    $product = Product::factory()->create(['price' => 100, 'sale_price' => 80]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 3]);

    $this->get(route('cart.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('items.0.price', 100)
            ->where('items.0.sale_price', 80)
            ->where('items.0.subtotal', 240)
            ->where('subtotal', 240));
});
