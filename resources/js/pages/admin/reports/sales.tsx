import { Head, usePage } from '@inertiajs/react';

import ReportFrame from '@/components/admin/report-frame';
import { formatTaka } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { ReportProps } from '@/types/admin';
import type { OrderLine } from '@/types/shop';

interface SalesReportRow {
    order_number: string;
    customer_name: string;
    items: OrderLine[];
    subtotal: number;
    discount_amount: number;
    delivery_charge: number;
    total: number;
    payment_method: string;
    payment_status: string;
    created_at: string;
}

export default function AdminReportsSales() {
    const props = usePage().props as unknown as ReportProps<SalesReportRow>;
    const { rows, filters, meta } = props;

    return (
        <>
            <Head title="বিক্রয় রিপোর্ট" />

            <ReportFrame
                meta={meta}
                filters={filters}
                baseUrl={adminRoutes.reports.sales.url()}
                summary={
                    <div className="flex flex-wrap gap-4 border-b border-stone-100 bg-emerald-50/50 px-5 py-3">
                        <Summary value={formatTaka(meta.paid_sum ?? 0)} label="পরিশোধিত বিক্রয়" />
                        <Summary value={formatTaka(meta.unpaid_sum ?? 0)} label="বকেয়া (COD)" />
                        <Summary value={formatTaka(meta.discount_sum ?? 0)} label="মোট ডিসকাউন্ট" />
                    </div>
                }
            >
                <table className="w-full text-left text-xs sm:text-sm print:text-xs">
                    <thead>
                        <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                            <th className="px-5 py-3">অর্ডার</th>
                            <th className="px-5 py-3">গ্রাহক</th>
                            <th className="px-5 py-3">আইটেম</th>
                            <th className="px-5 py-3 text-right">মোট</th>
                            <th className="px-5 py-3">পেমেন্ট</th>
                            <th className="px-5 py-3">তারিখ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-10 text-center text-stone-400">
                                    কোনো রেকর্ড নেই।
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.order_number}>
                                    <td className="px-5 py-2.5 font-mono font-bold text-emerald-950">{row.order_number}</td>
                                    <td className="px-5 py-2.5 font-semibold text-emerald-950">{row.customer_name}</td>
                                    <td className="px-5 py-2.5 text-stone-600">
                                        {row.items.map((item) => (
                                            <p key={item.product_name}>
                                                {item.product_name} × {item.quantity}
                                            </p>
                                        ))}
                                    </td>
                                    <td className="px-5 py-2.5 text-right font-bold text-emerald-950">
                                        {formatTaka(row.total)}
                                        {row.discount_amount > 0 ? (
                                            <span className="block text-xs font-semibold text-emerald-600">
                                                −{formatTaka(row.discount_amount)} কুপন
                                            </span>
                                        ) : null}
                                    </td>
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