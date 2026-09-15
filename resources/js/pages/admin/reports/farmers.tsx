import { Head, usePage } from '@inertiajs/react';

import ReportFrame from '@/components/admin/report-frame';
import adminRoutes from '@/routes/admin';
import type { ReportProps } from '@/types/admin';

interface FarmerReportRow {
    display_name: string;
    account: string | null;
    district: string;
    approval_status: string;
    account_active: string;
    products_count: number;
    created_at: string;
}

export default function AdminReportsFarmers() {
    const props = usePage().props as unknown as ReportProps<FarmerReportRow>;
    const { rows, filters, meta } = props;

    return (
        <>
            <Head title="কৃষক রিপোর্ট" />

            <ReportFrame meta={meta} filters={filters} baseUrl={adminRoutes.reports.farmers.url()}>
                <table className="w-full text-left text-xs sm:text-sm print:text-xs">
                    <thead>
                        <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                            <th className="px-5 py-3">কৃষক</th>
                            <th className="px-5 py-3">অ্যাকাউন্ট</th>
                            <th className="px-5 py-3">জেলা</th>
                            <th className="px-5 py-3">অনুমোদন</th>
                            <th className="px-5 py-3">অ্যাকাউন্ট স্ট্যাটাস</th>
                            <th className="px-5 py-3 text-right">পণ্য</th>
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
                                <tr key={`${row.display_name}-${index}`}>
                                    <td className="px-5 py-2.5 font-semibold text-emerald-950">{row.display_name}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.account ?? '—'}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.district}</td>
                                    <td className="px-5 py-2.5 font-bold text-emerald-800">{row.approval_status}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.account_active}</td>
                                    <td className="px-5 py-2.5 text-right font-bold text-emerald-950">{row.products_count}</td>
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