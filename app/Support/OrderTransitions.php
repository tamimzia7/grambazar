<?php

namespace App\Support;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;

/**
 * Enforces the order/payment lifecycle so that nonsense transitions are
 * rejected unless deliberately handled by an administrator.
 */
final class OrderTransitions
{
    /**
     * Allowed order status moves, keyed by the current status.
     *
     * @return array<string, array<int, OrderStatus>>
     */
    public static function orderMap(): array
    {
        return [
            OrderStatus::Pending->value => [OrderStatus::Confirmed, OrderStatus::Cancelled],
            OrderStatus::Confirmed->value => [OrderStatus::Processing, OrderStatus::Cancelled],
            OrderStatus::Processing->value => [OrderStatus::Shipped, OrderStatus::Cancelled],
            OrderStatus::Shipped->value => [OrderStatus::Delivered, OrderStatus::Cancelled],
            OrderStatus::Delivered->value => [],
            OrderStatus::Cancelled->value => [],
        ];
    }

    /**
     * Allowed payment status moves, keyed by the current status.
     *
     * @return array<string, array<int, PaymentStatus>>
     */
    public static function paymentMap(): array
    {
        return [
            PaymentStatus::Unpaid->value => [PaymentStatus::Paid, PaymentStatus::Failed],
            PaymentStatus::Paid->value => [PaymentStatus::Refunded],
            PaymentStatus::Failed->value => [PaymentStatus::Paid],
            PaymentStatus::Refunded->value => [],
        ];
    }

    public static function canTransitionOrder(OrderStatus $from, OrderStatus $to): bool
    {
        return in_array($to, self::orderMap()[$from->value] ?? [], true);
    }

    public static function canTransitionPayment(PaymentStatus $from, PaymentStatus $to): bool
    {
        return in_array($to, self::paymentMap()[$from->value] ?? [], true);
    }

    /**
     * @return array<int, string>
     */
    public static function nextOrderTargets(OrderStatus $from): array
    {
        return array_map(
            fn (OrderStatus $status): string => $status->value,
            self::orderMap()[$from->value] ?? [],
        );
    }

    /**
     * @return array<int, string>
     */
    public static function nextPaymentTargets(PaymentStatus $from): array
    {
        return array_map(
            fn (PaymentStatus $status): string => $status->value,
            self::paymentMap()[$from->value] ?? [],
        );
    }
}
