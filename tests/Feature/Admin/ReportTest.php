<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Farmer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asAdmin()->create());
});

it('renders the user, farmer, product, order and sales reports', function (array $route, string $component) {
    User::factory()->asFarmer()->create();
    $farmer = Farmer::factory()->approved()->create();
    Product::factory()->create(['farmer_id' => $farmer->id]);
    Order::factory()->create();

    [$name, $params] = $route;

    $this->get(route($name, $params))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    'users' => [['admin.reports.users', []], 'admin/reports/users'],
    'farmers' => [['admin.reports.farmers', []], 'admin/reports/farmers'],
    'products' => [['admin.reports.products', []], 'admin/reports/products'],
    'orders' => [['admin.reports.orders', []], 'admin/reports/orders'],
    'sales' => [['admin.reports.sales', []], 'admin/reports/sales'],
]);

it('filters the orders report by its lifecycle status', function () {
    $pending = Order::factory()->create(['order_status' => OrderStatus::Pending]);
    $cancelled = Order::factory()->create(['order_status' => OrderStatus::Cancelled]);

    $this->get(route('admin.reports.orders', ['order_status' => 'pending']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('rows.0.order_number', $pending->order_number)
            ->where('rows.1', null));
});

it('sums only settled and paid sales in the sales report', function () {
    Order::factory()->create([
        'order_status' => OrderStatus::Delivered,
        'payment_status' => PaymentStatus::Paid,
        'total' => 500,
    ]);
    Order::factory()->create([
        'order_status' => OrderStatus::Cancelled,
        'payment_status' => PaymentStatus::Paid,
        'total' => 999,
    ]);

    $this->get(route('admin.reports.sales'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('meta.count', 1)
            ->where('meta.paid_sum', 500));
});