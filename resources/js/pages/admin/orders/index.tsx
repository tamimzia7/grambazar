import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import { formatTaka } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminOrdersIndexPageProps } from '@/types/admin';

const inputClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminOrdersIndex() {
    const props = usePage().props as unknown as AdminOrdersIndexPageProps;
    const { orders, filters, orderStatuses, paymentStatuses } = props;
    const { data, setData, get } = useForm(
        filters as Record<string, string | number | boolean | null>,
    );

    const apply = () => get(window.location.pathname, { preserveState: true });

    return (
        <>
            <Head title="অর্ডার" />

            <PageHeader title="অর্ডার" subtitle="সকল অর্ডার ও পেমেন্ট অবস্থা।" />

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
                                placeholder="অর্ডার নম্বর, নাম, ফোন"
                                className={`${inputClass} w-full pl-8`}
                            />
                        </span>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            অর্ডার অবস্থা
                        </span>
                        <select
                            value={String(data.order_status ?? '')}
                            onChange={(event) =>
                                setData('order_status', event.target.value)
                            }
                            className={inputClass}
                        >
                            <option value="">সব অবস্থা</option>
                            {orderStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            পেমেন্ট
                        </span>
                        <select
                            value={String(data.payment_status ?? '')}
                            onChange={(event) =>
                                setData('payment_status', event.target.value)
                            }
                            className={inputClass}
                        >
                            <option value="">সব পেমেন্ট</option>
                            {paymentStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            শুরু তারিখ
                        </span>
                        <input
                            type="date"
                            value={String(data.date_from ?? '')}
                            onChange={(event) =>
                                setData('date_from', event.target.value)
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
                            value={String(data.date_to ?? '')}
                            onChange={(event) =>
                                setData('date_to', event.target.value)
                            }
                            className={inputClass}
                        />
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
                                <th className="px-4 py-3">অর্ডার</th>
                                <th className="px-4 py-3">গ্রাহক</th>
                                <th className="px-4 py-3">আইটেম</th>
                                <th className="px-4 py-3">মোট</th>
                                <th className="px-4 py-3">অর্ডার অবস্থা</th>
                                <th className="px-4 py-3">পেমেন্ট</th>
                                <th className="px-4 py-3">তারিখ</th>
                                <th className="px-4 py-3 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-12 text-center text-stone-400"
                                    >
                                        কোনো অর্ডার পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={adminRoutes.orders.show.url(
                                                    {
                                                        order: order.order_number,
                                                    },
                                                )}
                                                className="font-bold text-emerald-800 hover:text-emerald-900"
                                            >
                                                #{order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-emerald-950">
                                                {order.customer_name}
                                            </p>
                                            <p className="text-xs text-stone-500">
                                                +{order.customer_phone}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {order.items_count}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-emerald-800">
                                            {formatTaka(order.total)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                value={order.order_status.label}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                value={
                                                    order.payment_status.label
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {order.created_at}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={adminRoutes.orders.show.url(
                                                    {
                                                        order: order.order_number,
                                                    },
                                                )}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
                                            >
                                                <Eye
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                বিস্তারিত
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={orders} />
            </div>
        </>
    );
}
