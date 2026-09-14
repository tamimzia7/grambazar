import { toast } from 'sonner';

import ProductCard from '@/components/home/product-card';
import type { HomeProduct } from '@/types/home';

export default function SpiceSection({
    products,
}: {
    products: HomeProduct[];
}) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="spice-heading"
            className="bg-orange-50 py-16 lg:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-900/5 lg:grid-cols-5">
                    <div className="relative min-h-64 lg:col-span-2 lg:min-h-full">
                        <img
                            src="/images/home/spice.svg"
                            alt="দেশি মসলার থালা"
                            width={1200}
                            height={600}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>

                    <div className="p-8 sm:p-10 lg:col-span-3">
                        <p className="text-sm font-semibold tracking-wide text-orange-600 uppercase">
                            দেশি মসলা
                        </p>
                        <h2
                            id="spice-heading"
                            className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl"
                        >
                            মসলায় গ্রামের খাঁটি স্বাদ
                        </h2>
                        <p className="mt-3 max-w-xl leading-relaxed text-stone-600">
                            হলুদ, জিরা, মরিচ, ধনিয়া — সব মসলা সরাসরি কৃষকের মাঠ থেকে,
                            বাটনার আগ পর্যন্ত পুরো টাটকা।
                        </p>

                        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {products.map((product) => (
                                <li key={product.id}>
                                    <ProductCard product={product} />
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => toast('মসলার সম্পূর্ণ সংগ্রহ শীঘ্রই আসবে')}
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 transition-colors hover:text-orange-900 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
                        >
                            সব মসলা দেখুন →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
