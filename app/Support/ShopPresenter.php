<?php

namespace App\Support;

use App\Models\Farmer;
use App\Models\Order;
use App\Models\Product;
use App\Services\Cart\CartItem;
use Illuminate\Support\Str;

/**
 * Maps database records onto the array shape the storefront React pages expect.
 */
final class ShopPresenter
{
    /**
     * @return array<string, mixed>
     */
    public function card(Product $product): array
    {
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
            'image' => $this->productImage($product),
            'is_featured' => $product->is_featured,
            'is_popular' => $product->is_popular,
            'is_seasonal' => $product->is_seasonal,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function detail(Product $product): array
    {
        return [
            ...$this->card($product),
            'images' => $product->images
                ->sortBy([['is_primary', 'desc'], ['sort_order', 'asc']])
                ->values()
                ->map(fn ($image): string => $this->imageUrl($image->image))
                ->all(),
            'farmer' => ($farmer = $product->farmer) !== null && $farmer->isApproved()
                ? $this->farmer($farmer)
                : null,
        ];
    }

    /**
     * @return array<string, string|null>
     */
    public function farmer(Farmer $farmer): array
    {
        $location = collect([$farmer->village, $farmer->district])
            ->filter()
            ->map(fn (string $part): string => (string) $part)
            ->implode(', ');

        return [
            'display_name' => $farmer->display_name,
            'bio' => $farmer->bio,
            'location' => $location !== '' ? $location : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function cartItem(CartItem $item): array
    {
        return [
            ...$this->card($item->product),
            'quantity' => $item->quantity,
            'subtotal' => $item->subtotal(),
            'available' => $item->product->is_active && $item->product->enoughStockFor($item->quantity),
        ];
    }

    /**
     * @return array<string, string|float|array<int, array<string, string|float>>>
     */
    public function order(Order $order): array
    {
        $order->loadMissing('items');

        return [
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'delivery_address' => $order->delivery_address,
            'delivery_area' => $order->delivery_area,
            'delivery_district' => $order->delivery_district,
            'delivery_instructions' => $order->delivery_instructions,
            'delivery_charge' => (float) $order->delivery_charge,
            'subtotal' => (float) $order->subtotal,
            'total' => (float) $order->total,
            'payment_method' => $order->payment_method->label(),
            'payment_status' => $order->payment_status->label(),
            'order_status' => $order->order_status->label(),
            'created_at' => $order->created_at->format('d M Y, h:i A'),
            'items' => $order->items->map(fn ($item): array => [
                'product_name' => $item->product_name,
                'unit' => $item->unit->label(),
                'unit_price' => (float) $item->unit_price,
                'quantity' => (float) $item->quantity,
                'subtotal' => (float) $item->subtotal,
            ])->all(),
        ];
    }

    /**
     * @return array<string, string|float>
     */
    public function orderSummary(Order $order): array
    {
        return [
            'order_number' => $order->order_number,
            'total' => (float) $order->total,
            'payment_method' => $order->payment_method->label(),
            'payment_status' => $order->payment_status->label(),
            'order_status' => $order->order_status->label(),
            'created_at' => $order->created_at->format('d M Y'),
            'items_count' => $order->items_count,
        ];
    }

    private function productImage(Product $product): ?string
    {
        $image = $product->primaryImage();

        return $image !== null ? $this->imageUrl($image->image) : null;
    }

    private function imageUrl(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://', '//'])) {
            return $path;
        }

        return asset('storage/'.$path);
    }
}
