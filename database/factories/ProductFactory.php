<?php

namespace Database\Factories;

use App\Enums\ProductUnit;
use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->sentence(3);

        return [
            'farmer_id' => Farmer::factory()->approved(),
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug((string) $name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'short_description' => fake()->sentence(6),
            'description' => fake()->paragraph(3),
            'price' => fake()->numberBetween(100, 5000),
            'sale_price' => null,
            'unit' => ProductUnit::Kilogram,
            'stock_quantity' => fake()->numberBetween(0, 500),
            'min_order_quantity' => 1,
            'is_featured' => false,
            'is_popular' => false,
            'is_seasonal' => false,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (): array => [
            'is_featured' => true,
        ]);
    }

    public function seasonal(): static
    {
        return $this->state(fn (): array => [
            'is_seasonal' => true,
        ]);
    }

    public function popular(): static
    {
        return $this->state(fn (): array => [
            'is_popular' => true,
        ]);
    }

    public function onSale(): static
    {
        return $this->state(fn (array $attributes): array => [
            'sale_price' => round($attributes['price'] * 0.8, 2),
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (): array => [
            'stock_quantity' => 0,
        ]);
    }
}
