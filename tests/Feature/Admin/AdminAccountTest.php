<?php

use App\Enums\UserRole;
use App\Models\Permission;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asSuperAdmin()->create());
});

it('creates an admin account while ignoring the requested role', function () {
    $this->post(route('admin.admins.store'), [
        'name' => 'নতুন অ্যাডমিন',
        'email' => 'new-admin@grambazar.test',
        'password' => 'password123',
        'role' => 'super_admin',
    ])->assertRedirect();

    $admin = User::where('email', 'new-admin@grambazar.test')->firstOrFail();

    expect($admin->role)->toBe(UserRole::Admin)
        ->and($admin->is_active)->toBeTrue();

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'admin.created',
        'target_type' => 'user',
        'target_id' => $admin->id,
    ]);
});

it('updates an admin account and its active state', function () {
    $admin = User::factory()->asAdmin()->create(['name' => 'পুরাতন নাম']);

    $this->put(route('admin.admins.update', $admin), [
        'name' => 'নতুন নাম',
        'email' => $admin->email,
        'phone' => null,
        'is_active' => false,
    ])->assertRedirect();

    expect($admin->refresh()->name)->toBe('নতুন নাম')
        ->and($admin->is_active)->toBeFalse();
});

it('will not edit a super admin account', function () {
    $superAdmin = User::factory()->asSuperAdmin()->create();

    $this->get(route('admin.admins.edit', $superAdmin))->assertForbidden();
    $this->put(route('admin.admins.update', $superAdmin), [
        'name' => 'হ্যাক',
        'email' => $superAdmin->email,
    ])->assertForbidden();
});

it('refuses to deactivate a super admin account, even when it is the acting account', function () {
    $actor = User::factory()->asSuperAdmin()->create();
    $this->actingAs($actor);

    $this->post(route('admin.admins.toggle-active', $actor))->assertForbidden();

    expect($actor->refresh()->is_active)->toBeTrue();
});

it('syncs the admin role permissions from the editor', function () {
    $admin = User::factory()->asAdmin()->create();
    $granted = ['users.view', 'users.manage_status', 'site.manage'];

    $this->put(route('admin.admins.update-permissions', $admin), [
        'permissions' => $granted,
    ])->assertRedirect()
        ->assertSessionHas('flash.success');

    $roleGrants = DB::table('role_permission')
        ->where('role', UserRole::Admin->value)
        ->pluck('permission_id')
        ->all();

    expect($roleGrants)
        ->toHaveCount(3)
        ->toContain(Permission::where('name', 'users.view')->value('id'));

    expect($admin->hasPermission('users.view'))->toBeTrue()
        ->and($admin->hasPermission('farmers.view'))->toBeFalse();
});

it('refuses permission edits on a super admin account', function () {
    $superAdmin = User::factory()->asSuperAdmin()->create();

    $this->get(route('admin.admins.permissions', $superAdmin))->assertForbidden();
});

it('renders the admin list with account status', function () {
    $admin = User::factory()->asAdmin()->create(['name' => 'তালিকাভুক্ত অ্যাডমিন']);

    $this->get(route('admin.admins.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/admins/index')
            ->where('admins.data.0.email', $admin->email));
});