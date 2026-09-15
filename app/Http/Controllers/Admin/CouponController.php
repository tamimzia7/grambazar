<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCouponRequest;
use App\Http\Requests\Admin\UpdateCouponRequest;
use App\Models\Coupon;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $status = $request->query('status');

        $coupons = Coupon::query()
            ->withCount('usage')
            ->when($search !== '', fn ($query) => $query->where('code', 'like', "%{$search}%"))
            ->when(in_array($status, ['active', 'inactive'], true), function ($query) use ($status): void {
                $query->where('is_active', $status === 'active');
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return inertia('admin/coupons/index', [
            'coupons' => $coupons->through(fn (Coupon $coupon): array => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type->label(),
                'value' => (float) $coupon->value,
                'min_order_value' => $coupon->min_order_value !== null ? (float) $coupon->min_order_value : null,
                'max_uses' => $coupon->max_uses,
                'used_count' => $coupon->usage_count,
                'starts_at' => $coupon->starts_at?->format('d M Y'),
                'expires_at' => $coupon->expires_at?->format('d M Y'),
                'is_active' => $coupon->is_active,
                'created_at' => $coupon->created_at?->format('d M Y'),
            ]),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        return inertia('admin/coupons/create');
    }

    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $coupon = Coupon::create(array_merge(
            $request->validated(),
            ['is_active' => $request->boolean('is_active', true)],
        ));

        AuditLogService::record($request->user(), 'coupon.created', 'coupon', $coupon->id, [
            'code' => $coupon->code,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('flash', ['success' => '"'.$coupon->code.'" কুপন তৈরি করা হয়েছে।']);
    }

    public function edit(Request $request, Coupon $coupon): Response
    {
        return inertia('admin/coupons/edit', [
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type->value,
                'value' => (float) $coupon->value,
                'min_order_value' => $coupon->min_order_value !== null ? (float) $coupon->min_order_value : '',
                'max_uses' => $coupon->max_uses,
                'starts_at' => $coupon->starts_at?->format('Y-m-d') ?? '',
                'expires_at' => $coupon->expires_at?->format('Y-m-d') ?? '',
                'is_active' => $coupon->is_active,
                'description' => $coupon->description,
            ],
        ]);
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon): RedirectResponse
    {
        $coupon->update(array_merge(
            $request->validated(),
            ['is_active' => $request->boolean('is_active')],
        ));

        AuditLogService::record($request->user(), 'coupon.updated', 'coupon', $coupon->id, [
            'code' => $coupon->code,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('flash', ['success' => '"'.$coupon->code.'" কুপন হালনাগাদ করা হয়েছে।']);
    }

    public function toggleActive(Request $request, Coupon $coupon): RedirectResponse
    {
        $coupon->forceFill(['is_active' => ! $coupon->is_active])->save();

        AuditLogService::record($request->user(), 'coupon.status_toggled', 'coupon', $coupon->id, [
            'code' => $coupon->code,
            'is_active' => $coupon->is_active,
        ]);

        return back()->with('flash', [
            'success' => $coupon->is_active ? '"'.$coupon->code.'" সক্রিয় করা হয়েছে।' : '"'.$coupon->code.'" নিষ্ক্রিয় করা হয়েছে।',
        ]);
    }

    public function destroy(Request $request, Coupon $coupon): RedirectResponse
    {
        $code = $coupon->code;

        $coupon->delete();

        AuditLogService::record($request->user(), 'coupon.deleted', 'coupon', $coupon->id, [
            'code' => $code,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('flash', ['success' => '"'.$code.'" কুপন মুছে ফেলা হয়েছে।']);
    }
}
