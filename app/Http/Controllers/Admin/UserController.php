<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $role = $request->query('role');
        $status = $request->query('status');

        $users = User::query()
            ->with('farmer:id,user_id,display_name,approval_status')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when(in_array($role, array_map(fn (UserRole $role): string => $role->value, UserRole::cases()), true), function ($query) use ($role): void {
                $query->where('role', $role);
            })
            ->when(in_array($status, ['active', 'inactive'], true), function ($query) use ($status): void {
                $query->where('is_active', $status === 'active');
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return inertia('admin/users/index', [
            'users' => $users->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => [
                    'value' => $user->role->value,
                    'label' => $user->role->label(),
                ],
                'is_active' => $user->is_active,
                'created_at' => $user->created_at?->format('d M Y'),
            ]),
            'filters' => [
                'search' => $search,
                'role' => $role,
                'status' => $status,
            ],
            'roles' => collect(UserRole::cases())->map(fn (UserRole $role): array => [
                'value' => $role->value,
                'label' => $role->label(),
            ])->all(),
        ]);
    }

    public function show(Request $request, User $user): Response
    {
        $farmer = $user->farmer()->withCount('products')->first();

        return inertia('admin/users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => [
                    'value' => $user->role->value,
                    'label' => $user->role->label(),
                ],
                'is_active' => $user->is_active,
                'created_at' => $user->created_at?->format('d M Y, h:i A'),
                'orders_count' => $user->orders()->count(),
                'total_spent' => round((float) $user->orders()->where('order_status', '!=', 'cancelled')->sum('total'), 2),
            ],
            'farmer' => $farmer !== null ? [
                'id' => $farmer->id,
                'display_name' => $farmer->display_name,
                'approval_status' => $farmer->approval_status->label(),
                'district' => $farmer->district,
                'products_count' => $farmer->products_count,
            ] : null,
            'can' => [
                'manage_status' => $request->user()->hasPermission('users.manage_status'),
            ],
        ]);
    }

    public function toggleActive(Request $request, User $user): RedirectResponse
    {
        $actor = $request->user();

        if ($user->is($actor)) {
            return back()->with('flash', ['error' => 'নিজের অ্যাকাউন্ট নিজে নিষ্ক্রিয় করা যাবে না।']);
        }

        if ($user->role === UserRole::SuperAdmin && ! $actor->isSuperAdmin()) {
            abort(403, 'Super Admin অ্যাকাউন্ট পরিচালনা করার অনুমতি নেই।');
        }

        $user->forceFill(['is_active' => ! $user->is_active])->save();

        AuditLogService::record($actor, 'users.status_toggled', 'user', $user->id, [
            'is_active' => $user->is_active,
            'email' => $user->email,
        ]);

        return back()->with('flash', [
            'success' => $user->is_active ? 'অ্যাকাউন্টটি সক্রিয় করা হয়েছে।' : 'অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।',
        ]);
    }

    public function report(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $role = $request->query('role');
        $status = $request->query('status');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $users = User::query()
            ->with('farmer:id,user_id,display_name,approval_status')
            ->withCount(['orders'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when(in_array($role, array_map(fn (UserRole $role): string => $role->value, UserRole::cases()), true), function ($query) use ($role): void {
                $query->where('role', $role);
            })
            ->when(in_array($status, ['active', 'inactive'], true), function ($query) use ($status): void {
                $query->where('is_active', $status === 'active');
            })
            ->when($dateFrom, fn ($query) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn ($query) => $query->whereDate('created_at', '<=', $dateTo))
            ->orderByDesc('id')
            ->limit(1000)
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role->label(),
                'status' => $user->is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়',
                'orders_count' => $user->orders_count,
                'created_at' => $user->created_at?->format('d M Y'),
            ])
            ->all();

        return inertia('admin/reports/users', [
            'rows' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'status' => $status,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'meta' => [
                'title' => 'ব্যবহারকারী রিপোর্ট',
                'generated_at' => now()->format('d M Y, h:i A'),
                'count' => count($users),
            ],
        ]);
    }
}
