<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminPermissionsRequest;
use App\Http\Requests\Admin\UpdateAdminRequest;
use App\Models\Permission;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

/**
 * Administrator accounts. Only Super Admin may reach these endpoints. The role
 * of every created account is forced to Admin — requests cannot escalate to
 * Super Admin, and existing Super Admin accounts cannot be edited or removed.
 */
class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));

        $admins = User::query()
            ->whereIn('role', [UserRole::Admin->value, UserRole::SuperAdmin->value])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return inertia('admin/admins/index', [
            'admins' => $admins->through(fn (User $admin): array => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'role' => $admin->role->label(),
                'is_super_admin' => $admin->isSuperAdmin(),
                'is_active' => $admin->is_active,
                'created_at' => $admin->created_at?->format('d M Y'),
            ]),
            'filters' => ['search' => $search],
        ]);
    }

    public function create(Request $request): Response
    {
        return inertia('admin/admins/create');
    }

    public function store(StoreAdminRequest $request): RedirectResponse
    {
        // Role is deliberately ignored from the request payload; forced to Admin.
        $admin = DB::transaction(function () use ($request): User {
            $user = User::create(array_merge(
                $request->validated(),
                [
                    'role' => UserRole::Admin,
                    'email_verified_at' => now(),
                ],
            ));

            return $user;
        });

        AuditLogService::record($request->user(), 'admin.created', 'user', $admin->id, [
            'email' => $admin->email,
            'role' => $admin->role->value,
        ]);

        return redirect()->route('admin.admins.index')
            ->with('flash', ['success' => $admin->name.'-কে নতুন অ্যাডমিন হিসেবে যোগ করা হয়েছে।']);
    }

    public function edit(Request $request, User $adminUser): Response
    {
        abort_if(! $this->canTune($adminUser), 403, 'Super Admin অ্যাকাউন্ট সম্পাদনা করা যাবে না।');

        return inertia('admin/admins/edit', [
            'admin' => [
                'id' => $adminUser->id,
                'name' => $adminUser->name,
                'email' => $adminUser->email,
                'phone' => $adminUser->phone,
                'is_active' => $adminUser->is_active,
            ],
        ]);
    }

    public function update(UpdateAdminRequest $request, User $adminUser): RedirectResponse
    {
        abort_if(! $this->canTune($adminUser), 403, 'Super Admin অ্যাকাউন্ট সম্পাদনা করা যাবে না।');

        $validated = $request->validated();

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $adminUser->update(array_merge($validated, [
            'is_active' => $request->boolean('is_active'),
        ]));

        AuditLogService::record($request->user(), 'admin.updated', 'user', $adminUser->id, [
            'email' => $adminUser->email,
        ]);

        return redirect()->route('admin.admins.index')
            ->with('flash', ['success' => $adminUser->name.'-এর তথ্য হালনাগাদ করা হয়েছে।']);
    }

    public function toggleActive(Request $request, User $adminUser): RedirectResponse
    {
        abort_if(! $this->canTune($adminUser), 403, 'Super Admin অ্যাকাউন্ট পরিচালনা করা যাবে না।');

        if ($adminUser->is($request->user())) {
            return back()->with('flash', ['error' => 'নিজের অ্যাকাউন্ট নিজে নিষ্ক্রিয় করা যাবে না।']);
        }

        $adminUser->forceFill(['is_active' => ! $adminUser->is_active])->save();

        AuditLogService::record($request->user(), 'admin.status_toggled', 'user', $adminUser->id, [
            'email' => $adminUser->email,
            'is_active' => $adminUser->is_active,
        ]);

        return back()->with('flash', [
            'success' => $adminUser->is_active ? $adminUser->name.'-কে সক্রিয় করা হয়েছে।' : $adminUser->name.'-কে নিষ্ক্রিয় করা হয়েছে।',
        ]);
    }

    /**
     * Permission editor. Permissions are role-scoped: this screen edits the
     * grants held by the "admin" role, which applies to every admin account.
     */
    public function permissions(Request $request, User $adminUser): Response
    {
        abort_if(! $this->canTune($adminUser), 403, 'Super Admin অ্যাকাউন্টের অনুমতি পরিচালনা করা যাবে না।');

        $granted = Permission::query()
            ->join('role_permission', function ($join): void {
                $join->on('role_permission.permission_id', '=', 'permissions.id')
                    ->where('role_permission.role', '=', UserRole::Admin->value);
            })
            ->pluck('name')
            ->all();

        $permissions = Permission::query()
            ->orderBy('sort_order')->orderBy('group')->orderBy('name')
            ->get()
            ->groupBy('group')
            ->map(fn ($items, string $group): array => [
                'group' => $group,
                'permissions' => $items->map(fn (Permission $permission): array => [
                    'name' => $permission->name,
                    'label' => $permission->label,
                ])->values()->all(),
            ])
            ->values()
            ->all();

        return inertia('admin/admins/permissions', [
            'admin' => [
                'id' => $adminUser->id,
                'name' => $adminUser->name,
                'email' => $adminUser->email,
            ],
            'groups' => $permissions,
            'granted' => $granted,
        ]);
    }

    public function updatePermissions(UpdateAdminPermissionsRequest $request, User $adminUser): RedirectResponse
    {
        abort_if(! $this->canTune($adminUser), 403, 'Super Admin অ্যাকাউন্টের অনুমতি পরিচালনা করা যাবে না।');

        $permissionNames = $request->validated()['permissions'] ?? [];

        DB::transaction(function () use ($permissionNames): void {
            Permission::query()
                ->whereIn('name', $permissionNames)
                ->pluck('id')
                ->each(function (string $permissionId): void {
                    DB::table('role_permission')->updateOrInsert(
                        ['role' => UserRole::Admin->value, 'permission_id' => $permissionId],
                        ['updated_at' => now()],
                    );
                });

            DB::table('role_permission')
                ->where('role', UserRole::Admin->value)
                ->whereNotIn('permission_id', Permission::query()->whereIn('name', $permissionNames)->pluck('id'))
                ->delete();
        });

        AuditLogService::record($request->user(), 'admin.permissions_updated', 'role_permission', $adminUser->id, [
            'role' => UserRole::Admin->value,
            'permissions' => $permissionNames,
        ]);

        return back()->with('flash', ['success' => 'অ্যাডমিন রোলের অনুমতি হালনাগাদ করা হয়েছে।']);
    }

    /**
     * Only non-Super-Admin accounts may be tuned (Super Admin is untouchable),
     * and no account may be tuned to Super Admin status.
     */
    private function canTune(User $user): bool
    {
        return ! $user->isSuperAdmin();
    }
}
