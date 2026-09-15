import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, FolderPlus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import PageHeader from '@/components/admin/page-header';
import StatusBadge from '@/components/admin/status-badge';
import { toBnNumber } from '@/lib/format';
import adminRoutes from '@/routes/admin';
import type { AdminCategoriesIndexPageProps, AdminCategory } from '@/types/admin';

const inputClass =
    'h-9 rounded-md border border-stone-200 bg-white px-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

const submitClass =
    'h-9 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50';

export default function AdminCategoriesIndex() {
    const props = usePage().props as unknown as AdminCategoriesIndexPageProps;
    const { categories, totalProducts } = props;
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [open, setOpen] = useState<Record<number, boolean>>({});

    const create = useForm({
        name: '',
        slug: '',
        description: '',
        parent_id: '',
        is_active: true,
        sort_order: '0',
    });

    const startCreate = () => {
        create.reset();
        create.clearErrors();
        setCreating((value) => !value);
        setEditingId(null);
    };

    return (
        <>
            <Head title="ক্যাটাগরি" />

            <PageHeader
                title="ক্যাটাগরি"
                subtitle={`মোট ${toBnNumber(totalProducts)}টি পণ্য ক্যাটাগরিতে বিন্যস্ত।`}
                actions={
                    <button
                        type="button"
                        onClick={startCreate}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        <FolderPlus className="size-4" aria-hidden="true" />
                        {creating ? 'বাতিল' : 'নতুন ক্যাটাগরি'}
                    </button>
                }
            />

            {creating ? (
                <CategoryForm
                    mode="create"
                    form={create}
                    parentOptions={categories}
                    onSubmit={() => {
                        create.post(adminRoutes.categories.store.url(), {
                            onSuccess: () => {
                                setCreating(false);
                                create.reset();
                            },
                        });
                    }}
                />
            ) : null}

            <div className="rounded-2xl border border-stone-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-500">
                            <th className="px-4 py-3">ক্যাটাগরি</th>
                            <th className="px-4 py-3">পণ্য</th>
                            <th className="px-4 py-3">স্ট্যাটাস</th>
                            <th className="px-4 py-3">ক্রম</th>
                            <th className="px-4 py-3 text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-stone-400">
                                    কোনো ক্যাটাগরি নেই। উপরে ক্লিক করে তৈরি করুন।
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <CategoryRows
                                    key={category.id}
                                    category={category}
                                    depth={0}
                                    open={open[category.id] ?? false}
                                    isEditing={editingId === category.id}
                                    onToggleOpen={() =>
                                        setOpen((value) => ({ ...value, [category.id]: !value[category.id] }))
                                    }
                                    onToggleEdit={() => setEditingId(editingId === category.id ? null : category.id)}
                                    parentOptions={categories}
                                    hasChildren={category.children.length > 0}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function CategoryRows({
    category,
    depth,
    open,
    isEditing,
    onToggleOpen,
    onToggleEdit,
    parentOptions,
    hasChildren,
}: {
    category: AdminCategory;
    depth: number;
    open: boolean;
    isEditing: boolean;
    onToggleOpen: () => void;
    onToggleEdit: () => void;
    parentOptions: AdminCategory[];
    hasChildren: boolean;
}) {
    const edit = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        parent_id: String(category.parent_id ?? ''),
        is_active: category.is_active,
        sort_order: String(category.sort_order),
    });

    const submitEdit = () => {
        edit.put(adminRoutes.categories.update.url({ category: category.id }), {
            onSuccess: onToggleEdit,
        });
    };

    return (
        <>
            <tr style={{ backgroundColor: depth === 1 ? '#fafaf9' : undefined }}>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2" style={{ paddingInlineStart: depth * 20 }}>
                        {hasChildren || category.children.length > 0 ? (
                            <button
                                type="button"
                                onClick={onToggleOpen}
                                className="grid size-5 place-items-center rounded text-stone-500 hover:bg-stone-100"
                                aria-label={open ? 'গোপন করুন' : 'প্রদর্শন করুন'}
                            >
                                {open ? (
                                    <ChevronDown className="size-4" aria-hidden="true" />
                                ) : (
                                    <ChevronRight className="size-4" aria-hidden="true" />
                                )}
                            </button>
                        ) : (
                            <span className="size-5" />
                        )}
                        <div>
                            <p className="font-bold text-emerald-950">{category.name}</p>
                            <p className="text-xs text-stone-500">/category/{category.slug}</p>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3 text-stone-600">{toBnNumber(category.products_count)}</td>
                <td className="px-4 py-3">
                    <StatusBadge value={category.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} />
                </td>
                <td className="px-4 py-3 text-stone-600">{toBnNumber(category.sort_order)}</td>
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onToggleEdit}
                            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
                        >
                            {isEditing ? 'বাতিল' : 'সম্পাদনা'}
                        </button>
                        <Link
                            href={adminRoutes.categories.toggleActive.url({ category: category.id })}
                            method="post"
                            as="button"
                            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
                        >
                            {category.is_active ? 'লুকান' : 'সক্রিয় করুন'}
                        </Link>
                        <DestructiveDelete name={category.name} href={adminRoutes.categories.destroy.url({ category: category.id })} />
                    </div>
                </td>
            </tr>

            {isEditing ? (
                <tr>
                    <td colSpan={5} className="border-b border-stone-100 bg-emerald-50/40 px-4 py-4">
                        <CategoryForm
                            mode="edit"
                            form={edit}
                            parentOptions={parentOptions.filter((parent) => parent.id !== category.id)}
                            onSubmit={submitEdit}
                        />
                    </td>
                </tr>
            ) : null}

            {open && category.children.length > 0
                ? category.children.map((child) => (
                      <CategoryRows
                          key={child.id}
                          category={child}
                          depth={1}
                          open={false}
                          isEditing={false}
                          onToggleOpen={() => undefined}
                          onToggleEdit={() => undefined}
                          parentOptions={parentOptions}
                          hasChildren={false}
                      />
                  ))
                : null}
        </>
    );
}

