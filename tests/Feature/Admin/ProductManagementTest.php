<?php

use App\Models\Farmer;
use App\Models\Product;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asAdmin()->create());
});

it('renders a product with its farmer details', function () {
    $farmer = Farmer::factory()->approved()->create();
    $product = Product::factory()->create(['farmer_id' => $farmer->id]);

    $this->get(route('admin.products.show', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/show')
            ->where('product.farmer.display_name', $farmer->display_name));
});

it('updates curatorial flags on a product', function () {
    $product = Product::factory()->create();

    $this->put(route('admin.products.update', $product), [
        'short_description' => 'নতুন বর্ণনা',
        'price' => 120,
        'sale_price' => 99,
        'unit' => 'kg',
        'min_order_quantity' => 1,
        'is_featured' => true,
    ])->assertRedirect();

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'short_description' => 'নতুন বর্ণনা',
        'price' => 120,
        'sale_price' => 99,
        'is_featured' => true,
    ]);
});

it('clears a sale price that is not cheaper than the price', function () {
    $product = Product::factory()->create(['price' => 120]);

    $this->put(route('admin.products.update', $product), [
        'price' => 120,
        'sale_price' => 150,
        'unit' => 'kg',
        'min_order_quantity' => 1,
    ]);

    $this->assertDatabaseHas('products', ['id' => $product->id, 'sale_price' => null]);
});

it('rejects a negative stock update', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);

    $this->patch(route('admin.products.stock', $product), ['stock_quantity' => -1])
        ->assertSessionHasErrors('stock_quantity');

    expect($product->refresh()->stock_quantity)->toBe(10);
});

it('updates the stock quantity and logs it', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);

    $this->patch(route('admin.products.stock', $product), ['stock_quantity' => 3])
        ->assertRedirect();

    expect($product->refresh()->stock_quantity)->toBe(3);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'product.stock_updated',
        'target_type' => 'product',
        'target_id' => $product->id,
    ]);
});

it('hides a visible product through moderation', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $this->post(route('admin.products.toggle-active', $product))->assertRedirect();

    expect($product->refresh()->is_active)->toBeFalse();
});