import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Tags,
    Settings,
    Store,
    Terminal,
    Menu,
    X,
    Search,
    Calendar,
} from 'lucide-react';

interface AdminNavProps {
    currentPath: string;
    onNavClick?: () => void;
}

interface AdminPageProps {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role?: string;
        } | null;
    };
    today?: string;
    [key: string]: unknown;
}

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Stock', href: '/admin/stock', icon: BarChart3 },
    { label: 'Categories', href: '/admin/categories', icon: Tags },
    { label: 'Staff', href: '/admin/staff', icon: Users },
];

function AdminSidebar({ currentPath, onNavClick }: AdminNavProps) {
    return (
        <aside className="w-64 border-r border-[#242424] bg-[#141414] text-white flex flex-col h-full shrink-0">
            <div className="h-18 px-6 border-b border-[#242424] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F25623] text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#F25623]/25">
                        <div className="w-3.5 h-3.5 border-2 border-white rotate-45" />
                    </div>
                    <div>
                        <div className="font-bold tracking-tight text-white text-sm">
                            Metric Flow
                        </div>
                        <div className="text-[10px] text-[#737373] uppercase tracking-wider font-mono">
                            DMART BACK OFFICE
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact ? currentPath === item.href : currentPath.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavClick}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                isActive
                                    ? 'bg-[#222222] text-[#F25623] border border-[#333333] shadow-inner'
                                    : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F25623]' : 'text-[#737373]'}`} />
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    );
                })}

                <div className="pt-6 border-t border-[#222222] my-4 space-y-1.5">
                    <Link
                        href="/admin/settings"
                        onClick={onNavClick}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            currentPath.startsWith('/admin/settings')
                                ? 'bg-[#222222] text-[#F25623]'
                                : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                    >
                        <Settings className="w-4 h-4 text-[#737373]" />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>

            <div className="p-4 border-t border-[#242424] bg-[#111] space-y-3">
                <div className="text-[10px] font-bold text-[#666] uppercase tracking-wider font-mono">
                    Quick Portals
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold bg-[#1c1c1c] border border-[#2d2d2d] hover:border-[#F25623] hover:text-[#F25623] transition-colors text-white"
                    >
                        <Store className="w-3.5 h-3.5 text-[#F25623]" />
                        <span>Storefront</span>
                    </Link>
                    <Link
                        href="/pos"
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold bg-[#1c1c1c] border border-[#2d2d2d] hover:border-blue-400 hover:text-blue-400 transition-colors text-white"
                    >
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span>POS Term</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { url, props } = usePage<AdminPageProps>();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [search, setSearch] = useState('');
    const user = props.auth?.user;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/orders', search.trim() ? { search: search.trim() } : {});
    };

    return (
        <div className="dark min-h-screen flex bg-[#171717] text-white selection:bg-[#F25623] selection:text-white">
            <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
                <AdminSidebar currentPath={url} />
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 max-w-[80vw] bg-[#141414] z-50 flex flex-col h-full shadow-2xl">
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)} className="text-white">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <AdminSidebar currentPath={url} onNavClick={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-18 border-b border-[#242424] bg-[#171717]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="lg:hidden text-white hover:bg-[#222]"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search orders..."
                                className="w-full h-9 pl-10 pr-4 rounded-full border border-[#2d2d2d] bg-[#222222] text-xs text-white placeholder:text-[#666] focus:outline-none focus:border-[#F25623]"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#222222] border border-[#2d2d2d] text-xs text-[#d4d4d4] font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#F25623]" />
                            <span>{props.today ?? 'Today'}</span>
                        </div>

                        <div className="flex items-center gap-2 pl-2 border-l border-[#2d2d2d]">
                            <div className="w-8 h-8 rounded-full bg-[#F25623] text-white flex items-center justify-center text-xs font-bold">
                                {(user?.name ?? 'A').charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden md:block">
                                <div className="text-xs font-semibold text-white leading-tight">{user?.name ?? 'Admin'}</div>
                                <div className="text-[10px] text-[#737373]">Administrator</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
