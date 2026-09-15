<?php

namespace App\Services\Coupon;

use App\Models\Coupon;
use App\Services\Coupon\Exceptions\InvalidCouponException;

/**
 * Server-side coupon validation and pricing. Discounts are always derived
 * from the database record — never from values sent by the browser.
 */
class CouponService
{
    /**
     * The coupon document (code or id), or null when not present.
     */
    public function findCode(?string $code): ?Coupon
    {
        if ($code === null || trim($code) === '') {
            return null;
        }

        return Coupon::query()
            ->where('code', strtoupper(trim($code)))
            ->first();
    }

    /**
     * Validate a coupon against the rules that matter at checkout time.
     *
     * @throws InvalidCouponException
     */
    public function validate(?Coupon $coupon, float $subtotal): ?Coupon
    {
        if ($coupon === null) {
            return null;
        }

        if (! $coupon->is_active) {
            throw InvalidCouponException::inactive();
        }

        if ($coupon->expires_at !== null && $coupon->expires_at->isPast()) {
            throw InvalidCouponException::expired();
        }

        if ($coupon->starts_at !== null && $coupon->starts_at->isFuture()) {
            throw InvalidCouponException::notStarted();
        }

        if (! $coupon->hasUsageLeft()) {
            throw InvalidCouponException::exhausted();
        }

        $minimum = $coupon->min_order_value !== null ? (float) $coupon->min_order_value : 0.0;

        if ($subtotal < $minimum) {
            throw InvalidCouponException::belowMinimum($minimum);
        }

        return $coupon;
    }

    /**
     * The discount amount for a validated coupon against a subtotal.
     */
    public function discountFor(Coupon $coupon, float $subtotal): float
    {
        return $coupon->discountFor($subtotal);
    }
}
