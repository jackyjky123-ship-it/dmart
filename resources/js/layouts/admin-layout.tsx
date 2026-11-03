import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Tags,
    Settings,
    Store,
    Menu,
    X,
    Search,
    Calendar,
    ChevronDown,
    LogOut,
    PanelLeftClose,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminNavProps {
    currentPath: string;
    onNavClick?: () => void;
    onToggleCollapse?: () => void;
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
    sidebarOpen?: boolean;
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

function getPageMeta(path: string) {
    if (path === '/admin') return { title: 'Dashboard', icon: LayoutDashboard };
    if (path.startsWith('/admin/orders'))
        return { title: 'Orders', icon: ShoppingBag };
    if (path.startsWith('/admin/products'))
        return { title: 'Products', icon: Package };
    if (path.startsWith('/admin/stock'))
        return { title: 'Stock & Inventory', icon: BarChart3 };
    if (path.startsWith('/admin/categories'))
        return { title: 'Categories', icon: Tags };
    if (path.startsWith('/admin/staff')) return { title: 'Staff', icon: Users };
    if (path.startsWith('/admin/settings'))
        return { title: 'Settings', icon: Settings };
    return { title: 'Admin', icon: LayoutDashboard };
}

function AdminSidebar({
    currentPath,
    onNavClick,
    onToggleCollapse,
}: AdminNavProps) {
    const { t } = useTranslation();

    return (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar text-foreground select-none">
            {/* Brand Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <Link href="/admin" className="group flex items-center gap-3">
                    <img
                        src="/images/admin_icon.png"
                        alt="DMart Admin"
                        className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
                    />
                    <div>
                        <div className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-foreground">
                            <span>DMART</span>
                            <span className="py-0.2 rounded border border-[#F25623]/20 bg-[#F25623]/10 px-1.5 font-mono text-[10px] font-semibold text-[#F25623]">
                                ADMIN
                            </span>
                        </div>
                        <div className="font-mono text-[10px] tracking-wider text-muted-foreground">
                            {t('Back Office Console')}
                        </div>
                    </div>
                </Link>

                {onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={onToggleCollapse}
                        className="hidden h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
                        title={t('Close sidebar (⌘B)')}
                        aria-label={t('Close sidebar')}
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Navigation links */}
            <div className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? currentPath === item.href
                        : currentPath.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavClick}
                            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                                isActive
                                    ? 'border border-border bg-muted text-[#F25623] shadow-inner'
                                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <Icon
                                    className={`h-4 w-4 ${isActive ? 'text-[#F25623]' : 'text-muted-foreground'}`}
                                />
                                <span>{t(item.label)}</span>
                            </span>
                        </Link>
                    );
                })}

                <div className="my-3 space-y-1 border-t border-border pt-4">
                    <Link
                        href="/admin/settings"
                        onClick={onNavClick}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                            currentPath.startsWith('/admin/settings')
                                ? 'border border-border bg-muted text-[#F25623]'
                                : 'text-muted-foreground hover:bg-card hover:text-foreground'
                        }`}
                    >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>{t('Settings')}</span>
                    </Link>
                </div>
            </div>

            {/* Quick Portals & Language in Sidebar */}
            <div className="space-y-2.5 border-t border-border bg-sidebar p-4">
                <div className="flex items-center justify-between pb-1">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                        {t('Language')}
                    </span>
                    <LanguageSwitcher variant="toggle" />
                </div>
                <div className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    {t('Quick Portals')}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-[#F25623] hover:text-[#F25623]"
                    >
                        <img
                            src="/images/dmart_icon.png"
                            alt=""
                            className="h-3.5 w-3.5 object-contain"
                        />
                        <span>{t('Storefront')}</span>
                    </Link>
                    <Link
                        href="/pos"
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-[#F25623] hover:text-[#F25623]"
                    >
                        <img
                            src="/images/pos_icon.png"
                            alt=""
                            className="h-3.5 w-3.5 object-contain"
                        />
                        <span>{t('POS Term')}</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url, props } = usePage<AdminPageProps>();
    const { t } = useTranslation();

    const initialOpen =
        typeof props.sidebarOpen === 'boolean' ? props.sidebarOpen : true;
    const [sidebarOpen, setSidebarOpen] = useState(initialOpen);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [search, setSearch] = useState('');
    const user = props.auth?.user;

    const pageMeta = getPageMeta(url);
    const PageIcon = pageMeta.icon;

    // Load initial preference from localStorage if available
    useEffect(() => {
        const stored = localStorage.getItem('admin_sidebar_open');
        if (stored !== null) {
            setSidebarOpen(stored === 'true');
        }
    }, []);

    // Toggle sidebar function
    const toggleSidebar = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setMobileOpen((prev) => !prev);
            return;
        }

        setSidebarOpen((prev) => {
            const next = !prev;
            if (typeof document !== 'undefined') {
                document.cookie = `sidebar_state=${next}; path=/; max-age=604800`;
                localStorage.setItem('admin_sidebar_open', String(next));
            }
            return next;
        });
    };

    // Keyboard shortcut (⌘B or Ctrl+B)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/orders',
            search.trim() ? { search: search.trim() } : {},
        );
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-[#F25623] selection:text-white">
            {/* Desktop Collapsible Sidebar */}
            <div
                className={cn(
                    'sticky top-0 z-20 hidden h-screen shrink-0 transition-[width] duration-300 ease-in-out lg:block',
                    sidebarOpen ? 'w-64' : 'w-0 overflow-hidden',
                )}
            >
                <div className="h-full w-64">
                    <AdminSidebar
                        currentPath={url}
                        onToggleCollapse={toggleSidebar}
                    />
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-50 flex h-full w-64 max-w-[80vw] flex-col bg-background shadow-2xl">
                        <div className="absolute top-4 right-4">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setMobileOpen(false)}
                                className="text-foreground hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <AdminSidebar
                            currentPath={url}
                            onNavClick={() => setMobileOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Main Area */}
            <div className="flex min-w-0 flex-1 flex-col transition-all duration-300">
                {/* Admin Navbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
                    {/* Left: Breadcrumb with conditional sidebar toggle icon */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8.5 w-8.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
                            onClick={toggleSidebar}
                            aria-label={t('Toggle sidebar')}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-2.5">
                            {/* Breadcrumb icon: hidden when sidebar is open on desktop, shown when closed */}
                            <div
                                className={cn(
                                    'flex items-center overflow-hidden transition-all duration-200 ease-in-out',
                                    sidebarOpen
                                        ? 'lg:pointer-events-none lg:-mr-2.5 lg:w-0 lg:opacity-0'
                                        : 'w-8 opacity-100',
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={toggleSidebar}
                                    title={t('Open sidebar (⌘B)')}
                                    aria-label={t('Open sidebar')}
                                    className="group flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-muted text-[#F25623] shadow-inner transition-all hover:border-[#F25623]/60 hover:bg-muted"
                                >
                                    <PageIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                                </button>
                            </div>

                            <h1 className="text-xs font-bold tracking-tight text-foreground sm:text-sm">
                                {t(pageMeta.title)}
                            </h1>
                        </div>
                    </div>

                    {/* Center: Sleek Quick Search */}
                    <div className="mx-auto hidden max-w-xs flex-1 items-center md:flex">
                        <form
                            onSubmit={handleSearch}
                            className="relative w-full"
                        >
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('Quick search orders...')}
                                className="h-8.5 w-full rounded-lg border border-border bg-muted pr-3 pl-8.5 text-xs text-foreground transition-colors placeholder:text-muted-foreground focus:border-[#F25623] focus:outline-none"
                            />
                        </form>
                    </div>

                    {/* Right: Date, Portals, Theme & User Menu */}
                    <div className="flex shrink-0 items-center gap-2 text-xs sm:gap-2.5">
                        {/* Live Date Pill */}
                        <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground sm:flex">
                            <Calendar className="h-3.5 w-3.5 text-[#F25623]" />
                            <span>{props.today ?? t('Today')}</span>
                        </div>

                        {/* Language Switcher */}
                        <LanguageSwitcher variant="compact" align="end" />

                        {/* Portals Switcher Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8.5 gap-1.5 rounded-lg border border-border bg-muted px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                                    title={t('Switch workspace portal')}
                                >
                                    <Store className="h-3.5 w-3.5 text-[#F25623]" />
                                    <span className="hidden xl:inline">
                                        {t('Portals')}
                                    </span>
                                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl border border-border bg-card p-1.5 text-foreground shadow-2xl"
                            >
                                <DropdownMenuLabel className="px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                                    {t('Switch Portal')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-muted" />
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                >
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2.5 px-2.5 py-2"
                                    >
                                        <img
                                            src="/images/dmart_icon.png"
                                            alt=""
                                            className="h-4 w-4 shrink-0 object-contain"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-foreground">
                                                {t('Storefront')}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {t(
                                                    'Streetwear drops & catalog',
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                >
                                    <Link
                                        href="/pos"
                                        className="flex items-center gap-2.5 px-2.5 py-2"
                                    >
                                        <img
                                            src="/images/pos_icon.png"
                                            alt=""
                                            className="h-4 w-4 shrink-0 object-contain"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-foreground">
                                                {t('POS Cashier Terminal')}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {t(
                                                    'Cashier register & checkout',
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Theme Toggle */}
                        <ThemeToggle className="h-8.5 w-8.5 border border-border bg-muted text-muted-foreground hover:bg-muted hover:text-foreground" />

                        {/* Admin User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg border border-border bg-muted py-1 pr-2 pl-1.5 transition-colors hover:bg-muted focus:outline-none sm:pr-2.5 sm:pl-2"
                                >
                                    <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-[#F25623] text-xs font-bold text-white shadow-xs">
                                        {(user?.name ?? 'A')
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div className="hidden text-left sm:block">
                                        <div className="max-w-[100px] truncate text-xs leading-tight font-semibold text-foreground">
                                            {user?.name ?? t('Admin')}
                                        </div>
                                        <div className="font-mono text-[9px] leading-none text-[#F25623]">
                                            {t('ADMIN')}
                                        </div>
                                    </div>
                                    <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl border border-border bg-card p-1.5 text-foreground shadow-2xl"
                            >
                                <div className="border-b border-border px-3 py-2">
                                    <p className="truncate text-xs font-semibold text-foreground">
                                        {user?.name ?? t('Admin User')}
                                    </p>
                                    <p className="truncate text-[10px] text-muted-foreground">
                                        {user?.email ?? 'admin@dmart.test'}
                                    </p>
                                    <span className="mt-1 inline-block rounded border border-[#F25623]/30 bg-[#F25623]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#F25623]">
                                        {t('SYSTEM ADMINISTRATOR')}
                                    </span>
                                </div>
                                <div className="py-1">
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                    >
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs"
                                        >
                                            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{t('Store Settings')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                    >
                                        <Link
                                            href="/pos"
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs"
                                        >
                                            <img
                                                src="/images/pos_icon.png"
                                                alt=""
                                                className="h-3.5 w-3.5 object-contain"
                                            />
                                            <span>
                                                {t('Launch POS Terminal')}
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                    >
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs"
                                        >
                                            <img
                                                src="/images/dmart_icon.png"
                                                alt=""
                                                className="h-3.5 w-3.5 object-contain"
                                            />
                                            <span>{t('View Storefront')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </div>
                                <DropdownMenuSeparator className="bg-muted" />
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 focus:bg-rose-950/30"
                                >
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        <span>{t('Sign Out')}</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
