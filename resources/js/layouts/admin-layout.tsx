import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
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
    Terminal,
    Menu,
    X,
    Search,
    Calendar,
    Sun,
    Moon,
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
    if (path.startsWith('/admin/orders')) return { title: 'Orders', icon: ShoppingBag };
    if (path.startsWith('/admin/products')) return { title: 'Products', icon: Package };
    if (path.startsWith('/admin/stock')) return { title: 'Stock & Inventory', icon: BarChart3 };
    if (path.startsWith('/admin/categories')) return { title: 'Categories', icon: Tags };
    if (path.startsWith('/admin/staff')) return { title: 'Staff', icon: Users };
    if (path.startsWith('/admin/settings')) return { title: 'Settings', icon: Settings };
    return { title: 'Admin', icon: LayoutDashboard };
}

function AdminSidebar({ currentPath, onNavClick, onToggleCollapse }: AdminNavProps) {
    return (
        <aside className="w-64 border-r border-[#242424] bg-[#141414] text-white flex flex-col h-full shrink-0 select-none">
            {/* Brand Header */}
            <div className="h-16 px-5 border-b border-[#242424] flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-[#F25623] text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#F25623]/25 group-hover:scale-105 transition-transform">
                        D
                    </div>
                    <div>
                        <div className="font-bold tracking-tight text-white text-sm flex items-center gap-1.5">
                            <span>DMART</span>
                            <span className="text-[#F25623] font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#F25623]/10 border border-[#F25623]/20">
                                ADMIN
                            </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono tracking-wider">
                            Back Office Console
                        </div>
                    </div>
                </Link>

                {onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={onToggleCollapse}
                        className="text-zinc-400 hover:text-white hover:bg-[#242424] border border-[#2d2d2d] rounded-lg h-7 w-7 hidden lg:flex items-center justify-center transition-colors"
                        title="Close sidebar (⌘B)"
                        aria-label="Close sidebar"
                    >
                        <PanelLeftClose className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
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
                                    : 'text-zinc-400 hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F25623]' : 'text-zinc-500'}`} />
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    );
                })}

                <div className="pt-4 border-t border-[#222222] my-3 space-y-1">
                    <Link
                        href="/admin/settings"
                        onClick={onNavClick}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            currentPath.startsWith('/admin/settings')
                                ? 'bg-[#222222] text-[#F25623] border border-[#333333]'
                                : 'text-zinc-400 hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                    >
                        <Settings className="w-4 h-4 text-zinc-500" />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>

            {/* Quick Portals in Sidebar */}
            <div className="p-4 border-t border-[#242424] bg-[#111111] space-y-2.5">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
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
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold bg-[#1c1c1c] border border-[#2d2d2d] hover:border-[#F25623] hover:text-[#F25623] transition-colors text-white"
                    >
                        <img src="/images/pos_icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>POS Term</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { url, props } = usePage<AdminPageProps>();
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const initialOpen = typeof props.sidebarOpen === 'boolean' ? props.sidebarOpen : true;
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
        router.get('/admin/orders', search.trim() ? { search: search.trim() } : {});
    };

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="dark min-h-screen flex bg-[#171717] text-white selection:bg-[#F25623] selection:text-white">
            {/* Desktop Collapsible Sidebar */}
            <div
                className={cn(
                    'hidden lg:block shrink-0 sticky top-0 h-screen transition-[width] duration-300 ease-in-out z-20',
                    sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
                )}
            >
                <div className="w-64 h-full">
                    <AdminSidebar
                        currentPath={url}
                        onToggleCollapse={toggleSidebar}
                    />
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 max-w-[80vw] bg-[#141414] z-50 flex flex-col h-full shadow-2xl">
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)} className="text-white hover:bg-[#242424]">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <AdminSidebar currentPath={url} onNavClick={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Admin Navbar */}
                <header className="h-16 border-b border-[#242424] bg-[#171717]/95 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
                    {/* Left: Breadcrumb with conditional sidebar toggle icon */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="lg:hidden text-zinc-300 hover:text-white hover:bg-[#242424] rounded-lg h-8.5 w-8.5"
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-2.5">
                            {/* Breadcrumb icon: hidden when sidebar is open on desktop, shown when closed */}
                            <div
                                className={cn(
                                    'transition-all duration-200 ease-in-out overflow-hidden flex items-center',
                                    sidebarOpen ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none lg:-mr-2.5' : 'w-8 opacity-100'
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={toggleSidebar}
                                    title="Open sidebar (⌘B)"
                                    aria-label="Open sidebar"
                                    className="group w-8 h-8 rounded-lg bg-[#222222] border border-[#2d2d2d] hover:border-[#F25623]/60 hover:bg-[#282828] flex items-center justify-center text-[#F25623] shadow-inner shrink-0 cursor-pointer transition-all"
                                >
                                    <PageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>

                            <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                                {pageMeta.title}
                            </h1>
                        </div>
                    </div>

                    {/* Center: Sleek Quick Search */}
                    <div className="hidden md:flex items-center flex-1 max-w-xs mx-auto">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Quick search orders..."
                                className="w-full h-8.5 pl-8.5 pr-3 rounded-lg border border-[#2d2d2d] bg-[#202020] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#F25623] transition-colors"
                            />
                        </form>
                    </div>

                    {/* Right: Date, Portals, Theme & User Menu */}
                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 text-xs">
                        {/* Live Date Pill */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#202020] border border-[#2d2d2d] text-xs text-zinc-300 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-[#F25623]" />
                            <span>{props.today ?? 'Today'}</span>
                        </div>

                        {/* Portals Switcher Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8.5 px-2.5 rounded-lg border border-[#2d2d2d] bg-[#202020] text-zinc-300 hover:text-white hover:bg-[#282828] text-xs gap-1.5"
                                    title="Switch workspace portal"
                                >
                                    <Store className="w-3.5 h-3.5 text-[#F25623]" />
                                    <span className="hidden xl:inline">Portals</span>
                                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 border border-[#333] bg-[#1a1a1a] text-white shadow-2xl">
                                <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 px-2.5 py-1.5">
                                    Switch Portal
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#282828]" />
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                    <Link href="/" className="flex items-center gap-2.5 py-2 px-2.5">
                                        <Store className="w-4 h-4 text-[#F25623] shrink-0" />
                                        <div>
                                            <div className="font-semibold text-xs text-white">Storefront</div>
                                            <div className="text-[10px] text-zinc-400">Streetwear drops & catalog</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                    <Link href="/pos" className="flex items-center gap-2.5 py-2 px-2.5">
                                        <img src="/images/pos_icon.png" alt="" className="w-4 h-4 object-contain shrink-0" />
                                        <div>
                                            <div className="font-semibold text-xs text-white">POS Cashier Terminal</div>
                                            <div className="text-[10px] text-zinc-400">Cashier register & checkout</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleTheme}
                            className="rounded-lg text-zinc-400 hover:text-white hover:bg-[#282828] border border-[#2d2d2d] bg-[#202020] h-8.5 w-8.5"
                            aria-label="Toggle appearance"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-zinc-400" />
                            )}
                        </Button>

                        {/* Admin User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 py-1 rounded-lg border border-[#2d2d2d] bg-[#202020] hover:bg-[#282828] transition-colors focus:outline-none"
                                >
                                    <div className="w-6.5 h-6.5 rounded-md bg-[#F25623] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                        {(user?.name ?? 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <div className="text-xs font-semibold text-white leading-tight max-w-[100px] truncate">
                                            {user?.name ?? 'Admin'}
                                        </div>
                                        <div className="text-[9px] text-[#F25623] font-mono leading-none">
                                            ADMIN
                                        </div>
                                    </div>
                                    <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 border border-[#333] bg-[#1a1a1a] text-white shadow-2xl">
                                <div className="px-3 py-2 border-b border-[#282828]">
                                    <p className="text-xs font-semibold text-white truncate">{user?.name ?? 'Admin User'}</p>
                                    <p className="text-[10px] text-zinc-400 truncate">{user?.email ?? 'admin@dmart.test'}</p>
                                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#F25623]/20 text-[#F25623] border border-[#F25623]/30">
                                        SYSTEM ADMINISTRATOR
                                    </span>
                                </div>
                                <div className="py-1">
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                        <Link href="/admin/settings" className="flex items-center gap-2 text-xs py-1.5 px-2.5">
                                            <Settings className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>Store Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                        <Link href="/pos" className="flex items-center gap-2 text-xs py-1.5 px-2.5">
                                            <img src="/images/pos_icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                                            <span>Launch POS Terminal</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                        <Link href="/" className="flex items-center gap-2 text-xs py-1.5 px-2.5">
                                            <Store className="w-3.5 h-3.5 text-[#F25623]" />
                                            <span>View Storefront</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </div>
                                <DropdownMenuSeparator className="bg-[#282828]" />
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 focus:bg-rose-950/30">
                                    <Link href="/logout" method="post" as="button" className="w-full flex items-center gap-2 text-xs py-1.5 px-2.5">
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Sign Out</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
