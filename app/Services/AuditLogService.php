<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;

/**
 * Records privileged actions for the admin audit log.
 *
 * Metadata must never include passwords, hashes, tokens or other secrets.
 */
class AuditLogService
{
    /**
     * @param  array<string, mixed>  $metadata
     */
    public static function record(
        ?User $actor,
        string $action,
        ?string $targetType = null,
        int|string|null $targetId = null,
        array $metadata = [],
    ): AuditLog {
        return AuditLog::create([
            'actor_id' => $actor?->id,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId !== null ? (string) $targetId : null,
            'metadata' => $metadata === [] ? null : $metadata,
        ]);
    }
}
