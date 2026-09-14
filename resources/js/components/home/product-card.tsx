import { Link } from '@inertiajs/react';
import { ShoppingCart, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/cart';
import { priceLabel, productImage, toBnNumber, unitLabel } from '@/lib/format';
import productRoutes from '@/routes/products';
import type { HomeProduct } from '@/types/home';

export default function ProductCard({ product }: { product: HomeProduct }) {
    const onSale =
        product.sale_price !== null && product.sale_price < product.price;
    const inStock = product.stock_quantity > 0;
    const href = productRoutes.show.url({ product: { slug: product.slug } });

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10">
            <Link
                href={href}
                className="relative block overflow-hidden bg-emerald-50"
                aria-label={`${product.name} - বিস্তারিত দেখুন`}
            >
                <img
                    src={productImage(product)}
                    alt={product.name}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {onSale && (
                        <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow">
                            ছাড়
                        </span>
                    )}
                    {product.is_seasonal && (
                        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                            মৌসুমি
                        </span>
                    )}
                    {product.is_popular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-amber-600 shadow">
                            <Star
                                className="size-3 fill-amber-400 text-amber-400"
                                aria-hidden="true"
                            />
                            জনপ্রিয়
                        </span>
                    )}
                </div>

                {inStock && (
                    <span className="absolute right-3 bottom-3 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-medium text-emerald-700 shadow">
                        স্টকে আছে
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={href}>
                    <h3 className="text-base font-bold text-emerald-950 transition-colors hover:text-emerald-700">
                        {product.name}
                    </h3>
                </Link>
                <p className="line-clamp-2 min-h-10 text-sm text-stone-500">
                    {product.short_description ??
                        'গ্রামবাজার থেকে টাটকা সরাসরি ডেলিভারি।'}
                </p>

                <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-emerald-700">
                            {priceLabel(product)}
                        </span>
                        <span className="text-xs font-medium text-stone-400">
                            {unitLabel(product)}
                        </span>
                        {onSale && (
                            <span className="text-xs text-stone-400 line-through">
                                {toBnNumber(product.price)}
                            </span>
                        )}
                    </div>

                    <Button
                        type="button"
                        size="sm"
                        aria-label={`${product.name} কার্টে যোগ করুন`}
                        disabled={!inStock}
                        onClick={() =>
                            addToCart(product.id, product.min_order_quantity)
                        }
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700"
                    >
                        <ShoppingCart className="size-4" aria-hidden="true" />
                        কার্টে
                    </Button>
                </div>
            </div>
        </article>
    );
}
