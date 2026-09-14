import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import ProductCard from '@/components/home/product-card';
import type { HomeProduct } from '@/types/home';

export default function SeasonalSection({
    products,
}: {
    products: HomeProduct[];
}) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="seasonal-heading"
            className="bg-amber-50 py-16 lg:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl space-y-2">
                        <p className="text-sm font-semibold tracking-wide text-amber-600 uppercase">
                            মৌসুমি সংগ্রহ
                        </p>
                        <h2
                            id="seasonal-heading"
                            className="text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl"
                        >
                            এই মৌসুমের সেরা পণ্য
                        </h2>
                        <p className="text-base leading-relaxed text-stone-600">
                            ঋতুভিত্তিক টাটকা স্বাদের জন্য এখনই বেছে নিন আমাদের বাছাই করা
                            মৌসুমি পণ্য।
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            toast('মৌসুমি পণ্যের সম্পূর্ণ তালিকা শীর্ঘই আসবে')
                        }
                        className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-amber-700 transition-colors hover:text-amber-900 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                    >
                        সব দেখুন
                        <ArrowRight
                            className="size-4 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                    {products.map((product) => (
                        <li key={product.id}>
                            <ProductCard product={product} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
