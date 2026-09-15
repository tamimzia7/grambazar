import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PencilLine, Plus, Search, ShieldCheck } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import adminRoutes from '@/routes/admin';
import type { AdminAdminsIndexPageProps } from '@/types/admin';

export default function AdminAdminsIndex() {
    const props = usePage().props as unknown as AdminAdminsIndexPageProps;
    const { admins, filters } = props;
    const { data, setData, get } = useForm(filters as Record<string, string | number | boolean | null>);

    return (
        <>
            <Head title="অ্যাডমিন" />

            <PageHeader
                title="অ্যাডমিন অ্যাকাউন্ট"
                subtitle="কেবল Super Admin-এর জন্য। অ্যাডমিনদের ভূমিকা ও অনুমতি ব্যবস্থাপনা।"
                actions={
                    <Link
                        href={adminRoutes.admins.create.url()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        নতুন অ্যাডমিন
                    </Link>
                }
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
                                placeholder="নাম, ইমেইল, ফোন"
                                className="h-9 w-full rounded-md border border-stone-200 bg-white pl-8 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />
                        </span>
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
                                <th className="px-4 py-3">অ্যাডমিন</th>
                                <th className="px-4 py-3">ভূমিকা</th>
                                <th className="px-4 py-3">স্ট্যাটাস</th>
                                <th className="px-4 py-3">যোগদান</th>
                                <th className="px-4 py-3 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {admins.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-stone-400">
                                        কোনো অ্যাডমিন পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                admins.data.map((admin) => (
                                    <tr key={admin.id}>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-emerald-950">
                                                {admin.name}
                                                {admin.is_super_admin ? (
                                                    <span className="ml-2 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                                        Super
                                                    </span>
                                                ) : null}
                                            </p>
                                            <p className="text-xs text-stone-500">{admin.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">{admin.role}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge value={admin.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} />
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">{admin.created_at}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={adminRoutes.admins.permissions.url({ admin_user: admin.id })}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
                                                >
                                                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                                                    অনুমতি
                                                </Link>
                                                {!admin.is_super_admin ? (
                                                    <>
                                                        <Link
                                                            href={adminRoutes.admins.edit.url({ admin_user: admin.id })}
                                                            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                                                        >
                                                            <PencilLine className="size-3.5" aria-hidden="true" />
                                                            সম্পাদনা
                                                        </Link>
                                                        <Link
                                                            href={adminRoutes.admins.toggleActive.url({ admin_user: admin.id })}
                                                            method="post"
                                                            as="button"
                                                            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
                                                        >
                                                            {admin.is_active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                                                        </Link>
                                                    </>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={admins} />
            </div>
        </>
    );
}