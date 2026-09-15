<?php

namespace Database\Factories;

use App\Enums\CouponType;
use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('?????###')),
            'type' => CouponType::Percentage,
            'value' => 10,
            'min_order_value' => null,
            'max_uses' => null,
            'used_count' => 0,
            'starts_at' => null,
            'expires_at' => null,
            'is_active' => true,
            'description' => fake()->sentence(),
        ];
    }

    public function percentage(float $value = 10): static
    {
        return $this->state(fn (): array => [
            'type' => CouponType::Percentage,
            'value' => $value,
        ]);
    }

    public function fixed(float $value = 100): static
    {
        return $this->state(fn (): array => [
            'type' => CouponType::Fixed,
            'value' => $value,
        ]);
    }

    public function expired(int $days = 1): static
    {
        return $this->state(fn (): array => [
            'expires_at' => now()->subDays($days),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
        ]);
    }

    public function minOrder(float $amount): static
    {
        return $this->state(fn (): array => [
            'min_order_value' => $amount,
        ]);
    }

    public function limited(int $maxUses): static
    {
        return $this->state(fn (): array => [
            'max_uses' => $maxUses,
        ]);
    }
}
