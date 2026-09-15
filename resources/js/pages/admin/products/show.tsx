import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Boxes, Save } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import StatusBadge from '@/components/admin/status-badge';
import { formatTaka } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminProductShowPageProps } from '@/types/admin';

const inputClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminProductShow() {
    const props = usePage().props as unknown as AdminProductShowPageProps;
    const { product, units, can } = props;

    const edit = useForm({
        price: String(product.price),
        sale_price: product.sale_price === null ? '' : String(product.sale_price),
        unit: product.unit,
        stock_quantity: String(product.stock_quantity),
        min_order_quantity: String(product.min_order_quantity),
        is_featured: product.is_featured,
        is_popular: product.is_popular,
        is_seasonal: product.is_seasonal,
        is_active: product.is_active,
    });

    const stock = useForm({ stock_quantity: String(product.stock_quantity) });

    const updateStock = () => {
        stock.patch(adminRoutes.products.stock.url({ product: product.id }), {
            onSuccess: () => edit.setData('stock_quantity', String(stock.data.stock_quantity)),
        });
    };

    return (
        <>
            <Head title={`${product.name} — পণ্য`} />

            <PageHeader
                title={product.name}
                subtitle={`${product.category?.name ?? 'ক্যাটাগরি নেই'}${product.category ? ' · ' : ''}${product.unit_label} · ${formatTaka(product.price)}`}
                actions={
                    <Link
                        href={adminRoutes.products.index.url()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        ফিরে যান
                    </Link>
                }
            />

            <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-4">
                <img
                    src={
                        product.image ??
                        (product.category_slug
                            ? `/images/home/cat-${product.category_slug}.svg`
                            : '/images/home/product-fallback.svg')
                    }
                    alt={product.name}
                    className="h-64 w-full object-cover lg:h-80"
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <h2 className="text-base font-extrabold text-emerald-950">পণ্য ও মূল্য</h2>
                        {can.moderate ? (
                            <Link
                                href={adminRoutes.products.toggleActive.url({ product: product.id })}
                                method="post"
                                as="button"
                                className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
                            >
                                {product.is_active ? 'লুকান' : 'দৃশ্যমান করুন'}
                            </Link>
                        ) : null}
                    </div>
                    <StatusBadge value={product.is_active ? 'দৃশ্যমান' : 'লুকানো'} />
                    <p className="mb-4 mt-1 text-sm text-stone-500">{product.short_description ?? 'কোনো বিবরণ নেই'}</p>

                    {can.edit ? (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                edit.put(adminRoutes.products.update.url({ product: product.id }));
                            }}
                            className="grid gap-3 sm:grid-cols-2"
                        >
                            <Field label="মূল্য (৳)">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={String(edit.data.price)}
                                    onChange={(event) => edit.setData('price', event.target.value)}
                                    className={`${inputClass} w-full`}
                                />
                            </Field>
                            <Field label="সদস্য মূল্য (৳)">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={String(edit.data.sale_price)}
                                    onChange={(event) => edit.setData('sale_price', event.target.value)}
                                    placeholder="ঐচ্ছিক"
                                    className={`${inputClass} w-full`}
                                />
                            </Field>
                            <Field label="একক / ইউনিট">
                                <select
                                    value={String(edit.data.unit)}
                                    onChange={(event) => edit.setData('unit', event.target.value)}
                                    className={`${inputClass} w-full`}
                                >
                                    {units.map((unit) => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="সর্বনিম্ন অর্ডার (ইউনিট)">
                                <input
                                    type="number"
                                    min="1"
                                    value={String(edit.data.min_order_quantity)}
                                    onChange={(event) => edit.setData('min_order_quantity', event.target.value)}
                                    className={`${inputClass} w-full`}
                                />
                            </Field>
                            <div className="flex flex-wrap gap-4 sm:col-span-2">
                                <Checkbox label="ফিচার্ড" value={edit.data.is_featured} onChange={(v) => edit.setData('is_featured', v)} />
                                <Checkbox label="জনপ্রিয়" value={edit.data.is_popular} onChange={(v) => edit.setData('is_popular', v)} />
                                <Checkbox label="মৌসুমি" value={edit.data.is_seasonal} onChange={(v) => edit.setData('is_seasonal', v)} />
                            </div>
                            <button
                                type="submit"
                                disabled={edit.processing}
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 sm:col-span-2"
                            >
                                <Save className="size-4" aria-hidden="true" />
                                সংরক্ষণ করুন
                            </button>
                        </form>
                    ) : (
                        <dl className="divide-y divide-stone-100">
                            <InfoRow label="মূল্য" value={formatTaka(product.price)} />
                            {product.sale_price !== null ? <InfoRow label="সদস্য মূল্য" value={formatTaka(product.sale_price)} /> : null}
                            <InfoRow label="সর্বনিম্ন অর্ডার" value={`${product.min_order_quantity} ${product.unit_label}`} />
                            <InfoRow label="ফিচার্ড" value={product.is_featured ? 'হ্যাঁ' : 'না'} />
                            <InfoRow label="জনপ্রিয়" value={product.is_popular ? 'হ্যাঁ' : 'না'} />
                            <InfoRow label="মৌসুমি" value={product.is_seasonal ? 'হ্যাঁ' : 'না'} />
                        </dl>
                    )}
                </div>

                {can.stock ? (
                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-emerald-950">
                            <Boxes className="size-5 text-emerald-600" aria-hidden="true" />
                            স্টক হালনাগাদ
                        </h2>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                updateStock();
                            }}
                        >
                            <Field label="স্টক পরিমাণ (ইউনিট)">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={String(stock.data.stock_quantity)}
                                        onChange={(event) => stock.setData('stock_quantity', event.target.value)}
                                        className={`${inputClass} w-full`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={stock.processing}
                                        className="shrink-0 rounded-md bg-stone-900 px-4 text-sm font-bold text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
                                    >
                                        হালনাগাদ
                                    </button>
                                </div>
                            </Field>
                            {stock.errors.stock_quantity ? (
                                <p className="mt-1 text-xs font-semibold text-rose-600">{stock.errors.stock_quantity}</p>
                            ) : null}
                        </form>
                        {product.farmer ? (
                            <div className="mt-4 border-t border-stone-100 pt-4 text-sm">
                                <p className="font-semibold text-stone-500">কৃষক</p>
                                <p className="font-bold text-emerald-950">{product.farmer.display_name}</p>
                                <p className="text-xs text-stone-500">
                                    {product.farmer.status} · +{product.farmer.owner_phone ?? 'ফোন নেই'}
                                </p>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label>
            <span className="mb-1 block text-xs font-semibold text-stone-500">{label}</span>
            {children}
        </label>
    );
}

function Checkbox({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
    return (
        <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
                className="size-4 accent-emerald-600"
            />
            <span className="text-sm font-medium text-stone-600">{label}</span>
        </label>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-sm font-semibold text-stone-500">{label}</dt>
            <dd className="text-right text-sm font-bold text-emerald-950">{value}</dd>
        </div>
    );
}