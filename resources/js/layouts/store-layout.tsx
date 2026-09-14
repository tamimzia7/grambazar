import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import Footer from '@/components/home/footer';
import Navbar from '@/components/home/navbar';
import { useAppFlash } from '@/lib/flash';

export default function StoreLayout({ children }: { children: ReactNode }) {
    const { categories } = usePage().props;
    useAppFlash();

    return (
        <div className="flex min-h-screen flex-col bg-stone-50">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-emerald-600 focus:px-3 focus:py-2 focus:text-white"
            >
                মূল অংশে যান
            </a>
            <Navbar categories={categories} />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
