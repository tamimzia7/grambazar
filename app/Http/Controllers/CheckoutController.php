<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCheckoutRequest;
use App\Services\Cart\Cart;
use App\Services\Cart\CartItem;
use App\Services\Ordering\Exceptions\EmptyCartException;
use App\Services\Ordering\Exceptions\InsufficientStockException;
use App\Services\Ordering\Exceptions\UnavailableProductException;
use App\Services\Ordering\OrderPlacer;
use App\Support\ShopPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Cart $cart, ShopPresenter $presenter): Response|RedirectResponse
    {
        $items = $cart->items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('flash', ['error' => 'চেকআউট করার জন্য কার্টে পণ্য যোগ করুন।']);
        }

        $unavailable = $items->filter(
            fn (CartItem $item): bool => ! $item->product->is_active || ! $item->product->enoughStockFor($item->quantity)
        );

        if ($unavailable->isNotEmpty()) {
            return redirect()->route('cart.index')
                ->with('flash', ['error' => 'কার্টে থাকা কিছু পণ্য এখন আর কেনা যাচ্ছে না। অনুগ্রহ করে কার্ট থেকে সরিয়ে নিন।']);
        }

        $itemsPayload = $items->map(fn (CartItem $item): array => $presenter->cartItem($item));

        $subtotal = round($itemsPayload->sum('subtotal'), 2);

        return inertia('checkout/index', [
            'items' => $itemsPayload->all(),
            'subtotal' => $subtotal,
            'deliveryCharge' => app(OrderPlacer::class)->deliveryChargeFor($subtotal),
            'freeDeliveryAbove' => (float) config('shop.free_delivery_above'),
        ]);
    }

    public function store(
        StoreCheckoutRequest $request,
        Cart $cart,
        OrderPlacer $placer
    ): RedirectResponse {
        if ($cart->empty()) {
            return redirect()->route('cart.index')
                ->with('flash', ['error' => 'আপনার কার্ট খালি। আগে কিছু পণ্য যোগ করুন।']);
        }

        try {
            $order = $placer->place($request->validated());
        } catch (EmptyCartException $exception) {
            return redirect()->route('cart.index')
                ->with('flash', ['error' => $exception->getMessage()]);
        } catch (UnavailableProductException|InsufficientStockException $exception) {
            return back()
                ->withErrors(['cart' => $exception->getMessage()]);
        }

        return redirect()->route('orders.show', ['order' => $order->order_number])
            ->with('flash', ['success' => 'আপনার অর্ডারটি নিশ্চিত হয়েছে!']);
    }
}
