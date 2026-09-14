<?php

namespace App\Models;

use App\Enums\ProductUnit;
use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $order_id
 * @property int|null $product_id
 * @property string $product_name
 * @property ProductUnit $unit
 * @property string $unit_price
 * @property string $quantity
 * @property string $subtotal
 */
#[Fillable([
    'order_id',
    'product_id',
    'product_name',
    'unit',
    'unit_price',
    'quantity',
    'subtotal',
])]
class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected function casts(): array
    {
        return [
            'unit' => ProductUnit::class,
            'unit_price' => 'decimal:2',
            'quantity' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }
}
