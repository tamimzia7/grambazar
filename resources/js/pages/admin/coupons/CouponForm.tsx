import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

import adminRoutes from '@/routes/admin';
import type { AdminCouponEditPageProps } from '@/types/admin';

const inputClass =
    'h-9 w-full rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function CouponForm({
    mode,
    coupon,
}: {
    mode: 'create' | 'edit';
    coupon?: AdminCouponEditPageProps['coupon'];
}) {
    const isEdit = mode === 'edit' && coupon;

    const form = useForm({
        code: isEdit ? coupon.code : '',
        type: (isEdit ? coupon.type : 'percentage') as 'percentage' | 'fixed',
        value: isEdit ? String(coupon.value) : '',
        min_order_value:
            isEdit &&
            coupon.min_order_value !== null &&
            coupon.min_order_value !== ''
                ? String(coupon.min_order_value)
                : '',
        max_uses:
            isEdit && coupon.max_uses !== null ? String(coupon.max_uses) : '',
        starts_at: isEdit ? coupon.starts_at : '',
        expires_at: isEdit ? coupon.expires_at : '',
        is_active: isEdit ? coupon.is_active : true,
        description:
            isEdit && coupon.description !== null ? coupon.description : '',
    });

    const submit = () => {
        const options = {
            preserveScroll: true,
        };

        if (isEdit) {
            form.put(
                adminRoutes.coupons.update.url({ coupon: coupon.id }),
                options,
            );
        } else {
            form.post(adminRoutes.coupons.store.url(), options);
        }
    };

    const errorText = (key: keyof typeof form.data) =>
        form.errors[key] ? (
            <span className="text-xs font-semibold text-rose-600">
                {form.errors[key]}
            </span>
        ) : null;

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                submit();
            }}
            className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-5"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-1">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        কোড *
                    </span>
                    <input
                        type="text"
                        value={form.data.code}
                        onChange={(event) =>
                            form.setData(
                                'code',
                                event.target.value.toUpperCase(),
                            )
                        }
                        placeholder="যেমন: SAVE10"
                        className={`${inputClass} font-mono uppercase`}
                    />
                    {errorText('code')}
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        ধরন *
                    </span>
                    <select
                        value={form.data.type}
                        onChange={(event) =>
                            form.setData(
                                'type',
                                event.target.value as 'percentage' | 'fixed',
                            )
                        }
                        className={inputClass}
                    >
                        <option value="percentage">শতাংশ (%)</option>
                        <option value="fixed">নির্দিষ্ট (৳)</option>
                    </select>
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        মান *{' '}
                        {form.data.type === 'percentage' ? '(শতাংশ)' : '(টাকা)'}
                    </span>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={form.data.value}
                        onChange={(event) =>
                            form.setData('value', event.target.value)
                        }
                        placeholder={
                            form.data.type === 'percentage'
                                ? 'যেমন: 10'
                                : 'যেমন: 100'
                        }
                        className={inputClass}
                    />
                    {errorText('value')}
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        সর্বনিম্ন অর্ডার মূল্য (৳)
                    </span>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.data.min_order_value}
                        onChange={(event) =>
                            form.setData('min_order_value', event.target.value)
                        }
                        placeholder="ঐচ্ছিক"
                        className={inputClass}
                    />
                    {errorText('min_order_value')}
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        সর্বোচ্চ ব্যবহার
                    </span>
                    <input
                        type="number"
                        min="1"
                        value={form.data.max_uses}
                        onChange={(event) =>
                            form.setData('max_uses', event.target.value)
                        }
                        placeholder="সীমাহীন"
                        className={inputClass}
                    />
                    {errorText('max_uses')}
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        শুরু তারিখ
                    </span>
                    <input
                        type="date"
                        value={form.data.starts_at}
                        onChange={(event) =>
                            form.setData('starts_at', event.target.value)
                        }
                        className={inputClass}
                    />
                    {errorText('starts_at')}
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        শেষ তারিখ
                    </span>
                    <input
                        type="date"
                        value={form.data.expires_at}
                        onChange={(event) =>
                            form.setData('expires_at', event.target.value)
                        }
                        className={inputClass}
                    />
                    {errorText('expires_at')}
                </label>

                <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                        বিবরণ
                    </span>
                    <input
                        type="text"
                        value={form.data.description}
                        onChange={(event) =>
                            form.setData('description', event.target.value)
                        }
                        placeholder="সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)"
                        className={inputClass}
                    />
                </label>

                <label className="flex items-center gap-2 sm:col-span-2">
                    <input
                        type="checkbox"
                        checked={form.data.is_active}
                        onChange={(event) =>
                            form.setData('is_active', event.target.checked)
                        }
                        className="size-4 accent-emerald-600"
                    />
                    <span className="text-sm font-medium text-stone-600">
                        সক্রিয় (অবিলম্বে ব্যবহারযোগ্য)
                    </span>
                </label>
            </div>

            <button
                type="submit"
                disabled={form.processing}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
            >
                <Save className="size-4" aria-hidden="true" />
                {isEdit ? 'সংরক্ষণ করুন' : 'কুপন তৈরি করুন'}
            </button>
        </form>
    );
}
