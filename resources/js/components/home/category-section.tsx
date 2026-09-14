import type { HomeCategory } from '@/types/home';
import SectionHeading from '@/components/home/section-heading';
import { categoryToast } from '@/components/home/section-heading';

export default function CategorySection({
    categories,
}: {
    categories: HomeCategory[];
}) {
    return (
        <section
            aria-labelledby="categories-heading"
            className="bg-white py-16 lg:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="বিভাগ"
                    title="বাছাই করুন আপনার পছন্দের বিভাগ"
                    description="সবজি, ফল, মাছ থেকে শুরু করে দেশি মুরগি ও মসলা — সব এক জায়গায়।"
                    linkLabel="সব বিভাগ দেখুন"
                    onLink={() => categoryToast(categories[0])}
                />

                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7 lg:gap-5">
                    {categories.map((category) => (
                        <li key={category.slug}>
                            <button
                                type="button"
                                onClick={() => categoryToast(category)}
                                className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-emerald-50 bg-gradient-to-b from-emerald-50/60 to-white p-4 text-center transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                            >
                                <span className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-emerald-100 transition-transform group-hover:scale-105">
                                    <img
                                        src={category.image}
                                        alt=""
                                        width={80}
                                        height={80}
                                        loading="lazy"
                                        className="size-full object-cover"
                                    />
                                </span>
                                <span className="text-sm font-bold text-emerald-950">
                                    {category.name}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
