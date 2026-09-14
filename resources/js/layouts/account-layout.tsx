import { Link, usePage } from '@inertiajs/react';
import { KeyRound, LayoutDashboard, LogOut, Package, User } from 'lucide-react';

import accountRoutes from '@/routes/account';
import { logout } from '@/routes';

const navItems = [
    {
        label: 'ড্যাশবোর্ড',
        href: accountRoutes.dashboard.url(),
        icon: LayoutDashboard,
        match: '/account',
    },
    {
        label: 'আমার অর্ডার',
        href: accountRoutes.orders.index.url(),
        icon: Package,
        match: '/account/orders',
    },
    {
        label: 'প্রোফাইল',
        href: accountRoutes.profile.url(),
        icon: User,
        match: '/account/profile',
    },
    {
        label: 'পাসওয়ার্ড পরিবর্তন',
        href: accountRoutes.password.url(),
        icon: KeyRound,
        match: '/account/password',
    },
];

function isActive(url: string, match: string): boolean {
    if (match === '/account') {
        return url === '/account';
    }

    return url.startsWith(match);
}

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url } = usePage();

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-emerald-950">আমার অ্যাকাউন্ট</h1>

            <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
                <aside className="hidden lg:block">
                    <nav
                        aria-label="অ্যাকাউন্ট নেভিগেশন"
                        className="space-y-1 rounded-2xl border border-stone-100 bg-white p-3"
                    >
                        {navItems.map((item) => {
                            const active = isActive(url, item.match);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.match}
                                    href={item.href}
                                    prefetch
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-stone-600 hover:bg-emerald-50 hover:text-emerald-800'
                                    }`}
                                >
                                    <Icon
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <Link
                            href={logout.url()}
                            as="button"
                            method="post"
                            className="mt-3 flex w-full items-center gap-2.5 rounded-xl border-t border-stone-100 px-3 pt-3 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
                        >
                            <LogOut className="size-4" aria-hidden="true" />
                            লগআউট
                        </Link>
                    </nav>
                </aside>

                <nav
                    aria-label="অ্যাকাউন্ট নেভিগেশন"
                    className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden"
                >
                    {navItems.map((item) => {
                        const active = isActive(url, item.match);

                        return (
                            <Link
                                key={item.match}
                                href={item.href}
                                prefetch
                                aria-current={active ? 'page' : undefined}
                                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                    active
                                        ? 'bg-emerald-600 text-white'
                                        : 'border border-stone-200 bg-white text-stone-600'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}
