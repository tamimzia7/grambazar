<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CashOnDelivery = 'cod';

    /**
     * The display label used across the Bengali-first interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::CashOnDelivery => 'হাতে নগদ (Cod)',
        };
    }
}
