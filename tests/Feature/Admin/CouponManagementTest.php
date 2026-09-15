<?php

use App\Enums\CouponType;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asAdmin()->create());
});

function couponPayload(array $overrides = []): array
{
    return array_merge([
        'code' => 'RAMADAN10',
        'type' => CouponType::Percentage->value,
        'value' => 10,
        'min_order_value' => null,
        'max_uses' => null,
        'is_active' => true,
    ], $overrides);
}

it('creates a coupon and normalises the code', function () {
    $this->post(route('admin.coupons.store'), couponPayload(['code' => ' eid-50 ']))
        ->assertRedirect()
        ->assertSessionHas('flash.success');

    $this->assertDatabaseHas('coupons', ['code' => 'EID-50', 'type' => 'percentage']);
});

it('caps a percentage coupon value at 100', function () {
    $this->post(route('admin.coupons.store'), couponPayload(['value' => 150]))
        ->assertRedirect();

    $this->assertDatabaseHas('coupons', ['code' => 'RAMADAN10', 'value' => 100]);
});

it('rejects a duplicate coupon code', function () {
    Coupon::factory()->create(['code' => 'TAKEN']);

    $this->post(route('admin.coupons.store'), couponPayload(['code' => 'taken']))
        ->assertSessionHasErrors('code');

    expect(Coupon::where('code', 'TAKEN')->count())->toBe(1);
});

it('updates a coupon', function () {
    $coupon = Coupon::factory()->percentage()->create();

    $this->put(route('admin.coupons.update', $coupon), [
        'code' => 'NEW20',
        'type' => CouponType::Percentage->value,
        'value' => 20,
        'is_active' => false,
    ])->assertRedirect();

    $this->assertDatabaseHas('coupons', ['id' => $coupon->id, 'code' => 'NEW20', 'value' => 20, 'is_active' => false]);
});

it('toggles and deletes a coupon', function () {
    $coupon = Coupon::factory()->create();

    $this->post(route('admin.coupons.toggle-active', $coupon))->assertRedirect();
    expect($coupon->refresh()->is_active)->toBeFalse();

    $this->delete(route('admin.coupons.destroy', $coupon))->assertRedirect();
    $this->assertDatabaseMissing('coupons', ['id' => $coupon->id]);
});

it('renders the coupon index with usage counts', function () {
    $coupon = Coupon::factory()->create();

    $this->get(route('admin.coupons.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/coupons/index')
            ->where('coupons.data.0.code', $coupon->code));
});

describe('checkout security', function () {
    it('applies a valid coupon at checkout and links the usage to the order', function () {
        $this->actingAs(User::factory()->asCustomer()->create());

        $product = Product::factory()->create([
            'price' => 100,
            'sale_price' => null,
            'stock_quantity' => 10,
        ]);
        $coupon = Coupon::factory()->percentage(10)->create();

        $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
        $this->post(route('checkout.store'), [
            'customer_name' => 'তামিম জিয়া',
            'customer_phone' => '01712345678',
            'delivery_address' => 'বাড়ি ১',
            'delivery_district' => 'মানিকগঞ্জ',
            'coupon_code' => $coupon->code,
        ])->assertRedirect();

        $order = Order::where('customer_phone', '01712345678')->firstOrFail();

        expect((float) $order->discount_amount)->toBe(20.0)
            ->and($order->coupon_code)->toBe($coupon->code)
            ->and((float) $order->total)->toBe(240.0);

        $this->assertDatabaseHas('coupon_usages', [
            'coupon_id' => $coupon->id,
            'order_id' => $order->id,
            'user_id' => auth()->id(),
        ]);
    });

    it('rejects a coupon that does not exist', function () {
        $product = Product::factory()->create(['price' => 100, 'stock_quantity' => 10]);

        $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
        $this->post(route('checkout.store'), [
            'customer_name' => 'তামিম জিয়া',
            'customer_phone' => '01712345678',
            'delivery_address' => 'বাড়ি ১',
            'delivery_district' => 'মানিকগঞ্জ',
            'coupon_code' => 'DOESNOTEXIST',
        ])->assertSessionHasErrors('coupon');

        $this->assertDatabaseCount('orders', 0);
    });

    it('rejects an exhausted coupon without creating an order', function () {
        $coupon = Coupon::factory()->limited(1)->create(['used_count' => 1]);
        $product = Product::factory()->create(['price' => 100, 'stock_quantity' => 10]);

        $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
        $this->post(route('checkout.store'), [
            'customer_name' => 'তামিম জিয়া',
            'customer_phone' => '01712345678',
            'delivery_address' => 'বাড়ি ১',
            'delivery_district' => 'মানিকগঞ্জ',
            'coupon_code' => $coupon->code,
        ])->assertSessionHasErrors('coupon');

        $this->assertDatabaseCount('orders', 0);
        expect($coupon->refresh()->used_count)->toBe(1);
    });

    it('rejects a coupon below the minimum order value', function () {
        $coupon = Coupon::factory()->percentage()->minOrder(300)->create();
        $product = Product::factory()->create(['price' => 100, 'stock_quantity' => 10]);

        $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
        $this->post(route('checkout.store'), [
            'customer_name' => 'তামিম জিয়া',
            'customer_phone' => '01712345678',
            'delivery_address' => 'বাড়ি ১',
            'delivery_district' => 'মানিকগঞ্জ',
            'coupon_code' => $coupon->code,
        ])->assertSessionHasErrors('coupon');

        $this->assertDatabaseCount('orders', 0);
    });

    it('rejects an expired coupon without creating an order', function () {
        $coupon = Coupon::factory()->percentage(10)->expired()->create();
        $product = Product::factory()->create(['price' => 100, 'stock_quantity' => 10]);

        $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
        $this->post(route('checkout.store'), [
            'customer_name' => 'তামিম জিয়া',
            'customer_phone' => '01712345678',
            'delivery_address' => 'বাড়ি ১',
            'delivery_district' => 'মানিকগঞ্জ',
            'coupon_code' => $coupon->code,
        ])->assertSessionHasErrors('coupon');

        $this->assertDatabaseCount('orders', 0);
    });

    it('rejects an inactive coupon without creating an order', function () {
        $coupon = Coupon::factory()->percentage(10)->inactive()->create();
        $product = Product::factory()->create(['price' => 100, 'stock_quantity' => 10]);

        $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);
        $this->post(route('checkout.store'), [
            'customer_name' => 'তামিম জিয়া',
            'customer_phone' => '01712345678',
            'delivery_address' => 'বাড়ি ১',
            'delivery_district' => 'মানিকগঞ্জ',
            'coupon_code' => $coupon->code,
        ])->assertSessionHasErrors('coupon');

        $this->assertDatabaseCount('orders', 0);
    });
});
