<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Paid = 'paid';
    case Refunded = 'refunded';

    /**
     * The display label used across the Bengali-first interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'পরিশোধ হয়নি',
            self::Paid => 'পরিশোধিত',
            self::Refunded => 'ফেরত দেওয়া হয়েছে',
        };
    }
}
