<?php

namespace App\Services\Cart;

use App\Models\Product;
use Illuminate\Support\Facades\Session;

/**
 * Session-backed shopping cart for guest customers.
 *
 * The cart only stores product id + quantity; every price is re-read from the
 * database, so the server is always the source of truth. Storage is isolated
 * behind the session abstraction so authenticated carts can be added later
 * without touching the controllers.
 */
class Cart
{
    public const SESSION_KEY = 'shopping_cart';

    /**
     * @var array<int, int>|null
     */
    private ?array $raw = null;

    /**
     * @return array<int, int> product id => quantity
     */
    public function all(): array
    {
        return $this->raw();
    }

    public function has(int $productId): bool
    {
        return isset($this->all()[$productId]);
    }

    public function quantityOf(int $productId): int
    {
        return $this->all()[$productId] ?? 0;
    }

    /**
     * Add a quantity to the cart, merging with an existing line.
     */
    public function add(int $productId, int $quantity): void
    {
        $raw = $this->all();
        $raw[$productId] = ($raw[$productId] ?? 0) + $quantity;
        $this->save($raw);
    }

    /**
     * Set the exact quantity for a line; quantities at or below zero remove the line.
     */
    public function set(int $productId, int $quantity): void
    {
        $raw = $this->all();

        if ($quantity <= 0) {
            unset($raw[$productId]);
        } else {
            $raw[$productId] = $quantity;
        }

        $this->save($raw);
    }

    public function remove(int $productId): void
    {
        $this->set($productId, 0);
    }

    public function clear(): void
    {
        Session::forget(self::SESSION_KEY);
        $this->raw = null;
    }

    /**
     * Total number of items across all lines.
     */
    public function count(): int
    {
        return array_sum($this->all());
    }

    public function empty(): bool
    {
        return count($this->all()) === 0;
    }

    /**
     * Cart lines resolved against the database.
     *
     * Products that no longer exist are ignored; inactive or out-of-stock
     * products are still returned so the frontend can flag them as unavailable
     * instead of silently dropping the customer's selection.
     *
     * @return \Illuminate\Support\Collection<int, CartItem>
     */
    public function items(): \Illuminate\Support\Collection
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->whereIn('id', array_keys($this->all()))
            ->get()
            ->keyBy('id');

        return $products->map(fn (Product $product): CartItem => new CartItem(
            $product,
            $this->quantityOf($product->id),
        ))->values();
    }

    /**
     * Current subtotal of the available cart lines, computed server-side.
     */
    public function subtotal(): float
    {
        return round($this->items()->sum(fn (CartItem $item): float => $item->subtotal()), 2);
    }

    /**
     * @return array<int, int>
     */
    private function raw(): array
    {
        if ($this->raw === null) {
            $value = Session::get(self::SESSION_KEY, []);

            $this->raw = is_array($value)
                ? collect($value)->filter(fn ($quantity): bool => is_int($quantity) && $quantity > 0)->toArray()
                : [];
        }

        return $this->raw;
    }

    /**
     * @param  array<int, int>  $raw
     */
    private function save(array $raw): void
    {
        Session::put(self::SESSION_KEY, $raw);
        $this->raw = $raw;
    }
}
