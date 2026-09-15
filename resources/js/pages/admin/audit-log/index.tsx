import { Head, useForm, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import Pagination from '@/components/admin/pagination';
import adminRoutes from '@/routes/admin';
import type { AdminAuditLogIndexPageProps } from '@/types/admin';

export default function AdminAuditLogIndex() {
    const props = usePage().props as unknown as AdminAuditLogIndexPageProps;
    const { logs, filters } = props;
    const { data, setData, get } = useForm(filters as Record<string, string | number | boolean | null>);

    const targetLabels: Record<string, string> = {
        user: 'ব্যবহারকারী',
        farmer: 'কৃষক',
        product: 'পণ্য',
        category: 'ক্যাটাগরি',
        order: 'অর্ডার',
        coupon: 'কুপন',
        site_settings: 'সাইট সেটিংস',
        role_permission: 'অনুমতি',
    };

    return (
        <>
            <Head title="অডিট লগ" />

            <PageHeader
                title="অডিট লগ"
                subtitle="প্রশাসনিক কার্যক্রমের লগ।"
            />

            <div className="rounded-2xl border border-stone-200 bg-white">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        get(window.location.pathname, { preserveState: true });
                    }}
                    className="flex flex-wrap items-end gap-3 border-b border-stone-100 p-4"
                >
                    <label className="block grow basis-64">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">খুঁজুন</span>
                        <span className="relative block">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
                            <input
                                type="search"
                                value={String(data.search ?? '')}
                                onChange={(event) => setData('search', event.target.value)}
                                placeholder="অ্যাকশন বা ব্যবহারকারী"
                                className="h-9 w-full rounded-md border border-stone-200 bg-white pl-8 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />
                        </span>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">অ্যাকশন</span>
                        <input
                            type="text"
                            value={String(data.action ?? '')}
                            onChange={(event) => setData('action', event.target.value)}
                            placeholder="যেমন: farmer.approved"
                            className="h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">লক্ষ্য</span>
                        <select
                            value={String(data.target_type ?? '')}
                            onChange={(event) => setData('target_type', event.target.value)}
                            className="h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        >
                            <option value="">সব</option>
                            {Object.entries(targetLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="h-9 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        ফিল্টার
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                                <th className="px-4 py-3">সময়</th>
                                <th className="px-4 py-3">অভিনয়কারী</th>
                                <th className="px-4 py-3">অ্যাকশন</th>
                                <th className="px-4 py-3">লক্ষ্য</th>
                                <th className="px-4 py-3">লক্ষ্য আইডি</th>
                                <th className="px-4 py-3">বিস্তারিত</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-stone-400">
                                        কোনো লগ পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-stone-600">{log.created_at}</td>
                                        <td className="px-4 py-3">
                                            {log.actor ? (
                                                <>
                                                    <p className="font-semibold text-emerald-950">{log.actor.name}</p>
                                                    <p className="text-xs text-stone-500">{log.actor.email}</p>
                                                </>
                                            ) : (
                                                <span className="text-stone-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs font-bold text-stone-600">
                                                {log.action}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {log.target_type ? (targetLabels[log.target_type] ?? log.target_type) : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">{log.target_id ?? '—'}</td>
                                        <td className="px-4 py-3 text-xs text-stone-500">
                                            {log.metadata ? <pre className="whitespace-pre-wrap">{JSON.stringify(log.metadata)}</pre> : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={logs} />
            </div>
        </>
    );
}