import { router } from '@inertiajs/react';
import { toast } from 'sonner';

import cartRoutes from '@/routes/cart';

type InertiaErrors = Record<string, string>;

function handleCartError(errors: InertiaErrors): void {
    toast.error(errors.cart ?? 'কার্ট আপডেট করা যায়নি, আবার চেষ্টা করুন।');
}

export function addToCart(productId: number, quantity = 1): void {
    router.post(
        cartRoutes.add.url(),
        { product_id: productId, quantity },
        {
            preserveScroll: true,
            onError: handleCartError,
        },
    );
}

export function updateCartQuantity(productId: number, quantity: number): void {
    router.post(
        cartRoutes.update.url(),
        { product_id: productId, quantity },
        {
            preserveScroll: true,
            onError: handleCartError,
        },
    );
}

export function removeFromCart(productId: number): void {
    router.post(
        cartRoutes.remove.url(),
        { product_id: productId },
        {
            preserveScroll: true,
            onError: handleCartError,
        },
    );
}
