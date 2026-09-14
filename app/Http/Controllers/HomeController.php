<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Render the GramBazar homepage with database-driven sections.
     */
    public function __invoke(): Response
    {
        $categories = Category::query()
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image' => asset("images/home/cat-{$category->slug}.svg"),
            ])
            ->values()
            ->all();

        return Inertia::render('welcome', [
            'categories' => $categories,
            'popularProducts' => $this->productPayload(
                Product::query()->with('category')->where('is_popular', true)->active()->get(),
            ),
            'seasonalProducts' => $this->productPayload(
                Product::query()->with('category')->where('is_seasonal', true)->active()->get(),
            ),
            'spiceProducts' => $this->productPayload(
                Product::query()
                    ->with('category')
                    ->whereHas('category', fn ($query) => $query->where('slug', 'moshola'))
                    ->active()
                    ->get(),
            ),
            'featuredProduct' => $this->productPayload(
                Product::query()->with('category')->where('is_featured', true)->active()->get(),
            )[0] ?? null,
            'stats' => [
                'farmers' => Farmer::query()->where('approval_status', 'approved')->count(),
                'products' => Product::query()->active()->count(),
                'categories' => count($categories),
            ],
        ]);
    }

    /**
     * @param  Collection<int, Product>  $products
     * @return array<int, array<string, mixed>>
     */
    private function productPayload(Collection $products): array
    {
        return $products->map(function (Product $product): array {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'sale_price' => $product->sale_price !== null ? (float) $product->sale_price : null,
                'unit' => $product->unit->value,
                'unit_label' => $product->unit->label(),
                'short_description' => $product->short_description,
                'description' => $product->description,
                'stock_quantity' => $product->stock_quantity,
                'min_order_quantity' => $product->min_order_quantity,
                'category_slug' => $product->category?->slug,
                'image' => null,
                'is_featured' => $product->is_featured,
                'is_popular' => $product->is_popular,
                'is_seasonal' => $product->is_seasonal,
            ];
        })->values()->all();
    }
}
