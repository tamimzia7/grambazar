<?php

use App\Enums\UserRole;
use App\Models\Farmer;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
});

it('renders the users index for an administrator', function () {
    $admin = User::factory()->asAdmin()->create();
    $user = User::factory()->asCustomer()->create(['name' => 'রাশেদ মিয়া']);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->where('users.data.0.name', $user->name));
});

it('renders a user with their farmer profile attached', function () {
    $farmerUser = User::factory()->asFarmer()->create();
    Farmer::factory()->forUser($farmerUser)->approved()->create();

    $this->actingAs(User::factory()->asAdmin()->create())
        ->get(route('admin.users.show', $farmerUser))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/show')
            ->where('farmer.display_name', $farmerUser->farmer->display_name));
});

it('will not let an admin deactivate their own account', function () {
    $admin = User::factory()->asAdmin()->create();
    $this->actingAs($admin);

    $this->post(route('admin.users.toggle-active', $admin))
        ->assertRedirect()
        ->assertSessionHas('flash.error');

    expect($admin->refresh()->is_active)->toBeTrue();
});

it('blocks a non-super admin from toggling a super admin account', function () {
    $superAdmin = User::factory()->asSuperAdmin()->create();
    $this->actingAs(User::factory()->asAdmin()->create());

    $this->post(route('admin.users.toggle-active', $superAdmin))->assertForbidden();

    expect($superAdmin->refresh()->is_active)->toBeTrue();
});

it('lets a super admin deactivate another account and log the change', function () {
    $customer = User::factory()->asCustomer()->create();
    $this->actingAs(User::factory()->asSuperAdmin()->create());

    $this->post(route('admin.users.toggle-active', $customer))->assertRedirect();

    expect($customer->refresh()->is_active)->toBeFalse();

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'users.status_toggled',
        'target_type' => 'user',
        'target_id' => $customer->id,
    ]);
});

it('keeps the role untouched when the account status is toggled', function () {
    $customer = User::factory()->asCustomer()->create();
    $this->actingAs(User::factory()->asSuperAdmin()->create());

    $this->post(route('admin.users.toggle-active', $customer));

    expect($customer->refresh()->role)->toBe(UserRole::Customer);
});

it('records a user report with the order count', function () {
    $this->actingAs(User::factory()->asAdmin()->create());

    $user = User::factory()->asCustomer()->create();
    Order::factory()->for($user)->create(['order_number' => 'GB-REPORT-1']);

    $this->get(route('admin.users.report'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/reports/users')
            ->where('rows.0.orders_count', 1)
            ->where('rows.0.name', $user->name));
});
