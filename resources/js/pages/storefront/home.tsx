import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { HeroSlideshow } from '@/components/hero-slideshow';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Home as HomeIcon,
    Flame,
    MapPin,
    QrCode,
    Terminal,
    Phone,
    CheckCircle2,
    Store,
    Layers,
    Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    product_count: number;
}

interface HomeProps {
    categories?: Category[];
    featuredProducts?: CartProduct[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    produce: <Apple className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    'dairy-eggs': <Milk className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    bakery: <Wheat className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    beverages: <Coffee className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
    snacks: <Cookie className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
    frozen: <Snowflake className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    household: <HomeIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    'personal-care': <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    pantry: <Flame className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
};

// Default high-quality catalog data if database has not been seeded yet
const DEFAULT_CATEGORIES: Category[] = [
    { id: 1, name: 'Fresh Produce', slug: 'produce', description: 'Farm greens, citrus & tropical fruits', product_count: 14 },
    { id: 2, name: 'Daily Bakery', slug: 'bakery', description: 'Fresh baguettes, sourdough & butter croissants', product_count: 8 },
    { id: 3, name: 'Dairy & Eggs', slug: 'dairy-eggs', description: 'Farm eggs, fresh milk & butter', product_count: 9 },
    { id: 4, name: 'Beverages & Coffee', slug: 'beverages', description: 'Mondulkiri cold brew, juices & tea', product_count: 12 },
    { id: 5, name: 'Snacks & Sweets', slug: 'snacks', description: 'Plantain crisps, nuts & dried fruit', product_count: 15 },
    { id: 6, name: 'Pantry & Spices', slug: 'household', description: 'Kampot pepper, jasmine rice & sauces', product_count: 18 },
    { id: 7, name: 'Frozen Goods', slug: 'frozen', description: 'Ice creams, frozen dumplings & berries', product_count: 6 },
    { id: 8, name: 'Personal Care', slug: 'personal-care', description: 'Eco-soaps, balms & kitchen care', product_count: 7 },
];

const DEFAULT_PRODUCTS: CartProduct[] = [
    {
        id: 101,
        name: 'Battambang Sweet Mandarins',
        slug: 'battambang-sweet-mandarins',
        sku: 'FRU-MAN-01',
        price_cents: 320,
        compare_at_price_cents: 380,
        stock: 28,
        unit: '1 kg bag',
        category_name: 'Fresh Produce',
        image_url: null,
    },
    {
        id: 102,
        name: 'Kandal Organic Baby Bok Choy',
        slug: 'kandal-organic-bok-choy',
        sku: 'VEG-BOK-02',
        price_cents: 145,
        compare_at_price_cents: null,
        stock: 19,
        unit: '250g bunch',
        category_name: 'Fresh Produce',
        image_url: null,
    },
    {
        id: 103,
        name: 'Crusty Traditional French Baguette',
        slug: 'crusty-french-baguette',
        sku: 'BAK-BAG-01',
        price_cents: 150,
        compare_at_price_cents: 175,
        stock: 12,
        unit: '1 loaf',
        category_name: 'Daily Bakery',
        image_url: null,
    },
    {
        id: 104,
        name: 'Mondulkiri Cold Brew Iced Coffee',
        slug: 'mondulkiri-cold-brew',
        sku: 'BEV-CLD-01',
        price_cents: 225,
        compare_at_price_cents: null,
        stock: 24,
        unit: '330ml glass bottle',
        category_name: 'Beverages',
        image_url: null,
    },
    {
        id: 105,
        name: 'Certified Kampot Black Peppercorns',
        slug: 'kampot-black-peppercorns',
        sku: 'PAN-KMP-01',
        price_cents: 450,
        compare_at_price_cents: 520,
        stock: 4, // low stock highlight
        unit: '100g sealed jar',
        category_name: 'Pantry & Spices',
        image_url: null,
    },
    {
        id: 106,
        name: 'Phka Rumduol Grade-A Royal Jasmine Rice',
        slug: 'phka-rumduol-jasmine-rice',
        sku: 'RIC-PKR-05',
        price_cents: 680,
        compare_at_price_cents: 750,
        stock: 15,
        unit: '5 kg sack',
        category_name: 'Pantry & Spices',
        image_url: null,
    },
    {
        id: 107,
        name: 'Kampot Golden Flaky Sea Salt',
        slug: 'kampot-flaky-sea-salt',
        sku: 'PAN-SLT-02',
        price_cents: 210,
        compare_at_price_cents: null,
        stock: 35,
        unit: '200g pouch',
        category_name: 'Pantry & Spices',
        image_url: null,
    },
    {
        id: 108,
        name: 'Local Farm Brown Eggs (Omega-3)',
        slug: 'farm-brown-eggs-10pack',
        sku: 'EGG-OM3-10',
        price_cents: 260,
        compare_at_price_cents: 295,
        stock: 22,
        unit: 'Carton of 10',
        category_name: 'Dairy & Eggs',
        image_url: null,
    },
];

const DELIVERY_ZONES = [
    { name: 'Boeung Keng Kang (BKK 1-3)', time: '20-30 min', active: true },
    { name: 'Daun Penh & Riverside', time: '25-35 min', active: true },
    { name: 'Tuol Kork', time: '30-40 min', active: true },
    { name: 'Chamkarmon & Russian Market', time: '25-35 min', active: true },
    { name: '7 Makara', time: '20-30 min', active: true },
];

export default function HomeView({ categories = [], featuredProducts = [] }: HomeProps) {
    const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

    // Use passed categories or fallback to rich defaults
    const displayCategories = useMemo(() => {
        if (categories && categories.length > 0) {
            return categories;
        }
        return DEFAULT_CATEGORIES;
    }, [categories]);

    // Use passed featured products or fallback to curated showcase
    const displayProducts = useMemo(() => {
        if (featuredProducts && featuredProducts.length > 0) {
            return featuredProducts;
        }
        return DEFAULT_PRODUCTS;
    }, [featuredProducts]);

    // Filter products if category tab is active
    const filteredProducts = useMemo(() => {
        if (selectedCategoryTab === 'all') {
            return displayProducts;
        }
        return displayProducts.filter(
            (p) => p.category_name?.toLowerCase().includes(selectedCategoryTab.toLowerCase())
        );
    }, [displayProducts, selectedCategoryTab]);

    return (
        <div className="space-y-14 pb-12">
            <Head title="DMart — Fresh Neighborhood Grocery & Mini-Mart in Phnom Penh" />

            {/* Hero Section Slideshow (shadcn UI Carousel) */}
            <section aria-label="Featured Promotions Slideshow">
                <HeroSlideshow />
            </section>

            {/* Live Neighborhood Delivery Ticker & Store Hours */}
            <section className="bg-card/70 border rounded-2xl p-4 shadow-2xs backdrop-blur-xs">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <div className="font-medium text-foreground">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Live Delivery Active: </span>
                            Phnom Penh central dispatch (BKK1, Tuol Kork, Daun Penh, Russian Market) — Average ETA 32 mins.
                        </div>
                    </div>

                    <div className="flex items-center gap-5 text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Store Hours: 7:00 AM – 10:00 PM</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Hotline: +855 23 888 999</span>
                        </div>
                        <Badge variant="outline" className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40">
                            Free Over $35
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Value Propositions Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Why Shop at DMart">
                <div className="group p-5 rounded-2xl border bg-card/60 hover:bg-card hover:border-emerald-500/40 transition-all duration-200 shadow-2xs">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
                        <Truck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">35-Minute City Express</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Chilled vans and express bike couriers deliver direct to your apartment or villa across Phnom Penh.
                    </p>
                </div>

                <div className="group p-5 rounded-2xl border bg-card/60 hover:bg-card hover:border-amber-500/40 transition-all duration-200 shadow-2xs">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Farm-Direct Freshness</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Fresh greens and fruits harvested at dawn from trusted Kandal and Battambang agricultural cooperatives.
                    </p>
                </div>

                <div className="group p-5 rounded-2xl border bg-card/60 hover:bg-card hover:border-blue-500/40 transition-all duration-200 shadow-2xs">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
                        <QrCode className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Bakong KHQR & Cash</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Instant scan payment simulation with any Cambodian banking app, or cash on delivery with exact change.
                    </p>
                </div>

                <div className="group p-5 rounded-2xl border bg-card/60 hover:bg-card hover:border-purple-500/40 transition-all duration-200 shadow-2xs">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Real-Time Stock Sync</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        One unified inventory ledger guarantees what you see online is on our physical shelves right now.
                    </p>
                </div>
            </section>

            {/* Shop by Department / Category Grid */}
            <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                            <Store className="w-3.5 h-3.5" />
                            <span>Departments</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground">Shop by Department</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Explore fresh items organized by grocery aisle</p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700">
                        <Link href="/products">
                            View All Catalog ({displayCategories.reduce((acc, c) => acc + c.product_count, 0)} items)
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {displayCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            className="group flex flex-col items-center justify-center p-4 rounded-2xl border bg-card hover:bg-muted/40 hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 text-center"
                        >
                            <div className="w-12 h-12 rounded-xl bg-muted/80 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 group-hover:scale-110 transition-all flex items-center justify-center mb-2.5">
                                {CATEGORY_ICONS[cat.slug] || <Apple className="w-5 h-5 text-emerald-600" />}
                            </div>
                            <span className="text-xs font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                                {cat.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                {cat.product_count} items
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Curated Fresh Picks & Flash Specials */}
            <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Curated Selection</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground">Today's Fresh Picks</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Top pantry staples and harvest favorites</p>
                    </div>

                    {/* Quick Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {[
                            { id: 'all', label: 'All Items' },
                            { id: 'produce', label: 'Produce' },
                            { id: 'bakery', label: 'Bakery' },
                            { id: 'beverages', label: 'Drinks' },
                            { id: 'pantry', label: 'Pantry' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSelectedCategoryTab(tab.id)}
                                className={cn(
                                    'px-3 py-1 rounded-full text-xs font-semibold transition-all border',
                                    selectedCategoryTab === tab.id
                                        ? 'bg-foreground text-background border-foreground shadow-2xs'
                                        : 'bg-card text-muted-foreground border-border hover:bg-muted/70'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="flex justify-center pt-2">
                    <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold px-6 text-xs">
                        <Link href="/products">
                            Explore All Products in Catalog <ArrowRight className="w-3.5 h-3.5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Phnom Penh Neighborhood Delivery Zones Map/Guide */}
            <section className="rounded-3xl border bg-gradient-to-br from-emerald-900/10 via-card to-card p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Phnom Penh Express Coverage</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                            Fast Neighborhood Delivery to Your Doorstep
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            DMart couriers are stationed throughout Phnom Penh's major districts. Place an order right now and receive it chilled and freshly packed before your next meal.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                            {DELIVERY_ZONES.map((zone, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-background/80 text-xs">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span className="font-medium text-foreground">{zone.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px] font-mono font-semibold">
                                        {zone.time}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="relative rounded-2xl border bg-card p-6 shadow-xl space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-sm text-foreground">Free Delivery Guarantee</h3>
                                    <p className="text-xs text-muted-foreground">Orders over $35 ship 100% free of charge</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-black">
                                    $0
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4 text-xs text-muted-foreground">
                                <div className="flex items-center justify-between">
                                    <span>Flat Rate (Orders under $35.00)</span>
                                    <span className="font-bold text-foreground font-mono">$1.50</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Bakong KHQR Payment</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Supported (Mock)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Cash on Delivery</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Driver carries change</span>
                                </div>
                            </div>

                            <Button asChild size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
                                <Link href="/products">
                                    Start Filling Your Basket <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hybrid Mart Callout: In-Store POS & Back Office */}
            <section className="rounded-3xl border bg-card p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Portfolio Demo Notice</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                            Testing the Cashier POS or Admin Back Office?
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            DMart features a complete omnichannel system. Any item sold through the Cashier POS counter or online store decrements the shared inventory in real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <Button asChild variant="outline" size="sm" className="rounded-xl gap-2 font-semibold text-xs h-9">
                            <Link href="/pos">
                                <Terminal className="w-4 h-4 text-blue-600" />
                                Cashier POS Terminal
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="rounded-xl gap-2 font-semibold text-xs h-9">
                            <Link href="/admin">
                                <ShieldCheck className="w-4 h-4 text-purple-600" />
                                Admin Back Office
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
