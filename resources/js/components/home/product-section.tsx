import { toast } from 'sonner';

import ProductCard from '@/components/home/product-card';
import SectionHeading from '@/components/home/section-heading';
import type { HomeProduct } from '@/types/home';

export default function ProductSection({
    id,
    eyebrow,
    title,
    description,
    products,
}: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    products: HomeProduct[];
}) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby={`${id}-heading`}
            id={id}
            className="scroll-mt-20 bg-white py-16 lg:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                    linkLabel="সব দেখুন"
                    onLink={() => toast(`${title} — সম্পূর্ণ তালিকা শীঘ্রই আসবে`)}
                />

                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
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
