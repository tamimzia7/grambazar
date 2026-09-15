<?php

use App\Enums\FarmerApprovalStatus;
use App\Models\Farmer;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asAdmin()->create());
});

describe('approval lifecycle', function () {
    it('approves a pending farmer and logs the decision', function () {
        $farmer = Farmer::factory()->pending()->create();

        $this->post(route('admin.farmers.approve', $farmer))->assertRedirect();

        expect($farmer->refresh()->approval_status)->toBe(FarmerApprovalStatus::Approved);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'farmer.approved',
            'target_type' => 'farmer',
            'target_id' => $farmer->id,
        ]);
    });

    it('requires a reason before rejecting a farmer', function () {
        $farmer = Farmer::factory()->pending()->create();

        $this->post(route('admin.farmers.reject', $farmer), [])->assertSessionHasErrors('reason');

        expect($farmer->refresh()->approval_status)->toBe(FarmerApprovalStatus::Pending);
    });

    it('rejects a farmer with the given reason and logs it', function () {
        $farmer = Farmer::factory()->pending()->create();

        $this->post(route('admin.farmers.reject', $farmer), ['reason' => 'অসম্পূর্ণ তথ্য'])->assertRedirect();

        expect($farmer->refresh()->approval_status)->toBe(FarmerApprovalStatus::Rejected);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'farmer.rejected',
            'target_id' => $farmer->id,
        ]);
    });

    it('suspends and reactivates an approved farmer', function () {
        $farmer = Farmer::factory()->approved()->create();

        $this->post(route('admin.farmers.suspend', $farmer));
        expect($farmer->refresh()->approval_status)->toBe(FarmerApprovalStatus::Suspended);

        $this->post(route('admin.farmers.reactivate', $farmer));
        expect($farmer->refresh()->approval_status)->toBe(FarmerApprovalStatus::Approved);

        $this->assertDatabaseHas('audit_logs', ['action' => 'farmer.suspended', 'target_id' => $farmer->id]);
        $this->assertDatabaseHas('audit_logs', ['action' => 'farmer.reactivated', 'target_id' => $farmer->id]);
    });
});

describe('account status', function () {
    it('deactivates a farmer account through the user switch', function () {
        $farmer = Farmer::factory()->approved()->create();

        $this->post(route('admin.farmers.toggle-account', $farmer))
            ->assertRedirect()
            ->assertSessionHas('flash.success');

        expect($farmer->user->refresh()->is_active)->toBeFalse();
    });

    it('refuses to deactivate the acting account', function () {
        $actor = User::factory()->asAdmin()->create();
        $this->actingAs($actor);

        $farmer = Farmer::factory()->forUser($actor)->approved()->create();

        $this->post(route('admin.farmers.toggle-account', $farmer))
            ->assertRedirect()
            ->assertSessionHas('flash.error');

        expect($actor->refresh()->is_active)->toBeTrue();
    });
});

it('lists farmers with product counts', function () {
    $farmer = Farmer::factory()->approved()->create([
        'display_name' => 'আব্দুল করিম',
        'district' => 'মানিকগঞ্জ',
    ]);

    $this->get(route('admin.farmers.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/farmers/index')
            ->where('farmers.data.0.display_name', $farmer->display_name));
});

it('shows a farmer with their user details', function () {
    $farmer = Farmer::factory()->approved()->create();

    $this->get(route('admin.farmers.show', $farmer))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/farmers/show')
            ->where('farmer.user.email', $farmer->user->email));
});
