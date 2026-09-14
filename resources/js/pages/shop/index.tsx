import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, PackageSearch, Search } from 'lucide-react';
import { useState } from 'react';

import ProductCard from '@/components/home/product-card';
import { toBnNumber } from '@/lib/format';
import shopRoutes from '@/routes/shop';
import type { ShopPageProps } from '@/types/shop';

const SORTS = [
    { value: 'popular', label: 'জনপ্রিয়' },
    { value: 'price_asc', label: 'দাম কম থেকে বেশি' },
    { value: 'price_desc', label: 'দাম বেশি থেকে কম' },
    { value: 'newest', label: 'নতুন আগে' },
] as const;

export default function ShopIndex() {
    const { products, categories, activeCategory, search, sort } = usePage()
        .props as unknown as ShopPageProps;
    const [query, setQuery] = useState(search);

    const baseUrl = activeCategory
        ? shopRoutes.category.url({
              category: { slug: activeCategory.root.slug },
          })
        : shopRoutes.index.url();

    function applyFilters(next: { q?: string; sort?: string }): void {
        const params: Record<string, string> = { sort: next.sort ?? sort };

        const term = next.q ?? query.trim();
        if (term !== '') {
            params.q = term;
        }

        const querystring = new URLSearchParams(params).toString();

        router.get(
            `${baseUrl}?${querystring}`,
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    const activeRoot =
        categories.find(
            (category) => category.slug === activeCategory?.root.slug,
        ) ?? null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <nav aria-label="ব্রেডক্রম্ব" className="mb-4 text-sm text-stone-500">
                <Link
                    href="/"
                    className="transition-colors hover:text-emerald-700"
                >
                    হোম
                </Link>
                <span className="mx-2">/</span>
                <span className="font-medium text-stone-800">দোকান</span>
                {activeCategory && (
                    <>
                        <span className="mx-2">/</span>
                        <Link
                            href={shopRoutes.category.url({
                                category: { slug: activeCategory.root.slug },
                            })}
                            className="transition-colors hover:text-emerald-700"
                        >
                            {activeCategory.root.name}
                        </Link>
                        {activeCategory.slug !== activeCategory.root.slug && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="font-medium text-stone-800">
                                    {activeCategory.name}
                                </span>
                            </>
                        )}
                    </>
                )}
            </nav>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                    {activeCategory ? activeCategory.name : 'সব পণ্য'}
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                    মোট {toBnNumber(products.total)}টি পণ্য
                    {search !== '' && <> · "{search}" অনুসন্ধানকৃত</>}
                </p>
            </div>

            <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={shopRoutes.index.url()}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            activeCategory === null
                                ? 'bg-emerald-600 text-white'
                                : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-800'
                        }`}
                    >
                        সব
                    </Link>
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={shopRoutes.category.url({
                                category: { slug: category.slug },
                            })}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                activeRoot?.slug === category.slug
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-800'
                            }`}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

                {activeRoot !== null && activeRoot.children.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pl-1">
                        {activeRoot.children.map((child) => (
                            <Link
                                key={child.slug}
                                href={shopRoutes.category.url({
                                    category: { slug: child.slug },
                                })}
                                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                                    activeCategory?.slug === child.slug
                                        ? 'bg-amber-100 font-semibold text-amber-900'
                                        : 'text-stone-500 hover:bg-emerald-50 hover:text-emerald-800'
                                }`}
                            >
                                {child.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative flex-1">
                    <span className="sr-only">দোকানে পণ্য খুঁজুন</span>
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
                                applyFilters({ q: event.currentTarget.value });
                            }
                        }}
                        placeholder="পণ্য খুঁজুন..."
                        className="w-full rounded-full border border-stone-200 bg-white py-2.5 pr-4 pl-9 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                    />
                </label>

                <label className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="sr-only">সাজান</span>
                    <select
                        value={sort}
                        onChange={(event) =>
                            applyFilters({ sort: event.target.value })
                        }
                        className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                    >
                        {SORTS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {products.data.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-16 text-center">
                    <PackageSearch
                        className="size-12 text-stone-300"
                        aria-hidden="true"
                    />
                    <h2 className="mt-4 text-lg font-bold text-stone-700">
                        কোনো পণ্য পাওয়া যায়নি
                    </h2>
                    <p className="mt-1 max-w-sm text-sm text-stone-500">
                        অনুসন্ধানের শব্দ বদলে বা ভিন্ন বিভাগ দেখে আবার চেষ্টা করুন।
                    </p>
                    <Link
                        href={shopRoutes.index.url()}
                        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                        সব পণ্য দেখুন
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            )}

            {products.links.length > 3 && (
                <nav
                    aria-label="পেজিং"
                    className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
                >
                    {products.links.map((link, index) => {
                        const label = String(link.label);
                        const isPage = /^\d+$/.test(label);

                        if (link.url === null) {
                            return (
                                <span
                                    key={`${label}-${index}`}
                                    className="rounded-full px-3 py-2 text-sm text-stone-300"
                                >
                                    …
                                </span>
                            );
                        }

                        if (!isPage) {
                            return (
                                <Link
                                    key={`${label}-${index}`}
                                    href={link.url}
                                    className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                                >
                                    {label.replace(/&[a-z]+;/g, '').trim() ||
                                        label}
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={`${label}-${index}`}
                                href={link.url}
                                aria-current={link.active ? 'page' : undefined}
                                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                                    link.active
                                        ? 'bg-emerald-600 text-white'
                                        : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-800'
                                }`}
                            >
                                {toBnNumber(label)}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}
