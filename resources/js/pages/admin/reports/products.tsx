import { Head, usePage } from '@inertiajs/react';

import ReportFrame from '@/components/admin/report-frame';
import { formatTaka } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { ReportProps } from '@/types/admin';

interface ProductReportRow {
    name: string;
    category: string | null;
    farmer: string | null;
    unit_price: number;
    sale_price: number | null;
    stock_quantity: number;
    status: string;
    created_at: string;
}

export default function AdminReportsProducts() {
    const props = usePage().props as unknown as ReportProps<ProductReportRow>;
    const { rows, filters, meta } = props;

    return (
        <>
            <Head title="পণ্য রিপোর্ট" />

            <ReportFrame meta={meta} filters={filters} baseUrl={adminRoutes.reports.products.url()}>
                <table className="w-full text-left text-xs sm:text-sm print:text-xs">
                    <thead>
                        <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                            <th className="px-5 py-3">পণ্য</th>
                            <th className="px-5 py-3">ক্যাটাগরি</th>
                            <th className="px-5 py-3">কৃষক</th>
                            <th className="px-5 py-3 text-right">মূল্য</th>
                            <th className="px-5 py-3 text-right">সদস্য মূল্য</th>
                            <th className="px-5 py-3 text-right">স্টক</th>
                            <th className="px-5 py-3">স্ট্যাটাস</th>
                            <th className="px-5 py-3">যোগদান</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-5 py-10 text-center text-stone-400">
                                    কোনো রেকর্ড নেই।
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                <tr key={`${row.name}-${index}`}>
                                    <td className="px-5 py-2.5 font-semibold text-emerald-950">{row.name}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.category ?? '—'}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.farmer ?? '—'}</td>
                                    <td className="px-5 py-2.5 text-right font-bold text-emerald-950">{formatTaka(row.unit_price)}</td>
                                    <td className="px-5 py-2.5 text-right text-stone-600">
                                        {row.sale_price !== null ? formatTaka(row.sale_price) : '—'}
                                    </td>
                                    <td className="px-5 py-2.5 text-right text-stone-600">{row.stock_quantity}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.status}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.created_at}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </ReportFrame>
        </>
    );
}