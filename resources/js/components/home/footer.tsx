import {
    Clock,
    Facebook,
    Instagram,
    Leaf,
    Mail,
    MapPin,
    Phone,
    Send,
    Youtube,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { HomeSiteContent } from '@/types/home';

const BRAND = 'গ্রামবাজার';

const DEFAULT_SITE: HomeSiteContent = {
    hero_eyebrow: 'জমির থেকে সরাসরি আপনার রান্নাঘরে',
    hero_title: 'তাজা খাদ্য, সরাসরি গ্রামের হাত থেকে',
    hero_subtitle:
        'গ্রামবাজারে সরাসরি কৃষকদের কাছ থেকে টাটকা সবজি, ফল, মাছ ও মসলা কিনুন — কোনো মধ্যস্বত্বভোগী ছাড়াই। এক বিক্রেতা, সবচেয়ে সেরা দাম।',
    brand_about:
        'সরাসরি কৃষক থেকে শহরের রান্নাঘরে — টাটকা সবজি, ফল, মাছ ও মসলা, কোনো মধ্যস্বত্বভোগী ছাড়াই।',
    contact_address: 'সিংগাইর, মানিকগঞ্জ',
    contact_phone: '০১৭০০-০০০০০০',
    contact_email: 'support@grambazar.test',
    contact_hours: 'সকাল ৬টা - রাত ১০টা',
    social_facebook: 'https://facebook.com/grambazar',
    social_instagram: 'https://instagram.com/grambazar',
    social_youtube: 'https://youtube.com/@grambazar',
};

export default function Footer({ site = {} }: { site?: Partial<HomeSiteContent> }) {
    const content = { ...DEFAULT_SITE, ...site };
    const [email, setEmail] = useState('');

    function subscribe(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setEmail('');
        toast(
            `ধন্যবাদ! আপডেট পেতে ${email || 'আপনার ইমেইল'} দিয়ে নিউজলেটার শীঘ্রই চালু হবে`,
        );
    }

    return (
        <footer className="bg-emerald-950 text-emerald-100">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-2">
                            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                <Leaf className="size-5" aria-hidden="true" />
                            </span>
                            <span className="text-lg font-bold tracking-tight text-white">
                                {BRAND}
                            </span>
                        </div>
                        <p className="mt-4 max-w-sm leading-relaxed text-emerald-200/80">
                            {content.brand_about}
                        </p>
                        <div className="mt-5 flex gap-3">
                            {(
                                [
                                    [Facebook, 'ফেসবুক', content.social_facebook],
                                    [Instagram, 'ইনস্টাগ্রাম', content.social_instagram],
                                    [Youtube, 'ইউটিউব', content.social_youtube],
                                ] as const
                            ).map(([Icon, label, url]) =>
                                url ? (
                                    <a
                                        key={label}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={label}
                                        className="flex size-9 items-center justify-center rounded-full border border-emerald-800 text-emerald-200 transition-colors hover:border-emerald-500 hover:bg-emerald-800"
                                    >
                                        <Icon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </a>
                                ) : (
                                    <button
                                        key={label}
                                        type="button"
                                        aria-label={label}
                                        onClick={() =>
                                            toast(`আমাদের ${label} পেজ শীঘ্রই`)
                                        }
                                        className="flex size-9 items-center justify-center rounded-full border border-emerald-800 text-emerald-200 transition-colors hover:border-emerald-500 hover:bg-emerald-800"
                                    >
                                        <Icon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    <nav
                        aria-label="পাদলেখ লিংক"
                        className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5"
                    >
                        <div>
                            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                                দোকান
                            </h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                {['সবজি', 'ফল', 'মাছ ও মাংস', 'মসলা', 'বীজ'].map(
                                    (label) => (
                                        <li key={label}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toast(
                                                        `"${label}" বিভাগ শীঘ্রই আসবে`,
                                                    )
                                                }
                                                className="text-emerald-200/80 transition-colors hover:text-white"
                                            >
                                                {label}
                                            </button>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                                কোম্পানি
                            </h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                {[
                                    'আমাদের গল্প',
                                    'কৃষক যুক্ত হোন',
                                    'যোগাযোগ',
                                    'সার্বজনীন নীতিমালা',
                                ].map((label) => (
                                    <li key={label}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toast(
                                                    `"${label}" পাতা শীঘ্রই আসবে`,
                                                )
                                            }
                                            className="text-emerald-200/80 transition-colors hover:text-white"
                                        >
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                                সহায়তা
                            </h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                {[
                                    'কার্ট ও অর্ডার',
                                    'ডেলিভারি তথ্য',
                                    'FAQ ও প্রত্যাবর্তন',
                                ].map((label) => (
                                    <li key={label}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toast(
                                                    `"${label}" সহায়তা শীঘ্রই আসবে`,
                                                )
                                            }
                                            className="text-emerald-200/80 transition-colors hover:text-white"
                                        >
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                            নিউজলেটার
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-emerald-200/80">
                            মৌসুমি পণ্যের খবর আর বিশেষ অফার সবার আগে পেতে সাবস্ক্রাইব
                            করুন।
                        </p>
                        <form onSubmit={subscribe} className="mt-4">
                            <label
                                htmlFor="newsletter-email"
                                className="sr-only"
                            >
                                ইমেইল ঠিকানা
                            </label>
                            <div className="flex rounded-full border border-emerald-800 bg-emerald-900/60 focus-within:border-emerald-500">
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="আপনার ইমেইল"
                                    className="w-full rounded-l-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-emerald-300/50 focus:outline-none"
                                />
                                <Button
                                    type="submit"
                                    aria-label="সাবস্ক্রাইব"
                                    className="rounded-r-full bg-emerald-600 hover:bg-emerald-500"
                                >
                                    <Send
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                        </form>

                        <ul className="mt-6 space-y-2.5 text-sm text-emerald-200/80">
                            <li className="flex items-center gap-2">
                                <MapPin
                                    className="size-4 shrink-0 text-emerald-400"
                                    aria-hidden="true"
                                />
                                {content.contact_address}
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone
                                    className="size-4 shrink-0 text-emerald-400"
                                    aria-hidden="true"
                                />
                                {content.contact_phone}
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail
                                    className="size-4 shrink-0 text-emerald-400"
                                    aria-hidden="true"
                                />
                                {content.contact_email}
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock
                                    className="size-4 shrink-0 text-emerald-400"
                                    aria-hidden="true"
                                />
                                {content.contact_hours}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-emerald-900">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-emerald-300/70 sm:flex-row sm:px-6 lg:px-8">
                    <p>
                        © {new Date().getFullYear()} GramBazar — সর্বস্বত্ব সংরক্ষিত
                        | অনুকরণীয় নয়, ক্রয়যোগ্য।
                    </p>
                    <p className="flex items-center gap-1.5">
                        বাংলাদেশে ভালোবেসে তৈরি
                        <Leaf className="size-3.5" aria-hidden="true" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
