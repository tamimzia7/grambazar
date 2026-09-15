import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import adminRoutes from '@/routes/admin';

const inputClass =
    'h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminAdminsCreate() {
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        is_active: true,
    });

    const errorText = (key: keyof typeof form.data) =>
        form.errors[key] ? (
            <span className="text-xs font-semibold text-rose-600">
                {form.errors[key]}
            </span>
        ) : null;

    return (
        <>
            <Head title="নতুন অ্যাডমিন" />

            <PageHeader
                title="নতুন অ্যাডমিন"
                subtitle="ভূমিকা স্বয়ংক্রিয়ভাবে Admin থাকবে এবং সম্পূর্ণ অনুমতি অ্যাডমিন রোল থেকে নেয়া হবে।"
                actions={
                    <Link
                        href={adminRoutes.admins.index.url()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        ফিরে যান
                    </Link>
                }
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(adminRoutes.admins.store.url());
                }}
                className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-5"
            >
                <div className="space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            নাম *
                        </span>
                        <input
                            type="text"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            placeholder="পূর্ণ নাম"
                            className={inputClass}
                        />
                        {errorText('name')}
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            ইমেইল *
                        </span>
                        <input
                            type="email"
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            placeholder="admin@example.com"
                            className={inputClass}
                        />
                        {errorText('email')}
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            ফোন
                        </span>
                        <input
                            type="text"
                            value={form.data.phone}
                            onChange={(event) =>
                                form.setData('phone', event.target.value)
                            }
                            placeholder="01XXXXXXXXX"
                            className={inputClass}
                        />
                        {errorText('phone')}
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-stone-500">
                            পাসওয়ার্ড *
                        </span>
                        <input
                            type="password"
                            value={form.data.password}
                            onChange={(event) =>
                                form.setData('password', event.target.value)
                            }
                            placeholder="সর্বনিম্ন ৮ অক্ষর"
                            className={inputClass}
                        />
                        {errorText('password')}
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(event) =>
                                form.setData('is_active', event.target.checked)
                            }
                            className="size-4 accent-emerald-600"
                        />
                        <span className="text-sm font-medium text-stone-600">
                            সক্রিয় (লগইনযোগ্য)
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-md bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                    <Save className="size-4" aria-hidden="true" />
                    অ্যাডমিন তৈরি করুন
                </button>
            </form>
        </>
    );
}
