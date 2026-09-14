import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    MapPin,
    Package,
    Phone,
} from 'lucide-react';

import { formatTaka, toBnNumber } from '@/lib/format';
import shopRoutes from '@/routes/shop';
import type { OrderPageProps } from '@/types/shop';

export default function OrderShow() {
    const { order } = usePage().props as unknown as OrderPageProps;

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <div className="rounded-3xl border border-emerald-100 bg-white p-6 text-center sm:p-10">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="size-9 text-emerald-600" />
                </span>
                <h1 className="mt-5 text-2xl font-bold text-emerald-950 sm:text-3xl">
                    অর্ডার নিশ্চিত হয়েছে!
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
                    ধন্যবাদ, {order.customer_name}! আপনার অর্ডারের নম্বর{' '}
                    <span className="font-bold text-emerald-700">
                        {order.order_number}
                    </span>
                    । আমরা শীঘ্রই আপনার নম্বরে যোগাযোগ করব।
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-800">
                        <Clock className="size-4" aria-hidden="true" />
                        {order.order_status}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 font-medium text-stone-600">
                        <Package className="size-4" aria-hidden="true" />
                        {order.payment_method}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 font-medium text-stone-600">
                        {order.payment_status}
                    </span>
                </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <section className="rounded-2xl border border-stone-100 bg-white p-6">
                    <h2 className="flex items-center gap-2 text-base font-bold text-emerald-950">
                        <MapPin className="size-4 text-emerald-600" />
                        ডেলিভারির ঠিকানা
                    </h2>
                    <dl className="mt-4 space-y-2.5 text-sm text-stone-600">
                        <div className="flex justify-between gap-4">
                            <dt className="shrink-0">নাম</dt>
                            <dd className="text-right font-medium text-stone-800">
                                {order.customer_name}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="flex items-center gap-1.5">
                                <Phone
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                ফোন
                            </dt>
                            <dd className="text-right font-medium text-stone-800">
                                {order.customer_phone}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt>ঠিকানা</dt>
                            <dd className="text-right text-stone-800">
                                {order.delivery_address}
                                {order.delivery_area &&
                                    `, ${order.delivery_area}`}
                                , {order.delivery_district}
                            </dd>
                        </div>
                        {order.delivery_instructions && (
                            <div className="flex justify-between gap-4">
                                <dt>নির্দেশনা</dt>
                                <dd className="text-right text-stone-800">
                                    {order.delivery_instructions}
                                </dd>
                            </div>
                        )}
                        <div className="flex justify-between gap-4">
                            <dt>অর্ডারের সময়</dt>
                            <dd className="text-right text-stone-800">
                                {order.created_at}
                            </dd>
                        </div>
                    </dl>
                </section>

                <section className="rounded-2xl border border-stone-100 bg-white p-6">
                    <h2 className="text-base font-bold text-emerald-950">
                        পণ্যের তালিকা
                    </h2>
                    <ul className="mt-4 space-y-3">
                        {order.items.map((item, index) => (
                            <li
                                key={`${item.product_name}-${index}`}
                                className="flex items-center justify-between gap-4 text-sm"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-emerald-950">
                                        {item.product_name}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        {formatTaka(item.unit_price)}/
                                        {item.unit} ×{' '}
                                        {toBnNumber(item.quantity)}
                                    </p>
                                </div>
                                <span className="shrink-0 font-bold text-stone-800">
                                    {formatTaka(item.subtotal)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-5 space-y-2.5 border-t border-stone-100 pt-4 text-sm text-stone-600">
                        <div className="flex justify-between">
                            <dt>পণ্যের মূল্য</dt>
                            <dd className="font-semibold text-stone-800">
                                {formatTaka(order.subtotal)}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>ডেলিভারি চার্জ</dt>
                            <dd
                                className={
                                    order.delivery_charge === 0
                                        ? 'font-semibold text-emerald-600'
                                        : 'font-semibold text-stone-800'
                                }
                            >
                                {order.delivery_charge === 0
                                    ? 'ফ্রি'
                                    : formatTaka(order.delivery_charge)}
                            </dd>
                        </div>
                        <div className="flex justify-between border-t border-stone-100 pt-3 text-base">
                            <dt className="font-bold text-emerald-950">
                                সর্বমোট
                            </dt>
                            <dd className="font-extrabold text-emerald-700">
                                {formatTaka(order.total)}
                            </dd>
                        </div>
                    </dl>
                </section>
            </div>

            <div className="mt-8 text-center">
                <Link
                    href={shopRoutes.index.url()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                >
                    আরও কিনতে দোকানে যান
                    <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}
