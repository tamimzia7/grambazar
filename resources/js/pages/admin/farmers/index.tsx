import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import adminRoutes from '@/routes/admin';
import type { AdminFarmersIndexPageProps } from '@/types/admin';

const inputClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminFarmersIndex() {
    const props = usePage().props as unknown as AdminFarmersIndexPageProps;
    const { farmers, filters, statuses } = props;
    const { data, setData, get } = useForm(filters as Record<string, string | number | boolean | null>);

    const apply = () => get(window.location.pathname, { preserveState: true });

    return (
        <>
            <Head title="কৃষক" />

            <PageHeader
                title="কৃষক"
                subtitle="কৃষক অ্যাকাউন্ট ও অনুমোদন ব্যবস্থাপনা।"
            />

            <div className="rounded-2xl border border-stone-200 bg-white">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        apply();
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
                                placeholder="নাম, দোকান, ফোন"
                                className={`${inputClass} w-full pl-8`}
                            />
                        </span>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">অনুমোদন</span>
                        <select
                            value={String(data.status ?? '')}
                            onChange={(event) => setData('status', event.target.value)}
                            className={inputClass}
                        >
                            <option value="">সব স্ট্যাটাস</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">অ্যাকাউন্ট</span>
                        <select
                            value={String(data.account_status ?? '')}
                            onChange={(event) => setData('account_status', event.target.value)}
                            className={inputClass}
                        >
                            <option value="">সব অ্যাকাউন্ট</option>
                            <option value="active">সক্রিয়</option>
                            <option value="inactive">নিষ্ক্রিয়</option>
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
                                <th className="px-4 py-3">কৃষক</th>
                                <th className="px-4 py-3">জেলা</th>
                                <th className="px-4 py-3">অনুমোদন</th>
                                <th className="px-4 py-3">অ্যাকাউন্ট</th>
                                <th className="px-4 py-3">পণ্য</th>
                                <th className="px-4 py-3">যোগদান</th>
                                <th className="px-4 py-3 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {farmers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                                        কোনো কৃষক পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                farmers.data.map((farmer) => (
                                    <tr key={farmer.id}>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-emerald-950">{farmer.display_name}</p>
                                            <p className="text-xs text-stone-500">{farmer.district}</p>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">{farmer.district}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge value={farmer.approval_status.label} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge value={farmer.account_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} />
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">{farmer.products_count}</td>
                                        <td className="px-4 py-3 text-stone-600">{farmer.created_at}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={adminRoutes.farmers.show.url({ farmer: farmer.id })}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
                                            >
                                                <Eye className="size-3.5" aria-hidden="true" />
                                                বিস্তারিত
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={farmers} />
            </div>
        </>
    );
}