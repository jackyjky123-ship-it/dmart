import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { CartProvider, useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import {
    ShoppingCart,
    Search,
    Sun,
    Moon,
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
    const { itemCount } = useCart();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { url, props } = usePage<PageAuthProps>();
    const user = props.auth?.user;

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

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
        <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-[#171717]/95 backdrop-blur-xl text-white shadow-md">
            {/* Top Announcement Bar */}
            <div className="bg-black text-[#a3a3a3] text-[11px] uppercase tracking-widest py-2 px-4 border-b border-white/10 font-mono">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 truncate">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F25623] animate-pulse" />
                        <span className="text-white font-medium tracking-wider">
                            Limited Releases. Exclusive Drops. Elegance is now live.
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-[11px] text-[#a3a3a3]">
                        <span className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#F25623]" />
                            Free worldwide shipping over $99
                        </span>
                        <span className="text-white/40">|</span>
                        <span className="text-white font-semibold tracking-wider">USD $</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
                {/* Left Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-semibold text-[#a3a3a3]">
                    <Link
                        href="/"
                        className={`transition-colors hover:text-white ${isCurrent('/', true) ? 'text-white border-b-2 border-[#F25623] pb-1' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/products"
                        className={`transition-colors hover:text-white ${isCurrent('/products') ? 'text-white border-b-2 border-[#F25623] pb-1' : ''}`}
                    >
                        Catalog
                    </Link>
                    <Link
                        href="/products?filter=drops"
                        className="transition-colors hover:text-[#F25623] flex items-center gap-1"
                    >
                        <Flame className="w-3.5 h-3.5 text-[#F25623]" />
                        Drops
                    </Link>
                    <Link
                        href="/orders"
                        className={`transition-colors hover:text-white ${isCurrent('/orders') ? 'text-white border-b-2 border-[#F25623] pb-1' : ''}`}
                    >
                        Orders
                    </Link>
                </nav>

                {/* Center Brand Logo */}
                <div className="flex items-center justify-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-[#F25623] text-white flex items-center justify-center font-black text-lg tracking-tighter group-hover:scale-105 transition-transform shadow-md shadow-[#F25623]/20">
                            D
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-widest uppercase text-white font-sans">
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
                        className="hidden lg:flex relative items-center"
                    >
                        <Search className="w-3.5 h-3.5 absolute left-3 text-[#737373] pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH CATALOG..."
                            className="w-48 xl:w-56 h-8.5 pl-8 pr-3 rounded-full border border-[#2e2e2e] bg-[#222222] text-[11px] text-white placeholder:text-[#737373] placeholder:tracking-wider uppercase focus:outline-none focus:border-[#F25623] transition-all"
                        />
                    </form>

                    {/* Portal Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs h-8.5 rounded-full border-[#333333] bg-[#222222] text-[#d4d4d4] hover:text-white hover:bg-[#2c2c2c] hover:border-[#F25623]/60"
                            >
                                <Store className="w-3.5 h-3.5 text-[#F25623]" />
                                <span className="hidden xl:inline">Portals</span>
                                <ChevronDown className="w-3 h-3 text-white/50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-xl border border-[#333] bg-[#1a1a1a] text-white">
                            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider font-mono text-[#a3a3a3] px-2 py-1.5">
                                Switch Workspace
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#282828] focus:bg-[#282828]">
                                <Link href="/" className="flex items-center py-2 px-2.5">
                                    <ShoppingBag className="w-4 h-4 mr-2.5 text-[#F25623] shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs text-white">Storefront</div>
                                        <div className="text-[10px] text-[#a3a3a3]">Streetwear drops & catalog</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#282828] focus:bg-[#282828]">
                                <Link href="/pos" className="flex items-center py-2 px-2.5">
                                    <Terminal className="w-4 h-4 mr-2.5 text-blue-400 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs text-white">POS Cashier Terminal</div>
                                        <div className="text-[10px] text-[#a3a3a3]">High-speed in-store register</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#282828] focus:bg-[#282828]">
                                <Link href="/admin" className="flex items-center py-2 px-2.5">
                                    <Shield className="w-4 h-4 mr-2.5 text-purple-400 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs text-white">Admin Dashboard</div>
                                        <div className="text-[10px] text-[#a3a3a3]">Analytics & management</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-8.5 w-8.5 rounded-full text-[#a3a3a3] hover:text-white hover:bg-[#262626]"
                        aria-label="Toggle theme"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-[#a3a3a3]" />
                        )}
                    </Button>

                    {/* User Profile */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8.5 rounded-full px-2 gap-2 text-xs text-white hover:bg-[#262626]"
                                >
                                    <div className="w-6 h-6 rounded-full bg-[#F25623] text-white font-bold text-[11px] flex items-center justify-center">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline font-medium max-w-[90px] truncate">
                                        {user.name}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border border-[#333] bg-[#1a1a1a] text-white">
                                <DropdownMenuLabel className="text-xs px-2 py-1">
                                    <div className="font-semibold truncate text-white">{user.name}</div>
                                    <div className="text-[10px] text-[#a3a3a3] font-normal truncate">{user.email}</div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#282828]">
                                    <Link href="/orders" className="flex items-center text-xs text-[#d4d4d4]">
                                        <ShoppingBag className="w-3.5 h-3.5 mr-2 text-[#a3a3a3]" />
                                        My Orders
                                    </Link>
                                </DropdownMenuItem>
                                {user.role === 'admin' && (
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#282828]">
                                        <Link href="/admin" className="flex items-center text-xs text-[#F25623] font-medium">
                                            <Shield className="w-3.5 h-3.5 mr-2" />
                                            Admin Portal
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {(user.role === 'cashier' || user.role === 'admin') && (
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#282828]">
                                        <Link href="/pos" className="flex items-center text-xs text-blue-400 font-medium">
                                            <Terminal className="w-3.5 h-3.5 mr-2" />
                                            POS Terminal
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-destructive focus:text-destructive hover:bg-rose-950/30">
                                    <Link href="/logout" method="post" as="button" className="w-full flex items-center text-xs">
                                        <LogOut className="w-3.5 h-3.5 mr-2" />
                                        Log Out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="hidden sm:inline-flex text-xs h-8.5 rounded-full font-medium text-[#d4d4d4] hover:text-white hover:bg-[#262626]"
                        >
                            <Link href="/login">
                                <UserIcon className="w-3.5 h-3.5 mr-1.5 text-[#a3a3a3]" />
                                Account
                            </Link>
                        </Button>
                    )}

                    {/* Cart Button with Signature Orange Badge */}
                    <Button
                        asChild
                        variant="orange"
                        size="sm"
                        className="h-8.5 px-3.5 rounded-full gap-2 font-semibold shadow-md shadow-[#F25623]/25"
                    >
                        <Link href="/cart" className="flex items-center">
                            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                            <span className="hidden sm:inline text-xs font-semibold">BAG</span>
                            <span className="ml-1 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-white text-[#171717] text-[10px] font-black">
                                {itemCount}
                            </span>
                        </Link>
                    </Button>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-8.5 w-8.5 rounded-full text-white hover:bg-[#262626]"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="md:hidden border-b border-[#2d2d2d] bg-[#171717] px-4 py-4 space-y-4 shadow-2xl">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-[#737373] pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search drops & apparel..."
                            className="w-full h-10 pl-9 pr-3 rounded-full border border-[#2d2d2d] bg-[#222] text-xs text-white focus:ring-1 focus:ring-[#F25623] focus:outline-none"
                        />
                    </form>

                    <nav className="flex flex-col space-y-1 uppercase text-xs tracking-wider font-semibold text-[#a3a3a3]">
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl hover:bg-[#222] text-white flex items-center justify-between"
                        >
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl hover:bg-[#222] text-white flex items-center justify-between"
                        >
                            <span>Catalog</span>
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl hover:bg-[#222] text-white flex items-center justify-between"
                        >
                            <span>Shopping Bag</span>
                            <Badge className="bg-[#F25623] text-white text-xs">{itemCount}</Badge>
                        </Link>
                        <Link
                            href="/orders"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl hover:bg-[#222] text-white"
                        >
                            <span>Orders</span>
                        </Link>
                        <Link
                            href="/pos"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl hover:bg-[#222] text-blue-400"
                        >
                            <span>POS Terminal</span>
                        </Link>
                        <Link
                            href="/admin"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl hover:bg-[#222] text-purple-400"
                        >
                            <span>Admin Portal</span>
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

function StorefrontFooter() {
    return (
        <footer className="border-t border-[#262626] bg-[#111111] text-[#a3a3a3] transition-colors">
            {/* Value Propositions Strip */}
            <div className="border-b border-[#222222] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#2d2d2d] text-[#F25623] flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">Free Global Shipping</div>
                            <div className="text-[11px] text-[#737373]">On all orders over $99</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#2d2d2d] text-[#F25623] flex items-center justify-center shrink-0">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">Easy 30-Day Returns</div>
                            <div className="text-[11px] text-[#737373]">Hassle-free exchanges</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#2d2d2d] text-[#F25623] flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">100% Authentic Drop</div>
                            <div className="text-[11px] text-[#737373]">Verified original streetwear</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#2d2d2d] text-[#F25623] flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">Limited Releases</div>
                            <div className="text-[11px] text-[#737373]">Exclusive capsule drops</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-4 md:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-[#F25623] text-white flex items-center justify-center font-black text-sm">
                                D
                            </div>
                            <span className="text-xl font-black tracking-widest uppercase text-white font-sans">
                                D<span className="text-[#F25623]">MART</span>
                            </span>
                        </div>
                        <p className="text-xs text-[#737373] leading-relaxed">
                            Luxury staples for the modern disruptor. Precision-tailored pieces that break convention and redefine presence. This isn't just fashion—it's a statement.
                        </p>
                        <div className="pt-2">
                            <span className="text-[11px] font-mono tracking-widest text-[#F25623] uppercase">
                                #DESIGNED-TO-DISRUPT
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
                            Capsule Drops
                        </h4>
                        <ul className="space-y-2.5 text-xs text-[#a3a3a3]">
                            <li><Link href="/products?category=hoodies" className="hover:text-[#F25623] transition-colors">Essential Oversized Hoodies</Link></li>
                            <li><Link href="/products?category=tees" className="hover:text-[#F25623] transition-colors">Acid-Wash Graphic Tees</Link></li>
                            <li><Link href="/products?category=outerwear" className="hover:text-[#F25623] transition-colors">Technical Outerwear & Bomber</Link></li>
                            <li><Link href="/products?category=bottoms" className="hover:text-[#F25623] transition-colors">Distressed Denim & Cargo</Link></li>
                            <li><Link href="/products?category=accessories" className="hover:text-[#F25623] transition-colors">Caps, Bags & Accessories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
                            Workspaces
                        </h4>
                        <ul className="space-y-2.5 text-xs text-[#a3a3a3]">
                            <li>
                                <Link href="/" className="hover:text-[#F25623] font-medium transition-colors flex items-center gap-2">
                                    <ShoppingBag className="w-3.5 h-3.5 text-[#F25623]" /> Storefront Showcase
                                </Link>
                            </li>
                            <li>
                                <Link href="/pos" className="hover:text-blue-400 font-medium transition-colors flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-blue-400" /> POS Cashier Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="hover:text-purple-400 font-medium transition-colors flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5 text-purple-400" /> Admin Analytics Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:text-white transition-colors flex items-center gap-2">
                                    <ShoppingCart className="w-3.5 h-3.5 text-[#a3a3a3]" /> Checkout & Payment
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white font-mono">
                            Join The Drop Club
                        </h4>
                        <p className="text-xs text-[#737373]">
                            Be the first to know about private drops, limited releases, and exclusive archive sales.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL..."
                                className="w-full h-9 px-3 rounded-lg border border-[#2d2d2d] bg-[#1a1a1a] text-xs text-white placeholder:text-[#666] placeholder:text-[10px] focus:outline-none focus:border-[#F25623]"
                            />
                            <Button type="submit" variant="orange" size="sm" className="h-9 px-3 shrink-0 rounded-lg">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
                    <p>&copy; {new Date().getFullYear()} DMART STUDIO. ALL RIGHTS RESERVED.</p>
                    <div className="flex items-center gap-4 text-[11px] font-mono">
                        <span className="text-[#F25623]">STYLE • VIBE • REFLECT</span>
                        <span>|</span>
                        <span>GLOBAL SHIPPING</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#171717] text-white selection:bg-[#F25623] selection:text-white transition-colors">
                <StorefrontHeader />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
                <StorefrontFooter />
            </div>
        </CartProvider>
    );
}
