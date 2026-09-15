<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\SiteSetting;
use Database\Seeders\SiteSettingSeeder;
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

        $defaults = collect(SiteSettingSeeder::defaults())
            ->mapWithKeys(fn (array $setting): array => [$setting['key'] => $setting['value']])
            ->all();

        $stored = SiteSetting::resolveMany(array_keys($defaults), $defaults);

        $keys = [
            'site.hero_eyebrow' => 'hero_eyebrow',
            'site.hero_title' => 'hero_title',
            'site.hero_subtitle' => 'hero_subtitle',
            'site.brand_about' => 'brand_about',
            'site.contact_address' => 'contact_address',
            'site.contact_phone' => 'contact_phone',
            'site.contact_email' => 'contact_email',
            'site.contact_hours' => 'contact_hours',
            'site.social_facebook' => 'social_facebook',
            'site.social_instagram' => 'social_instagram',
            'site.social_youtube' => 'social_youtube',
        ];

        $site = [];
        foreach ($keys as $settingKey => $prop) {
            $site[$prop] = $stored[$settingKey];
        }

        return Inertia::render('welcome', [
            'site' => $site,
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
