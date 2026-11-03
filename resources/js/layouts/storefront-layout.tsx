import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { CartProvider, useCart } from '@/hooks/use-cart';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';
import {
    ShoppingCart,
    Search,
    Menu,
    X,
    Store,
    Shield,
    Terminal,
    ShoppingBag,
    User as UserIcon,
    LogOut,
    ChevronDown,
    Truck,
    ArrowRight,
    Sparkles,
    Flame,
    RotateCcw,
    ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PageAuthProps {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role?: string;
        } | null;
    };
    [key: string]: unknown;
}

function StorefrontHeader() {
    const { t } = useTranslation();
    const { itemCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { url, props } = usePage<PageAuthProps>();
    const user = props.auth?.user;
    const canUsePos = user?.role === 'cashier' || user?.role === 'admin';
    const canUseAdmin = user?.role === 'admin';

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/products', { search: searchQuery.trim() });
            setMobileOpen(false);
        } else {
            router.get('/products');
        }
    };

    const isCurrent = (path: string, exact = false) => {
        if (exact) {
            return url === path;
        }
        return url.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 text-foreground shadow-md backdrop-blur-xl">
            {/* Top Announcement Bar */}
            <div className="border-b border-white/10 bg-black px-4 py-2 font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                        <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#F25623]" />
                        <span className="truncate font-medium tracking-wider text-white">
                            {t(
                                'Limited Releases. Exclusive Drops. Demo storefront.',
                            )}
                        </span>
                    </div>

                    <div className="hidden items-center gap-4 text-[11px] text-neutral-400 sm:flex">
                        <span className="flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5 text-[#F25623]" />
                            {t('Free shipping over $35')}
                        </span>
                        <span className="text-white/40">|</span>
                        <span className="font-semibold tracking-wider text-white">
                            USD $
                        </span>
                        <span className="text-white/40">|</span>
                        <LanguageSwitcher variant="compact" align="end" />
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Left Navigation */}
                <nav className="hidden items-center gap-6 text-xs font-semibold tracking-widest text-muted-foreground uppercase md:flex">
                    <Link
                        href="/"
                        className={`transition-colors hover:text-foreground ${isCurrent('/', true) ? 'border-b-2 border-[#F25623] pb-1 text-foreground' : ''}`}
                    >
                        {t('Home')}
                    </Link>
                    <Link
                        href="/products"
                        className={`transition-colors hover:text-foreground ${isCurrent('/products') ? 'border-b-2 border-[#F25623] pb-1 text-foreground' : ''}`}
                    >
                        {t('Catalog')}
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center gap-1 transition-colors hover:text-[#F25623]"
                    >
                        <Flame className="h-3.5 w-3.5 text-[#F25623]" />
                        {t('New Drops')}
                    </Link>
                    <Link
                        href="/orders"
                        className={`transition-colors hover:text-foreground ${isCurrent('/orders') ? 'border-b-2 border-[#F25623] pb-1 text-foreground' : ''}`}
                    >
                        {t('Orders')}
                    </Link>
                </nav>

                {/* Center Brand Logo */}
                <div className="flex items-center justify-center">
                    <Link href="/" className="group flex items-center gap-2">
                        <img
                            src="/images/dmart_icon.png"
                            alt="DMart"
                            className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                            <span className="font-sans text-2xl font-black tracking-widest text-foreground uppercase">
                                D<span className="text-[#F25623]">MART</span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Search bar Desktop */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative hidden items-center lg:flex"
                    >
                        <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('SEARCH CATALOG...')}
                            className="h-8.5 w-48 rounded-full border border-border bg-muted pr-3 pl-8 text-[11px] text-foreground uppercase transition-all placeholder:tracking-wider placeholder:text-muted-foreground focus:border-[#F25623] focus:outline-none xl:w-56"
                        />
                    </form>

                    <ThemeToggle className="h-8.5 w-8.5 rounded-full border border-border bg-muted text-foreground hover:bg-muted" />

                    {/* Portal Switcher */}
                    {canUsePos && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden h-8.5 items-center gap-1.5 rounded-full border-border bg-muted text-xs text-foreground hover:border-[#F25623]/60 hover:bg-muted hover:text-foreground sm:inline-flex"
                                >
                                    <Store className="h-3.5 w-3.5 text-[#F25623]" />
                                    <span className="hidden xl:inline">
                                        {t('Portals')}
                                    </span>
                                    <ChevronDown className="h-3 w-3 text-foreground/50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl border border-border bg-card p-1.5 text-foreground shadow-xl"
                            >
                                <DropdownMenuLabel className="px-2 py-1.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                                    {t('Switch Workspace')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-muted" />
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                >
                                    <Link
                                        href="/"
                                        className="flex items-center px-2.5 py-2"
                                    >
                                        <ShoppingBag className="mr-2.5 h-4 w-4 shrink-0 text-[#F25623]" />
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
                                        className="flex items-center px-2.5 py-2"
                                    >
                                        <img
                                            src="/images/pos_icon.png"
                                            alt=""
                                            className="mr-2.5 h-4 w-4 shrink-0 object-contain"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-foreground">
                                                {t('POS Cashier Terminal')}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {t('In-store register')}
                                            </div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                {canUseAdmin && (
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                    >
                                        <Link
                                            href="/admin"
                                            className="flex items-center px-2.5 py-2"
                                        >
                                            <img
                                                src="/images/admin_icon.png"
                                                alt=""
                                                className="mr-2.5 h-4 w-4 shrink-0 object-contain"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-foreground">
                                                    {t('Admin Dashboard')}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {t(
                                                        'Catalog & order management',
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* User Profile */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8.5 gap-2 rounded-full px-2 text-xs text-foreground hover:bg-muted"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F25623] text-[11px] font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden max-w-[90px] truncate font-medium sm:inline">
                                        {user.name}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-xl border border-border bg-card p-1.5 text-foreground shadow-xl"
                            >
                                <DropdownMenuLabel className="px-2 py-1 text-xs">
                                    <div className="truncate font-semibold text-foreground">
                                        {user.name}
                                    </div>
                                    <div className="truncate text-[10px] font-normal text-muted-foreground">
                                        {user.email}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-muted" />
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg hover:bg-muted"
                                >
                                    <Link
                                        href="/orders"
                                        className="flex items-center text-xs text-foreground"
                                    >
                                        <ShoppingBag className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                        {t('My Orders')}
                                    </Link>
                                </DropdownMenuItem>
                                {user.role === 'admin' && (
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg hover:bg-muted"
                                    >
                                        <Link
                                            href="/admin"
                                            className="flex items-center text-xs font-medium text-[#F25623]"
                                        >
                                            <Shield className="mr-2 h-3.5 w-3.5" />
                                            {t('Admin Portal')}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {(user.role === 'cashier' ||
                                    user.role === 'admin') && (
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg hover:bg-muted"
                                    >
                                        <Link
                                            href="/pos"
                                            className="flex items-center text-xs font-medium text-foreground"
                                        >
                                            <img
                                                src="/images/pos_icon.png"
                                                alt=""
                                                className="mr-2 h-3.5 w-3.5 object-contain"
                                            />
                                            {t('POS Terminal')}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-muted" />
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg text-destructive hover:bg-rose-950/30 focus:text-destructive"
                                >
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center text-xs"
                                    >
                                        <LogOut className="mr-2 h-3.5 w-3.5" />
                                        {t('Log Out')}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="hidden h-8.5 rounded-full text-xs font-medium text-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
                        >
                            <Link href="/login">
                                <UserIcon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                                {t('Account')}
                            </Link>
                        </Button>
                    )}

                    {/* Cart Button with Signature Orange Badge */}
                    <Button
                        asChild
                        variant="orange"
                        size="sm"
                        className="h-8.5 gap-2 rounded-full px-3.5 font-semibold shadow-md shadow-[#F25623]/25"
                    >
                        <Link href="/cart" className="flex items-center">
                            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                            <span className="hidden text-xs font-semibold sm:inline">
                                {t('BAG')}
                            </span>
                            <span className="ml-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-[#171717]">
                                {itemCount}
                            </span>
                        </Link>
                    </Button>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8.5 w-8.5 rounded-full text-foreground hover:bg-muted md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {mobileOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="space-y-4 border-b border-border bg-background px-4 py-4 shadow-2xl md:hidden">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('Search drops & apparel...')}
                            className="h-10 w-full rounded-full border border-border bg-muted pr-3 pl-9 text-xs text-foreground focus:ring-1 focus:ring-[#F25623] focus:outline-none"
                        />
                    </form>

                    <nav className="flex flex-col space-y-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-foreground hover:bg-muted"
                        >
                            <span>{t('Home')}</span>
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-foreground hover:bg-muted"
                        >
                            <span>{t('Catalog')}</span>
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-foreground hover:bg-muted"
                        >
                            <span>{t('Shopping Bag')}</span>
                            <Badge className="bg-[#F25623] text-xs text-white">
                                {itemCount}
                            </Badge>
                        </Link>
                        <Link
                            href="/orders"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-xl px-3.5 py-2.5 text-foreground hover:bg-muted"
                        >
                            <span>{t('Orders')}</span>
                        </Link>
                        {canUsePos && (
                            <Link
                                href="/pos"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3.5 py-2.5 text-blue-400 hover:bg-muted"
                            >
                                <span>{t('POS Terminal')}</span>
                            </Link>
                        )}
                        {canUseAdmin && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3.5 py-2.5 text-purple-400 hover:bg-muted"
                            >
                                <span>{t('Admin Portal')}</span>
                            </Link>
                        )}
                    </nav>

                    {/* Language Selection in Mobile Drawer */}
                    <div className="flex items-center justify-between border-t border-border px-2 pt-3">
                        <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                            {t('Toggle appearance')}
                        </span>
                        <ThemeToggle className="h-8.5 w-8.5 rounded-lg border border-border bg-muted text-foreground hover:bg-muted" />
                    </div>
                    <div className="flex items-center justify-between border-t border-border px-2 pt-3">
                        <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                            {t('Language')} / ភាសា
                        </span>
                        <LanguageSwitcher variant="toggle" />
                    </div>
                </div>
            )}
        </header>
    );
}

function StorefrontFooter() {
    const { t } = useTranslation();
    const { props } = usePage<PageAuthProps>();
    const user = props.auth?.user;
    const canUsePos = user?.role === 'cashier' || user?.role === 'admin';
    const canUseAdmin = user?.role === 'admin';

    return (
        <footer className="border-t border-border bg-sidebar text-muted-foreground transition-colors">
            {/* Value Propositions Strip */}
            <div className="border-b border-border py-8">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[#F25623]">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold tracking-wider text-foreground uppercase">
                                {t('Free Shipping')}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                                {t('On all orders over $35')}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[#F25623]">
                            <RotateCcw className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold tracking-wider text-foreground uppercase">
                                {t('Easy 30-Day Returns')}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                                {t('Hassle-free exchanges')}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[#F25623]">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold tracking-wider text-foreground uppercase">
                                {t('100% Authentic Drop')}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                                {t('Verified original streetwear')}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[#F25623]">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold tracking-wider text-foreground uppercase">
                                {t('Limited Releases')}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                                {t('Exclusive capsule drops')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    <div className="space-y-4 md:col-span-1">
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/dmart_icon.png"
                                alt="DMart"
                                className="h-7 w-7 object-contain"
                            />
                            <span className="font-sans text-xl font-black tracking-widest text-foreground uppercase">
                                D<span className="text-[#F25623]">MART</span>
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            Luxury staples for the modern disruptor.
                            Precision-tailored pieces that break convention and
                            redefine presence. This isn't just fashion—it's a
                            statement.
                        </p>
                        <div className="pt-2">
                            <span className="font-mono text-[11px] tracking-widest text-[#F25623] uppercase">
                                #DESIGNED-TO-DISRUPT
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                            {t('Capsule Drops')}
                        </h4>
                        <ul className="space-y-2.5 text-xs text-muted-foreground">
                            <li>
                                <Link
                                    href="/products?category=hoodies"
                                    className="transition-colors hover:text-[#F25623]"
                                >
                                    {t('Essential Oversized Hoodies')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=tees"
                                    className="transition-colors hover:text-[#F25623]"
                                >
                                    {t('Acid-Wash Graphic Tees')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=outerwear"
                                    className="transition-colors hover:text-[#F25623]"
                                >
                                    {t('Technical Outerwear & Bomber')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=bottoms"
                                    className="transition-colors hover:text-[#F25623]"
                                >
                                    {t('Distressed Denim & Cargo')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=accessories"
                                    className="transition-colors hover:text-[#F25623]"
                                >
                                    {t('Caps, Bags & Accessories')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                            {t('Workspaces')}
                        </h4>
                        <ul className="space-y-2.5 text-xs text-muted-foreground">
                            <li>
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 font-medium transition-colors hover:text-[#F25623]"
                                >
                                    <ShoppingBag className="h-3.5 w-3.5 text-[#F25623]" />{' '}
                                    {t('Storefront Showcase')}
                                </Link>
                            </li>
                            {canUsePos && (
                                <li>
                                    <Link
                                        href="/pos"
                                        className="flex items-center gap-2 font-medium transition-colors hover:text-blue-400"
                                    >
                                        <Terminal className="h-3.5 w-3.5 text-blue-400" />{' '}
                                        {t('POS Cashier Register')}
                                    </Link>
                                </li>
                            )}
                            {canUseAdmin && (
                                <li>
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 font-medium transition-colors hover:text-purple-400"
                                    >
                                        <Shield className="h-3.5 w-3.5 text-purple-400" />{' '}
                                        {t('Admin Analytics Portal')}
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link
                                    href="/cart"
                                    className="flex items-center gap-2 transition-colors hover:text-foreground"
                                >
                                    <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />{' '}
                                    {t('Checkout & Payment')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                            {t('Join The Drop Club')}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            {t('Follow the catalog for new seeded drops.')}
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                toast.info(
                                    t(
                                        'Newsletter signup is not available in this demo.',
                                    ),
                                );
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="email"
                                placeholder={t('ENTER YOUR EMAIL...')}
                                className="h-9 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground placeholder:text-[10px] placeholder:text-muted-foreground focus:border-[#F25623] focus:outline-none"
                            />
                            <Button
                                type="submit"
                                variant="orange"
                                size="sm"
                                className="h-9 shrink-0 rounded-lg px-3"
                            >
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
                    <p>
                        &copy; {new Date().getFullYear()} DMART STUDIO. ALL
                        RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-4 font-mono text-[11px]">
                        <span className="text-[#F25623]">
                            {t('STYLE • VIBE • REFLECT')}
                        </span>
                        <span>|</span>
                        <span>{t('GLOBAL SHIPPING')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#F25623] selection:text-white">
                <StorefrontHeader />
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </main>
                <StorefrontFooter />
            </div>
        </CartProvider>
    );
}
