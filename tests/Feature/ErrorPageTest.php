<?php

use App\Models\Product;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders a friendly 404 error page', function () {
    $this->get('/definitely-not-a-real-page')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ErrorPage')
            ->where('status', 404));
});

it('renders a friendly 403 error page', function () {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asCustomer()->create());

    $this->get(route('admin.dashboard'))
        ->assertForbidden()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ErrorPage')
            ->where('status', 403));
});

it('renders a friendly 404 for a product that is not purchasable', function () {
    $product = Product::factory()->create(['is_active' => false]);

    $this->get(route('products.show', $product))
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ErrorPage')
            ->where('status', 404));
});

it('sends baseline security headers on web responses', function () {
    $this->get('/')
        ->assertOk()
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
        ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
});
