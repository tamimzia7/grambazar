<?php

use App\Enums\ProductUnit;
use App\Http\Requests\Product\StoreProductRequest;
use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;

it('belongs to a category and a farmer', function () {
    $farmer = Farmer::factory()->approved()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'farmer_id' => $farmer->id,
        'category_id' => $category->id,
    ]);

    expect($product->category->is($category))->toBeTrue()
        ->and($product->farmer->is($farmer))->toBeTrue();
});

it('enforces unique product slugs', function () {
    Product::factory()->create(['slug' => 'siddho-chal']);

    expect(fn () => Product::factory()->create(['slug' => 'siddho-chal']))
        ->toThrow(QueryException::class);
});

it('defaults to an active product sold per kilogram', function () {
    $product = Product::factory()->create();

    expect($product->is_active)->toBeTrue()
        ->and($product->min_order_quantity)->toBe(1)
        ->and($product->unit)->toBe(ProductUnit::Kilogram)
        ->and($product->sale_price)->toBeNull();
});

it('stores multiple images and resolves the primary image', function () {
    $product = Product::factory()->create();
    ProductImage::factory()->count(2)->create([
        'product_id' => $product->id,
        'is_primary' => false,
    ]);
    $primary = ProductImage::factory()->create([
        'product_id' => $product->id,
        'is_primary' => true,
        'sort_order' => 1,
    ]);

    expect($product->images()->count())->toBe(3)
        ->and($product->primaryImage()->is($primary))->toBeTrue();
});

it('accepts a valid product payload', function () {
    $farmer = Farmer::factory()->approved()->create();
    $category = Category::factory()->create();

    $payload = [
        'farmer_id' => $farmer->id,
        'category_id' => $category->id,
        'name' => 'সিদ্ধ চাল',
        'slug' => 'siddho-chal',
        'price' => 85,
        'unit' => ProductUnit::Kilogram->value,
        'stock_quantity' => 100,
    ];

    $request = StoreProductRequest::create('/products', 'POST', $payload);

    expect(Validator::make($request->all(), $request->rules())->errors())->toBeEmpty();
});

it('rejects a negative price and negative stock', function () {
    $farmer = Farmer::factory()->approved()->create();
    $category = Category::factory()->create();

    $payload = [
        'farmer_id' => $farmer->id,
        'category_id' => $category->id,
        'name' => 'Bad Product',
        'slug' => 'bad-product',
        'price' => -5,
        'unit' => ProductUnit::Kilogram->value,
        'stock_quantity' => -1,
    ];

    $request = StoreProductRequest::create('/products', 'POST', $payload);

    expect(Validator::make($request->all(), $request->rules())->errors()->toArray())
        ->toHaveKeys(['price', 'stock_quantity']);
});

it('rejects a duplicate slug and an unknown unit', function () {
    Product::factory()->create(['slug' => 'siddho-chal']);
    $farmer = Farmer::factory()->approved()->create();
    $category = Category::factory()->create();

    $payload = [
        'farmer_id' => $farmer->id,
        'category_id' => $category->id,
        'name' => 'Duplicate',
        'slug' => 'siddho-chal',
        'price' => 100,
        'unit' => 'bucket',
        'stock_quantity' => 10,
    ];

    $request = StoreProductRequest::create('/products', 'POST', $payload);
    $errors = Validator::make($request->all(), $request->rules())->errors();

    expect($errors->has('slug'))->toBeTrue()
        ->and($errors->has('unit'))->toBeTrue();
});
