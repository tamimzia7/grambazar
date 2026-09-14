<?php

namespace App\Enums;

enum FarmerApprovalStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Suspended = 'suspended';

    /**
     * The display label used across the Bengali-first interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'অনুমোদন pending',
            self::Approved => 'অনুমোদিত',
            self::Rejected => 'বাতিল',
            self::Suspended => 'স্থগিত',
        };
    }

    /**
     * Whether the farmer is allowed to list products.
     */
    public function isActive(): bool
    {
        return $this === self::Approved;
    }

    /**
     * Whether a decision has been reached that later requires a deliberate change.
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::Approved, self::Rejected], true);
    }
}
