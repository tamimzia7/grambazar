<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\AuditLogService;
use App\Support\OrderTransitions;
use App\Support\ShopPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Response;

class OrderController extends Controller
{
    /** @return array<int, string> */
    private static function enumValues(string $enumClass): array
    {
        return array_map(fn ($case): string => $case->value, $enumClass::cases());
    }

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $orderStatus = $request->query('order_status');
        $paymentStatus = $request->query('payment_status');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $orders = Order::query()
            ->withCount('items')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('order_number', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_phone', 'like', "%{$search}%");
                });
            })
            ->when(in_array($orderStatus, self::enumValues(OrderStatus::class), true), function ($query) use ($orderStatus): void {
                $query->where('order_status', $orderStatus);
            })
            ->when(in_array($paymentStatus, self::enumValues(PaymentStatus::class), true), function ($query) use ($paymentStatus): void {
                $query->where('payment_status', $paymentStatus);
            })
            ->when($dateFrom, fn ($query) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn ($query) => $query->whereDate('created_at', '<=', $dateTo))
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return inertia('admin/orders/index', [
            'orders' => $orders->through(fn (Order $order): array => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'items_count' => $order->items_count,
                'total' => (float) $order->total,
                'payment_method' => $order->payment_method->label(),
                'order_status' => [
                    'value' => $order->order_status->value,
                    'label' => $order->order_status->label(),
                ],
                'payment_status' => [
                    'value' => $order->payment_status->value,
                    'label' => $order->payment_status->label(),
                ],
                'created_at' => $order->created_at?->format('d M Y, h:i A'),
            ]),
            'filters' => [
                'search' => $search,
                'order_status' => $orderStatus,
                'payment_status' => $paymentStatus,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'orderStatuses' => collect(OrderStatus::cases())->map(fn (OrderStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])->all(),
            'paymentStatuses' => collect(PaymentStatus::cases())->map(fn (PaymentStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])->all(),
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $presenter = new ShopPresenter;

        return inertia('admin/orders/show', [
            'order' => [
                ...$presenter->order($order),
                'id' => $order->id,
            ],
            'transitions' => [
                'order' => OrderTransitions::nextOrderTargets($order->order_status),
                'payment' => OrderTransitions::nextPaymentTargets($order->payment_status),
            ],
            'orderStatuses' => collect(OrderStatus::cases())->map(fn (OrderStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])->all(),
            'paymentStatuses' => collect(PaymentStatus::cases())->map(fn (PaymentStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])->all(),
            'can' => [
                'update' => $request->user()->hasPermission('orders.update'),
                'payment' => $request->user()->hasPermission('orders.payment'),
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'order_status' => ['required', Rule::enum(OrderStatus::class)],
        ]);

        $target = OrderStatus::from($validated['order_status']);

        return DB::transaction(function () use ($request, $order, $target): RedirectResponse {
            $previous = $order->order_status;

            if (! OrderTransitions::canTransitionOrder($previous, $target)) {
                return back()->with('flash', [
                    'error' => 'অর্ডারের অবস্থা '.$previous->label().' থেকে '.$target->label().'-এ পরিবর্তন করা যাবে না।',
                ]);
            }

            $order->forceFill(['order_status' => $target])->save();

            AuditLogService::record($request->user(), 'order.status_updated', 'order', $order->id, [
                'order_number' => $order->order_number,
                'from' => $previous->value,
                'to' => $target->value,
            ]);

            return back()->with('flash', ['success' => 'অর্ডারের অবস্থা '.$target->label().' করা হয়েছে।']);
        });
    }

    public function updatePayment(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'payment_status' => ['required', Rule::enum(PaymentStatus::class)],
        ]);

        $target = PaymentStatus::from($validated['payment_status']);

        return DB::transaction(function () use ($request, $order, $target): RedirectResponse {
            $previous = $order->payment_status;

            if (! OrderTransitions::canTransitionPayment($previous, $target)) {
                return back()->with('flash', [
                    'error' => 'পেমেন্টের অবস্থা '.$previous->label().' থেকে '.$target->label().'-এ পরিবর্তন করা যাবে না।',
                ]);
            }

            $order->forceFill(['payment_status' => $target])->save();

            AuditLogService::record($request->user(), 'order.payment_updated', 'order', $order->id, [
                'order_number' => $order->order_number,
                'from' => $previous->value,
                'to' => $target->value,
            ]);

            return back()->with('flash', ['success' => 'পেমেন্টের অবস্থা '.$target->label().' করা হয়েছে।']);
        });
    }
}
