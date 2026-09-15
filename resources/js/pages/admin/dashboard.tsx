import { Head, Link, usePage } from '@inertiajs/react';
import { CircleDollarSign, ListOrdered, Package, Sprout, Users } from 'lucide-react';

import { formatTaka } from '@/lib/format';
import StatCard from '@/components/admin/stat-card';
import PageHeader from '@/components/admin/page-header';
import StatusBadge from '@/components/admin/status-badge';
import adminRoutes from '@/routes/admin';
import type { DashboardPageProps } from '@/types/admin';

export default function AdminDashboard() {
    const { stats, recentOrders, recentFarmers, recentProducts, recentUsers } =
        usePageProps<DashboardPageProps>();

    return (
        <>
            <Head title="ড্যাশবোর্ড" />

            <PageHeader
                title="ড্যাশবোর্ড"
                subtitle="গ্রামবাজারের সর্বশেষ অবস্থা এক নজরে।"
            />

            <section aria-label="সংখ্যালেখ্য" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="মোট ব্যবহারকারী" value={stats.users} icon={<Users className="size-5" aria-hidden="true" />} />
                <StatCard
                    label="মোট কৃষক"
                    value={stats.farmers}
                    icon={<Sprout className="size-5" aria-hidden="true" />}
                    tone="amber"
                />
                <StatCard
                    label="মোট পণ্য"
                    value={stats.products}
                    icon={<Package className="size-5" aria-hidden="true" />}
                    tone="sky"
                />
                <StatCard
                    label="মোট অর্ডার"
                    value={stats.orders}
                    icon={<ListOrdered className="size-5" aria-hidden="true" />}
                />
                <StatCard
                    label="অনুমোদন অপেক্ষমাণ কৃষক"
                    value={stats.pendingFarmers}
                    icon={<Sprout className="size-5" aria-hidden="true" />}
                    tone="amber"
                />
                <StatCard
                    label="চলমান অর্ডার"
                    value={stats.ongoingOrders}
                    icon={<ListOrdered className="size-5" aria-hidden="true" />}
                    tone="sky"
                />
                <StatCard
                    label="নগদ বিক্রয় (পরিশোধিত)"
                    value={stats.totalSales}
                    icon={<CircleDollarSign className="size-5" aria-hidden="true" />}
                />
                <StatCard
                    label="অপরিশোধিত বিক্রয়"
                    value={stats.unpaidSales}
                    icon={<CircleDollarSign className="size-5" aria-hidden="true" />}
                    tone="rose"
                />
            </section>

            <section aria-label="সাম্প্রতিক কার্যকলাপ" className="mt-6 grid gap-4 lg:grid-cols-2">
                <DashboardPanel
                    title="সাম্প্রতিক অর্ডার"
                    href={adminRoutes.orders.index.url()}
                    hrefLabel="সব অর্ডার"
                >
                    {recentOrders.length === 0 ? (
                        <Empty text="এখনও কোনো অর্ডার নেই।" />
                    ) : (
                        <ul className="divide-y divide-stone-100">
                            {recentOrders.map((order) => (
                                <li key={order.order_number} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-bold text-emerald-950">#{order.order_number}</p>
                                        <p className="text-xs text-stone-500">
                                            {order.customer_name} · {order.created_at}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-emerald-700">{formatTaka(order.total)}</p>
                                        <StatusBadge value={order.order_status} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </DashboardPanel>

                <DashboardPanel
                    title="সাম্প্রতিক কৃষক"
                    href={adminRoutes.farmers.index.url()}
                    hrefLabel="সব কৃষক"
                >
                    {recentFarmers.length === 0 ? (
                        <Empty text="এখনও কোনো কৃষক নেই।" />
                    ) : (
                        <ul className="divide-y divide-stone-100">
                            {recentFarmers.map((farmer) => (
                                <li key={farmer.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-bold text-emerald-950">{farmer.display_name}</p>
                                        <p className="text-xs text-stone-500">
                                            {farmer.district} · {farmer.created_at}
                                        </p>
                                    </div>
                                    <StatusBadge value={farmer.approval_status} />
                                </li>
                            ))}
                        </ul>
                    )}
                </DashboardPanel>

                <DashboardPanel
                    title="সাম্প্রতিক পণ্য"
                    href={adminRoutes.products.index.url()}
                    hrefLabel="সব পণ্য"
                >
                    {recentProducts.length === 0 ? (
                        <Empty text="এখনও কোনো পণ্য নেই।" />
                    ) : (
                        <ul className="divide-y divide-stone-100">
                            {recentProducts.map((product) => (
                                <li key={product.id} className="flex items-center justify-between py-3">
                                    <p className="font-bold text-emerald-950">{product.name}</p>
                                    <div className="text-right">
                                        <p className="font-extrabold text-emerald-700">{formatTaka(product.price)}</p>
                                        <StatusBadge value={product.is_active ? 'সক্রিয়' : 'লুকানো'} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </DashboardPanel>

                <DashboardPanel
                    title="সাম্প্রতিক ব্যবহারকারী"
                    href={adminRoutes.users.index.url()}
                    hrefLabel="সব ব্যবহারকারী"
                >
                    {recentUsers.length === 0 ? (
                        <Empty text="এখনও কোনো ব্যবহারকারী নেই।" />
                    ) : (
                        <ul className="divide-y divide-stone-100">
                            {recentUsers.map((user) => (
                                <li key={user.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-bold text-emerald-950">{user.name}</p>
                                        <p className="text-xs text-stone-500">{user.email}</p>
                                    </div>
                                    <StatusBadge value={user.role} tone="stone" />
                                </li>
                            ))}
                        </ul>
                    )}
                </DashboardPanel>
            </section>
        </>
    );
}

function usePageProps<T>(): T {
    return usePage().props as unknown as T;
}

function DashboardPanel({
    title,
    href,
    hrefLabel,
    children,
}: {
    title: string;
    href: string;
    hrefLabel: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-base font-extrabold text-emerald-950">{title}</h2>
                <Link href={href} className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                    {hrefLabel} →
                </Link>
            </div>
            {children}
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return <p className="py-8 text-center text-sm text-stone-400">{text}</p>;
}