<?php

use App\Enums\ProductUnit;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
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

it('lets the owning customer view their account order via the confirmation page', function () {
    $user = User::factory()->asCustomer()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('orders.show', ['order' => $order->order_number]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.order_number', $order->order_number));
});

it('hides another customer account order from the public confirmation page', function () {
    $owner = User::factory()->asCustomer()->create();
    $other = User::factory()->asCustomer()->create();
    $order = Order::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($other)
        ->get(route('orders.show', ['order' => $order->order_number]))
        ->assertNotFound();
});

it('hides an account order from guests on the public confirmation page', function () {
    $owner = User::factory()->asCustomer()->create();
    $order = Order::factory()->create(['user_id' => $owner->id]);

    $this->get(route('orders.show', ['order' => $order->order_number]))
        ->assertNotFound();
});

it('lets an administrator view any order via the public confirmation page', function () {
    $admin = User::factory()->asAdmin()->create();
    $order = Order::factory()->create(['user_id' => User::factory()->asCustomer()->create()->id]);

    $this->actingAs($admin)
        ->get(route('orders.show', ['order' => $order->order_number]))
        ->assertOk();
});
