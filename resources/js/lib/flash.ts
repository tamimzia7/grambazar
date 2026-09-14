import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AppFlash {
    success?: string;
    error?: string;
}

/**
 * Surfaces server-flashed status messages (cart updates, order confirmation)
 * as toasts once per redirected visit.
 */
export function useAppFlash(): void {
    const { flash } = usePage().props as { flash: AppFlash | null };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
}
