import { Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Star,
    Truck,
} from 'lucide-react';
import { useState } from 'react';

import ProductCard from '@/components/home/product-card';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/cart';
import {
    formatTaka,
    priceLabel,
    productImage,
    toBnNumber,
    unitLabel,
} from '@/lib/format';
import shopRoutes from '@/routes/shop';
import type { ProductDetailPageProps } from '@/types/shop';

export default function ProductShow() {
    const { product, related } = usePage()
        .props as unknown as ProductDetailPageProps;
    const [quantity, setQuantity] = useState(product.min_order_quantity);
    const [activeImage, setActiveImage] = useState(0);

    const onSale =
        product.sale_price !== null && product.sale_price < product.price;
    const inStock = product.stock_quantity > 0;
    const images =
        product.images.length > 0 ? product.images : [productImage(product)];

    function changeQuantity(delta: number): void {
        setQuantity((current) =>
            Math.max(
                product.min_order_quantity,
                Math.min(product.stock_quantity, current + delta),
            ),
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <nav aria-label="ব্রেডক্রম্ব" className="mb-6 text-sm text-stone-500">
                <Link
                    href="/"
                    className="transition-colors hover:text-emerald-700"
                >
                    হোম
                </Link>
                <span className="mx-2">/</span>
                <Link
                    href={shopRoutes.index.url()}
                    className="transition-colors hover:text-emerald-700"
                >
                    দোকান
                </Link>
                {product.category_slug && (
                    <>
                        <span className="mx-2">/</span>
                        <span className="text-stone-800">{product.name}</span>
                    </>
                )}
            </nav>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <div className="relative overflow-hidden rounded-3xl border border-stone-100 bg-emerald-50">
                        <img
                            src={images[activeImage]}
                            alt={product.name}
                            width={800}
                            height={800}
                            className="aspect-square w-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                            {onSale && (
                                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">
                                    ছাড়
                                </span>
                            )}
                            {product.is_seasonal && (
                                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
                                    মৌসুমি
                                </span>
                            )}
                            {product.is_popular && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-amber-600 shadow">
                                    <Star
                                        className="size-3 fill-amber-400 text-amber-400"
                                        aria-hidden="true"
                                    />
                                    জনপ্রিয়
                                </span>
                            )}
                        </div>
                    </div>

                    {images.length > 1 && (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                aria-label="আগের ছবি"
                                onClick={() =>
                                    setActiveImage((current) =>
                                        current === 0
                                            ? images.length - 1
                                            : current - 1,
                                    )
                                }
                                className="flex size-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <div className="flex flex-1 gap-3 overflow-x-auto pb-1">
                                {images.map((src, index) => (
                                    <button
                                        key={`${src}-${index}`}
                                        type="button"
                                        aria-label={`ছবি ${toBnNumber(index + 1)}`}
                                        aria-current={
                                            index === activeImage
                                                ? 'true'
                                                : undefined
                                        }
                                        onClick={() => setActiveImage(index)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                                            index === activeImage
                                                ? 'border-emerald-600'
                                                : 'border-transparent hover:border-emerald-300'
                                        }`}
                                    >
                                        <img
                                            src={src}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                aria-label="পরের ছবি"
                                onClick={() =>
                                    setActiveImage((current) =>
                                        current === images.length - 1
                                            ? 0
                                            : current + 1,
                                    )
                                }
                                className="flex size-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                        {product.name}
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-stone-500">
                        {product.short_description ??
                            'গ্রামবাজার থেকে সরাসরি টাটকা ডেলিভারি।'}
                    </p>

                    <div className="mt-5 flex items-baseline gap-3">
                        <span className="text-3xl font-extrabold text-emerald-700">
                            {priceLabel(product)}
                        </span>
                        <span className="text-base font-medium text-stone-400">
                            {unitLabel(product)}
                        </span>
                        {onSale && (
                            <span className="text-base text-stone-400 line-through">
                                {formatTaka(product.price)}
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        {inStock ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                                <CheckCircle2
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                স্টকে আছে ({toBnNumber(product.stock_quantity)}{' '}
                                {product.unit_label})
                            </span>
                        ) : (
                            <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">
                                স্টক শেষ
                            </span>
                        )}
                        <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600">
                            সর্বনিম্ন {toBnNumber(product.min_order_quantity)}{' '}
                            {product.unit_label}
                        </span>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-full border border-stone-200 bg-white">
                            <button
                                type="button"
                                aria-label="পরিমাণ কমাও"
                                disabled={
                                    !inStock ||
                                    quantity <= product.min_order_quantity
                                }
                                onClick={() => changeQuantity(-1)}
                                className="flex size-10 items-center justify-center rounded-l-full text-stone-600 transition-colors hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Minus className="size-4" />
                            </button>
                            <span
                                aria-live="polite"
                                className="min-w-12 text-center text-base font-bold text-emerald-950"
                            >
                                {toBnNumber(quantity)}
                            </span>
                            <button
                                type="button"
                                aria-label="পরিমাণ বাড়াও"
                                disabled={
                                    !inStock ||
                                    quantity >= product.stock_quantity
                                }
                                onClick={() => changeQuantity(1)}
                                className="flex size-10 items-center justify-center rounded-r-full text-stone-600 transition-colors hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Plus className="size-4" />
                            </button>
                        </div>

                        <Button
                            type="button"
                            size="lg"
                            disabled={!inStock}
                            onClick={() => addToCart(product.id, quantity)}
                            className="flex-1 rounded-full bg-emerald-600 px-8 py-3 text-base font-bold hover:bg-emerald-700 sm:flex-none"
                        >
                            <ShoppingCart
                                className="size-5"
                                aria-hidden="true"
                            />
                            কার্টে যোগ করুন
                        </Button>
                    </div>

                    <ul className="mt-6 space-y-2.5 text-sm text-stone-600">
                        <li className="flex items-center gap-2">
                            <Truck
                                className="size-4 shrink-0 text-emerald-600"
                                aria-hidden="true"
                            />
                            {toBnNumber(1000)} টাকার বেশি অর্ডারে একই দিনের ডেলিভারি
                        </li>
                        <li className="flex items-center gap-2">
                            <ShieldCheck
                                className="size-4 shrink-0 text-emerald-600"
                                aria-hidden="true"
                            />
                            পণ্য যাচাই করে নিশ্চিত গুণমান
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2
                                className="size-4 shrink-0 text-emerald-600"
                                aria-hidden="true"
                            />
                            সারাদেশে ডেলিভারি, পেমেন্ট হাতে (ক্যাশ অন ডেলিভারি)
                        </li>
                    </ul>

                    {product.farmer && (
                        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                                {product.farmer.display_name.charAt(0)}
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-emerald-700">
                                    সরাসরি কৃষকের কাছ থেকে
                                </p>
                                <h2 className="mt-0.5 font-bold text-emerald-950">
                                    {product.farmer.display_name}
                                </h2>
                                {product.farmer.location && (
                                    <p className="mt-0.5 text-sm text-stone-600">
                                        📍 {product.farmer.location}
                                    </p>
                                )}
                                {product.farmer.bio && (
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                        {product.farmer.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {product.description && (
                        <div className="mt-8">
                            <h2 className="text-lg font-bold text-emerald-950">
                                বিবরণ
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                {product.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {related.length > 0 && (
                <section aria-labelledby="related-heading" className="mt-16">
                    <div className="mb-5 flex items-center justify-between">
                        <h2
                            id="related-heading"
                            className="text-xl font-bold text-emerald-950"
                        >
                            একই ধরনের পণ্য
                        </h2>
                        <Link
                            href={shopRoutes.index.url()}
                            className="text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
                        >
                            সব দেখুন
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {related.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
