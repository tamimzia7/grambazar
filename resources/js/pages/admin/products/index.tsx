import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import { formatTaka } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminProductsIndexPageProps } from '@/types/admin';

const inputClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminProductsIndex() {
    const props = usePage().props as unknown as AdminProductsIndexPageProps;
    const { products, filters, categories } = props;
    const { data, setData, get } = useForm(filters as Record<string, string | number | boolean | null>);

    const apply = () => get(window.location.pathname, { preserveState: true });

    return (
        <>
            <Head title="পণ্য" />

            <PageHeader title="পণ্য" subtitle="সকল পণ্য, স্টক ও মডারেশন।" />

            <div className="rounded-2xl border border-stone-200 bg-white">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        apply();
                    }}
                    className="flex flex-wrap items-end gap-3 border-b border-stone-100 p-4"
                >
                    <label className="block grow basis-64">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">খুঁজুন</span>
                        <span className="relative block">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
                            <input
                                type="search"
                                value={String(data.search ?? '')}
                                onChange={(event) => setData('search', event.target.value)}
                                placeholder="পণ্যের নাম"
                                className={`${inputClass} w-full pl-8`}
                            />
                        </span>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">ক্যাটাগরি</span>
                        <select
                            value={String(data.category_id ?? '')}
                            onChange={(event) => setData('category_id', event.target.value)}
                            className={inputClass}
                        >
                            <option value="">সব ক্যাটাগরি</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">স্ট্যাটাস</span>
                        <select
                            value={String(data.status ?? '')}
                            onChange={(event) => setData('status', event.target.value)}
                            className={inputClass}
                        >
                            <option value="">সব স্ট্যাটাস</option>
                            <option value="active">দৃশ্যমান</option>
                            <option value="inactive">লুকানো</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="h-9 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        ফিল্টার
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                                <th className="px-4 py-3">পণ্য</th>
                                <th className="px-4 py-3">ক্যাটাগরি</th>
                                <th className="px-4 py-3">কৃষক</th>
                                <th className="px-4 py-3">মূল্য</th>
                                <th className="px-4 py-3">স্টক</th>
                                <th className="px-4 py-3">স্ট্যাটাস</th>
                                <th className="px-4 py-3 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                                        কোনো পণ্য পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image ?? '/images/home/product-fallback.svg'}
                                                    alt=""
                                                    className="size-10 rounded-lg object-cover"
                                                />
                                                <p className="font-bold text-emerald-950">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">{product.category ?? '—'}</td>
                                        <td className="px-4 py-3 text-stone-600">{product.farmer ?? '—'}</td>
                                        <td className="px-4 py-3 font-bold text-emerald-800">{formatTaka(product.price)}</td>
                                        <td className="px-4 py-3 text-stone-600">{product.stock_quantity}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge value={product.is_active ? 'দৃশ্যমান' : 'লুকানো'} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={adminRoutes.products.show.url({ product: product.id })}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
                                            >
                                                <Eye className="size-3.5" aria-hidden="true" />
                                                বিস্তারিত
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={products} />
            </div>
        </>
    );
}