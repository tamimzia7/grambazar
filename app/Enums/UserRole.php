<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Farmer = 'farmer';
    case Admin = 'admin';
    case SuperAdmin = 'super_admin';

    /**
     * The display label used across the Bengali-first interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Customer => 'গ্রাহক',
            self::Farmer => 'কৃষক',
            self::Admin => 'অ্যাডমিন',
            self::SuperAdmin => 'সুপার অ্যাডমিন',
        };
    }
}
