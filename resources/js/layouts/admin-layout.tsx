import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Megaphone,
    Settings,
    HelpCircle,
    Store,
    Terminal,
    Sun,
    Moon,
    Menu,
    X,
    ExternalLink,
    Bell,
    Calendar,
    Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminNavProps {
    currentPath: string;
    onNavClick?: () => void;
}

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '8' },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Customers', href: '/admin/staff', icon: Users },
    { label: 'Analysis', href: '/admin/stock', icon: BarChart3 },
    { label: 'Marketing', href: '/admin/categories', icon: Megaphone },
];

function AdminSidebar({ currentPath, onNavClick }: AdminNavProps) {
    return (
        <aside className="w-64 border-r border-[#242424] bg-[#141414] text-white flex flex-col h-full shrink-0">
            {/* Metric Flow / Brand Header */}
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

            {/* Navigation links */}
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
                            {item.badge && (
                                <span className="bg-[#2a2a2a] text-[#F25623] text-[10px] px-2 py-0.5 font-mono font-bold rounded-full border border-[#333]">
                                    {item.badge}
                                </span>
                            )}
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

                    <button
                        type="button"
                        onClick={() => alert('DMart Help Center: Contact support@dmart.test')}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-all text-left"
                    >
                        <HelpCircle className="w-4 h-4 text-[#737373]" />
                        <span>Help Center</span>
                    </button>
                </div>
            </div>

            {/* Bottom Quick Switchers */}
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
    const { url } = usePage();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="min-h-screen flex bg-[#171717] text-white selection:bg-[#F25623] selection:text-white">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
                <AdminSidebar currentPath={url} />
            </div>

            {/* Mobile Sidebar */}
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

            {/* Right Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Admin Top Bar (Inspired by admin_dashboard_ref.png) */}
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

                        {/* Top Search Pill */}
                        <div className="relative w-full">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full h-9 pl-10 pr-4 rounded-full border border-[#2d2d2d] bg-[#222222] text-xs text-white placeholder:text-[#666] focus:outline-none focus:border-[#F25623]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        {/* Current Date Display */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#222222] border border-[#2d2d2d] text-xs text-[#d4d4d4] font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#F25623]" />
                            <span>Wed, 29 May 2024</span>
                        </div>

                        {/* Notification Bell */}
                        <button
                            type="button"
                            className="relative w-9 h-9 rounded-full bg-[#222222] border border-[#2d2d2d] text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F25623]" />
                        </button>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleTheme}
                            className="text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                            aria-label="Toggle theme"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-[#a3a3a3]" />
                            )}
                        </Button>

                        {/* User Avatar */}
                        <div className="flex items-center gap-2 pl-2 border-l border-[#2d2d2d]">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                alt="Admin User"
                                className="w-8 h-8 rounded-full object-cover border border-[#444]"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content Container */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
