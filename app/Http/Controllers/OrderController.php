<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Support\ShopPresenter;
use Illuminate\Http\Request;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly ShopPresenter $presenter) {}

    /**
     * Public order confirmation page.  Guest orders (user_id null) are
     * accessible to anyone who knows the order number (the post-checkout
     * bearer token).  Orders attached to a registered account are only
     * visible to that owner or an administrator — preventing PII leakage
     * to other authenticated users.
     */
    public function show(Request $request, Order $order): Response
    {
        if ($order->user_id !== null) {
            $user = $request->user();

            abort_unless(
                $user !== null && ($user->isAdministrator() || $user->id === $order->user_id),
                404
            );
        }

        return inertia('orders/show', [
            'order' => $this->presenter->order($order),
        ]);
    }
}
