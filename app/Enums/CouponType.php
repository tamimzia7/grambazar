<?php

namespace App\Enums;

enum CouponType: string
{
    case Percentage = 'percentage';
    case Fixed = 'fixed';

    /**
     * The display label used across the Bengali-first interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Percentage => 'শতকরা',
            self::Fixed => 'নির্দিষ্ট টাকা',
        };
    }
}
