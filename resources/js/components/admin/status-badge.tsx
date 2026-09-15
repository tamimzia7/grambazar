import { cn } from '@/lib/utils';

const toneMap: Record<string, string> = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rose: 'border-rose-200 bg-rose-50 text-rose-600',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    stone: 'border-stone-200 bg-stone-100 text-stone-600',
};

/**
 * Derives a status tone from common status/value spellings so tables stay
 * colour-consistent without a hand-written map per page.
 */
export function toneFor(value: string): keyof typeof toneMap {
    const v = value.toLowerCase();

    if (
        v.includes('active') ||
        v.includes('approved') ||
        v.includes('paid') ||
        v.includes('active_order') ||
        v === 'delivered' ||
        v === 'confirmed' ||
        v === 'completed'
    ) {
        return 'emerald';
    }

    if (v.includes('reject') || v.includes('pending') || v.includes('unpaid') || v === 'suspended') {
        return 'amber';
    }

    if (v.includes('failed') || v.includes('cancelled') || v === 'canceled' || v.includes('refunded')) {
        return 'rose';
    }

    return 'sky';
}

export default function StatusBadge({
    value,
    className,
    tone,
}: {
    value: string;
    className?: string;
    tone?: keyof typeof toneMap;
}) {
    const resolved = tone ?? toneFor(value);

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                toneMap[resolved],
                className,
            )}
        >
            {value}
        </span>
    );
}