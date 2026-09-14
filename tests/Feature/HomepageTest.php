<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the homepage with database driven sections', function () {
    $this->seed();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('categories', 7)
            ->has('popularProducts', 4)
            ->has('seasonalProducts', 3)
            ->has('spiceProducts', 4)
            ->has('featuredProduct')
            ->where('stats.categories', 7)
            ->where('stats.products', 12)
            ->where('stats.farmers', 1)
        );
});

it('keeps the hero copy in Bengali', function () {
    $this->seed();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('categories.0.name', 'চাল')
            ->where('popularProducts.0.name', 'তাজা পাবদা মাছ')
        );
});
