import { Link } from '@inertiajs/react';

import { toBnNumber } from '@/lib/format';
import type { Paginator } from '@/types/admin';

export default function Pagination<T>({ paginator }: { paginator: Paginator<T> }) {
    if (paginator.links.length <= 3) {
        return null;
    }

    return (
        <nav
            aria-label="পেজিং"
            className="flex flex-wrap items-center justify-center gap-1.5 border-t border-stone-100 p-4"
        >
            {paginator.links.map((link, index) => {
                const label = String(link.label);
                const isPage = /^\d+$/.test(label);

                if (link.url === null) {
                    return (
                        <span
                            key={`${label}-${index}`}
                            className="rounded-full px-3 py-2 text-sm text-stone-300"
                        >
                            …
                        </span>
                    );
                }

                if (!isPage) {
                    return (
                        <Link
                            key={`${label}-${index}`}
                            href={link.url}
                            className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                        >
                            {label.replace(/&[a-z]+;/g, '').trim() || label}
                        </Link>
                    );
                }

                return (
                    <Link
                        key={`${label}-${index}`}
                        href={link.url}
                        aria-current={link.active ? 'page' : undefined}
                        className={`${
                            link.active
                                ? 'bg-emerald-600 text-white'
                                : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-800'
                        } rounded-full px-3 py-2 text-sm`}
                    >
                        {toBnNumber(Number(label))}
                    </Link>
                );
            })}
        </nav>
    );
}