import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import StatusBadge from '@/components/admin/status-badge';
import { formatTaka, toBnNumber } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminOrderShowPageProps } from '@/types/admin';

const selectClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm font-semibold text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminOrderShow() {
    const props = usePage().props as unknown as AdminOrderShowPageProps;
    const { order, transitions, can } = props;

    const orderForm = useForm({ order_status: '' });
    const paymentForm = useForm({ payment_status: '' });

    const advanceOrder = () => {
        if (!orderForm.data.order_status) return;
        orderForm.post(
            adminRoutes.orders.updateStatus.url({ order: order.order_number }),
            {
                forceFormData: true,
                onSuccess: () => orderForm.reset(),
            },
        );
    };

    const advancePayment = () => {
        if (!paymentForm.data.payment_status) return;
        paymentForm.post(
            adminRoutes.orders.updatePayment.url({ order: order.order_number }),
            {
                forceFormData: true,
                onSuccess: () => paymentForm.reset(),
            },
        );
    };

    return (
        <>
            <Head title={`#${order.order_number} — অর্ডার`} />

            <PageHeader
                title={`অর্ডার #${order.order_number}`}
                subtitle={`${order.customer_name} · ${order.created_at}`}
                actions={
                    <Link
                        href={adminRoutes.orders.index.url()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        ফিরে যান
                    </Link>
                }
            />

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
                {can.update ? (
                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <h2 className="mb-1 text-sm font-extrabold text-emerald-950">
                            অর্ডারের অবস্থা
                        </h2>
                        <p className="mb-3 text-xs text-stone-500">
                            বর্তমান: <StatusBadge value={order.order_status} />
                        </p>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                advanceOrder();
                            }}
                        >
                            <div className="flex gap-2">
                                <select
                                    value={orderForm.data.order_status}
                                    onChange={(event) =>
                                        orderForm.setData(
                                            'order_status',
                                            event.target.value,
                                        )
                                    }
                                    className={`${selectClass} grow`}
                                >
                                    <option value="">
                                        পরবর্তী অবস্থা নির্বাচন করুন…
                                    </option>
                                    {transitions.order.map((target) => (
                                        <option key={target} value={target}>
                                            {orderStatusLabel(target)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    disabled={
                                        orderForm.processing ||
                                        !orderForm.data.order_status
                                    }
                                    className="shrink-0 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    প্রয়োগ
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}

                {can.payment ? (
                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <h2 className="mb-1 text-sm font-extrabold text-emerald-950">
                            পেমেন্টের অবস্থা
                        </h2>
                        <p className="mb-3 text-xs text-stone-500">
                            বর্তমান: <StatusBadge value={order.payment_status} />
                        </p>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                advancePayment();
                            }}
                        >
                            <div className="flex gap-2">
                                <select
                                    value={paymentForm.data.payment_status}
                                    onChange={(event) =>
                                        paymentForm.setData(
                                            'payment_status',
                                            event.target.value,
                                        )
                                    }
                                    className={`${selectClass} grow`}
                                >
                                    <option value="">
                                        পরবর্তী অবস্থা নির্বাচন করুন…
                                    </option>
                                    {transitions.payment.map((target) => (
                                        <option key={target} value={target}>
                                            {paymentStatusLabel(target)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    disabled={
                                        paymentForm.processing ||
                                        !paymentForm.data.payment_status
                                    }
                                    className="shrink-0 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    প্রয়োগ
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-2">
                    <h2 className="mb-3 text-base font-extrabold text-emerald-950">
                        আইটেম
                    </h2>
                    {order.items.length === 0 ? (
                        <p className="py-4 text-center text-sm text-stone-400">
                            কোনো আইটেম নেই।
                        </p>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-stone-100 text-xs tracking-wide text-stone-500 uppercase">
                                        <th className="py-2 pr-4">পণ্য</th>
                                        <th className="py-2 pr-4">ইউনিট</th>
                                        <th className="py-2 pr-4 text-right">
                                            দর
                                        </th>
                                        <th className="py-2 pr-4 text-right">
                                            পরিমাণ
                                        </th>
                                        <th className="py-2 text-right">
                                            সাবমোট
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {order.items.map((item, index) => (
                                        <tr
                                            key={`${item.product_name}-${index}`}
                                        >
                                            <td className="py-2.5 pr-4 font-semibold text-emerald-950">
                                                {item.product_name}
                                            </td>
                                            <td className="py-2.5 pr-4 text-stone-600">
                                                {item.unit}
                                            </td>
                                            <td className="py-2.5 pr-4 text-right text-stone-600">
                                                {formatTaka(item.unit_price)}
                                            </td>
                                            <td className="py-2.5 pr-4 text-right text-stone-600">
                                                {toBnNumber(item.quantity)}
                                            </td>
                                            <td className="py-2.5 text-right font-bold text-emerald-950">
                                                {formatTaka(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <dl className="mt-3 space-y-2 border-t border-stone-100 pt-3 text-sm">
                                <TotalRow
                                    label="সাবটোটাল"
                                    value={formatTaka(order.subtotal)}
                                />
                                <TotalRow
                                    label="ডেলিভারি চার্জ"
                                    value={formatTaka(order.delivery_charge)}
                                />
                                {order.coupon_code ? (
                                    <TotalRow
                                        label={`কুপন (${order.coupon_code})`}
                                        value={`−${formatTaka(order.discount_amount)}`}
                                    />
                                ) : null}
                                <div className="flex items-center justify-between gap-4 pt-1 text-base">
                                    <dt className="font-extrabold text-emerald-950">
                                        মোট
                                    </dt>
                                    <dd className="font-extrabold text-emerald-700">
                                        {formatTaka(order.total)}
                                    </dd>
                                </div>
                            </dl>
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <h2 className="mb-3 text-base font-extrabold text-emerald-950">
                            গ্রাহক ও ডেলিভারি
                        </h2>
                        <dl className="divide-y divide-stone-100">
                            <InfoRow label="নাম" value={order.customer_name} />
                            <InfoRow
                                label="ফোন"
                                value={`+${order.customer_phone}`}
                            />
                            <InfoRow
                                label="পেমেন্ট পদ্ধতি"
                                value={paymentMethodLabel(order.payment_method)}
                            />
                            <InfoRow
                                label="ঠিকানা"
                                value={order.delivery_address}
                            />
                            <InfoRow
                                label="এলাকা"
                                value={order.delivery_area ?? '—'}
                            />
                            <InfoRow
                                label="জেলা"
                                value={order.delivery_district}
                            />
                            {order.delivery_instructions ? (
                                <InfoRow
                                    label="নোট"
                                    value={order.delivery_instructions}
                                />
                            ) : null}
                        </dl>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <h2 className="mb-3 text-base font-extrabold text-emerald-950">
                            অবস্থা
                        </h2>
                        <dl className="divide-y divide-stone-100">
                            <InfoRow label="অর্ডার" value={order.order_status} />
                            <InfoRow
                                label="পেমেন্ট"
                                value={order.payment_status}
                            />
                        </dl>
                    </div>
                </div>
            </div>
        </>
    );
}

function orderStatusLabel(value: string): string {
    const labels: Record<string, string> = {
        pending: 'পেন্ডিং',
        confirmed: 'নিশ্চিত',
        processing: 'প্রক্রিয়াধীন',
        shipped: 'শিপড',
        delivered: 'ডেলিভারড',
        cancelled: 'বাতিল',
    };
    return labels[value] ?? value;
}

function paymentStatusLabel(value: string): string {
    const labels: Record<string, string> = {
        unpaid: 'অপরিশোধিত',
        paid: 'পরিশোধিত',
        failed: 'ব্যর্থ',
        refunded: 'ফেরত',
    };
    return labels[value] ?? value;
}

function paymentMethodLabel(value: string): string {
    const labels: Record<string, string> = {
        cod: 'ক্যাশ অন ডেলিভারি',
        online: 'অনলাইন পেমেন্ট',
    };
    return labels[value] ?? value;
}

function TotalRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-stone-500">{label}</dt>
            <dd className="font-bold text-emerald-950">{value}</dd>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2.5">
            <dt className="text-sm font-semibold text-stone-500">{label}</dt>
            <dd className="max-w-52 text-right text-sm font-bold text-emerald-950">
                {value}
            </dd>
        </div>
    );
}
