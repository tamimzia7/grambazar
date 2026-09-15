<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductUnit;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\AuditLogService;
use App\Support\ShopPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Response;

/**
 * Product moderation, stock and catalogue flags. Farmer-owned details are
 * edited by the farmer; admins only adjust curatorial and inventory state.
 */
class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $categoryId = $request->query('category_id');
        $status = $request->query('status');

        $products = Product::query()
            ->with(['category:id,name', 'farmer:id,user_id,display_name', 'images:id,product_id,image,is_primary,sort_order'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->when($categoryId !== null && $categoryId !== '', function ($query) use ($categoryId): void {
                $category = Category::find((int) $categoryId);
                $ids = $category !== null ? $category->children()->pluck('id')->push($category->id) : [];

                $query->whereIn('category_id', $ids);
            })
            ->when(in_array($status, ['active', 'inactive'], true), function ($query) use ($status): void {
                $query->where('is_active', $status === 'active');
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        $presenter = new ShopPresenter;

        return inertia('admin/products/index', [
            'products' => $products->through(function (Product $product) use ($presenter): array {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image' => $presenter->card($product)['image'],
                    'category' => $product->category?->name,
                    'farmer' => $product->farmer?->display_name,
                    'price' => (float) $product->price,
                    'sale_price' => $product->sale_price !== null ? (float) $product->sale_price : null,
                    'stock_quantity' => $product->stock_quantity,
                    'is_active' => $product->is_active,
                    'created_at' => $product->created_at?->format('d M Y'),
                ];
            }),
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId,
                'status' => $status,
            ],
            'categories' => Category::orderBy('name')->get(['id', 'name'])->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
            ])->all(),
        ]);
    }

    public function show(Request $request, Product $product): Response
    {
        $product->load(['category:id,name', 'farmer.user:id,name,email,phone', 'images']);

        $presenter = new ShopPresenter;

        return inertia('admin/products/show', [
            'product' => [
                ...$presenter->detail($product),
                'farmer' => $product->farmer !== null
                    ? [
                        'id' => $product->farmer->id,
                        'display_name' => $product->farmer->display_name,
                        'status' => $product->farmer->approval_status->label(),
                        'owner_user_id' => $product->farmer->user_id,
                        'owner_phone' => $product->farmer->user?->phone,
                    ]
                    : null,
                'category' => $product->category !== null
                    ? ['id' => $product->category->id, 'name' => $product->category->name]
                    : null,
                'is_active' => $product->is_active,
            ],
            'units' => collect(ProductUnit::cases())->map(fn (ProductUnit $unit): array => [
                'value' => $unit->value,
                'label' => $unit->label(),
            ])->all(),
            'can' => [
                'edit' => $request->user()->hasPermission('products.edit'),
                'stock' => $request->user()->hasPermission('products.stock'),
                'moderate' => $request->user()->hasPermission('products.moderate'),
            ],
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0.01', 'max:99999999'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'max:99999999', 'lt:price'],
            'unit' => ['required', Rule::enum(ProductUnit::class)],
            'min_order_quantity' => ['required', 'integer', 'min:1', 'max:1000'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_popular' => ['sometimes', 'boolean'],
            'is_seasonal' => ['sometimes', 'boolean'],
        ]);

        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_popular'] = $request->boolean('is_popular');
        $validated['is_seasonal'] = $request->boolean('is_seasonal');

        if (($validated['price'] ?? null) !== null && (float) $validated['sale_price'] >= (float) $validated['price']) {
            $validated['sale_price'] = null;
        }

        $product->update($validated);

        AuditLogService::record($request->user(), 'product.updated', 'product', $product->id, [
            'name' => $product->name,
        ]);

        return back()->with('flash', ['success' => '"'.$product->name.'" হালনাগাদ করা হয়েছে।']);
    }

    public function updateStock(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'stock_quantity' => ['required', 'integer', 'min:0', 'max:999999'],
        ]);

        $product->forceFill(['stock_quantity' => $validated['stock_quantity']])->save();

        AuditLogService::record($request->user(), 'product.stock_updated', 'product', $product->id, [
            'name' => $product->name,
            'stock_quantity' => $product->stock_quantity,
        ]);

        return back()->with('flash', ['success' => $product->name.'-এর মজুত আপডেট হয়েছে।']);
    }

    public function toggleActive(Request $request, Product $product): RedirectResponse
    {
        $product->forceFill(['is_active' => ! $product->is_active])->save();

        AuditLogService::record($request->user(), 'product.status_toggled', 'product', $product->id, [
            'name' => $product->name,
            'is_active' => $product->is_active,
        ]);

        return back()->with('flash', [
            'success' => $product->is_active ? '"'.$product->name.'" দৃশ্যমান করা হয়েছে।' : '"'.$product->name.'" লুকানো হয়েছে।',
        ]);
    }
}
