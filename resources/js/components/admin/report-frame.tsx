import { Link, router } from '@inertiajs/react';
import { Download, ExternalLink, Printer } from 'lucide-react';
import { useState } from 'react';

import { toBnNumber } from '@/lib/format';
import type { ReportFilters, ReportMeta } from '@/types/admin';

const inputClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

/**
 * Shared shell for every report. The toolbar only appears on screen (it is
 * hidden when printed) while the report header, table and summary stay part
 * of the output. Preview and "download as PDF" both open the browser print
 * dialog; saving there yields the PDF.
 */
export default function ReportFrame({
    meta,
    filters,
    baseUrl,
    children,
    summary,
}: {
    meta: ReportMeta;
    filters: ReportFilters;
    baseUrl: string;
    children: React.ReactNode;
    summary?: React.ReactNode;
}) {
    const [dateFrom, setDateFrom] = useState<string>(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState<string>(filters.date_to ?? '');

    const apply = () => {
        const params: Record<string, string> = {};

        if (dateFrom !== '') {
            params.date_from = dateFrom;
        }

        if (dateTo !== '') {
            params.date_to = dateTo;
        }

        router.get(`${baseUrl}?${new URLSearchParams(params).toString()}`);
    };

    return (
        <div>
            <div className="print-hidden mb-4 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex flex-wrap items-end gap-3">
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            শুরুর তারিখ
                        </span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(event) =>
                                setDateFrom(event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            শেষ তারিখ
                        </span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(event) => setDateTo(event.target.value)}
                            className={inputClass}
                        />
                    </label>

                    <button
                        type="button"
                        onClick={apply}
                        className="h-9 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        ফিল্টার প্রয়োগ
                    </button>

                    {(filters.date_from || filters.date_to) && (
                        <Link
                            href={baseUrl}
                            className="inline-flex h-9 items-center rounded-md border border-stone-200 px-3 text-sm font-semibold text-stone-600"
                        >
                            রিসেট
                        </Link>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                    >
                        <Printer className="size-4" aria-hidden="true" />
                        প্রিন্ট প্রিভিউ
                    </button>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                    >
                        <Download className="size-4" aria-hidden="true" />
                        PDF হিসেবে ডাউনলোড
                    </button>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-stone-400">
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        ফিল্টার পরিবর্তন করে রিপোর্ট পুনরায় তৈরি করুন
                    </span>
                </div>
            </div>

            <div className="print-area overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className="border-b border-stone-100 px-5 py-4">
                    <h2 className="text-lg font-extrabold text-emerald-950">
                        {meta.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-stone-500">
                        তৈরি: {meta.generated_at} · মোট রেকর্ড:{' '}
                        {toBnNumber(meta.count)}
                    </p>
                </div>

                {summary}

                <div className="overflow-x-auto">{children}</div>
            </div>
        </div>
    );
}
