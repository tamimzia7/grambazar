<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $order_number
 * @property int|null $user_id
 * @property string $customer_name
 * @property string $customer_phone
 * @property string|null $customer_email
 * @property string $delivery_address
 * @property string|null $delivery_area
 * @property string $delivery_district
 * @property string|null $delivery_instructions
 * @property string $delivery_charge
 * @property string $subtotal
 * @property string $total
 * @property string|null $coupon_code
 * @property string $discount_amount
 * @property PaymentMethod $payment_method
 * @property PaymentStatus $payment_status
 * @property OrderStatus $order_status
 * @property string|null $notes
 */
#[Fillable([
    'user_id',
    'order_number',
    'customer_name',
    'customer_phone',
    'customer_email',
    'delivery_address',
    'delivery_area',
    'delivery_district',
    'delivery_instructions',
    'delivery_charge',
    'subtotal',
    'total',
    'coupon_code',
    'discount_amount',
    'payment_method',
    'payment_status',
    'order_status',
    'notes',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('order_status', OrderStatus::Pending);
    }

    protected function casts(): array
    {
        return [
            'delivery_charge' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'payment_method' => PaymentMethod::class,
            'payment_status' => PaymentStatus::class,
            'order_status' => OrderStatus::class,
        ];
    }
}
