<?php

namespace App\Enums;

enum ProductUnit: string
{
    case Kilogram = 'kg';
    case Gram = 'g';
    case Piece = 'pcs';
    case Dozen = 'dozen';
    case Litre = 'litre';
    case Bag = 'bag';

    /**
     * The display label used across the Bengali-first interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Kilogram => 'কেজি',
            self::Gram => 'গ্রাম',
            self::Piece => 'পিস',
            self::Dozen => 'ডজন',
            self::Litre => 'লিটার',
            self::Bag => 'বস্তা',
        };
    }
}
