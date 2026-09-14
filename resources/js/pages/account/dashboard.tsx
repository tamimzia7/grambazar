import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Package,
    ReceiptText,
    ShoppingBag,
    User,
    KeyRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatTaka, toBnNumber } from '@/lib/format';
import accountRoutes from '@/routes/account';
import type { AccountDashboardPageProps } from '@/types/account';

export default function AccountDashboard() {
    const page = usePage().props;
    const { auth } = page;
    const { total_orders, recent_orders } =
        page as unknown as AccountDashboardPageProps;

    return (
        <>
            <Head title="আমার ড্যাশবোর্ড" />

            <div className="rounded-2xl border border-emerald-100 bg-emerald-600 p-6 text-white sm:p-8">
                <p className="text-sm font-medium text-emerald-100">শুভেচ্ছা,</p>
                <h2 className="mt-1 text-2xl font-bold">{auth.user.name}</h2>
                <p className="mt-1 text-sm text-emerald-100">
                    গ্রামবাজারে আপনার সমস্ত কার্যক্রম এক জায়গায়।
                </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-100 bg-white p-5">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50">
                        <ShoppingBag
                            className="size-5 text-amber-600"
                            aria-hidden="true"
                        />
                    </span>
                    <p className="mt-3 text-3xl font-extrabold text-emerald-950">
                        {toBnNumber(total_orders)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-stone-500">
                        মোট অর্ডার
                    </p>
                </div>
            </div>

            <div className="mt-8 rounded-2xl border border-stone-100 bg-white">
                <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
                    <h3 className="flex items-center gap-2 text-base font-bold text-emerald-950">
                        <ReceiptText className="size-4 text-emerald-600" />
                        সাম্প্রতিক অর্ডার
                    </h3>
                    <Link
                        href={accountRoutes.orders.index.url()}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        সব দেখুন
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                </div>

                {recent_orders.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <Package
                            className="mx-auto size-10 text-stone-300"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-medium text-stone-500">
                            এখনও কোনো অর্ডার নেই
                        </p>
                        <p className="mt-1 text-sm text-stone-400">
                            দোকানে গিয়ে আপনার পছন্দের পণ্য অর্ডার করুন।
                        </p>
                        <Link
                            href="/shop"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                        >
                            দোকানে যান
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-stone-100">
                        {recent_orders.map((order) => (
                            <li
                                key={order.order_number}
                                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                            >
                                <div>
                                    <p className="font-bold text-emerald-950">
                                        #{order.order_number}
                                    </p>
                                    <p className="mt-0.5 text-sm text-stone-500">
                                        {toBnNumber(order.items_count)} টি পণ্য •{' '}
                                        {order.created_at}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-stone-500">
                                        {order.payment_status}
                                    </span>
                                    <span className="font-extrabold text-emerald-700">
                                        {formatTaka(order.total)}
                                    </span>
                                    <Link
                                        href={accountRoutes.orders.show.url({
                                            order: order.order_number,
                                        })}
                                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                    >
                                        বিস্তারিত
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Link
                    href={accountRoutes.profile.url()}
                    prefetch
                    className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white p-5 transition-colors hover:border-emerald-200"
                >
                    <span className="flex items-center gap-3">
                        <User className="size-5 text-emerald-600" />
                        <span>
                            <span className="block font-bold text-emerald-950">
                                প্রোফাইল
                            </span>
                            <span className="block text-sm text-stone-500">
                                নাম, মোবাইল ও ইমেইল আপডেট করুন
                            </span>
                        </span>
                    </span>
                    <ArrowRight className="size-4 text-stone-400" />
                </Link>
                <Link
                    href={accountRoutes.password.url()}
                    prefetch
                    className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white p-5 transition-colors hover:border-emerald-200"
                >
                    <span className="flex items-center gap-3">
                        <KeyRound className="size-5 text-emerald-600" />
                        <span>
                            <span className="block font-bold text-emerald-950">
                                পাসওয়ার্ড
                            </span>
                            <span className="block text-sm text-stone-500">
                                পাসওয়ার্ড পরিবর্তন করুন
                            </span>
                        </span>
                    </span>
                    <ArrowRight className="size-4 text-stone-400" />
                </Link>
            </div>

            <div className="mt-8 text-center">
                <Link href="/shop">
                    <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700">
                        কেনাকাটা চালিয়ে যান
                    </Button>
                </Link>
            </div>
        </>
    );
}
