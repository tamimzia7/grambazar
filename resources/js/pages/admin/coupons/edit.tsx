import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import adminRoutes from '@/routes/admin';
import type { AdminCouponEditPageProps } from '@/types/admin';
import CouponForm from './CouponForm';

export default function AdminCouponsEdit() {
    const props = usePage().props as unknown as AdminCouponEditPageProps;
    const { coupon } = props;

    return (
        <>
            <Head title={`${coupon.code} — কুপন`} />

            <PageHeader
                title={`কুপন সম্পাদনা`}
                subtitle={`কোড: ${coupon.code}`}
                actions={
                    <Link
                        href={adminRoutes.coupons.index.url()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        ফিরে যান
                    </Link>
                }
            />

            <CouponForm mode="edit" coupon={coupon} />
        </>
    );
}
