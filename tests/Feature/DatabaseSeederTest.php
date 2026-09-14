<?php

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\User;

it('seeds demo categories, users and products without real data', function () {
    $this->seed();

    expect(Category::count())->toBe(7)
        ->and(User::where('role', 'super_admin')->count())->toBe(1)
        ->and(User::where('email', 'admin@grambazar.test')->exists())->toBeTrue()
        ->and(Farmer::where('approval_status', 'approved')->count())->toBe(1)
        ->and(Farmer::where('approval_status', 'pending')->count())->toBe(1)
        ->and(Product::count())->toBe(12)
        ->and(Product::where('is_popular', true)->count())->toBe(4)
        ->and(Product::where('is_seasonal', true)->count())->toBe(3)
        ->and(Product::where('is_featured', true)->count())->toBe(2);
});

it('is safe to re-run and keeps demo counts stable', function () {
    $this->seed();
    $this->seed();

    expect(User::where('email', 'farmer@grambazar.test')->count())->toBe(1)
        ->and(Product::count())->toBe(12);
});
