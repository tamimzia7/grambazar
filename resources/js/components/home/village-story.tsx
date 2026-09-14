import { Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VillageStory() {
    const [videoOpen, setVideoOpen] = useState(false);

    function playVideo(): void {
        setVideoOpen(true);
        toast('ভিডিওটি শীঘ্রই যুক্ত হবে — আপাতত দৃশ্যপট দেখুন');
    }

    return (
        <section
            aria-labelledby="village-heading"
            className="bg-white py-16 lg:py-20"
        >
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
                <div className="lg:col-span-5">
                    <p className="text-sm font-semibold tracking-wide text-emerald-600 uppercase">
                        আমাদের গল্প
                    </p>
                    <h2
                        id="village-heading"
                        className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl"
                    >
                        এক গ্রাম, এক বাজার
                    </h2>
                    <p className="mt-4 leading-relaxed text-stone-600">
                        প্রতিদিন ভোরে দেশের আনাচে-কানাচের কৃষক তাদের সেরা ফলন নিয়ে হাজির
                        হয় গ্রামবাজারে। আমাদের কাজ — সেই তাজা পণ্যটা সোজা পাঠিয়ে দেওয়া আপনার
                        রান্নাঘরে। সঞ্চয়, সতেজতা আর সৎ আয় — এই তিন মন্ত্রেই আমাদের যাত্রা।
                    </p>
                    <dl className="mt-8 grid grid-cols-3 gap-6">
                        {(
                            [
                                ['১ লক্ষ+', 'কৃষক পরিবার'],
                                ['১০০%', 'জৈব ও তাজা'],
                                ['২৪ ঘণ্টা', 'সর্বোচ্চ ডেলিভারি'],
                            ] as const
                        ).map(([value, label]) => (
                            <div key={label}>
                                <dt className="sr-only">{label}</dt>
                                <dd className="text-2xl font-extrabold text-emerald-700">
                                    {value}
                                </dd>
                                <dd className="mt-1 text-sm text-stone-500">
                                    {label}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="relative lg:col-span-7">
                    <img
                        src="/images/home/village.svg"
                        alt="গ্রামের পুকুর, গাছ আর সন্ধ্যার দৃশ্য"
                        width={1200}
                        height={675}
                        loading="lazy"
                        className="w-full rounded-3xl border-4 border-emerald-50 shadow-2xl shadow-emerald-900/10"
                    />

                    <button
                        type="button"
                        onClick={playVideo}
                        aria-label="গ্রামবাজার - গল্পটা চলুন দেখি"
                        className="absolute inset-0 flex items-center justify-center rounded-3xl bg-emerald-950/30 transition-colors hover:bg-emerald-950/40 focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:outline-none"
                    >
                        <span
                            aria-hidden="true"
                            className={`flex size-20 items-center justify-center rounded-full bg-white/95 text-emerald-700 shadow-2xl transition-transform ${
                                videoOpen ? 'scale-90' : ''
                            }`}
                        >
                            <Play className="ml-1 size-9 fill-current" />
                        </span>
                    </button>

                    {videoOpen && (
                        <div
                            role="status"
                            className="absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-2 rounded-full bg-emerald-900/85 px-4 py-2 text-sm font-medium text-white backdrop-blur"
                        >
                            <Sparkles
                                className="size-4 text-amber-300"
                                aria-hidden="true"
                            />
                            গ্রামের গল্প — ভিডিও শীঘ্রই
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
