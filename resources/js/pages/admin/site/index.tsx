import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';

import PageHeader from '@/components/admin/page-header';
import adminRoutes from '@/routes/admin';
import type { AdminSiteIndexPageProps } from '@/types/admin';

const inputClass =
    'h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

export default function AdminSiteIndex() {
    const props = usePage().props as unknown as AdminSiteIndexPageProps;
    const { groups, can } = props;

    const initial: Record<string, string> = groups
        .flatMap((group) => group.items)
        .reduce<Record<string, string>>((carry, item) => {
            carry[item.key] = item.value ?? '';
            return carry;
        }, {});

    const form = useForm({ settings: initial });

    const submit = () => {
        const settings = groups.map((group) => {
            const values: Record<string, string | null> = {};
            for (const item of group.items) {
                values[item.key] = form.data.settings[item.key] ?? null;
            }
            return values;
        });

        form.transform(() => ({ settings }));
        form.post(adminRoutes.site.update.url());
    };

    return (
        <>
            <Head title="সাইট সেটিংস" />

            <PageHeader
                title="সাইট সেটিংস"
                subtitle="হিরো, ব্র্যান্ড, যোগাযোগ ও সোশ্যাল তথ্য।"
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
                className="mx-auto max-w-3xl space-y-6"
            >
                {groups.map((group) => (
                    <section key={group.group} className="rounded-2xl border border-stone-200 bg-white">
                        <header className="border-b border-stone-100 px-5 py-4">
                            <h2 className="text-sm font-extrabold uppercase tracking-wide text-emerald-950">
                                {group.group}
                            </h2>
                        </header>
                        <div className="space-y-4 p-5">
                            {group.items.map((item) => (
                                <label key={item.key} className="block">
                                    <span className="mb-1 block text-xs font-semibold text-stone-500">
                                        {item.label}
                                    </span>
                                    <input
                                        type="text"
                                        value={form.data.settings[item.key] ?? ''}
                                        onChange={(event) =>
                                            form.setData('settings', {
                                                ...form.data.settings,
                                                [item.key]: event.target.value,
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </label>
                            ))}
                        </div>
                    </section>
                ))}

                <button
                    type="submit"
                    disabled={form.processing || !can.edit}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                    <Save className="size-4" aria-hidden="true" />
                    সংরক্ষণ করুন
                </button>
            </form>
        </>
    );
}