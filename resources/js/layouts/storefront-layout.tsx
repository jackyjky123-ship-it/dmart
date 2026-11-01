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
    Phone,
    MapPin,
    Clock,
    Sparkles,
    User as UserIcon,
    LogOut,
    CheckCircle2,
    ChevronDown,
    Truck,
    CreditCard,
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
        <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70 shadow-xs transition-colors">
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs py-1.5 px-4 font-medium tracking-tight">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 truncate">
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span className="truncate">
                            <strong className="font-semibold text-emerald-100">Express Delivery in Phnom Penh:</strong> Free delivery on orders over $35.00
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-4 text-emerald-100 text-[11px] shrink-0 font-sans">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-emerald-300" /> 7:00 AM – 10:00 PM Daily
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-emerald-300" /> +855 23 888 999
                        </span>
                        <span className="bg-white/15 px-2 py-0.5 rounded-full text-[10px] text-white font-medium">
                            Phnom Penh Mini-Mart
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
                {/* Brand */}
                <div className="flex items-center gap-6 shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 group-hover:shadow-emerald-600/30 transition-all duration-200">
                            D
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tight text-foreground flex items-center gap-1">
                                D<span className="text-emerald-600 dark:text-emerald-400">Mart</span>
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                                Grocery &bull; Mini-Mart
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links Desktop */}
                    <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
                        <Link
                            href="/"
                            className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                                isCurrent('/', true)
                                    ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                                isCurrent('/products')
                                    ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                        >
                            Products Catalog
                        </Link>
                        <Link
                            href="/orders"
                            className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                                isCurrent('/orders')
                                    ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                        >
                            My Orders
                        </Link>
                    </nav>
                </div>

                {/* Integrated Instant Search (Desktop / Tablet) */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative items-center"
                >
                    <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search groceries, bakery, drinks..."
                        className="w-full h-9.5 pl-9 pr-3 rounded-xl border border-input/80 bg-muted/40 hover:bg-muted/60 focus:bg-background text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-muted-foreground/80"
                    />
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    {/* Portal Switcher Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs h-9 border-dashed rounded-xl px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="hidden xl:inline">Portals</span>
                                <ChevronDown className="w-3 h-3 text-muted-foreground/70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-lg border">
                            <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 text-muted-foreground">
                                Switch Demo Workspace
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href="/" className="flex items-center py-2 px-2.5">
                                    <ShoppingBag className="w-4 h-4 mr-2.5 text-emerald-600 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs">Customer Storefront</div>
                                        <div className="text-[10px] text-muted-foreground">Browse, cart, checkout</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href="/pos" className="flex items-center py-2 px-2.5">
                                    <Terminal className="w-4 h-4 mr-2.5 text-blue-600 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs">POS Cashier Terminal</div>
                                        <div className="text-[10px] text-muted-foreground">Quick sell & receipt print</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href="/admin" className="flex items-center py-2 px-2.5">
                                    <Shield className="w-4 h-4 mr-2.5 text-purple-600 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs">Admin Back Office</div>
                                        <div className="text-[10px] text-muted-foreground">Catalog, stock & orders</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dark / Light Mode Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9.5 w-9.5 rounded-xl hover:bg-muted/80"
                        aria-label="Toggle theme"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
                        ) : (
                            <Moon className="h-4 w-4 text-muted-foreground transition-transform hover:-rotate-12" />
                        )}
                    </Button>

                    {/* User Profile / Login */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9.5 rounded-xl px-2 gap-2 text-xs hover:bg-muted/80"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline font-medium max-w-[90px] truncate">
                                        {user.name}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-lg border">
                                <DropdownMenuLabel className="text-xs px-2 py-1">
                                    <div className="font-semibold truncate">{user.name}</div>
                                    <div className="text-[10px] text-muted-foreground font-normal truncate">{user.email}</div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                    <Link href="/orders" className="flex items-center text-xs">
                                        <ShoppingBag className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                                        My Orders
                                    </Link>
                                </DropdownMenuItem>
                                {user.role === 'admin' && (
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                        <Link href="/admin" className="flex items-center text-xs text-purple-600 font-medium">
                                            <Shield className="w-3.5 h-3.5 mr-2" />
                                            Admin Portal
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {(user.role === 'cashier' || user.role === 'admin') && (
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                        <Link href="/pos" className="flex items-center text-xs text-blue-600 font-medium">
                                            <Terminal className="w-3.5 h-3.5 mr-2" />
                                            POS Terminal
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-destructive focus:text-destructive">
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
                            className="hidden sm:inline-flex text-xs h-9.5 rounded-xl font-medium"
                        >
                            <Link href="/login">
                                <UserIcon className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                Sign In
                            </Link>
                        </Button>
                    )}

                    {/* Cart Button */}
                    <Button
                        asChild
                        variant="emerald"
                        size="sm"
                        className="h-9.5 px-3.5 rounded-xl gap-2 font-semibold shadow-xs"
                    >
                        <Link href="/cart" className="flex items-center">
                            <ShoppingCart className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                            <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-emerald-950/20 text-white text-[11px] font-bold">
                                {itemCount}
                            </span>
                        </Link>
                    </Button>

                    {/* Mobile Hamburger Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-9.5 w-9.5 rounded-xl"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Dropdown / Drawer */}
            {mobileOpen && (
                <div className="lg:hidden border-b border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-4 shadow-xl">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search fresh groceries..."
                            className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-muted/30 text-xs focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                        />
                    </form>

                    <nav className="flex flex-col space-y-1">
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-between"
                        >
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-between"
                        >
                            <span>Products Catalog</span>
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-between"
                        >
                            <span>Cart</span>
                            <Badge className="bg-emerald-600 text-white text-xs">{itemCount}</Badge>
                        </Link>
                        <Link
                            href="/orders"
                            onClick={() => setMobileOpen(false)}
                            className="px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                        >
                            My Orders
                        </Link>
                    </nav>

                    <div className="pt-3 border-t flex flex-col gap-1.5">
                        <div className="text-[11px] font-semibold text-muted-foreground px-3 uppercase tracking-wider">
                            Demo Portals
                        </div>
                        <Link
                            href="/pos"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-lg text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2 font-medium"
                        >
                            <Terminal className="w-4 h-4" /> POS Cashier Terminal
                        </Link>
                        <Link
                            href="/admin"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-lg text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-2 font-medium"
                        >
                            <Shield className="w-4 h-4" /> Admin Back Office
                        </Link>
                    </div>

                    {!user && (
                        <div className="pt-3 border-t">
                            <Button asChild variant="outline" className="w-full justify-center text-xs h-9.5 rounded-xl">
                                <Link href="/login" onClick={() => setMobileOpen(false)}>
                                    <UserIcon className="w-3.5 h-3.5 mr-2" />
                                    Customer Login / Sign In
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

function StorefrontFooter() {
    return (
        <footer className="border-t border-border/60 bg-muted/20 mt-20">
            {/* Trust and Values Strip */}
            <div className="border-b border-border/40 bg-muted/40 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Truck className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-foreground">30-Min Fast Delivery</div>
                            <div className="text-[11px] text-muted-foreground">Phnom Penh City dispatch</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-foreground">Mock KHQR & Cash</div>
                            <div className="text-[11px] text-muted-foreground">Bakong simulation & COD</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-foreground">100% Fresh Guaranteed</div>
                            <div className="text-[11px] text-muted-foreground">Direct daily local farm supply</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-foreground">Open 7 Days a Week</div>
                            <div className="text-[11px] text-muted-foreground">7:00 AM – 10:00 PM Daily</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3.5 md:col-span-1">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                                D
                            </div>
                            <span className="text-lg font-black tracking-tight">
                                D<span className="text-emerald-600 dark:text-emerald-400">Mart</span>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Your neighborhood grocery and mini-mart in Phnom Penh. Fresh produce, everyday pantry staples, and lightning-fast local fulfillment.
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800/50">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Locally Operated &bull; Phnom Penh</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3.5">
                            Shop Categories
                        </h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li><Link href="/products?category=produce" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Fresh Produce</Link></li>
                            <li><Link href="/products?category=dairy-eggs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Dairy & Eggs</Link></li>
                            <li><Link href="/products?category=bakery" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Daily Bakery</Link></li>
                            <li><Link href="/products?category=beverages" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Beverages & Coffee</Link></li>
                            <li><Link href="/products?category=snacks" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Snacks & Confections</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3.5">
                            Demo Portals
                        </h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors flex items-center gap-1.5">
                                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" /> Customer Storefront
                                </Link>
                            </li>
                            <li>
                                <Link href="/pos" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1.5">
                                    <Terminal className="w-3.5 h-3.5 text-blue-600" /> Cashier POS Terminal
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-purple-600" /> Admin Back Office
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                                    <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground" /> Cart & Checkout Flow
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2.5 text-xs text-muted-foreground">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3.5">
                            Store Location & Hours
                        </h4>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                            <span>#24 Samdach Penn Nouth St (214), Phnom Penh</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>+855 23 888 999</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Mon - Sun: 7:00 AM - 10:00 PM</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
                    <p>&copy; {new Date().getFullYear()} DMart Mini-Mart. Built with Laravel 12 & Inertia React.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                            Demo Mode &bull; Simulated KHQR Payments
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-100 selection:text-emerald-900 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent)] transition-colors">
                <StorefrontHeader />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
                <StorefrontFooter />
            </div>
        </CartProvider>
    );
}