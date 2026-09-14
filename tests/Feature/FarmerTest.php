<?php

use App\Enums\FarmerApprovalStatus;
use App\Http\Requests\Farmer\UpdateFarmerRequest;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

it('belongs to a user and defaults to pending approval', function () {
    $farmer = Farmer::factory()->create();

    expect($farmer->user)->toBeInstanceOf(User::class)
        ->and($farmer->approval_status)->toBe(FarmerApprovalStatus::Pending)
        ->and($farmer->isApproved())->toBeFalse();
});

it('holds many products once approved', function () {
    $farmer = Farmer::factory()->approved()->create();
    Product::factory()->count(3)->create(['farmer_id' => $farmer->id]);

    expect($farmer->isApproved())->toBeTrue()
        ->and($farmer->products()->count())->toBe(3);
});

it('tracks each approval state', function (FarmerApprovalStatus $status) {
    $farmer = Farmer::factory()->create(['approval_status' => $status]);

    expect($farmer->approval_status)->toBe($status);
})->with([
    'pending' => FarmerApprovalStatus::Pending,
    'approved' => FarmerApprovalStatus::Approved,
    'rejected' => FarmerApprovalStatus::Rejected,
    'suspended' => FarmerApprovalStatus::Suspended,
]);

it('only lets an administrator change the approval status', function () {
    $owner = User::factory()->asFarmer()->create();
    $farmer = Farmer::factory()->forUser($owner)->pending()->create();

    $request = UpdateFarmerRequest::create("/farmers/{$farmer->id}", 'PATCH', [
        'approval_status' => 'approved',
    ]);
    $request->setUserResolver(fn (): User => $owner);
    $request->setRouteResolver(fn (): array => ['farmer' => $farmer]);

    $validator = Validator::make($request->all(), $request->rules());

    foreach ($request->after() as $after) {
        $after($validator);
    }

    expect($validator->errors()->has('approval_status'))->toBeTrue();
});
