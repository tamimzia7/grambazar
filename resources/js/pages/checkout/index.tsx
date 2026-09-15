import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Banknote, CheckCircle2, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    formatTaka,
    priceLabel,
    productImage,
    toBnNumber,
    unitLabel,
} from '@/lib/format';
import cartRoutes from '@/routes/cart';
import checkoutRoutes from '@/routes/checkout';
import type { CheckoutPageProps } from '@/types/shop';

const DISTRICTS = [
    'মানিকগঞ্জ',
    'ঢাকা',
    'গাজীপুর',
    'চট্টগ্রাম',
    'রাজশাহী',
    'খুলনা',
    'সিলেট',
    'বরিশাল',
    'রংপুর',
    'ময়মনসিংহ',
];

export default function CheckoutIndex() {
    const { items, subtotal, deliveryCharge, freeDeliveryAbove } = usePage()
        .props as unknown as CheckoutPageProps;

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        delivery_address: '',
        delivery_area: '',
        delivery_district: '',
        delivery_instructions: '',
        coupon_code: '',
    });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        post(checkoutRoutes.store.url());
    }

    const freeDelivery = freeDeliveryAbove > 0 && subtotal >= freeDeliveryAbove;
    const total = subtotal + (freeDelivery ? 0 : deliveryCharge);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                href={cartRoutes.index.url()}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-emerald-700"
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
                কার্টে ফিরে যান
            </Link>

            <h1 className="mt-4 text-2xl font-bold text-emerald-950 sm:text-3xl">
                চেকআউট
            </h1>

            {(errors as { cart?: string }).cart && (
                <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                    {(errors as { cart?: string }).cart}
                </div>
            )}

            <form
                onSubmit={submit}
                className="mt-6 grid items-start gap-6 lg:grid-cols-3"
            >
                <div className="space-y-6 lg:col-span-2">
                    <section
                        aria-labelledby="shipping-heading"
                        className="rounded-2xl border border-stone-100 bg-white p-6"
                    >
                        <h2
                            id="shipping-heading"
                            className="flex items-center gap-2 text-lg font-bold text-emerald-950"
                        >
                            <MapPin className="size-5 text-emerald-600" />
                            ডেলিভারি তথ্য
                        </h2>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="customer_name"
                                    className="text-sm font-medium text-stone-700"
                                >
                                    নাম <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="customer_name"
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(event) =>
                                        setData(
                                            'customer_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="আপনার নাম"
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                                {errors.customer_name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.customer_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="customer_phone"
                                    className="text-sm font-medium text-stone-700"
                                >
                                    মোবাইল নম্বর{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="customer_phone"
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(event) =>
                                        setData(
                                            'customer_phone',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="01XXXXXXXXX"
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                                {errors.customer_phone && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.customer_phone}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="customer_email"
                                    className="text-sm font-medium text-stone-700"
                                >
                                    ইমেইল (ঐচ্ছিক)
                                </label>
                                <input
                                    id="customer_email"
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(event) =>
                                        setData(
                                            'customer_email',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="tumi@example.com"
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                                {errors.customer_email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.customer_email}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="delivery_address"
                                    className="text-sm font-medium text-stone-700"
                                >
                                    সম্পূর্ণ ঠিকানা{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="delivery_address"
                                    rows={2}
                                    value={data.delivery_address}
                                    onChange={(event) =>
                                        setData(
                                            'delivery_address',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="রাস্তা, বাসা/ফ্ল্যাট, মাঠ... "
                                    className="mt-1.5 w-full resize-none rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                                {errors.delivery_address && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.delivery_address}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="delivery_area"
                                    className="text-sm font-medium text-stone-700"
                                >
                                    এলাকা (ঐচ্ছিক)
                                </label>
                                <input
                                    id="delivery_area"
                                    type="text"
                                    value={data.delivery_area}
                                    onChange={(event) =>
                                        setData(
                                            'delivery_area',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="যেমন: সিংগাইর"
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="delivery_district"
                                    className="text-sm font-medium text-stone-700"
                                >
                                    জেলা <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="delivery_district"
                                    type="text"
                                    list="district-list"
                                    value={data.delivery_district}
                                    onChange={(event) =>
                                        setData(
                                            'delivery_district',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="যেমন: মানিকগঞ্জ"
                                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                                <datalist id="district-list">
                                    {DISTRICTS.map((district) => (
                                        <option
                                            key={district}
                                            value={district}
                                        />
                                    ))}
                                </datalist>
                                {errors.delivery_district && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.delivery_district}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="delivery_instructions"
                                    className="text-sm font-medium text-stone-700"
                                >
                                    বিশেষ নির্দেশনা (ঐচ্ছিক)
                                </label>
                                <textarea
                                    id="delivery_instructions"
                                    rows={2}
                                    value={data.delivery_instructions}
                                    onChange={(event) =>
                                        setData(
                                            'delivery_instructions',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="ডেলিভারির আগে ফোন করতে পারবেন..."
                                    className="mt-1.5 w-full resize-none rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    <section
                        aria-labelledby="payment-heading"
                        className="rounded-2xl border border-stone-100 bg-white p-6"
                    >
                        <h2
                            id="payment-heading"
                            className="flex items-center gap-2 text-lg font-bold text-emerald-950"
                        >
                            <Banknote className="size-5 text-emerald-600" />
                            পেমেন্ট
                        </h2>
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5">
                            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                                <Banknote
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-emerald-950">
                                    হাতে নগদ (ক্যাশ অন ডেলিভারি)
                                </p>
                                <p className="text-xs text-stone-600">
                                    পণ্য হাতে পাওয়ার সময় টাকা পরিশোধ করবেন।
                                </p>
                            </div>
                            <CheckCircle2
                                className="ml-auto size-5 text-emerald-600"
                                aria-hidden="true"
                            />
                        </div>
                    </section>
                </div>

                <aside className="h-fit rounded-2xl border border-stone-100 bg-white p-6 lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold text-emerald-950">
                        অর্ডার সারসংক্ষেপ
                    </h2>

                    <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={productImage(item)}
                                    alt={item.name}
                                    width={56}
                                    height={56}
                                    className="size-14 shrink-0 rounded-lg border border-stone-100 bg-emerald-50 object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-emerald-950">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        × {toBnNumber(item.quantity)}{' '}
                                        {priceLabel(item)}
                                        {unitLabel(item)}
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-stone-700">
                                    {formatTaka(item.subtotal)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-5 space-y-3 border-t border-stone-100 pt-4 text-sm">
                        <div className="flex items-center justify-between text-stone-600">
                            <dt>কুপন কোড</dt>
                            <dd className="font-semibold text-stone-800">
                                <input
                                    type="text"
                                    value={data.coupon_code}
                                    onChange={(event) =>
                                        setData(
                                            'coupon_code',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder="ঐচ্ছিক"
                                    className="h-8 w-28 rounded-lg border border-stone-200 bg-white px-2 text-right font-mono text-xs font-bold text-emerald-800 uppercase placeholder:font-sans placeholder:font-normal placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                                />
                            </dd>
                        </div>
                        {((errors as unknown as { coupon?: string }).coupon) && (
                            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                                {(errors as unknown as { coupon?: string }).coupon}
                            </p>
                        )}
                        <div className="flex items-center justify-between text-stone-600">
                            <dt>পণ্যের মূল্য</dt>
                            <dd className="font-semibold text-stone-800">
                                {formatTaka(subtotal)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between text-stone-600">
                            <dt>ডেলিভারি চার্জ</dt>
                            <dd
                                className={`font-semibold ${
                                    freeDelivery
                                        ? 'text-emerald-600'
                                        : 'text-stone-800'
                                }`}
                            >
                                {freeDelivery
                                    ? 'ফ্রি'
                                    : formatTaka(deliveryCharge)}
                            </dd>
                        </div>
                        {!freeDelivery && freeDeliveryAbove > 0 && (
                            <p className="text-xs text-stone-500">
                                {toBnNumber(freeDeliveryAbove)} টাকার বেশি অর্ডারে
                                ফ্রি ডেলিভারি পাবেন।
                            </p>
                        )}
                        <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-base">
                            <dt className="font-bold text-emerald-950">
                                সর্বমোট (COD)
                            </dt>
                            <dd className="font-extrabold text-emerald-700">
                                {formatTaka(total)}
                            </dd>
                        </div>
                    </dl>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="mt-6 w-full rounded-full bg-emerald-600 py-3 text-base font-bold hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {processing ? 'অর্ডার করা হচ্ছে…' : 'অর্ডার নিশ্চিত করুন'}
                    </Button>

                    <p className="mt-3 text-center text-xs text-stone-400">
                        নিশ্চিত করলে অর্ডারটি চূড়ান্ত হবে। আগে আবার ভালো করে দেখে নিন।
                    </p>
                </aside>
            </form>
        </div>
    );
}
