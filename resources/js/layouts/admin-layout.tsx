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
    ExternalLink,
    Bell,
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
        <aside className="w-64 border-r border-border/60 bg-card/90 backdrop-blur-xl flex flex-col h-full shrink-0">
            {/* Admin Header */}
            <div className="h-16 px-5 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-purple-600/30">
                        D
                    </div>
                    <div>
                        <div className="font-extrabold tracking-tight text-foreground text-sm flex items-center gap-1.5">
                            DMart Admin
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold">
                                Ops
                            </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                            Back Office System
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <div className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                                isActive
                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-semibold shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-muted-foreground'}`} />
                                <span>{item.label}</span>
                            </span>
                            {item.badge && (
                                <Badge className="bg-purple-600 text-white text-[10px] px-1.5 py-0 font-bold rounded-md">
                                    {item.badge}
                                </Badge>
                            )}
                            {item.badgeAlert && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Low stock alert" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Quick Switchers */}
            <div className="p-3 border-t border-border/60 bg-muted/20 space-y-2.5">
                <div className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Quick Portals
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-background border border-border/80 hover:bg-muted transition-colors text-emerald-700 dark:text-emerald-400"
                    >
                        <Store className="w-3.5 h-3.5" />
                        <span>Storefront</span>
                    </Link>
                    <Link
                        href="/pos"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-background border border-border/80 hover:bg-muted transition-colors text-blue-700 dark:text-blue-400"
                    >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>POS Term</span>
                    </Link>
                </div>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between px-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                            AM
                        </div>
                        <span className="font-medium text-[11px] truncate max-w-[120px]">admin@dmart.test</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] py-0 border-purple-200 dark:border-purple-900 text-purple-600">
                        Admin
                    </Badge>
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 max-w-[80vw] bg-card z-50 flex flex-col h-full shadow-2xl">
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)}>
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
                <header className="h-16 border-b border-border/60 bg-card/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="lg:hidden"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Shield className="w-3.5 h-3.5 text-purple-600" />
                            <span>Admin</span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                            <span className="font-semibold text-foreground capitalize">
                                {url === '/admin' ? 'Dashboard' : url.replace('/admin/', '').split('/')[0]}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="xs" className="hidden sm:inline-flex rounded-lg gap-1 text-xs">
                            <Link href="/">
                                <Store className="w-3 h-3 text-emerald-600" />
                                <span>Preview Store</span>
                                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-muted-foreground" />
                            )}
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