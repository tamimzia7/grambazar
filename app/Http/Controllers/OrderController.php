<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Response;

class OrderController extends Controller
{
    public function show(Order $order): Response
    {
        $order->load('items');

        return inertia('orders/show', [
            'order' => [
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'delivery_address' => $order->delivery_address,
                'delivery_area' => $order->delivery_area,
                'delivery_district' => $order->delivery_district,
                'delivery_instructions' => $order->delivery_instructions,
                'delivery_charge' => (float) $order->delivery_charge,
                'subtotal' => (float) $order->subtotal,
                'total' => (float) $order->total,
                'payment_method' => $order->payment_method->label(),
                'payment_status' => $order->payment_status->label(),
                'order_status' => $order->order_status->label(),
                'created_at' => $order->created_at->format('d M Y, h:i A'),
                'items' => $order->items->map(fn ($item): array => [
                    'product_name' => $item->product_name,
                    'unit' => $item->unit->label(),
                    'unit_price' => (float) $item->unit_price,
                    'quantity' => (float) $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                ])->all(),
            ],
        ]);
    }
}
