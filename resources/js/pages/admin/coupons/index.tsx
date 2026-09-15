import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PencilLine, Plus, Search, Trash2 } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import { formatTaka, toBnNumber } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminCouponsIndexPageProps } from '@/types/admin';

const inputClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminCouponsIndex() {
    const props = usePage().props as unknown as AdminCouponsIndexPageProps;
    const { coupons, filters } = props;
    const { data, setData, get } = useForm(
        filters as Record<string, string | number | boolean | null>,
    );

    const apply = () => get(window.location.pathname, { preserveState: true });

    return (
        <>
            <Head title="কুপন" />

            <PageHeader
                title="কুপন"
                subtitle="ডিসকাউন্ট কুপন ব্যবস্থাপনা।"
                actions={
                    <Link
                        href={adminRoutes.coupons.create.url()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        নতুন কুপন
                    </Link>
                }
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
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            খুঁজুন
                        </span>
                        <span className="relative block">
                            <Search
                                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={String(data.search ?? '')}
                                onChange={(event) =>
                                    setData('search', event.target.value)
                                }
                                placeholder="কোড, যেমন: SAVE10"
                                className={`${inputClass} w-full pl-8`}
                            />
                        </span>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            স্ট্যাটাস
                        </span>
                        <select
                            value={String(data.status ?? '')}
                            onChange={(event) =>
                                setData('status', event.target.value)
                            }
                            className={inputClass}
                        >
                            <option value="">সব স্ট্যাটাস</option>
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
                            <tr className="border-b border-stone-100 text-xs tracking-wide text-stone-500 uppercase">
                                <th className="px-4 py-3">কোড</th>
                                <th className="px-4 py-3">ডিসকাউন্ট</th>
                                <th className="px-4 py-3">সর্বনিম্ন অর্ডার</th>
                                <th className="px-4 py-3">ব্যবহার</th>
                                <th className="px-4 py-3">মেয়াদ</th>
                                <th className="px-4 py-3">স্ট্যাটাস</th>
                                <th className="px-4 py-3 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {coupons.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-stone-400"
                                    >
                                        কোনো কুপন পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                coupons.data.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td className="px-4 py-3">
                                            <span className="rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs font-bold text-emerald-800">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-emerald-800">
                                            {coupon.type === 'percentage'
                                                ? `${toBnNumber(coupon.value)}%`
                                                : formatTaka(coupon.value)}
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {coupon.min_order_value !== null
                                                ? formatTaka(
                                                      coupon.min_order_value,
                                                  )
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {toBnNumber(coupon.used_count)}
                                            {coupon.max_uses !== null
                                                ? ` / ${toBnNumber(coupon.max_uses)}`
                                                : ''}
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {coupon.expires_at ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                value={
                                                    coupon.is_active
                                                        ? 'সক্রিয়'
                                                        : 'নিষ্ক্রিয়'
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={adminRoutes.coupons.edit.url(
                                                        { coupon: coupon.id },
                                                    )}
                                                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                                                >
                                                    <PencilLine
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                    সম্পাদনা
                                                </Link>
                                                <Link
                                                    href={adminRoutes.coupons.toggleActive.url(
                                                        { coupon: coupon.id },
                                                    )}
                                                    method="post"
                                                    as="button"
                                                    className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
                                                >
                                                    {coupon.is_active
                                                        ? 'নিষ্ক্রিয় করুন'
                                                        : 'সক্রিয় করুন'}
                                                </Link>
                                                <Link
                                                    href={adminRoutes.coupons.destroy.url(
                                                        { coupon: coupon.id },
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    onClick={(event) => {
                                                        if (
                                                            !window.confirm(
                                                                `"${coupon.code}" কুপন মুছে ফেলতে চান?`,
                                                            )
                                                        ) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                    মুছুন
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={coupons} />
            </div>
        </>
    );
}
