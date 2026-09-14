import { Link, router, usePage } from '@inertiajs/react';
import { Heart, Leaf, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { toBnNumber } from '@/lib/format';
import { dashboard, login, register } from '@/routes';
import cartRoutes from '@/routes/cart';
import shopRoutes from '@/routes/shop';
import type { HomeCategory } from '@/types/home';

interface NavCategory {
    name: string;
    slug: string;
}

export default function Navbar({
    categories,
}: {
    categories: Array<HomeCategory | NavCategory>;
}) {
    const { auth, cartCount } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [query, setQuery] = useState('');

    function submitSearch(): void {
        const trimmed = query.trim();

        if (trimmed !== '') {
            router.get(shopRoutes.index.url({ query: { q: trimmed } }));
            setMobileOpen(false);
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur">
            <nav
                aria-label="মূল নেভিগেশন"
                className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
            >
                <div className="flex items-center gap-3">
                    <Link
                        href={shopRoutes.index.url()}
                        aria-label="গ্রামবাজার - হোম"
                        className="flex items-center gap-2"
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                            <Leaf className="size-5" aria-hidden="true" />
                        </span>
                        <span className="text-lg font-bold tracking-tight text-emerald-900">
                            গ্রাম
                            <mark className="bg-transparent text-emerald-600">
                                বাজার
                            </mark>
                        </span>
                    </Link>

                    <div className="ml-4 hidden items-center gap-1 md:flex">
                        {categories.slice(0, 4).map((category) => (
                            <Link
                                key={category.slug}
                                href={shopRoutes.category.url({
                                    category: { slug: category.slug },
                                })}
                                className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="hidden flex-1 items-center justify-end gap-3 md:flex lg:mx-10">
                    <label className="relative w-full max-w-md">
                        <span className="sr-only">পণ্য খুঁজুন</span>
                        <Search
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch();
                                }
                            }}
                            placeholder="চাল, মাছ, সবজি খুঁজুন..."
                            className="w-full rounded-full border border-stone-200 bg-stone-50 py-2 pr-4 pl-9 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                        />
                    </label>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="প্রিয় তালিকা"
                        onClick={() => toast('প্রিয় তালিকা শীঘ্রই আসছে')}
                        className="text-stone-600 hover:text-emerald-700"
                    >
                        <Heart className="size-5" />
                    </Button>
                    <Link
                        href={cartRoutes.index.url()}
                        aria-label="কার্ট"
                        className="relative flex size-9 items-center justify-center rounded-md text-stone-600 transition-colors hover:text-emerald-700"
                    >
                        <ShoppingCart className="size-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-semibold text-amber-950">
                                {toBnNumber(cartCount)}
                            </span>
                        )}
                    </Link>

                    {auth.user ? (
                        <Link href={dashboard()} prefetch>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                ড্যাশবোর্ড
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={login()} prefetch>
                                <Button
                                    variant="ghost"
                                    className="text-emerald-800 hover:bg-emerald-50"
                                >
                                    লগইন
                                </Button>
                            </Link>
                            <Link href={register()} prefetch>
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                    নিবন্ধন
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    aria-label={mobileOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((open) => !open)}
                    className="rounded-md p-2 text-emerald-900 transition-colors hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none md:hidden"
                >
                    {mobileOpen ? (
                        <X className="size-6" />
                    ) : (
                        <Menu className="size-6" />
                    )}
                </button>
            </nav>

            {mobileOpen && (
                <div className="border-t border-emerald-100 bg-white px-4 pt-3 pb-5 md:hidden">
                    <label className="relative mb-4 block">
                        <span className="sr-only">পণ্য খুঁজুন</span>
                        <Search
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch();
                                }
                            }}
                            placeholder="চাল, মাছ, সবজি খুঁজুন..."
                            className="w-full rounded-full border border-stone-200 bg-stone-50 py-2 pr-4 pl-9 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={shopRoutes.category.url({
                                    category: { slug: category.slug },
                                })}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg bg-emerald-50 px-3 py-2 text-left text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-100"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                prefetch
                                className="flex-1"
                            >
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    ড্যাশবোর্ড
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    prefetch
                                    className="flex-1"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        লগইন
                                    </Button>
                                </Link>
                                <Link
                                    href={register()}
                                    prefetch
                                    className="flex-1"
                                >
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                        নিবন্ধন
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
