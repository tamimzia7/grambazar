<?php

use App\Models\Farmer;
use App\Models\User;
use App\Services\AuditLogService;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Facades\DB;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
});

it('records an audit entry when an admin approves a farmer', function () {
    $admin = User::factory()->asAdmin()->create();
    $farmer = Farmer::factory()->pending()->create();

    $this->actingAs($admin)->post(route('admin.farmers.approve', $farmer));

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $admin->id,
        'action' => 'farmer.approved',
        'target_type' => 'farmer',
        'target_id' => $farmer->id,
    ]);
});

it('stores structured metadata with the audit entry', function () {
    $admin = User::factory()->asAdmin()->create();
    $farmer = Farmer::factory()->pending()->create(['display_name' => 'রহিম উদ্দিন']);

    $this->actingAs($admin)->post(route('admin.farmers.reject', $farmer), ['reason' => 'তথ্য অসম্পূর্ণ']);

    $entry = DB::table('audit_logs')->where('action', 'farmer.rejected')->first();

    expect(json_decode($entry->metadata, true))
        ->toMatchArray([
            'from' => 'pending',
            'display_name' => 'রহিম উদ্দিন',
            'reason' => 'তথ্য অসম্পূর্ণ',
        ]);
});

it('records a null actor for actions without an authenticated user', function () {
    $farmer = Farmer::factory()->pending()->create();

    // The admin middleware forbids the action before it runs for guests, so we
    // exercise the service directly with a null actor to pin down the contract.
    AuditLogService::record(null, 'farmer.approved', 'farmer', $farmer->id, []);

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => null,
        'action' => 'farmer.approved',
        'target_id' => $farmer->id,
    ]);
});