<?php

namespace App\Services\Coupon\Exceptions;

use RuntimeException;

class InvalidCouponException extends RuntimeException
{
    public static function notFound(): self
    {
        return new self('কুপনটি খুঁজে পাওয়া যায়নি।');
    }

    public static function inactive(): self
    {
        return new self('কুপনটি এখন সক্রিয় নয়।');
    }

    public static function expired(): self
    {
        return new self('কুপনটির মেয়াদ শেষ হয়ে গেছে।');
    }

    public static function notStarted(): self
    {
        return new self('কুপনটি এখনও চালু হয়নি।');
    }

    public static function exhausted(): self
    {
        return new self('কুপনটির ব্যবহারসীমা শেষ হয়ে গেছে।');
    }

    public static function belowMinimum(float $minimum): self
    {
        return new self(sprintf('কুপনটি পেতে ন্যূনতম অর্ডার মান %s টাকা হতে হবে।', number_format($minimum, 2)));
    }
}
