<?php

namespace Database\Factories;

use App\Enums\FarmerApprovalStatus;
use App\Models\Farmer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Farmer>
 */
class FarmerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->asFarmer(),
            'display_name' => fake()->name(),
            'phone' => fake()->numerify('01########'),
            'address' => fake()->streetAddress(),
            'village' => fake()->city(),
            'district' => fake()->city(),
            'bio' => fake()->sentence(12),
            'profile_image' => null,
            'approval_status' => FarmerApprovalStatus::Pending,
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (): array => [
            'user_id' => $user->id,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (): array => [
            'approval_status' => FarmerApprovalStatus::Pending,
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (): array => [
            'approval_status' => FarmerApprovalStatus::Approved,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (): array => [
            'approval_status' => FarmerApprovalStatus::Rejected,
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn (): array => [
            'approval_status' => FarmerApprovalStatus::Suspended,
        ]);
    }
}
