import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
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

function StorefrontHeader() {
    const { itemCount } = useCart();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { url } = usePage();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md">
            {/* Top Announcement Bar */}
            <div className="bg-emerald-700 dark:bg-emerald-900 text-white text-xs py-1.5 px-4 font-medium">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                        Fresh Grocery Delivery in Phnom Penh &bull; Free shipping over $35.00
                    </span>
                    <div className="hidden sm:flex items-center gap-4 text-emerald-100 text-[11px]">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 7:00 AM - 10:00 PM
                        </span>
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> +855 23 888 999
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                            D
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tight text-foreground">
                                D<span className="text-emerald-600 dark:text-emerald-400">Mart</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                                Grocery &bull; Mini-Mart
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links Desktop */}
                    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                        <Link
                            href="/"
                            className={`px-3 py-1.5 rounded-lg transition-colors ${
                                url === '/' ? 'text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className={`px-3 py-1.5 rounded-lg transition-colors ${
                                url.startsWith('/products') ? 'text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Products Catalog
                        </Link>
                        <Link
                            href="/orders"
                            className={`px-3 py-1.5 rounded-lg transition-colors ${
                                url.startsWith('/orders') ? 'text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            My Orders
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Portal Switcher Shortcut for Reviewers */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="hidden lg:flex items-center gap-1.5 text-xs h-8 border-dashed">
                                <Store className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Switch Portal</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-xs">Quick Portal Switcher</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/" className="cursor-pointer">
                                    <ShoppingBag className="w-4 h-4 mr-2 text-emerald-600" /> Storefront
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/pos" className="cursor-pointer">
                                    <Terminal className="w-4 h-4 mr-2 text-blue-600" /> POS Cashier
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin" className="cursor-pointer">
                                    <Shield className="w-4 h-4 mr-2 text-purple-600" /> Admin Back Office
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dark Mode Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9" aria-label="Toggle theme">
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>

                    {/* Cart Button */}
                    <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white relative h-9 px-3.5 gap-2">
                        <Link href="/cart">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline font-semibold text-xs">Cart</span>
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 text-xs px-1.5 py-0 min-w-5 h-5 flex items-center justify-center rounded-full font-bold"
                            >
                                {itemCount}
                            </Badge>
                        </Link>
                    </Button>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-9 w-9"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
                <div className="md:hidden border-b bg-background px-4 py-4 space-y-3">
                    <nav className="flex flex-col space-y-1">
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                        >
                            Products Catalog
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted flex items-center justify-between"
                        >
                            <span>Cart</span>
                            <Badge className="bg-emerald-600">{itemCount}</Badge>
                        </Link>
                        <Link
                            href="/orders"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                        >
                            My Orders
                        </Link>
                    </nav>
                    <div className="pt-2 border-t flex flex-col gap-1">
                        <div className="text-xs font-semibold text-muted-foreground px-3 py-1">Portals</div>
                        <Link href="/pos" className="px-3 py-1.5 text-xs text-blue-600 hover:underline flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5" /> Cashier POS Terminal
                        </Link>
                        <Link href="/admin" className="px-3 py-1.5 text-xs text-purple-600 hover:underline flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" /> Admin Back Office
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

function StorefrontFooter() {
    return (
        <footer className="border-t bg-muted/30 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3 md:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-base">
                                D
                            </div>
                            <span className="text-lg font-black tracking-tight">
                                D<span className="text-emerald-600 dark:text-emerald-400">Mart</span>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Your neighborhood grocery and mini-mart in Phnom Penh. Fresh produce, everyday pantry staples, and lightning-fast local fulfillment.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Shop Categories</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li><Link href="/products?category=produce" className="hover:text-foreground">Fresh Produce</Link></li>
                            <li><Link href="/products?category=dairy-eggs" className="hover:text-foreground">Dairy & Eggs</Link></li>
                            <li><Link href="/products?category=bakery" className="hover:text-foreground">Daily Bakery</Link></li>
                            <li><Link href="/products?category=beverages" className="hover:text-foreground">Beverages & Coffee</Link></li>
                            <li><Link href="/products?category=snacks" className="hover:text-foreground">Snacks & Confections</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Demo Portals</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li><Link href="/" className="hover:text-emerald-600 font-medium">Customer Storefront</Link></li>
                            <li><Link href="/pos" className="hover:text-blue-600 font-medium">Cashier POS Terminal</Link></li>
                            <li><Link href="/admin" className="hover:text-purple-600 font-medium">Admin Back Office</Link></li>
                            <li><Link href="/checkout" className="hover:text-foreground">Checkout Flow</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Store Location</h4>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>#24 Samdach Penn Nouth St (214), Phnom Penh</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>+855 23 888 999</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Mon - Sun: 7:00 AM - 10:00 PM</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
                    <p>&copy; {new Date().getFullYear()} DMart Mini-Mart Demo. Portfolio & Student Project.</p>
                    <p className="text-[11px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-2.5 py-1 rounded-md">
                        Demo Mode &bull; Simulated KHQR Payments &bull; No Real Money
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-100 selection:text-emerald-900">
                <StorefrontHeader />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
                <StorefrontFooter />
            </div>
        </CartProvider>
    );
}
