<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Support\ShopPresenter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Response;

class ShopController extends Controller
{
    /**
     * The storefront listing, optionally scoped to a category.
     */
    public function index(Request $request, ?Category $category = null): Response
    {
        $query = Product::query()
            ->active()
            ->with(['category', 'images']);

        if ($category instanceof Category) {
            $query->whereIn('category_id', $this->categoryAndDescendants($category));
        }

        $search = trim((string) $request->query('q', ''));

        if ($search !== '') {
            $needle = addcslashes($search, '%_\\');

            $query->where(function ($builder) use ($needle): void {
                $builder->where('name', 'like', "%{$needle}%")
                    ->orWhere('short_description', 'like', "%{$needle}%")
                    ->orWhere('description', 'like', "%{$needle}%")
                    ->orWhereHas('category', fn ($categories): mixed => $categories->where('name', 'like', "%{$needle}%"));
            });
        }

        $this->applySort($query, $request->query('sort', 'popular'));

        $products = $query->paginate((int) config('shop.products_per_page'))
            ->withQueryString()
            ->through(fn (Product $product): array => app(ShopPresenter::class)->card($product));

        $activeCategory = $category instanceof Category ? $this->categoryPayload($category) : null;

        return inertia('shop/index', [
            'products' => $products,
            'categories' => $this->categoryTree(),
            'activeCategory' => $activeCategory,
            'search' => $search,
            'sort' => (string) $request->query('sort', 'popular'),
        ]);
    }

    /**
     * @return array<int, array{id: int, name: string, slug: string, sort_order: int, children: array<int, array{id: int, name: string, slug: string}>}>
     */
    private function categoryTree(): array
    {
        return Category::query()
            ->active()
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->with(['children' => fn ($children): mixed => $children->active()->orderBy('sort_order')])
            ->get()
            ->map(fn (Category $root): array => [
                'id' => $root->id,
                'name' => $root->name,
                'slug' => $root->slug,
                'sort_order' => $root->sort_order,
                'children' => $root->children->map(fn (Category $child): array => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                ])->values()->all(),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{name: string, slug: string, root: array{id: int, name: string, slug: string}}
     */
    private function categoryPayload(Category $category): array
    {
        $root = $category->parent ?? $category;

        return [
            'name' => $category->name,
            'slug' => $category->slug,
            'root' => ['id' => $root->id, 'name' => $root->name, 'slug' => $root->slug],
        ];
    }

    /**
     * @return array<int, int>
     */
    private function categoryAndDescendants(Category $category): array
    {
        $ids = [$category->id];

        return array_merge($ids, $category->children()->pluck('id')->all());
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function applySort(Builder $query, string $sort): void
    {
        match ($sort) {
            'price_asc' => $query->orderByRaw('COALESCE(NULLIF(sale_price, 0), price) ASC'),
            'price_desc' => $query->orderByRaw('COALESCE(NULLIF(sale_price, 0), price) DESC'),
            'newest' => $query->orderByDesc('created_at'),
            'discount' => $query->orderByDesc('is_popular')->orderByDesc('created_at'),
            default => $query->orderByRaw('is_popular DESC, COALESCE(NULLIF(sale_price, 0), price) ASC'),
        };
    }
}
