import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { CartProduct } from '@/hooks/use-cart';
import {
    ArrowRight,
    Truck,
    ShieldCheck,
    Clock,
    Sparkles,
    ShoppingBag,
    Apple,
    Milk,
    Wheat,
    Coffee,
    Cookie,
    Snowflake,
    Home,
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    product_count: number;
}

interface HomeProps {
    categories: Category[];
    featuredProducts: CartProduct[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    produce: <Apple className="w-5 h-5 text-emerald-600" />,
    'dairy-eggs': <Milk className="w-5 h-5 text-blue-600" />,
    bakery: <Wheat className="w-5 h-5 text-amber-600" />,
    beverages: <Coffee className="w-5 h-5 text-orange-600" />,
    snacks: <Cookie className="w-5 h-5 text-yellow-600" />,
    frozen: <Snowflake className="w-5 h-5 text-sky-600" />,
    household: <Home className="w-5 h-5 text-teal-600" />,
    'personal-care': <Sparkles className="w-5 h-5 text-purple-600" />,
};

export default function HomeView({ categories = [], featuredProducts = [] }: HomeProps) {
    return (
        <div className="space-y-12">
            <Head title="Fresh Grocery Delivery & Mini-Mart in Phnom Penh" />

            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-8 sm:p-12 shadow-xl">
                <div className="relative z-10 max-w-2xl space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md text-emerald-100">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Daily Fresh Produce &bull; Phnom Penh Delivery</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                        Fresh Groceries at Your Door in Minutes.
                    </h1>

                    <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-xl">
                        Shop everyday kitchen essentials, crisp farm produce, bakery staples, and snacks. Local convenience store prices with instant delivery.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-6 shadow-md">
                            <Link href="/products">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Start Shopping
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                            <Link href="/pos">
                                Switch to POS Terminal <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 w-64 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Today's Store Promo</div>
                    <div className="text-xl font-bold">Free Delivery</div>
                    <div className="text-xs text-emerald-100">On all orders over $35.00 within central Phnom Penh.</div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-amber-300 h-full w-3/4 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Value Props Bar */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3.5 p-4 rounded-2xl border bg-card/60 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Fast City Delivery</div>
                        <div className="text-xs text-muted-foreground">Within 30-45 mins in Phnom Penh</div>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl border bg-card/60 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Mock KHQR & Cash</div>
                        <div className="text-xs text-muted-foreground">Bakong simulation or cash on delivery</div>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl border bg-card/60 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Open 7 Days a Week</div>
                        <div className="text-xs text-muted-foreground">7:00 AM to 10:00 PM daily</div>
                    </div>
                </div>
            </section>

            {/* Shop by Category */}
            <section className="space-y-4">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Shop by Department</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Explore fresh items organized by section</p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-600">
                        <Link href="/products">
                            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl border bg-card hover:bg-muted/50 hover:border-emerald-500/50 transition-all text-center group shadow-2xs"
                        >
                            <div className="w-12 h-12 rounded-xl bg-muted group-hover:scale-110 transition-transform flex items-center justify-center mb-2.5">
                                {CATEGORY_ICONS[cat.slug] || <Apple className="w-5 h-5 text-emerald-600" />}
                            </div>
                            <span className="text-xs font-semibold text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1">
                                {cat.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                                {cat.product_count} items
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Fresh Products */}
            <section className="space-y-4">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Featured Groceries</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Customer favorites and top pantry staples</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="text-xs">
                        <Link href="/products">
                            Explore Catalog ({featuredProducts.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {featuredProducts.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
}
