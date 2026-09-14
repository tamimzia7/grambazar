<?php

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

it('lists active products on the shop page', function () {
    $products = Product::factory()->count(3)->create();

    $response = $this->get(route('shop.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('shop/index')
            ->has('products.data', 3)
            ->where('products.total', 3)
            ->where('activeCategory', null));

    $categories = collect($response->viewData('page')['props']['categories']);
    expect($categories)->toHaveCount($products->count());
    expect($categories->pluck('slug'))
        ->toContain($products[0]->category->slug);
});

it('hides inactive products from the shop listing', function () {
    Product::factory()->create();
    Product::factory()->inactive()->create();

    $this->get(route('shop.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('shop/index')
            ->where('products.total', 1));
});

it('filters products by category including child categories', function () {
    $root = Category::factory()->create();
    $child = Category::factory()->childOf($root)->create();
    Product::factory()->create([
        'category_id' => $root->id,
        'name' => 'রুট আইটেম',
        'slug' => 'root-item',
    ]);
    Product::factory()->create([
        'category_id' => $child->id,
        'name' => 'চাইল্ড আইটেম',
        'slug' => 'child-item',
    ]);

    $this->get(route('shop.category', ['category' => $root->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('shop/index')
            ->where('products.total', 2)
            ->where('activeCategory.slug', $root->slug));

    $this->get(route('shop.category', ['category' => $child->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.total', 1)
            ->where('activeCategory.slug', $child->slug));
});

it('searches products by name', function () {
    Product::factory()->create([
        'name' => 'তাজা পাবদা মাছ',
        'slug' => 'taja-pabda',
    ]);
    Product::factory()->create([
        'name' => 'বাসমতি চাল',
        'slug' => 'basmati-chal',
    ]);

    $this->get(route('shop.index').'?q=পাবদা')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.total', 1)
            ->where('products.data.0.slug', 'taja-pabda')
            ->where('search', 'পাবদা'));
});

it('sorts by selling price ascending', function () {
    Product::factory()->create([
        'name' => 'ছাড় পণ্য',
        'slug' => 'discount-item',
        'price' => 100,
        'sale_price' => 80,
    ]);
    Product::factory()->create([
        'name' => 'সাধারণ পণ্য',
        'slug' => 'regular-item',
        'price' => 150,
        'sale_price' => null,
    ]);
    Product::factory()->create([
        'name' => 'দামি পণ্য',
        'slug' => 'expensive-item',
        'price' => 200,
        'sale_price' => null,
    ]);

    $this->get(route('shop.index').'?sort=price_asc')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.slug', 'discount-item')
            ->where('products.data.1.slug', 'regular-item')
            ->where('products.data.2.slug', 'expensive-item')
            ->where('sort', 'price_asc'));
});

it('shows product details with an approved farmer', function () {
    $farmer = Farmer::factory()->approved()->create([
        'display_name' => 'কৃষক রহিম',
        'village' => 'সিংগাইর',
        'district' => 'মানিকগঞ্জ',
    ]);
    $product = Product::factory()->create(['farmer_id' => $farmer->id]);
    Product::factory()->count(2)->create([
        'category_id' => $product->category_id,
    ]);

    $this->get(route('products.show', $product->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('products/show')
            ->where('product.slug', $product->slug)
            ->where('product.farmer.display_name', 'কৃষক রহিম')
            ->where('product.farmer.location', 'সিংগাইর, মানিকগঞ্জ')
            ->has('related', 2));
});

it('hides the seller of a product whose farmer is not approved', function () {
    $farmer = Farmer::factory()->pending()->create();
    $product = Product::factory()->create(['farmer_id' => $farmer->id]);

    $this->get(route('products.show', $product->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('product.farmer', null));
});

it('returns 404 for a product that is not purchasable', function () {
    $product = Product::factory()->inactive()->create();

    $this->get(route('products.show', $product->slug))
        ->assertNotFound();
});
