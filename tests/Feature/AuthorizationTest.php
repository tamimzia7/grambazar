<?php

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\User;

it('defaults a new user to the customer role', function () {
    $user = User::factory()->create();

    expect($user->role)->toBe(UserRole::Customer)
        ->and($user->isCustomer())->toBeTrue()
        ->and($user->isAdministrator())->toBeFalse();
});

it('recognises administrator roles', function () {
    $admin = User::factory()->asAdmin()->create();
    $superAdmin = User::factory()->asSuperAdmin()->create();
    $farmer = User::factory()->asFarmer()->create();

    expect($admin->isAdministrator())->toBeTrue()
        ->and($superAdmin->isAdministrator())->toBeTrue()
        ->and($admin->isSuperAdmin())->toBeFalse()
        ->and($farmer->isAdministrator())->toBeFalse();
});

it('allows only farmers and administrators to create products', function () {
    $farmer = User::factory()->asFarmer()->create();
    $customer = User::factory()->asCustomer()->create();
    $admin = User::factory()->asAdmin()->create();

    expect($farmer->can('create', Product::class))->toBeTrue()
        ->and($admin->can('create', Product::class))->toBeTrue()
        ->and($customer->can('create', Product::class))->toBeFalse();
});

it('allows farmers to update their own products but not another farmer', function () {
    $owner = User::factory()->asFarmer()->create();
    $other = User::factory()->asFarmer()->create();
    $admin = User::factory()->asAdmin()->create();

    $ownerFarmer = Farmer::factory()->forUser($owner)->approved()->create();
    $otherFarmer = Farmer::factory()->forUser($other)->approved()->create();

    $ownProduct = Product::factory()->create(['farmer_id' => $ownerFarmer->id]);
    $otherProduct = Product::factory()->create(['farmer_id' => $otherFarmer->id]);

    expect($owner->can('update', $ownProduct))->toBeTrue()
        ->and($owner->can('update', $otherProduct))->toBeFalse()
        ->and($admin->can('update', $otherProduct))->toBeTrue();
});

it('lets a farmer edit their own pending profile', function () {
    $farmerUser = User::factory()->asFarmer()->create();
    $farmer = Farmer::factory()->forUser($farmerUser)->pending()->create();

    expect($farmerUser->can('update', $farmer))->toBeTrue();
});

it('restricts farmer approval and deletion to administrators', function () {
    $admin = User::factory()->asAdmin()->create();
    $farmerUser = User::factory()->asFarmer()->create();
    $farmer = Farmer::factory()->forUser($farmerUser)->pending()->create();

    expect($farmerUser->can('approve', $farmer))->toBeFalse()
        ->and($farmerUser->can('delete', $farmer))->toBeFalse()
        ->and($admin->can('approve', $farmer))->toBeTrue()
        ->and($admin->can('suspend', $farmer))->toBeTrue();
});

it('restricts category management to administrators', function () {
    $farmer = User::factory()->asFarmer()->create();
    $customer = User::factory()->asCustomer()->create();
    $admin = User::factory()->asAdmin()->create();
    $category = Category::factory()->create();

    expect($farmer->can('create', Category::class))->toBeFalse()
        ->and($customer->can('update', $category))->toBeFalse()
        ->and($admin->can('create', Category::class))->toBeTrue()
        ->and($admin->can('update', $category))->toBeTrue();
});
