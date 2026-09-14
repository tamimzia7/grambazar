import { BadgeCheck, HandCoins, Truck } from 'lucide-react';

export default function FarmerDirect() {
    return (
        <section
            aria-labelledby="farmer-direct-heading"
            className="bg-white py-16 lg:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-2xl shadow-emerald-900/25">
                    <div className="grid items-center gap-8 lg:grid-cols-2">
                        <div className="p-8 sm:p-12 lg:p-14">
                            <p className="text-sm font-semibold tracking-wide text-amber-300 uppercase">
                                সরাসরি কৃষক থেকে
                            </p>
                            <h2
                                id="farmer-direct-heading"
                                className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                            >
                                কোনো মধ্যস্বত্বভোগী নেই, লাভ পৌঁছে যায় কৃষকের হাতে
                            </h2>
                            <p className="mt-4 max-w-lg leading-relaxed text-emerald-100">
                                আপনার কেনা প্রতিটি পণ্যের ন্যায্য দাম সরাসরি যায় প্রান্তিক
                                কৃষকের কাছে। গ্রামবাজার নিশ্চিত করে — তাজা পণ্য, সঠিক দাম,
                                আর সুষ্ঠু আয়।
                            </p>

                            <ul className="mt-8 space-y-4">
                                {(
                                    [
                                        [BadgeCheck, 'যোগ্যতা যাচাই করা কৃষক'],
                                        [Truck, 'সকালে তোলা, সন্ধ্যায় ডেলিভারি'],
                                        [HandCoins, 'ন্যায্য দামের নিশ্চয়তা'],
                                    ] as const
                                ).map(([Icon, label]) => (
                                    <li
                                        key={label}
                                        className="flex items-center gap-3 text-emerald-50"
                                    >
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600/60 text-white">
                                            <Icon
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <span className="font-medium">
                                            {label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative min-h-72 lg:min-h-full">
                            <img
                                src="/images/home/farmer-direct.svg"
                                alt="ধান খেতে দাঁড়িয়ে থাকা কৃষক"
                                width={800}
                                height={900}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-transparent lg:from-emerald-900/50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
