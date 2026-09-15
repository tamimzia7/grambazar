import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Package } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import StatusBadge from '@/components/admin/status-badge';
import { formatTaka, toBnNumber } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminUserShowPageProps } from '@/types/admin';

export default function AdminUserShow() {
    const props = usePage().props as unknown as AdminUserShowPageProps;
    const { user, farmer, can } = props;

    return (
        <>
            <Head title={`${user.name} — ব্যবহারকারী`} />

            <PageHeader
                title={user.name}
                subtitle={`${user.email} · যোগদান: ${user.created_at}`}
                actions={
                    <Link
                        href={adminRoutes.users.index.url()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        ফিরে যান
                    </Link>
                }
            />

            {can.manage_status ? (
                <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-sm text-stone-600">
                        অ্যাকাউন্টের লগইন স্ট্যাটাস:{' '}
                        <StatusBadge value={user.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} />
                    </p>
                    <Link
                        href={adminRoutes.users.toggleActive.url({ user: user.id })}
                        method="post"
                        as="button"
                        className="mt-3 rounded-md bg-stone-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-stone-700"
                    >
                        {user.is_active ? 'লগইন নিষ্ক্রিয় করুন' : 'লগইন সক্রিয় করুন'}
                    </Link>
                </div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
                <InfoCard title="অ্যাকাউন্ট তথ্য">
                    <InfoRow label="রোল" value={user.role.label} />
                    <InfoRow label="ফোন" value={user.phone ?? '—'} />
                    <InfoRow label="অর্ডার সংখ্যা" value={toBnNumber(user.orders_count)} />
                    <InfoRow label="মোট কেনাকাটা" value={formatTaka(user.total_spent)} />
                    <InfoRow label="যোগদান" value={user.created_at} />
                </InfoCard>

                {farmer !== null ? (
                    <InfoCard title="কৃষক প্রোফাইল">
                        <InfoRow label="প্রদর্শন নাম" value={farmer.display_name} />
                        <InfoRow label="জেলা" value={farmer.district} />
                        <InfoRow label="অনুমোদন" value={farmer.approval_status} />
                        <InfoRow label="সক্রিয় পণ্য" value={toBnNumber(farmer.products_count)} />
                        <Link
                            href={adminRoutes.farmers.show.url({ farmer: farmer.id })}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                        >
                            <Package className="size-4" aria-hidden="true" />
                            কৃষকের প্রোফাইল দেখুন
                        </Link>
                    </InfoCard>
                ) : (
                    <InfoCard title="কৃষক প্রোফাইল">
                        <p className="text-sm text-stone-400">এই ব্যবহারকারী কৃষক নয়।</p>
                    </InfoCard>
                )}
            </div>
        </>
    );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-3 text-base font-extrabold text-emerald-950">{title}</h2>
            <dl className="divide-y divide-stone-100">{children}</dl>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-2.5">
            <dt className="text-sm font-semibold text-stone-500">{label}</dt>
            <dd className="text-sm font-bold text-emerald-950">{value}</dd>
        </div>
    );
}