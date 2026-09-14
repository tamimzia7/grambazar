<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Support\ShopPresenter;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly ShopPresenter $presenter) {}

    public function show(Order $order): Response
    {
        return inertia('orders/show', [
            'order' => $this->presenter->order($order),
        ]);
    }
}
