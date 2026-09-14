import { ArrowRight, Quote, Star } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function FarmerStory() {
    return (
        <section
            aria-labelledby="farmer-story-heading"
            id="farmer-story"
            className="scroll-mt-20 bg-emerald-50 py-16 lg:py-20"
        >
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
                <div className="relative order-2 lg:order-1 lg:col-span-5">
                    <img
                        src="/images/home/farmer-story.svg"
                        alt="গ্রামবাজারের একজন কৃষকের প্রতিকৃতি"
                        width={760}
                        height={900}
                        loading="lazy"
                        className="w-full max-w-md rounded-3xl border-4 border-white shadow-2xl shadow-emerald-900/15"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-4 left-6 flex items-center gap-1 rounded-full bg-amber-300 px-4 py-1.5 text-sm font-bold text-amber-950 shadow-lg"
                    >
                        <Star className="size-4 fill-amber-950" />
                        র‍ান্নাঘরের প্রিয় কৃষক
                    </span>
                </div>

                <div className="order-1 lg:order-2 lg:col-span-7">
                    <p className="text-sm font-semibold tracking-wide text-emerald-600 uppercase">
                        কৃষকের কথা
                    </p>
                    <h2
                        id="farmer-story-heading"
                        className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl"
                    >
                        কৃষকের মুখেই শুনুন গ্রামবাজারের গল্প
                    </h2>

                    <figure className="mt-8 max-w-2xl">
                        <Quote
                            aria-hidden="true"
                            className="mb-4 size-10 text-emerald-300"
                        />
                        <blockquote className="text-xl leading-relaxed font-medium text-emerald-950 sm:text-2xl">
                            আগে মাঝারিরা আমার পণ্যের লাভ ভাগ করে নিত। এখন গ্রামবাজারে সরাসরি
                            বিক্রি করি — পেলে টাকা আমার নিজের থলিতে যায়, আর ক্রেতা পায়
                            ভোরের তাজা ফলন।
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-4">
                            <span
                                aria-hidden="true"
                                className="flex size-12 items-center justify-center rounded-full bg-emerald-700 font-bold text-white"
                            >
                                ক
                            </span>
                            <div>
                                <p className="font-bold text-emerald-950">
                                    করিম মিয়া
                                </p>
                                <p className="text-sm text-stone-500">
                                    জৈব সবজি চাষি, সিংগাইর
                                </p>
                            </div>
                        </figcaption>
                    </figure>

                    <Button
                        asChild
                        onClick={() => toast('কৃষক হিসেবে নিবন্ধন শীঘ্রই চালু হবে')}
                        size="lg"
                        className="mt-8 rounded-full bg-emerald-600 px-7 shadow-lg shadow-emerald-600/25 hover:bg-emerald-700"
                    >
                        <a href="#farmer-story">
                            কৃষক হিসেবে যুক্ত হন
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
