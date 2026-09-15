import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import adminRoutes from '@/routes/admin';
import type { AdminPermissionsPageProps } from '@/types/admin';

export default function AdminAdminsPermissions() {
    const props = usePage().props as unknown as AdminPermissionsPageProps;
    const { admin, groups, granted } = props;

    const form = useForm({ permissions: [...granted] });

    const toggle = (name: string) => {
        const next = form.data.permissions.includes(name)
            ? form.data.permissions.filter((item) => item !== name)
            : [...form.data.permissions, name];

        form.setData('permissions', next);
    };

    const submit = () => {
        form.put(
            adminRoutes.admins.updatePermissions.url({ admin_user: admin.id }),
        );
    };

    return (
        <>
            <Head title="অনুমতি — অ্যাডমিন রোল" />

            <PageHeader
                title="অ্যাডমিন রোলের অনুমতি"
                subtitle={`এই গ্রান্ট সকল অ্যাডমিন অ্যাকাউন্টে প্রযোজ্য। দেখছেন: ${admin.name}`}
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
                    submit();
                }}
                className="mx-auto max-w-3xl"
            >
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-5 py-3">
                    <p className="text-sm font-semibold text-stone-600">
                        নির্বাচিত:{' '}
                        <span className="font-extrabold text-emerald-800">
                            {form.data.permissions.length}
                        </span>
                        টি অনুমতি
                    </p>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                        <Save className="size-4" aria-hidden="true" />
                        সংরক্ষণ করুন
                    </button>
                </div>

                {groups.map((group) => (
                    <section
                        key={group.group}
                        className="mb-4 rounded-2xl border border-stone-200 bg-white"
                    >
                        <header className="border-b border-stone-100 px-5 py-3">
                            <h2 className="text-sm font-extrabold tracking-wide text-emerald-950 uppercase">
                                {group.group}
                            </h2>
                        </header>
                        <ul className="divide-y divide-stone-100">
                            {group.permissions.map((permission) => (
                                <li key={permission.name}>
                                    <label className="flex cursor-pointer items-center gap-3 px-5 py-3 hover:bg-emerald-50/40">
                                        <input
                                            type="checkbox"
                                            checked={form.data.permissions.includes(
                                                permission.name,
                                            )}
                                            onChange={() =>
                                                toggle(permission.name)
                                            }
                                            className="size-4 accent-emerald-600"
                                        />
                                        <span className="text-sm font-semibold text-stone-700">
                                            {permission.label}
                                        </span>
                                        <code className="ml-auto rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-500">
                                            {permission.name}
                                        </code>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </form>
        </>
    );
}
