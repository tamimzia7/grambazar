import { ArrowRight, BadgeCheck, Leaf, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { priceLabel, productImage, toBnNumber, unitLabel } from '@/lib/format';
import type { HomeProduct, HomeStats } from '@/types/home';

export default function Hero({
    featuredProduct,
    stats,
}: {
    featuredProduct: HomeProduct | null;
    stats: HomeStats;
}) {
    return (
        <section
            aria-label="গ্রামবাজার - পরিচিতি"
            className="relative overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-amber-50 via-emerald-50 to-white"
            />
            <a aria-hidden="true" id="home" className="absolute top-0" />

            <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pt-16 lg:pb-20">
                <div className="lg:col-span-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-medium text-emerald-800 shadow-sm">
                        <Leaf
                            className="size-4 text-emerald-600"
                            aria-hidden="true"
                        />
                        জমির থেকে সরাসরি আপনার রান্নাঘরে
                    </span>

                    <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
                        তাজা খাদ্য, সরাসরি{' '}
                        <span className="relative whitespace-nowrap text-emerald-600">
                            গ্রামের
                            <span
                                aria-hidden="true"
                                className="absolute bottom-1 left-0 -z-10 h-3 w-full -rotate-1 rounded-sm bg-amber-300"
                            />
                        </span>{' '}
                        হাত থেকে
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
                        গ্রামবাজারে সরাসরি কৃষকদের কাছ থেকে টাটকা সবজি, ফল, মাছ ও মসলা কিনুন
                        — কোনো মধ্যস্বত্বভোগী ছাড়াই। এক বিক্রেতা, সবচেয়ে সেরা দাম।
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full bg-emerald-600 px-7 shadow-lg shadow-emerald-600/25 hover:bg-emerald-700"
                        >
                            <a href="#popular-products">
                                এখনই কেনাকাটা শুরু করুন
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-full border-emerald-300 bg-white px-7 text-emerald-800 hover:bg-emerald-50"
                        >
                            <a href="#farmer-story">কৃষক হিসেবে যুক্ত হন</a>
                        </Button>
                    </div>

                    <dl className="mt-10 flex flex-wrap gap-8">
                        {(
                            [
                                ['কৃষক', stats.farmers],
                                ['পণ্য', stats.products],
                                ['বিভাগ', stats.categories],
                            ] as const
                        ).map(([label, value]) => (
                            <div key={label}>
                                <dt className="sr-only">{label}</dt>
                                <dd className="flex items-baseline gap-1.5">
                                    <span className="text-3xl font-extrabold text-emerald-700">
                                        {toBnNumber(value)}
                                    </span>
                                    <span className="text-sm font-medium text-stone-500">
                                        + {label}
                                    </span>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="relative lg:col-span-6">
                    <img
                        src="/images/home/hero.svg"
                        alt="ধানে ভরা ঝুড়ি ও গ্রামীণ দৃশ্য"
                        width={1200}
                        height={900}
                        className="w-full rounded-3xl border-4 border-white shadow-2xl shadow-emerald-900/15"
                    />

                    {featuredProduct && (
                        <aside
                            aria-label="বিশেষ অফার"
                            className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/95 p-3 pr-5 shadow-xl backdrop-blur sm:left-8"
                        >
                            <img
                                src={productImage(featuredProduct)}
                                alt=""
                                className="size-14 rounded-xl object-cover"
                            />
                            <div>
                                <p className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                                    <Star
                                        className="size-3.5 fill-amber-400 text-amber-400"
                                        aria-hidden="true"
                                    />
                                    বিশেষ অফার
                                </p>
                                <p className="text-sm font-bold text-emerald-900">
                                    {featuredProduct.name}
                                </p>
                                <p className="text-sm font-semibold text-emerald-600">
                                    {priceLabel(featuredProduct)}
                                    <span className="ml-1 text-xs font-normal text-stone-400">
                                        {unitLabel(featuredProduct)}
                                    </span>
                                </p>
                            </div>
                        </aside>
                    )}

                    <span
                        aria-hidden="true"
                        className="absolute -top-3 -right-3 flex size-16 items-center justify-center rounded-2xl bg-amber-300 text-amber-900 shadow-lg"
                    >
                        <BadgeCheck className="size-8" />
                    </span>
                </div>
            </div>

            <p
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"
            />
        </section>
    );
}
