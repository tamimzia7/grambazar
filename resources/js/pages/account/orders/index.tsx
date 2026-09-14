import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Package } from 'lucide-react';

import { formatTaka, toBnNumber } from '@/lib/format';
import accountRoutes from '@/routes/account';
import shopRoutes from '@/routes/shop';
import type { AccountOrdersPageProps } from '@/types/account';

export default function AccountOrders() {
    const { orders } = usePage().props as unknown as AccountOrdersPageProps;

    return (
        <>
            <Head title="আমার অর্ডার" />

            <div className="rounded-2xl border border-stone-100 bg-white">
                <div className="border-b border-stone-100 px-5 py-4">
                    <h2 className="text-lg font-bold text-emerald-950">
                        আমার অর্ডার
                    </h2>
                    <p className="mt-1 text-sm text-stone-500">
                        আপনার সমস্ত অর্ডারের তালিকা এখানে।
                    </p>
                </div>

                {orders.data.length === 0 ? (
                    <div className="px-5 py-14 text-center">
                        <Package
                            className="mx-auto size-12 text-stone-300"
                            aria-hidden="true"
                        />
                        <p className="mt-4 text-base font-bold text-stone-600">
                            এখনও কোনো অর্ডার নেই
                        </p>
                        <p className="mt-1 text-sm text-stone-400">
                            দোকানে গিয়ে আপনার পছন্দের পণ্য অর্ডার করুন।
                        </p>
                        <Link
                            href={shopRoutes.index.url()}
                            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                        >
                            দোকানে যান
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <ul className="divide-y divide-stone-100">
                            {orders.data.map((order) => (
                                <li
                                    key={order.order_number}
                                    className="px-5 py-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-bold text-emerald-950">
                                                #{order.order_number}
                                            </p>
                                            <p className="mt-0.5 text-sm text-stone-500">
                                                {order.created_at}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-stone-500">
                                                    {order.payment_status}
                                                </p>
                                                <p className="font-extrabold text-emerald-700">
                                                    {formatTaka(order.total)}
                                                </p>
                                            </div>
                                            <Link
                                                href={accountRoutes.orders.show.url(
                                                    {
                                                        order: order.order_number,
                                                    },
                                                )}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                                            >
                                                বিস্তারিত
                                                <ArrowRight
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {orders.links.length > 3 && (
                            <nav
                                aria-label="পেজিং"
                                className="flex flex-wrap items-center justify-center gap-1.5 border-t border-stone-100 p-4"
                            >
                                {orders.links.map((link, index) => {
                                    const label = String(link.label);
                                    const isPage = /^\d+$/.test(label);

                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={`${label}-${index}`}
                                                className="rounded-full px-3 py-2 text-sm text-stone-300"
                                            >
                                                …
                                            </span>
                                        );
                                    }

                                    if (!isPage) {
                                        return (
                                            <Link
                                                key={`${label}-${index}`}
                                                href={link.url}
                                                className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                                            >
                                                {label
                                                    .replace(/&[a-z]+;/g, '')
                                                    .trim() || label}
                                            </Link>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={`${label}-${index}`}
                                            href={link.url}
                                            aria-current={
                                                link.active ? 'page' : undefined
                                            }
                                            className={`${
                                                link.active
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-800'
                                            } rounded-full px-3 py-2 text-sm`}
                                        >
                                            {toBnNumber(Number(label))}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
