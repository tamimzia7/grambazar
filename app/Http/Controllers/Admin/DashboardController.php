<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Farmer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $productQuery = Product::query();

        $orderQuery = Order::query();

        return inertia('admin/dashboard', [
            'stats' => [
                'users' => User::count(),
                'farmers' => Farmer::count(),
                'pendingFarmers' => Farmer::query()->where('approval_status', 'pending')->count(),
                'products' => (clone $productQuery)->count(),
                'activeProducts' => (clone $productQuery)->where('is_active', true)->count(),
                'orders' => (clone $orderQuery)->count(),
                'ongoingOrders' => (clone $orderQuery)
                    ->whereNotIn('order_status', [OrderStatus::Delivered, OrderStatus::Cancelled])
                    ->count(),
                'completedOrders' => (clone $orderQuery)
                    ->where('order_status', OrderStatus::Delivered)
                    ->count(),
                'totalSales' => round((float) (clone $orderQuery)
                    ->where('order_status', '!=', OrderStatus::Cancelled)
                    ->where('payment_status', PaymentStatus::Paid)
                    ->sum('total'), 2),
                'unpaidSales' => round((float) (clone $orderQuery)
                    ->where('order_status', '!=', OrderStatus::Cancelled)
                    ->where('payment_status', PaymentStatus::Unpaid)
                    ->sum('total'), 2),
            ],
            'recentOrders' => Order::query()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Order $order): array => [
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'total' => (float) $order->total,
                    'order_status' => $order->order_status->label(),
                    'created_at' => $order->created_at?->format('d M Y, h:i A'),
                ])
                ->all(),
            'recentFarmers' => Farmer::query()
                ->with('user')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Farmer $farmer): array => [
                    'id' => $farmer->id,
                    'display_name' => $farmer->display_name,
                    'district' => $farmer->district,
                    'approval_status' => $farmer->approval_status->label(),
                    'created_at' => $farmer->created_at?->format('d M Y'),
                ])
                ->all(),
            'recentProducts' => Product::query()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'is_active' => $product->is_active,
                    'created_at' => $product->created_at?->format('d M Y'),
                ])
                ->all(),
            'recentUsers' => User::query()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->label(),
                    'created_at' => $user->created_at?->format('d M Y'),
                ])
                ->all(),
        ]);
    }
}
