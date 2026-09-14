<?php

namespace App\Services\Ordering;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\Cart\Cart;
use App\Services\Ordering\Exceptions\EmptyCartException;
use App\Services\Ordering\Exceptions\InsufficientStockException;
use App\Services\Ordering\Exceptions\UnavailableProductException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Orchestrates a checkout: re-validates every line against the database under
 * a row lock, snapshots prices, decrements stock and stores the order atomically.
 */
class OrderPlacer
{
    public function __construct(private readonly Cart $cart) {}

    /**
     * @param  array<string, mixed>  $customer
     *
     * @throws EmptyCartException
     * @throws UnavailableProductException
     * @throws InsufficientStockException
     */
    public function place(array $customer): Order
    {
        $lines = $this->cart->items();

        if ($lines->isEmpty()) {
            throw new EmptyCartException('আপনার কার্ট খালি। আগে কিছু পণ্য যোগ করুন।');
        }

        return DB::transaction(function () use ($lines, $customer): Order {
            $rows = [];

            foreach ($lines as $line) {
                /** @var Product|null $product */
                $product = Product::query()->whereKey($line->product->id)->lockForUpdate()->first();

                if ($product === null || ! $product->is_active) {
                    throw new UnavailableProductException($line->product->name.' আর কেনা যাবে না।');
                }

                if ($line->quantity < (int) $product->min_order_quantity) {
                    throw new UnavailableProductException(
                        $product->name.'-এর জন্য সর্বনিম্ন '.$product->min_order_quantity.' '.$product->unit->label().' লাগবে।'
                    );
                }

                $this->reserveStock($product, $line->quantity);

                $rows[] = [
                    'product' => $product,
                    'price' => $product->sellingPrice(),
                    'quantity' => $line->quantity,
                ];
            }

            $subtotal = round(array_sum(array_map(
                fn (array $row): float => $row['price'] * $row['quantity'],
                $rows
            )), 2);

            $deliveryCharge = $this->deliveryChargeFor($subtotal);

            $order = Order::create([
                'order_number' => $this->orderNumber(),
                'user_id' => Auth::id(),
                'customer_name' => (string) $customer['customer_name'],
                'customer_phone' => (string) $customer['customer_phone'],
                'customer_email' => isset($customer['customer_email']) ? (string) $customer['customer_email'] : null,
                'delivery_address' => (string) $customer['delivery_address'],
                'delivery_area' => isset($customer['delivery_area']) ? (string) $customer['delivery_area'] : null,
                'delivery_district' => (string) $customer['delivery_district'],
                'delivery_instructions' => isset($customer['delivery_instructions']) ? (string) $customer['delivery_instructions'] : null,
                'delivery_charge' => $deliveryCharge,
                'subtotal' => $subtotal,
                'total' => round($subtotal + $deliveryCharge, 2),
                'payment_method' => PaymentMethod::CashOnDelivery,
                'payment_status' => PaymentStatus::Unpaid,
                'order_status' => OrderStatus::Pending,
            ]);

            foreach ($rows as $row) {
                /** @var Product $product */
                $product = $row['product'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit' => $product->unit,
                    'unit_price' => $row['price'],
                    'quantity' => $row['quantity'],
                    'subtotal' => round($row['price'] * $row['quantity'], 2),
                ]);
            }

            $this->cart->clear();

            return $order;
        });
    }

    public function deliveryChargeFor(float $subtotal): float
    {
        $threshold = (float) config('shop.free_delivery_above');

        if ($threshold > 0 && $subtotal >= $threshold) {
            return 0.0;
        }

        return round((float) config('shop.delivery_charge'), 2);
    }

    private function orderNumber(): string
    {
        return 'GB-'.now()->format('ymd').'-'.strtoupper(Str::random(6));
    }

    /**
     * Decrement stock atomically, failing when the reserved amount is no longer available.
     */
    private function reserveStock(Product $product, int $quantity): void
    {
        $reserved = Product::query()
            ->whereKey($product->id)
            ->where('is_active', true)
            ->where('stock_quantity', '>=', $quantity)
            ->decrement('stock_quantity', $quantity);

        if ($reserved !== 1) {
            throw new InsufficientStockException($product->name.'-এর স্টক এখন অপর্যাপ্ত।');
        }
    }
}
