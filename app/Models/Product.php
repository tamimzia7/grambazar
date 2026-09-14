<?php

namespace App\Models;

use App\Enums\ProductUnit;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $farmer_id
 * @property int $category_id
 * @property string $name
 * @property string $slug
 * @property string|null $short_description
 * @property string|null $description
 * @property string $price
 * @property string|null $sale_price
 * @property ProductUnit $unit
 * @property int $stock_quantity
 * @property int $min_order_quantity
 * @property bool $is_featured
 * @property bool $is_popular
 * @property bool $is_seasonal
 * @property bool $is_active
 */
#[Fillable([
    'farmer_id',
    'category_id',
    'name',
    'slug',
    'short_description',
    'description',
    'price',
    'sale_price',
    'unit',
    'stock_quantity',
    'min_order_quantity',
    'is_featured',
    'is_popular',
    'is_seasonal',
    'is_active',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Farmer, $this>
     */
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<ProductImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * The preferred product image, falling back to the first gallery image.
     */
    public function primaryImage(): ?ProductImage
    {
        return $this->images->firstWhere('is_primary', true) ?? $this->images->first();
    }

    public function onSale(): bool
    {
        return $this->sale_price !== null;
    }

    /**
     * The price actually charged, preferring a valid discounted price.
     */
    public function sellingPrice(): float
    {
        $sale = (float) $this->sale_price;

        return $sale > 0 && $sale < (float) $this->price ? $sale : (float) $this->price;
    }

    public function isDiscounted(): bool
    {
        return $this->sellingPrice() !== (float) $this->price;
    }

    public function enoughStockFor(int $quantity): bool
    {
        return (int) $this->stock_quantity >= $quantity;
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'unit' => ProductUnit::class,
            'stock_quantity' => 'integer',
            'min_order_quantity' => 'integer',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_seasonal' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
