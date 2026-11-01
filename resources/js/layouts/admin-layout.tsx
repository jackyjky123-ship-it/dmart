import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingBag,
    Boxes,
    Users,
    Settings,
    Store,
    Terminal,
    Sun,
    Moon,
    Menu,
    X,
    Shield,
    ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminNavProps {
    currentPath: string;
    onNavClick?: () => void;
}

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Tags },
    { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag, badge: '5' },
    { label: 'Stock & Ledger', href: '/admin/stock', icon: Boxes, badgeAlert: true },
    { label: 'Staff Management', href: '/admin/staff', icon: Users },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
];

function AdminSidebar({ currentPath, onNavClick }: AdminNavProps) {
    return (
        <aside className="w-64 border-r bg-card flex flex-col h-full shrink-0">
            {/* Admin Header */}
            <div className="h-16 px-6 border-b flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    D
                </div>
                <div>
                    <div className="font-extrabold tracking-tight text-foreground text-sm flex items-center gap-1.5">
                        DMart Admin
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            v1.0
                        </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                        Back Office &bull; Ops
                    </div>
                </div>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <div className="px-3 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Store Operations
                </div>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact ? currentPath === item.href : currentPath.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavClick}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-semibold shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-muted-foreground'}`} />
                                {item.label}
                            </span>
                            {item.badge && (
                                <Badge className="bg-purple-600 text-white text-[10px] px-1.5 py-0 font-bold">
                                    {item.badge}
                                </Badge>
                            )}
                            {item.badgeAlert && (
                                <span className="w-2 h-2 rounded-full bg-amber-500" title="Low stock alert" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Quick Switchers */}
            <div className="p-3 border-t bg-muted/20 space-y-2">
                <div className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Portals
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-background border hover:bg-muted transition-colors text-emerald-700 dark:text-emerald-400"
                    >
                        <Store className="w-3.5 h-3.5" />
                        <span>Store</span>
                    </Link>
                    <Link
                        href="/pos"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-background border hover:bg-muted transition-colors text-blue-700 dark:text-blue-400"
                    >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>POS</span>
                    </Link>
                </div>
                <div className="pt-2 border-t flex items-center justify-between px-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                            AM
                        </div>
                        <span className="font-medium text-[11px] truncate max-w-[120px]">admin@dmart.test</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] py-0">Admin</Badge>
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
        <div className="min-h-screen flex bg-background text-foreground selection:bg-purple-100 selection:text-purple-900">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
                <AdminSidebar currentPath={url} />
            </div>

            {/* Mobile Sheet/Overlay Sidebar */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 max-w-[80vw] bg-card z-50 flex flex-col h-full shadow-2xl">
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="h-8 w-8">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <AdminSidebar currentPath={url} onNavClick={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            {/* Right Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Admin Top Bar */}
                <header className="h-16 border-b bg-card px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-9 w-9"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Shield className="w-3.5 h-3.5 text-purple-600" />
                            <span>Admin</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="font-semibold text-foreground capitalize">
                                {url === '/admin' ? 'Dashboard' : url.replace('/admin/', '').split('/')[0]}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                            {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                        </Button>
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
