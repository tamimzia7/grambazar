<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\Cart\Cart;
use App\Services\Cart\CartItem;
use App\Support\ShopPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Cart $cart, ShopPresenter $presenter): Response
    {
        $items = $cart->items()
            ->map(fn (CartItem $item): array => $presenter->cartItem($item));

        $available = $items->filter(fn (array $item): bool => $item['available'])->values();
        $unavailable = $items->filter(fn (array $item): bool => ! $item['available'])->values();

        return inertia('cart/index', [
            'items' => $available->all(),
            'unavailableItems' => $unavailable->all(),
            'subtotal' => round($available->sum('subtotal'), 2),
            'count' => (int) $available->sum('quantity'),
        ]);
    }

    public function add(Request $request, Cart $cart): RedirectResponse
    {
        $product = $this->resolveRequestedProduct($request);

        if ($product === null) {
            return back()->withErrors(['cart' => 'পণ্যটি আর পাওয়া যাচ্ছে না।']);
        }

        $quantity = (int) $request->input('quantity', $product->min_order_quantity);
        $totalQuantity = $quantity + $cart->quantityOf($product->id);

        if ($totalQuantity < (int) $product->min_order_quantity) {
            return back()->withErrors([
                'cart' => sprintf(
                    'এ পণ্যের জন্য সর্বনিম্ন %d %s অর্ডার করতে হবে।',
                    $product->min_order_quantity,
                    $product->unit->label()
                ),
            ]);
        }

        if (! $product->enoughStockFor($totalQuantity)) {
            return back()->withErrors([
                'cart' => sprintf('দুঃখিত! %s-এর শুধু %d %s বাকি আছে।', $product->name, $product->stock_quantity, $product->unit->label()),
            ]);
        }

        $cart->add($product->id, $quantity);

        return back()->with('flash', [
            'success' => sprintf('%s কার্টে যোগ হয়েছে।', $product->name),
        ]);
    }

    public function update(Request $request, Cart $cart): RedirectResponse
    {
        $product = $this->resolveRequestedProduct($request);

        if ($product === null) {
            return back()->withErrors(['cart' => 'পণ্যটি আর পাওয়া যাচ্ছে না।']);
        }

        $quantity = (int) $request->input('quantity', 0);

        if ($quantity < (int) $product->min_order_quantity) {
            return back()->withErrors([
                'cart' => sprintf(
                    'এ পণ্যের জন্য সর্বনিম্ন %d %s অর্ডার করতে হবে।',
                    $product->min_order_quantity,
                    $product->unit->label()
                ),
            ]);
        }

        if (! $product->enoughStockFor($quantity)) {
            return back()->withErrors([
                'cart' => sprintf('দুঃখিত! %s-এর শুধু %d %s বাকি আছে।', $product->name, $product->stock_quantity, $product->unit->label()),
            ]);
        }

        $cart->set($product->id, $quantity);

        return back()->with('flash', ['success' => 'কার্ট আপডেট হয়েছে।']);
    }

    public function remove(Request $request, Cart $cart): RedirectResponse
    {
        $productId = (int) $request->input('product_id');

        if ($productId > 0 && $cart->has($productId)) {
            $cart->remove($productId);
        }

        return back()->with('flash', ['success' => 'পণ্যটি কার্ট থেকে সরানো হয়েছে।']);
    }

    private function resolveRequestedProduct(Request $request): ?Product
    {
        $value = $request->input('product_id');

        if (! is_numeric($value) || (int) $value <= 0) {
            return null;
        }

        /** @var Product|null */
        return Product::query()->active()->whereKey((int) $value)->first();
    }
}
