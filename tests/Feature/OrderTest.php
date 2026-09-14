<?php

use App\Enums\ProductUnit;
use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Testing\AssertableInertia as Assert;

it('shows the order confirmation with item snapshots and totals', function () {
    $order = Order::factory()->create([
        'order_number' => 'GB-260915-ABC123',
        'customer_name' => 'তামিম জিয়া',
        'customer_phone' => '01712345678',
        'delivery_district' => 'মানিকগঞ্জ',
        'subtotal' => 200,
        'delivery_charge' => 60,
        'total' => 260,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_name' => 'তাজা পাবদা মাছ',
        'unit' => ProductUnit::Kilogram,
        'unit_price' => 100,
        'quantity' => 2,
        'subtotal' => 200,
    ]);

    $this->get(route('orders.show', ['order' => $order->order_number]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/show')
            ->where('order.order_number', 'GB-260915-ABC123')
            ->where('order.customer_name', 'তামিম জিয়া')
            ->where('order.delivery_district', 'মানিকগঞ্জ')
            ->where('order.subtotal', 200)
            ->where('order.delivery_charge', 60)
            ->where('order.total', 260)
            ->where('order.items.0.product_name', 'তাজা পাবদা মাছ')
            ->where('order.items.0.quantity', 2)
            ->where('order.items.0.unit', 'কেজি'));
});

it('marks a free-delivery order with a zero delivery charge', function () {
    $order = Order::factory()->create([
        'delivery_charge' => 0,
        'subtotal' => 1200,
        'total' => 1200,
    ]);

    $this->get(route('orders.show', ['order' => $order->order_number]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.delivery_charge', 0)
            ->where('order.total', 1200));
});
