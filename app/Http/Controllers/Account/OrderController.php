<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Support\ShopPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly ShopPresenter $presenter) {}

    public function index(Request $request): Response
    {
        $orders = $request->user()->orders()
            ->withCount('items')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order): array => $this->presenter->orderSummary($order));

        return inertia('account/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        Gate::authorize('view', $order);

        return inertia('account/orders/show', [
            'order' => $this->presenter->order($order),
        ]);
    }
}
