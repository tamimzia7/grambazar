<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_number' => 'GB-'.strtoupper(fake()->unique()->bothify('####-????')),
            'user_id' => null,
            'customer_name' => fake()->name(),
            'customer_phone' => fake()->numerify('01########'),
            'customer_email' => fake()->safeEmail(),
            'delivery_address' => fake()->streetAddress(),
            'delivery_area' => fake()->city(),
            'delivery_district' => fake()->city(),
            'delivery_instructions' => null,
            'delivery_charge' => 60,
            'subtotal' => 500,
            'total' => 560,
            'payment_method' => PaymentMethod::CashOnDelivery,
            'payment_status' => PaymentStatus::Unpaid,
            'order_status' => OrderStatus::Pending,
            'notes' => null,
        ];
    }
}
