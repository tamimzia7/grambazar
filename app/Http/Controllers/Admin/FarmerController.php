<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FarmerApprovalStatus;
use App\Http\Controllers\Controller;
use App\Models\Farmer;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

/**
 * Farmer approval lifecycle: approve, reject, suspend and reactivate accounts.
 * Only administrator accounts may reach these endpoints (routing + middleware),
 * and a farmer can never moderate their own profile.
 */
class FarmerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $status = $request->query('status');
        $accountStatus = $request->query('account_status');

        $farmers = Farmer::query()
            ->with('user:id,name,email,phone,is_active')
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('display_name', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($query) => $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->when(in_array($status, array_map(fn (FarmerApprovalStatus $status): string => $status->value, FarmerApprovalStatus::cases()), true), function ($query) use ($status): void {
                $query->where('approval_status', $status);
            })
            ->when(in_array($accountStatus, ['active', 'inactive'], true), function ($query) use ($accountStatus): void {
                $query->whereHas('user', fn ($query) => $query->where('is_active', $accountStatus === 'active'));
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return inertia('admin/farmers/index', [
            'farmers' => $farmers->through(fn (Farmer $farmer): array => [
                'id' => $farmer->id,
                'display_name' => $farmer->display_name,
                'district' => $farmer->district,
                'approval_status' => [
                    'value' => $farmer->approval_status->value,
                    'label' => $farmer->approval_status->label(),
                ],
                'account_active' => $farmer->user->is_active,
                'products_count' => $farmer->products_count,
                'created_at' => $farmer->created_at?->format('d M Y'),
            ]),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'account_status' => $accountStatus,
            ],
            'statuses' => collect(FarmerApprovalStatus::cases())->map(fn (FarmerApprovalStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])->all(),
        ]);
    }

    public function show(Request $request, Farmer $farmer): Response
    {
        $farmer->load('user');

        $products = $farmer->products()
            ->with('category:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category?->name,
                'price' => (float) $product->price,
                'sale_price' => $product->sale_price !== null ? (float) $product->sale_price : null,
                'stock_quantity' => $product->stock_quantity,
                'is_active' => $product->is_active,
            ])
            ->all();

        return inertia('admin/farmers/show', [
            'farmer' => [
                'id' => $farmer->id,
                'display_name' => $farmer->display_name,
                'bio' => $farmer->bio,
                'district' => $farmer->district,
                'village' => $farmer->village,
                'address' => $farmer->address,
                'approval_status' => [
                    'value' => $farmer->approval_status->value,
                    'label' => $farmer->approval_status->label(),
                ],
                'created_at' => $farmer->created_at?->format('d M Y'),
                'user' => [
                    'id' => $farmer->user->id,
                    'name' => $farmer->user->name,
                    'email' => $farmer->user->email,
                    'phone' => $farmer->user->phone,
                    'is_active' => $farmer->user->is_active,
                ],
            ],
            'products' => $products,
            'can' => [
                'approve' => $request->user()->hasPermission('farmers.approve'),
                'reject' => $request->user()->hasPermission('farmers.reject'),
                'suspend' => $request->user()->hasPermission('farmers.suspend'),
                'toggle_account' => $request->user()->hasPermission('users.manage_status'),
            ],
        ]);
    }

    public function approve(Request $request, Farmer $farmer): RedirectResponse
    {
        $farmer->load('user');

        return DB::transaction(function () use ($request, $farmer): RedirectResponse {
            $before = $farmer->approval_status;

            $farmer->forceFill([
                'approval_status' => FarmerApprovalStatus::Approved,
            ])->save();

            AuditLogService::record($request->user(), 'farmer.approved', 'farmer', $farmer->id, [
                'from' => $before->value,
                'display_name' => $farmer->display_name,
            ]);

            return back()->with('flash', ['success' => $farmer->display_name.'-এর প্রোফাইল অনুমোদিত হয়েছে।']);
        });
    }

    public function reject(Request $request, Farmer $farmer): RedirectResponse
    {
        $farmer->load('user');

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        return DB::transaction(function () use ($request, $farmer, $validated): RedirectResponse {
            $before = $farmer->approval_status;

            $farmer->forceFill([
                'approval_status' => FarmerApprovalStatus::Rejected,
            ])->save();

            AuditLogService::record($request->user(), 'farmer.rejected', 'farmer', $farmer->id, [
                'from' => $before->value,
                'display_name' => $farmer->display_name,
                'reason' => $validated['reason'],
            ]);

            return back()->with('flash', ['error' => $farmer->display_name.'-এর প্রোফাইল প্রত্যাখ্যান করা হয়েছে।']);
        });
    }

    public function suspend(Request $request, Farmer $farmer): RedirectResponse
    {
        $farmer->load('user');

        return DB::transaction(function () use ($request, $farmer): RedirectResponse {
            $before = $farmer->approval_status;

            $farmer->forceFill([
                'approval_status' => FarmerApprovalStatus::Suspended,
            ])->save();

            AuditLogService::record($request->user(), 'farmer.suspended', 'farmer', $farmer->id, [
                'from' => $before->value,
                'display_name' => $farmer->display_name,
            ]);

            return back()->with('flash', ['error' => $farmer->display_name.'-এর প্রোফাইল সাময়িকভাবে স্থগিত করা হয়েছে।']);
        });
    }

    public function reactivate(Request $request, Farmer $farmer): RedirectResponse
    {
        $farmer->load('user');

        return DB::transaction(function () use ($request, $farmer): RedirectResponse {
            $before = $farmer->approval_status;

            $farmer->forceFill([
                'approval_status' => FarmerApprovalStatus::Approved,
            ])->save();

            AuditLogService::record($request->user(), 'farmer.reactivated', 'farmer', $farmer->id, [
                'from' => $before->value,
                'display_name' => $farmer->display_name,
            ]);

            return back()->with('flash', ['success' => $farmer->display_name.'-এর প্রোফাইল পুনরায় সক্রিয় করা হয়েছে।']);
        });
    }

    public function toggleAccount(Request $request, Farmer $farmer): RedirectResponse
    {
        $farmer->load('user');

        $user = $farmer->user;

        if ($user->is($request->user())) {
            return back()->with('flash', ['error' => 'নিজের অ্যাকাউন্ট নিজে নিষ্ক্রিয় করা যাবে না।']);
        }

        $user->forceFill(['is_active' => ! $user->is_active])->save();

        AuditLogService::record($request->user(), 'farmer.account_toggled', 'farmer', $farmer->id, [
            'is_active' => $user->is_active,
            'display_name' => $farmer->display_name,
        ]);

        return back()->with('flash', [
            'success' => $user->is_active ? 'কৃষকের অ্যাকাউন্ট সক্রিয় করা হয়েছে।' : 'কৃষকের অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।',
        ]);
    }
}
