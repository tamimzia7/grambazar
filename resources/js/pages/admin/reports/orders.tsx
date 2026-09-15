import { Head, usePage } from '@inertiajs/react';

import ReportFrame from '@/components/admin/report-frame';
import { formatTaka } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { ReportProps } from '@/types/admin';

interface OrderReportRow {
    order_number: string;
    customer_name: string;
    customer_phone: string;
    items_count: number;
    total: number;
    payment_method: string;
    order_status: string;
    payment_status: string;
    created_at: string;
}

export default function AdminReportsOrders() {
    const props = usePage().props as unknown as ReportProps<OrderReportRow>;
    const { rows, filters, meta } = props;

    return (
        <>
            <Head title="অর্ডার রিপোর্ট" />

            <ReportFrame
                meta={meta}
                filters={filters}
                baseUrl={adminRoutes.reports.orders.url()}
                summary={
                    <div className="flex flex-wrap gap-4 border-b border-stone-100 bg-emerald-50/50 px-5 py-3">
                        <Summary value={`${rows.length}টি অর্ডার`} label="মোট রেকর্ড" />
                        <Summary value={formatTaka(meta.settled_sum ?? 0)} label="পরিশোধিত অর্ডারের মূল্য" />
                    </div>
                }
            >
                <table className="w-full text-left text-xs sm:text-sm print:text-xs">
                    <thead>
                        <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                            <th className="px-5 py-3">অর্ডার</th>
                            <th className="px-5 py-3">গ্রাহক</th>
                            <th className="px-5 py-3 text-right">আইটেম</th>
                            <th className="px-5 py-3 text-right">মোট</th>
                            <th className="px-5 py-3">পেমেন্ট পদ্ধতি</th>
                            <th className="px-5 py-3">অর্ডার অবস্থা</th>
                            <th className="px-5 py-3">পেমেন্ট</th>
                            <th className="px-5 py-3">তারিখ</th>
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
                            rows.map((row) => (
                                <tr key={row.order_number}>
                                    <td className="px-5 py-2.5 font-mono font-bold text-emerald-950">{row.order_number}</td>
                                    <td className="px-5 py-2.5">
                                        <p className="font-semibold text-emerald-950">{row.customer_name}</p>
                                        <p className="text-xs text-stone-500">+{row.customer_phone}</p>
                                    </td>
                                    <td className="px-5 py-2.5 text-right text-stone-600">{row.items_count}</td>
                                    <td className="px-5 py-2.5 text-right font-bold text-emerald-950">{formatTaka(row.total)}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.payment_method}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.order_status}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.payment_status}</td>
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

function Summary({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-stone-500">{label}:</span>
            <span className="text-sm font-extrabold text-emerald-800">{value}</span>
        </div>
    );
}