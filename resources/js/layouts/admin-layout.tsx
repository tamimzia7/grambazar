import { Link, usePage } from '@inertiajs/react';
import {
    ChartColumn,
    FileClock,
    FolderTree,
    House,
    LayoutDashboard,
    ListOrdered,
    LogOut,
    Menu,
    Package,
    Settings2,
    Sprout,
    Tag,
    TicketPercent,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { home, logout } from '@/routes';
import adminRoutes from '@/routes/admin';

type NavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    match: string;
    permission?: string;
    superAdminOnly?: boolean;
};

type NavSection = {
    heading?: string;
    items: NavItem[];
};

const navSections: NavSection[] = [
    {
        items: [
            {
                label: 'ড্যাশবোর্ড',
                href: adminRoutes.dashboard.url(),
                icon: LayoutDashboard,
                match: '/admin',
            },
        ],
    },
    {
        heading: 'ব্যবস্থাপনা',
        items: [
            {
                label: 'ব্যবহারকারী',
                href: adminRoutes.users.index.url(),
                icon: Users,
                match: '/admin/users',
                permission: 'users.view',
            },
            {
                label: 'কৃষক',
                href: adminRoutes.farmers.index.url(),
                icon: Sprout,
                match: '/admin/farmers',
                permission: 'farmers.view',
            },
            {
                label: 'ক্যাটাগরি',
                href: adminRoutes.categories.index.url(),
                icon: FolderTree,
                match: '/admin/categories',
                permission: 'categories.view',
            },
            {
                label: 'পণ্য',
                href: adminRoutes.products.index.url(),
                icon: Package,
                match: '/admin/products',
                permission: 'products.view',
            },
            {
                label: 'অর্ডার',
                href: adminRoutes.orders.index.url(),
                icon: ListOrdered,
                match: '/admin/orders',
                permission: 'orders.view',
            },
            {
                label: 'কুপন',
                href: adminRoutes.coupons.index.url(),
                icon: TicketPercent,
                match: '/admin/coupons',
                permission: 'coupons.view',
            },
        ],
    },
    {
        heading: 'বিশ্লেষণ',
        items: [
            {
                label: 'রিপোর্ট',
                href: adminRoutes.reports.users.url(),
                icon: ChartColumn,
                match: '/admin/reports',
                permission: 'reports.view',
            },
            {
                label: 'অডিট লগ',
                href: adminRoutes.auditLogs.index.url(),
                icon: FileClock,
                match: '/admin/audit-logs',
                permission: 'audit.view',
            },
        ],
    },
    {
        heading: 'কনফিগারেশন',
        items: [
            {
                label: 'অ্যাডমিন অ্যাকাউন্ট',
                href: adminRoutes.admins.index.url(),
                icon: Settings2,
                match: '/admin/admins',
                permission: 'admins.manage',
                superAdminOnly: true,
            },
            {
                label: 'সাইট ম্যানেজমেন্ট',
                href: adminRoutes.site.index.url(),
                icon: Tag,
                match: '/admin/site',
                permission: 'site.manage',
            },
        ],
    },
];

function allowed(
    permissions: string[],
    item: NavItem,
    isSuperAdmin: boolean,
): boolean {
    if (item.superAdminOnly) {
        return isSuperAdmin;
    }

    if (!item.permission) {
        return true;
    }

    return permissions.includes(item.permission);
}

function isActive(url: string, match: string): boolean {
    if (match === '/admin') {
        return url === '/admin';
    }

    return url.startsWith(match);
}

function AdminNav({
    url,
    permissions,
    isSuperAdmin,
    onNavigate,
}: {
    url: string;
    permissions: string[];
    isSuperAdmin: boolean;
    onNavigate?: () => void;
}) {
    return (
        <div className="flex flex-col gap-5 pr-2">
            {navSections.map((section, index) => {
                const items = section.items.filter((item) =>
                    allowed(permissions, item, isSuperAdmin),
                );

                if (items.length === 0) {
                    return null;
                }

                return (
                    <div key={section.heading ?? index}>
                        {section.heading ? (
                            <p className="mb-1.5 px-3 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                {section.heading}
                            </p>
                        ) : null}
                        <nav className="space-y-0.5">
                            {items.map((item) => {
                                const active = isActive(url, item.match);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.match}
                                        href={item.href}
                                        prefetch
                                        onClick={onNavigate}
                                        aria-current={
                                            active ? 'page' : undefined
                                        }
                                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                                            active
                                                ? 'bg-emerald-600 text-white'
                                                : 'text-stone-600 hover:bg-emerald-50 hover:text-emerald-800'
                                        }`}
                                    >
                                        <Icon
                                            className="size-4 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                );
            })}

            <div className="mt-auto border-t border-stone-200 pt-3">
                <Link
                    href={adminRoutes.dashboard.url()}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                >
                    <House className="size-4" aria-hidden="true" />
                    দোকান দেখা
                </Link>
                <Link
                    href={logout.url()}
                    as="button"
                    method="post"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                    <LogOut className="size-4" aria-hidden="true" />
                    লগআউট
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const page = usePage();
    const { url } = page;
    const { auth, permissions } = page.props;
    const [open, setOpen] = useState(false);

    const userPermissions = Array.isArray(permissions)
        ? (permissions as string[])
        : [];
    const user = auth.user;
    const isSuperAdmin = user.role === 'super_admin';

    return (
        <div className="min-h-screen bg-stone-50">
            <header className="print-hidden sticky top-0 z-40 border-b border-stone-200 bg-white">
                <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setOpen(true)}
                        aria-label="মেনু খুলুন"
                    >
                        <Menu className="size-5" aria-hidden="true" />
                    </Button>

                    <Link
                        href={adminRoutes.dashboard.url()}
                        className="flex items-center gap-2 text-emerald-700"
                    >
                        <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white">
                            গ্রা
                        </span>
                        <span className="hidden text-lg font-extrabold text-emerald-950 sm:block">
                            গ্রামবাজার অ্যাডমিন
                        </span>
                    </Link>

                    <div className="ml-auto flex items-center gap-2">
                        <span className="hidden text-sm text-stone-500 sm:block">
                            {user.name}
                        </span>
                        <Link
                            href={home.url()}
                            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                        >
                            দোকান
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className="print-hidden sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-stone-200 bg-white p-3 lg:block">
                    <AdminNav
                        url={url}
                        permissions={userPermissions}
                        isSuperAdmin={isSuperAdmin}
                    />
                </aside>

                {open ? (
                    <div
                        className="print-hidden fixed inset-0 z-50 bg-black/40 lg:hidden"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                ) : null}

                <aside
                    className={`print-hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform overflow-y-auto bg-white p-4 shadow-2xl transition-transform lg:hidden ${
                        open ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    aria-label="অ্যাডমিন নেভিগেশন"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-lg font-extrabold text-emerald-950">
                            গ্রামবাজার অ্যাডমিন
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(false)}
                            aria-label="মেনু বন্ধ করুন"
                        >
                            <X className="size-5" aria-hidden="true" />
                        </Button>
                    </div>

                    <AdminNav
                        url={url}
                        permissions={userPermissions}
                        isSuperAdmin={isSuperAdmin}
                        onNavigate={() => setOpen(false)}
                    />
                </aside>

                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
