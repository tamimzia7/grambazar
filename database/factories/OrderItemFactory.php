<?php

namespace Database\Factories;

use App\Enums\ProductUnit;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_name' => fake()->words(3, true),
            'unit' => ProductUnit::Kilogram,
            'unit_price' => 100,
            'quantity' => 1,
            'subtotal' => 100,
        ];
    }
}
