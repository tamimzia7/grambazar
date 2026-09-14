<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Support\ShopPresenter;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly ShopPresenter $presenter) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $orders = $user->orders()
            ->withCount('items')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($order): array => $this->presenter->orderSummary($order))
            ->all();

        return inertia('account/dashboard', [
            'total_orders' => $user->orders()->count(),
            'recent_orders' => $orders,
        ]);
    }
}
