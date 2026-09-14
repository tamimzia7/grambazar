<?php

namespace App\Services\Cart;

use App\Models\Product;

/**
 * A single product line inside the shopping cart with server-computed pricing.
 */
final class CartItem
{
    public function __construct(
        public readonly Product $product,
        public readonly int $quantity,
    ) {}

    /**
     * The current unit price charged for this product (source of truth is the database).
     */
    public function price(): float
    {
        return $this->product->sellingPrice();
    }

    public function subtotal(): float
    {
        return round($this->price() * $this->quantity, 2);
    }
}
