<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Farmer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Support\ShopPresenter;
use Illuminate\Http\Request;
use Inertia\Response;

/**
 * Read-only business reports. Each report renders on the same page in a
 * print-friendly layout — "Preview" opens the print dialog and "Download as
 * PDF" hands the rendered page to the browser so the user can save it as PDF.
 */
class ReportController extends Controller
{
    private const MAX_ROWS = 1000;

    public function users(Request $request): Response
    {
        $filters = $this->dateFilters($request);

        $rows = User::query()
            ->with('farmer:id,user_id,display_name,approval_status')
            ->withCount('orders')
            ->when($filters['date_from'] !== null, fn ($query) => $query->whereDate('created_at', '>=', $filters['date_from']))
            ->when($filters['date_to'] !== null, fn ($query) => $query->whereDate('created_at', '<=', $filters['date_to']))
            ->orderByDesc('id')
            ->limit(self::MAX_ROWS)
            ->get();

        return inertia('admin/reports/users', [
            'rows' => $rows->map(fn (User $user): array => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role->label(),
                'status' => $user->is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়',
                'orders_count' => $user->orders_count,
                'created_at' => $user->created_at?->format('d M Y'),
            ])->all(),
            'filters' => $filters,
            'meta' => [
                'title' => 'ব্যবহারকারী রিপোর্ট',
                'count' => $rows->count(),
                'generated_at' => now()->format('d M Y, h:i A'),
            ],
        ]);
    }

    public function farmers(Request $request): Response
    {
        $filters = $this->dateFilters($request);

        $rows = Farmer::query()
            ->with('user:id,name,is_active')
            ->withCount(['products'])
            ->when($filters['date_from'] !== null, fn ($query) => $query->whereDate('created_at', '>=', $filters['date_from']))
            ->when($filters['date_to'] !== null, fn ($query) => $query->whereDate('created_at', '<=', $filters['date_to']))
            ->orderByDesc('id')
            ->limit(self::MAX_ROWS)
            ->get();

        return inertia('admin/reports/farmers', [
            'rows' => $rows->map(fn (Farmer $farmer): array => [
                'display_name' => $farmer->display_name,
                'account' => $farmer->user->name,
                'district' => $farmer->district,
                'approval_status' => $farmer->approval_status->label(),
                'account_active' => $farmer->user->is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়',
                'products_count' => $farmer->products_count,
                'created_at' => $farmer->created_at?->format('d M Y'),
            ])->all(),
            'filters' => $filters,
            'meta' => [
                'title' => 'কৃষক রিপোর্ট',
                'count' => $rows->count(),
                'generated_at' => now()->format('d M Y, h:i A'),
            ],
        ]);
    }

    public function products(Request $request): Response
    {
        $filters = $this->dateFilters($request);
        $status = $request->query('status');

        $rows = Product::query()
            ->with(['category:id,name', 'farmer:id,user_id,display_name'])
            ->when($filters['date_from'] !== null, fn ($query) => $query->whereDate('created_at', '>=', $filters['date_from']))
            ->when($filters['date_to'] !== null, fn ($query) => $query->whereDate('created_at', '<=', $filters['date_to']))
            ->when(in_array($status, ['active', 'inactive'], true), fn ($query) => $query->where('is_active', $status === 'active'))
            ->orderByDesc('id')
            ->limit(self::MAX_ROWS)
            ->get();

        return inertia('admin/reports/products', [
            'rows' => $rows->map(fn (Product $product): array => [
                'name' => $product->name,
                'category' => $product->category?->name,
                'farmer' => $product->farmer?->display_name,
                'unit_price' => (float) $product->price,
                'sale_price' => $product->sale_price !== null ? (float) $product->sale_price : null,
                'stock_quantity' => $product->stock_quantity,
                'status' => $product->is_active ? 'দৃশ্যমান' : 'লুকানো',
                'created_at' => $product->created_at?->format('d M Y'),
            ])->all(),
            'filters' => [...$filters, 'status' => $status],
            'meta' => [
                'title' => 'পণ্য রিপোর্ট',
                'count' => $rows->count(),
                'generated_at' => now()->format('d M Y, h:i A'),
            ],
        ]);
    }

    public function orders(Request $request): Response
    {
        $filters = $this->dateFilters($request);
        $status = $request->query('order_status');

        $rows = Order::query()
            ->withCount('items')
            ->when($filters['date_from'] !== null, fn ($query) => $query->whereDate('created_at', '>=', $filters['date_from']))
            ->when($filters['date_to'] !== null, fn ($query) => $query->whereDate('created_at', '<=', $filters['date_to']))
            ->when(OrderStatus::tryFrom((string) $status) !== null, fn ($query) => $query->where('order_status', $status))
            ->orderByDesc('id')
            ->limit(self::MAX_ROWS)
            ->get();

        $settled = $rows
            ->where('order_status', '!=', OrderStatus::Cancelled)
            ->where('payment_status', 'paid');

        return inertia('admin/reports/orders', [
            'rows' => $rows->map(fn (Order $order): array => [
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'items_count' => $order->items_count,
                'total' => (float) $order->total,
                'payment_method' => $order->payment_method->label(),
                'order_status' => $order->order_status->label(),
                'payment_status' => $order->payment_status->label(),
                'created_at' => $order->created_at?->format('d M Y, h:i A'),
            ])->all(),
            'filters' => [...$filters, 'order_status' => $status],
            'meta' => [
                'title' => 'অর্ডার রিপোর্ট',
                'count' => $rows->count(),
                'settled_sum' => round((float) $settled->sum('total'), 2),
                'generated_at' => now()->format('d M Y, h:i A'),
            ],
        ]);
    }

    public function sales(Request $request): Response
    {
        $filters = $this->dateFilters($request);

        $rows = Order::query()
            ->where('order_status', '!=', OrderStatus::Cancelled->value)
            ->with('items')
            ->when($filters['date_from'] !== null, fn ($query) => $query->whereDate('created_at', '>=', $filters['date_from']))
            ->when($filters['date_to'] !== null, fn ($query) => $query->whereDate('created_at', '<=', $filters['date_to']))
            ->orderByDesc('created_at')
            ->limit(self::MAX_ROWS)
            ->get();

        $paid = $rows->where('payment_status', 'paid');
        $unpaid = $rows->where('payment_status', 'unpaid');

        $presenter = new ShopPresenter;

        return inertia('admin/reports/sales', [
            'rows' => $rows->map(function (Order $order) use ($presenter): array {
                return [
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'items' => $presenter->order($order)['items'],
                    'subtotal' => (float) $order->subtotal,
                    'discount_amount' => (float) $order->discount_amount,
                    'delivery_charge' => (float) $order->delivery_charge,
                    'total' => (float) $order->total,
                    'payment_method' => $order->payment_method->label(),
                    'payment_status' => $order->payment_status->label(),
                    'created_at' => $order->created_at?->format('d M Y, h:i A'),
                ];
            })->all(),
            'filters' => $filters,
            'meta' => [
                'title' => 'বিক্রয় রিপোর্ট',
                'count' => $rows->count(),
                'paid_sum' => round((float) $paid->sum('total'), 2),
                'unpaid_sum' => round((float) $unpaid->sum('total'), 2),
                'discount_sum' => round((float) $rows->sum('discount_amount'), 2),
                'generated_at' => now()->format('d M Y, h:i A'),
            ],
        ]);
    }

    /**
     * @return array{date_from: string|null, date_to: string|null}
     */
    private function dateFilters(Request $request): array
    {
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        return [
            'date_from' => is_string($dateFrom) && $dateFrom !== '' ? $dateFrom : null,
            'date_to' => is_string($dateTo) && $dateTo !== '' ? $dateTo : null,
        ];
    }
}
