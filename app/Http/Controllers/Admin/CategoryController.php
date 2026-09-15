<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

/**
 * Admin taxonomy management. Hierarchy is limited to one level: only root
 * categories may host children, so product/catalog queries stay predictable.
 */
class CategoryController extends Controller
{
    private const CHILD_DIRECTORY = 'categories';

    public function index(Request $request): Response
    {
        $categories = Category::orderBy('sort_order')->orderBy('name')->get();

        $roots = $categories
            ->whereNull('parent_id')
            ->values()
            ->map(function (Category $category) use ($categories): array {
                return $this->presentCategory($category, $categories);
            })
            ->all();

        return inertia('admin/categories/index', [
            'categories' => $roots,
            'totalProducts' => Category::query()->withCount('products')->get()->sum('products_count'),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (isset($validated['parent_id'])) {
            /** @var Category $parent */
            $parent = Category::query()->whereKey($validated['parent_id'])->firstOrFail();

            if (! $parent->isRoot()) {
                return back()->withErrors(['parent_id' => 'শুধুমাত্র মূল ক্যাটাগরির অধীনে উপ-ক্যাটাগরি তৈরি করা যাবে।'])->withInput();
            }
        }

        if (! empty($validated['image'])) {
            $validated['image'] = $request->file('image')->store(self::CHILD_DIRECTORY, 'public');
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $category = Category::create($validated);

        AuditLogService::record($request->user(), 'category.created', 'category', $category->id, [
            'name' => $category->name,
            'parent_id' => $category->parent_id,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('flash', ['success' => '"'.$category->name.'" ক্যাটাগরি তৈরি করা হয়েছে।']);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();

        if (isset($validated['parent_id'])) {
            /** @var Category $parent */
            $parent = Category::query()->whereKey($validated['parent_id'])->firstOrFail();

            if (! $parent->isRoot()) {
                return back()->withErrors(['parent_id' => 'শুধুমাত্র মূল ক্যাটাগরির অধীনে উপ-ক্যাটাগরি তৈরি করা যাবে।'])->withInput();
            }
        }

        if (! empty($validated['image'])) {
            $validated['image'] = $request->file('image')->store(self::CHILD_DIRECTORY, 'public');
        }

        $category->update($validated);

        AuditLogService::record($request->user(), 'category.updated', 'category', $category->id, [
            'name' => $category->name,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('flash', ['success' => '"'.$category->name.'" হালনাগাদ করা হয়েছে।']);
    }

    public function toggleActive(Request $request, Category $category): RedirectResponse
    {
        $category->forceFill(['is_active' => ! $category->is_active])->save();

        AuditLogService::record($request->user(), 'category.status_toggled', 'category', $category->id, [
            'name' => $category->name,
            'is_active' => $category->is_active,
        ]);

        return back()->with('flash', [
            'success' => $category->is_active ? '"'.$category->name.'" সক্রিয় করা হয়েছে।' : '"'.$category->name.'" নিষ্ক্রিয় করা হয়েছে।',
        ]);
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->with('flash', [
                'error' => 'ক্যাটাগরিতে পণ্য থাকায় মুছে ফেলা যাবে না। প্রথমে পণ্যগুলো সরান।',
            ]);
        }

        $name = $category->name;

        $category->delete();

        AuditLogService::record($request->user(), 'category.deleted', 'category', $category->id, [
            'name' => $name,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('flash', ['success' => '"'.$name.'" ক্যাটাগরি মুছে ফেলা হয়েছে।']);
    }

    /**
     * @param  Collection<int, Category>  $all
     * @return array<string, mixed>
     */
    private function presentCategory(Category $category, $all): array
    {
        $children = $all
            ->where('parent_id', $category->id)
            ->values()
            ->map(fn (Category $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'slug' => $child->slug,
                'description' => $child->description,
                'image' => $child->image ? Storage::disk('public')->url($child->image) : null,
                'is_active' => $child->is_active,
                'sort_order' => $child->sort_order,
                'products_count' => $child->products()->count(),
            ])
            ->all();

        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'image' => $category->image ? Storage::disk('public')->url($category->image) : null,
            'parent_id' => $category->parent_id,
            'is_active' => $category->is_active,
            'sort_order' => $category->sort_order,
            'products_count' => $category->products()->count(),
            'children' => $children,
            'has_products' => $category->products()->exists(),
        ];
    }
}