function CategoryForm({
    mode,
    form,
    parentOptions,
    includeParent = true,
    onSubmit,
}: {
    mode: 'create' | 'edit';
    form: {
        data: Record<string, unknown>;
        setData: (key: string, value: string | boolean) => void;
        errors: Record<string, string>;
        processing: boolean;
    };
    parentOptions: AdminCategory[];
    includeParent?: boolean;
    onSubmit: () => void;
}) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className="flex flex-wrap items-end gap-3 border-b border-stone-100 p-4"
        >
            <label className="block">
                <span className="mb-1 block text-xs font-semibold text-stone-500">নাম *</span>
                <input
                    type="text"
                    value={String(form.data.name)}
                    onChange={(event) => form.setData('name', event.target.value)}
                    required
                    placeholder="যেমন: শাক সবজি"
                    className={inputClass}
                />
            </label>
            <label className="block">
                <span className="mb-1 block text-xs font-semibold text-stone-500">স্লাগ</span>
                <input
                    type="text"
                    value={String(form.data.slug)}
                    onChange={(event) => form.setData('slug', event.target.value)}
                    placeholder="শাক-সবজি"
                    className={inputClass}
                />
            </label>
            {includeParent ? (
                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-stone-500">মূল ক্যাটাগরি</span>
                    <select
                        value={String(form.data.parent_id)}
                        onChange={(event) => form.setData('parent_id', event.target.value)}
                        className={inputClass}
                    >
                        <option value="">— মূল —</option>
                        {parentOptions.map((parent) => (
                            <option key={parent.id} value={parent.id}>
                                {parent.name}
                            </option>
                        ))}
                    </select>
                </label>
            ) : null}
            <label className="block grow basis-52">
                <span className="mb-1 block text-xs font-semibold text-stone-500">বর্ণনা</span>
                <input
                    type="text"
                    value={String(form.data.description)}
                    onChange={(event) => form.setData('description', event.target.value)}
                    placeholder="সংক্ষিপ্ত বিবরণ"
                    className={`${inputClass} w-full`}
                />
            </label>
            <label className="flex items-center gap-2 pb-1">
                <input
                    type="checkbox"
                    checked={Boolean(form.data.is_active)}
                    onChange={(event) => form.setData('is_active', event.target.checked)}
                    className="size-4 accent-emerald-600"
                />
                <span className="text-sm font-medium text-stone-600">সক্রিয়</span>
            </label>
            <button
                type="submit"
                disabled={form.processing}
                className={`${submitClass} inline-flex items-center gap-1.5`}
            >
                <Save className="size-4" aria-hidden="true" />
                {mode === 'create' ? 'তৈরি করুন' : 'সংরক্ষণ করুন'}
            </button>
        </form>
    );
}

function DestructiveDelete({ name, href }: { name: string; href: string }) {
    return (
        <Link
            href={href}
            method="delete"
            as="button"
            onClick={(event) => {
                if (!window.confirm(`"${name}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
                    event.preventDefault();
                }
            }}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
        >
            <Trash2 className="size-3.5" aria-hidden="true" />
            মুছুন
        </Link>
    );
}