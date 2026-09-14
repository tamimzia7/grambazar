import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingCart,
    ShoppingBag,
    TriangleAlert,
    Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { removeFromCart, updateCartQuantity } from '@/lib/cart';
import {
    formatTaka,
    priceLabel,
    productImage,
    toBnNumber,
    unitLabel,
} from '@/lib/format';
import checkoutRoutes from '@/routes/checkout';
import productRoutes from '@/routes/products';
import shopRoutes from '@/routes/shop';
import type { CartProduct, CartPageProps } from '@/types/shop';

function LineItem({
    item,
    readOnly = false,
}: {
    item: CartProduct;
    readOnly?: boolean;
}) {
    return (
        <li className="flex items-start gap-4 border-b border-stone-100 pb-5 last:border-0">
            <Link
                href={productRoutes.show.url({
                    product: { slug: item.slug },
                })}
                className="shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-emerald-50"
            >
                <img
                    src={productImage(item)}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="size-24 object-cover"
                />
            </Link>

            <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <Link
                            href={productRoutes.show.url({
                                product: { slug: item.slug },
                            })}
                            className="font-bold text-emerald-950 transition-colors hover:text-emerald-700"
                        >
                            {item.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-stone-500">
                            {priceLabel(item)}
                            <span className="text-stone-400">
                                {unitLabel(item)}
                            </span>
                            {item.sale_price !== null &&
                                item.sale_price < item.price && (
                                    <span className="ml-2 text-xs text-stone-400 line-through">
                                        {toBnNumber(item.price)}
                                    </span>
                                )}
                        </p>
                    </div>
                    <span className="text-base font-extrabold text-emerald-700">
                        {formatTaka(item.subtotal)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    {readOnly ? (
                        <span className="text-sm text-stone-500">
                            × {toBnNumber(item.quantity)} {item.unit_label}
                        </span>
                    ) : (
                        <div className="inline-flex items-center rounded-full border border-stone-200 bg-white">
                            <button
                                type="button"
                                aria-label={`${item.name} পরিমাণ কমাও`}
                                disabled={
                                    item.quantity <= item.min_order_quantity
                                }
                                onClick={() =>
                                    updateCartQuantity(
                                        item.id,
                                        item.quantity - 1,
                                    )
                                }
                                className="flex size-9 items-center justify-center rounded-l-full text-stone-600 transition-colors hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Minus className="size-4" />
                            </button>
                            <span className="min-w-10 text-center text-sm font-bold text-emerald-950">
                                {toBnNumber(item.quantity)}
                            </span>
                            <button
                                type="button"
                                aria-label={`${item.name} পরিমাণ বাড়াও`}
                                disabled={item.quantity >= item.stock_quantity}
                                onClick={() =>
                                    updateCartQuantity(
                                        item.id,
                                        item.quantity + 1,
                                    )
                                }
                                className="flex size-9 items-center justify-center rounded-r-full text-stone-600 transition-colors hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Plus className="size-4" />
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        aria-label={`${item.name} সরিয়ে ফেলুন`}
                        onClick={() => removeFromCart(item.id)}
                        className="flex size-9 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            </div>
        </li>
    );
}

export default function CartIndex() {
    const { items, unavailableItems, subtotal, count } = usePage()
        .props as unknown as CartPageProps;

    if (count === 0 && items.length === 0) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50">
                    <ShoppingBag className="size-10 text-emerald-400" />
                </div>
                <h1 className="mt-6 text-2xl font-bold text-emerald-950">
                    আপনার কার্ট এখন খালি
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
                    গ্রামের সেরা টাটকা পণ্য কিনতে এখনই দোকানে ঘুরে আসুন।
                </p>
                <Link
                    href={shopRoutes.index.url()}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                    দোকানে যান
                    <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                আপনার কার্ট
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                মোট {toBnNumber(count)}টি আইটেম
            </p>

            {unavailableItems.length > 0 && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <h2 className="flex items-center gap-2 font-bold text-amber-900">
                        <TriangleAlert className="size-5" aria-hidden="true" />
                        কিছু পণ্যের স্টক পরিবর্তন হয়েছে
                    </h2>
                    <ul className="mt-4 space-y-5">
                        {unavailableItems.map((item) => (
                            <LineItem key={item.id} item={item} readOnly />
                        ))}
                    </ul>
                    <p className="mt-4 text-sm text-amber-800">
                        চাহিদা অনুযায়ী স্টক পরিবর্তন হয়েছে। পণ্যটি কার্ট থেকে সরিয়ে নিতে
                        বা নতুন করে যোগ করতে পারেন।
                    </p>
                </div>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <section
                    aria-label="কার্টের পণ্য"
                    className="rounded-2xl border border-stone-100 bg-white p-6 lg:col-span-2"
                >
                    <ul className="space-y-5">
                        {items.map((item) => (
                            <LineItem key={item.id} item={item} />
                        ))}
                    </ul>
                </section>

                <aside className="h-fit rounded-2xl border border-stone-100 bg-white p-6">
                    <h2 className="text-lg font-bold text-emerald-950">
                        অর্ডার সারসংক্ষেপ
                    </h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between text-stone-600">
                            <dt>পণ্যের মূল্য</dt>
                            <dd className="font-semibold text-stone-800">
                                {formatTaka(subtotal)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between text-stone-600">
                            <dt>ডেলিভারি চার্জ</dt>
                            <dd className="font-semibold text-stone-800">
                                চেকআউটে দেখুন
                            </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-base">
                            <dt className="font-bold text-emerald-950">
                                সর্বমোট
                            </dt>
                            <dd className="font-extrabold text-emerald-700">
                                {formatTaka(subtotal)} +
                            </dd>
                        </div>
                    </dl>

                    <Link
                        href={checkoutRoutes.index.url()}
                        className="mt-6 block"
                    >
                        <Button className="w-full rounded-full bg-emerald-600 py-3 text-base font-bold hover:bg-emerald-700">
                            চেকআউট করুন
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Button>
                    </Link>

                    <p className="mt-4 text-xs leading-relaxed text-stone-500">
                        {toBnNumber(1000)} টাকার বেশি অর্ডারে ফ্রি ডেলিভারি। পেমেন্ট
                        হবে হাতে (ক্যাশ অন ডেলিভারি)।
                    </p>
                </aside>
            </div>
        </div>
    );
}
