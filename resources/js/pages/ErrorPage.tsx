import { Link, usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';
import shopRoutes from '@/routes/shop';

const STATUS_CONTENT: Record<
    number,
    { title: string; description: string; action: string }
> = {
    403: {
        title: 'অনুমতি নেই',
        description: 'এই পৃষ্ঠাটি দেখার অনুমতি আপনার নেই।',
        action: 'প্রথম পাতায় ফিরে যান',
    },
    404: {
        title: 'পৃষ্ঠাটি পাওয়া যায়নি',
        description: 'আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি আর নেই বা সরিয়ে ফেলা হয়েছে।',
        action: 'প্রথম পাতায় ফিরে যান',
    },
    419: {
        title: 'সেশন শেষ হয়ে গেছে',
        description: 'পৃষ্ঠাটি বেশি সময় ধরে খোলা ছিল, অনুগ্রহ করে আবার চেষ্টা করুন।',
        action: 'প্রথম পাতায় ফিরে যান',
    },
    429: {
        title: 'অনেক বেশি চেষ্টা',
        description: 'খুব বেশি অনুরোধ করা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।',
        action: 'প্রথম পাতায় ফিরে যান',
    },
    500: {
        title: 'সার্ভারে সমস্যা',
        description: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। আমরা সমস্যাটি সমাধান করছি।',
        action: 'প্রথম পাতায় ফিরে যান',
    },
    503: {
        title: 'সেবা সাময়িক বন্ধ',
        description: 'সেবাটি সাময়িকভাবে বন্ধ রয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন।',
        action: 'প্রথম পাতায় ফিরে যান',
    },
};

export default function ErrorPage() {
    const { status } = usePage().props as unknown as { status: number };
    const content = STATUS_CONTENT[status] ?? STATUS_CONTENT[500];

    return (
        <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-800 antialiased">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
                    <AppLogoIcon className="size-10 fill-current text-white" />
                </span>

                <p className="mt-8 text-5xl font-extrabold tracking-tight text-emerald-700 sm:text-6xl">
                    {status}
                </p>
                <h1 className="mt-3 text-xl font-bold text-emerald-950 sm:text-2xl">
                    {content.title}
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
                    {content.description}
                </p>

                <Link
                    href={shopRoutes.index.url()}
                    className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                >
                    {content.action}
                </Link>
            </div>
        </div>
    );
}
