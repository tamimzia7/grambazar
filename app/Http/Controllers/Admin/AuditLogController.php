<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $action = trim((string) $request->query('action'));
        $targetType = $request->query('target_type');

        $logs = AuditLog::query()
            ->with('actor:id,name,email')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('action', 'like', "%{$search}%")
                        ->orWhereHas('actor', fn ($query) => $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->when($action !== '', fn ($query) => $query->where('action', $action))
            ->when(in_array($targetType, ['user', 'farmer', 'product', 'category', 'order', 'coupon', 'site_settings', 'role_permission'], true), function ($query) use ($targetType): void {
                $query->where('target_type', $targetType);
            })
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        return inertia('admin/audit-log/index', [
            'logs' => $logs->through(fn (AuditLog $log): array => [
                'id' => $log->id,
                'actor' => $log->actor !== null
                    ? ['id' => $log->actor->id, 'name' => $log->actor->name, 'email' => $log->actor->email]
                    : null,
                'action' => $log->action,
                'target_type' => $log->target_type,
                'target_id' => $log->target_id,
                'metadata' => $log->metadata,
                'created_at' => $log->created_at?->format('d M Y, h:i:s A'),
            ]),
            'filters' => [
                'search' => $search,
                'action' => $action,
                'target_type' => $targetType,
            ],
        ]);
    }
}
