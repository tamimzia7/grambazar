<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\ShopPresenter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Request $request, Product $product, ShopPresenter $presenter): Response
    {
        abort_unless($product->is_active, 404);

        $product->load(['category', 'images', 'farmer']);

        $related = Product::query()
            ->active()
            ->whereKeyNot($product->id)
            ->where(function (Builder $query) use ($product): void {
                $query->where('category_id', $product->category_id)
                    ->orWhere('farmer_id', $product->farmer_id);
            })
            ->orderByDesc('is_popular')
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at')
            ->limit(4)
            ->with(['category', 'images'])
            ->get()
            ->map(fn (Product $item): array => $presenter->card($item));

        return inertia('products/show', [
            'product' => $presenter->detail($product),
            'related' => $related->all(),
        ]);
    }
}
