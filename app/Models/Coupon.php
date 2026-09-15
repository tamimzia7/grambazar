<?php

namespace App\Models;

use App\Enums\CouponType;
use Database\Factories\CouponFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property CouponType $type
 * @property string $value
 * @property string|null $min_order_value
 * @property int|null $max_uses
 * @property int $used_count
 * @property Carbon|null $starts_at
 * @property Carbon|null $expires_at
 * @property bool $is_active
 * @property string|null $description
 */
#[Fillable([
    'code',
    'type',
    'value',
    'min_order_value',
    'max_uses',
    'used_count',
    'starts_at',
    'expires_at',
    'is_active',
    'description',
])]
class Coupon extends Model
{
    /** @use HasFactory<CouponFactory> */
    use HasFactory;

    /**
     * @return HasMany<CouponUsage, $this>
     */
    public function usage(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * The coupon code, always normalised to uppercase.
     *
     * @return Attribute<?string, string>
     */
    protected function code(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => $value !== null ? strtoupper($value) : null,
            set: fn (string $value): string => strtoupper(trim($value)),
        );
    }

    public function hasUsageLeft(): bool
    {
        return $this->max_uses === null || $this->used_count < $this->max_uses;
    }

    public function isWithinValidity(?Carbon $now = null): bool
    {
        $moment = $now ?? now();

        if ($this->starts_at !== null && $moment->lt($this->starts_at)) {
            return false;
        }

        if ($this->expires_at !== null && $moment->gt($this->expires_at)) {
            return false;
        }

        return true;
    }

    /**
     * The maximum discount that still requires a positive order total.
     */
    public function discountFor(float $subtotal): float
    {
        $discount = $this->type === CouponType::Percentage
            ? round($subtotal * ((float) $this->value / 100), 2)
            : (float) $this->value;

        return round(min($discount, max($subtotal, 0.0)), 2);
    }

    protected function casts(): array
    {
        return [
            'type' => CouponType::class,
            'value' => 'decimal:2',
            'min_order_value' => 'decimal:2',
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
}
