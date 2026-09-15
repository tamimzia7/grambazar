<?php

use App\Models\User;
use Database\Seeders\PermissionSeeder;

it('redirects guests away from the admin panel', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

it('forbids customers and farmers from the admin panel', function (Closure $createUser) {
    $this->actingAs($createUser())
        ->get(route('admin.dashboard'))
        ->assertForbidden();
})->with([
    'customer' => fn (): User => User::factory()->asCustomer()->create(),
    'farmer' => fn (): User => User::factory()->asFarmer()->create(),
]);

it('lets an administrator open the dashboard', function () {
    $this->seed(PermissionSeeder::class);

    $this->actingAs(User::factory()->asAdmin()->create())
        ->get(route('admin.dashboard'))
        ->assertOk();
});

it('lets a super admin open the dashboard without seeded permissions', function () {
    $this->actingAs(User::factory()->asSuperAdmin()->create())
        ->get(route('admin.dashboard'))
        ->assertOk();
});

it('reserves the admin account section for super admins', function () {
    $this->seed(PermissionSeeder::class);

    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)->get(route('admin.admins.index'))->assertForbidden();
});

it('lets a super admin manage admin accounts', function () {
    $this->seed(PermissionSeeder::class);

    $this->actingAs(User::factory()->asSuperAdmin()->create())
        ->get(route('admin.admins.index'))
        ->assertOk();
});

it('requires the audit view permission for the audit log', function () {
    $this->seed(PermissionSeeder::class);

    $this->actingAs(User::factory()->asAdmin()->create())
        ->get(route('admin.audit-logs.index'))
        ->assertOk();
});