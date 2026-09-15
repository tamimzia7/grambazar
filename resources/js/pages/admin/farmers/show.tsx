import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, PauseCircle, PlayCircle, Power, XCircle } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import StatusBadge from '@/components/admin/status-badge';
import { toBnNumber } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminFarmerShowPageProps } from '@/types/admin';

export default function AdminFarmerShow() {
    const props = usePage().props as unknown as AdminFarmerShowPageProps;
    const { farmer, products, can } = props;

    const reject = useForm({ reason: '' });

    return (
        <>
            <Head title={`${farmer.display_name} — কৃষক`} />

            <PageHeader
                title={farmer.display_name}
                subtitle={`${farmer.display_name} · ${farmer.district} · যোগদান: ${farmer.created_at}`}
                actions={
                    <Link
                        href={adminRoutes.farmers.index.url()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        ফিরে যান
                    </Link>
                }
            />

            <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-stone-500">অনুমোদন অবস্থা:</span>
                        <StatusBadge value={farmer.approval_status.label} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {can.approve && farmer.approval_status.value !== 'approved' ? (
                            <Link
                                href={adminRoutes.farmers.approve.url({ farmer: farmer.id })}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="size-4" aria-hidden="true" />
                                অনুমোদন করুন
                            </Link>
                        ) : null}
                        {can.suspend && farmer.approval_status.value === 'approved' ? (
                            <Link
                                href={adminRoutes.farmers.suspend.url({ farmer: farmer.id })}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100"
                            >
                                <PauseCircle className="size-4" aria-hidden="true" />
                                স্থগিত করুন
                            </Link>
                        ) : null}
                        {can.suspend && farmer.approval_status.value === 'suspended' ? (
                            <Link
                                href={adminRoutes.farmers.reactivate.url({ farmer: farmer.id })}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
                            >
                                <PlayCircle className="size-4" aria-hidden="true" />
                                পুনরায় সক্রিয় করুন
                            </Link>
                        ) : null}
                        {can.toggle_account ? (
                            <Link
                                href={adminRoutes.farmers.toggleAccount.url({ farmer: farmer.id })}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition-colors hover:bg-stone-50"
                            >
                                <Power className="size-4" aria-hidden="true" />
                                লগইন {farmer.user.is_active ? 'নিষ্ক্রিয়' : 'সক্রিয়'} করুন
                            </Link>
                        ) : null}
                    </div>
                </div>

                {can.reject && farmer.approval_status.value !== 'rejected' ? (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            reject.post(adminRoutes.farmers.reject.url({ farmer: farmer.id }));
                        }}
                        className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4"
                    >
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600">
                            <XCircle className="size-4" aria-hidden="true" />
                            প্রত্যাখ্যান করুন:
                        </span>
                        <input
                            type="text"
                            value={reject.data.reason}
                            onChange={(event) => reject.setData('reason', event.target.value)}
                            placeholder="প্রত্যাখ্যানের কারণ (আবশ্যক)"
                            className="h-9 grow basis-60 rounded-md border border-stone-200 bg-white px-2.5 text-sm outline-none transition-colors focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                        />
                        {reject.errors.reason ? (
                            <span className="text-xs font-semibold text-rose-600">{reject.errors.reason}</span>
                        ) : null}
                        <button
                            type="submit"
                            disabled={reject.processing || reject.data.reason.trim() === ''}
                            className="h-9 rounded-md bg-rose-600 px-4 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
                        >
                            প্রত্যাখ্যান
                        </button>
                    </form>
                ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-5">
                    <h2 className="mb-3 text-base font-extrabold text-emerald-950">কৃষকের তথ্য</h2>
                    <dl className="divide-y divide-stone-100">
                        <InfoRow label="বায়ো" value={farmer.bio ?? '—'} />
                        <InfoRow label="গ্রাম" value={farmer.village ?? '—'} />
                        <InfoRow label="জেলা" value={farmer.district} />
                        <InfoRow label="ঠিকানা" value={farmer.address ?? '—'} />
                        <InfoRow
                            label="অ্যাকাউন্ট"
                            value={
                                farmer.user.is_active ? (
                                    <StatusBadge value="সক্রিয়" />
                                ) : (
                                    <StatusBadge value="নিষ্ক্রিয়" />
                                )
                            }
                        />
                    </dl>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-5">
                    <h2 className="mb-3 text-base font-extrabold text-emerald-950">প্রোফাইল (নাম, ইমেইল, ফোন)</h2>
                    <dl className="divide-y divide-stone-100">
                        <InfoRow label="নাম" value={farmer.user.name} />
                        <InfoRow label="ইমেইল" value={farmer.user.email} />
                        <InfoRow label="ফোন" value={farmer.user.phone ?? '—'} />
                    </dl>
                </div>
            </div>

            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
                <h2 className="mb-3 text-base font-extrabold text-emerald-950">
                    সাম্প্রতিক পণ্য ({toBnNumber(products.length)})
                </h2>
                {products.length === 0 ? (
                    <p className="py-6 text-center text-sm text-stone-400">এখনও কোনো পণ্য নেই।</p>
                ) : (
                    <ul className="divide-y divide-stone-100">
                        {products.map((product) => (
                            <li key={product.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                                <div>
                                    <p className="font-bold text-emerald-950">{product.name}</p>
                                    <p className="text-xs text-stone-500">
                                        {product.category ?? '—'} · স্টক {toBnNumber(product.stock_quantity)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge value={product.is_active ? 'দৃশ্যমান' : 'লুকানো'} />
                                    <Link
                                        href={adminRoutes.products.show.url({ product: product.id })}
                                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                    >
                                        দেখুন →
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
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