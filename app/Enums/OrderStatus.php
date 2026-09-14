<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Processing = 'processing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    /**
     * The display label used across the Bengali-first interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'নতুন অর্ডার',
            self::Confirmed => 'নিশ্চিতকৃত',
            self::Processing => 'প্রক্রিয়াধীন',
            self::Shipped => 'পাঠানো হয়েছে',
            self::Delivered => 'ডেলিভারি সম্পন্ন',
            self::Cancelled => 'বাতিল',
        };
    }
}
