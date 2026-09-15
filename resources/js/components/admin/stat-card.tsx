import type React from 'react';

import { toBnNumber } from '@/lib/format';

export default function StatCard({
    label,
    value,
    icon,
    tone = 'emerald',
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone?: 'emerald' | 'stone' | 'amber' | 'rose' | 'sky';
}) {
    const tones: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-700',
        stone: 'bg-stone-100 text-stone-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        sky: 'bg-sky-50 text-sky-600',
    };

    const formatted =
        typeof value === 'number'
            ? toBnNumber(value.toLocaleString('en-US'))
            : value;

    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-500">
                    {label}
                </span>
                <span
                    className={`grid size-9 place-items-center rounded-xl ${tones[tone]}`}
                >
                    {icon}
                </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-emerald-950">
                {formatted}
            </p>
        </div>
    );
}
