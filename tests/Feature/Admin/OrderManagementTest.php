<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asAdmin()->create());
});

it('lists orders for an administrator', function () {
    $order = Order::factory()->create();

    $this->get(route('admin.orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->where('orders.data.0.order_number', $order->order_number));
});

it('shows an order with its allowed transitions', function () {
    $order = Order::factory()->create(['order_status' => OrderStatus::Pending]);

    $this->get(route('admin.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.order_number', $order->order_number)
            ->where('transitions.order', ['confirmed', 'cancelled']));
});

it('moves an order forward through the lifecycle', function () {
    $order = Order::factory()->create(['order_status' => OrderStatus::Pending]);

    $this->post(route('admin.orders.update-status', $order), ['order_status' => 'confirmed'])
        ->assertRedirect()
        ->assertSessionHas('flash.success');

    expect($order->refresh()->order_status)->toBe(OrderStatus::Confirmed);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'order.status_updated',
        'target_type' => 'order',
        'target_id' => $order->id,
    ]);
});

it('refuses a status that skips a lifecycle step', function () {
    $order = Order::factory()->create(['order_status' => OrderStatus::Pending]);

    $this->post(route('admin.orders.update-status', $order), ['order_status' => 'shipped'])
        ->assertRedirect()
        ->assertSessionHas('flash.error');

    expect($order->refresh()->order_status)->toBe(OrderStatus::Pending);
    $this->assertDatabaseMissing('audit_logs', ['action' => 'order.status_updated']);
});

it('marks a pending payment as paid', function () {
    $order = Order::factory()->create(['payment_status' => PaymentStatus::Unpaid]);

    $this->post(route('admin.orders.update-payment', $order), ['payment_status' => 'paid'])
        ->assertRedirect();

    expect($order->refresh()->payment_status)->toBe(PaymentStatus::Paid);
});

it('refuses to move a refunded payment back to paid', function () {
    $order = Order::factory()->create(['payment_status' => PaymentStatus::Refunded]);

    $this->post(route('admin.orders.update-payment', $order), ['payment_status' => 'paid'])
        ->assertRedirect()
        ->assertSessionHas('flash.error');

    expect($order->refresh()->payment_status)->toBe(PaymentStatus::Refunded);
});
