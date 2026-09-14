import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import type { HomeCategory } from '@/types/home';

export default function SectionHeading({
    eyebrow,
    title,
    description,
    linkLabel,
    onLink,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    linkLabel?: string;
    onLink?: () => void;
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
                {eyebrow && (
                    <p className="text-sm font-semibold tracking-wide text-emerald-600 uppercase">
                        {eyebrow}
                    </p>
                )}
                <h2 className="text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
                    {title}
                </h2>
                {description && (
                    <p className="text-base leading-relaxed text-stone-600">
                        {description}
                    </p>
                )}
            </div>
            {linkLabel && onLink && (
                <button
                    type="button"
                    onClick={onLink}
                    className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                >
                    {linkLabel}
                    <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                    />
                </button>
            )}
        </div>
    );
}

export function categoryToast(category: HomeCategory): void {
    toast(`"${category.name}" বিভাগের পাতা শীঘ্রই আসবে`);
}
