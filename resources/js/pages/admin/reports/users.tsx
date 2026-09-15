import { Head, usePage } from '@inertiajs/react';

import ReportFrame from '@/components/admin/report-frame';
import adminRoutes from '@/routes/admin';
import type { ReportProps } from '@/types/admin';

interface UserReportRow {
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: string;
    orders_count: number;
    created_at: string;
}

export default function AdminReportsUsers() {
    const props = usePage().props as unknown as ReportProps<UserReportRow>;
    const { rows, filters, meta } = props;

    return (
        <>
            <Head title="ব্যবহারকারী রিপোর্ট" />

            <ReportFrame meta={meta} filters={filters} baseUrl={adminRoutes.reports.users.url()}>
                <table className="w-full text-left text-xs sm:text-sm print:text-xs">
                    <thead>
                        <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                            <th className="px-5 py-3">নাম</th>
                            <th className="px-5 py-3">ইমেইল</th>
                            <th className="px-5 py-3">ফোন</th>
                            <th className="px-5 py-3">ভূমিকা</th>
                            <th className="px-5 py-3">স্ট্যাটাস</th>
                            <th className="px-5 py-3 text-right">অর্ডার</th>
                            <th className="px-5 py-3">যোগদান</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-10 text-center text-stone-400">
                                    কোনো রেকর্ড নেই।
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                <tr key={`${row.email}-${index}`}>
                                    <td className="px-5 py-2.5 font-semibold text-emerald-950">{row.name}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.email}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.phone ?? '—'}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.role}</td>
                                    <td className="px-5 py-2.5 text-stone-600">{row.status}</td>
                                    <td className="px-5 py-2.5 text-right font-bold text-emerald-950">{row.orders_count}</td>
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