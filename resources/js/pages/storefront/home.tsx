import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { CartProduct, useCart } from '@/hooks/use-cart';
import {
    ArrowRight,
    Truck,
    ShieldCheck,
    RotateCcw,
    Sparkles,
    Flame,
    ShoppingBag,
    Eye,
    Star,
    Layers,
    ChevronRight,
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

const DEFAULT_CATEGORIES: Category[] = [
    { id: 1, name: 'Hoodies & Sweats', slug: 'hoodies', description: 'Heavyweight fleece with drop shoulders', product_count: 12 },
    { id: 2, name: 'Graphic Tees', slug: 'tees', description: 'Acid-wash vintage boxy cuts', product_count: 16 },
    { id: 3, name: 'Outerwear', slug: 'outerwear', description: 'Technical bombers & utility jackets', product_count: 8 },
    { id: 4, name: 'Cargos & Denim', slug: 'bottoms', description: 'Wide-leg utility cargos and relaxed denim', product_count: 10 },
    { id: 5, name: 'Accessories', slug: 'accessories', description: 'Caps, cross-body bags & hardware', product_count: 9 },
];

const DEFAULT_PRODUCTS: CartProduct[] = [
    {
        id: 101,
        name: 'Essential Oversized Hoodie',
        slug: 'essential-oversized-hoodie',
        sku: 'HD-ESS-01',
        price_cents: 5999,
        compare_at_price_cents: 8999,
        stock: 24,
        unit: 'Charcoal Gray',
        category_name: 'Hoodies & Sweats',
        image_url: null,
    },
    {
        id: 102,
        name: 'Los Angeles California Unisex Hoodie',
        slug: 'la-california-unisex-hoodie',
        sku: 'HD-LAC-02',
        price_cents: 4500,
        compare_at_price_cents: 6700,
        stock: 18,
        unit: 'Jet Black',
        category_name: 'Hoodies & Sweats',
        image_url: null,
    },
    {
        id: 103,
        name: 'Smile Planet Cosmic Pullover',
        slug: 'smile-planet-cosmic-pullover',
        sku: 'HD-SMI-03',
        price_cents: 4500,
        compare_at_price_cents: 6700,
        stock: 15,
        unit: 'Onyx Black',
        category_name: 'Hoodies & Sweats',
        image_url: null,
    },
    {
        id: 104,
        name: 'Armour House Strengthwear Hoodie',
        slug: 'armour-house-strengthwear-hoodie',
        sku: 'HD-ARM-04',
        price_cents: 5600,
        compare_at_price_cents: 6700,
        stock: 22,
        unit: 'Washed Black',
        category_name: 'Hoodies & Sweats',
        image_url: null,
    },
    {
        id: 105,
        name: 'Monster Heavy Graphic Hoodie',
        slug: 'monster-heavy-graphic-hoodie',
        sku: 'HD-MON-05',
        price_cents: 5600,
        compare_at_price_cents: 6700,
        stock: 11,
        unit: 'Deep Black',
        category_name: 'Hoodies & Sweats',
        image_url: null,
    },
    {
        id: 106,
        name: 'Acid Wash Vintage Boxy Tee',
        slug: 'acid-wash-vintage-boxy-tee',
        sku: 'TEE-ACD-06',
        price_cents: 3400,
        compare_at_price_cents: 4800,
        stock: 35,
        unit: 'Acid Gray',
        category_name: 'Graphic Tees',
        image_url: null,
    },
    {
        id: 107,
        name: 'Utility Multi-Pocket Cargo Pant',
        slug: 'utility-multipocket-cargo-pant',
        sku: 'BOT-CRG-07',
        price_cents: 6800,
        compare_at_price_cents: 8500,
        stock: 8,
        unit: 'Matte Slate',
        category_name: 'Cargos & Denim',
        image_url: null,
    },
    {
        id: 108,
        name: 'Monochrome Tech Flight Bomber',
        slug: 'monochrome-tech-flight-bomber',
        sku: 'OUT-BMB-08',
        price_cents: 12000,
        compare_at_price_cents: 15000,
        stock: 6,
        unit: 'Obsidian Black',
        category_name: 'Outerwear',
        image_url: null,
    },
];

export default function Home({
    categories = DEFAULT_CATEGORIES,
    featuredProducts = DEFAULT_PRODUCTS,
}: HomeProps) {
    const products = featuredProducts.length > 0 ? featuredProducts : DEFAULT_PRODUCTS;
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'all') {
            return products;
        }
        return products.filter((p) => {
            const cat = (p.category_name || '').toLowerCase();
            return cat.includes(activeCategory.toLowerCase());
        });
    }, [products, activeCategory]);

    return (
        <div className="space-y-16 pb-12">
            <Head title="DMART — Limited Releases & Modern Luxury Streetwear" />

            {/* 1. HERO SECTION (Inspired by design_ref.png) */}
            <section className="relative overflow-hidden rounded-2xl bg-[#121212] border border-[#262626] min-h-[580px] lg:min-h-[640px] flex items-center justify-center text-center px-6 py-20">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#121212]/60 to-[#121212]" />
                </div>

                {/* Subtle Orange Glow Ambient Spot */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F25623]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    {/* Capsule Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-[#F25623]">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Exclusive Capsule Drop 01</span>
                    </div>

                    {/* Headline Trio */}
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none font-sans">
                            STYLE
                        </h1>
                        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#e5e5e5] leading-none font-sans">
                            VIBE
                        </h2>
                        <h3 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#F25623] leading-none font-sans">
                            REFLECT
                        </h3>
                    </div>

                    {/* Subtitle */}
                    <p className="max-w-xl mx-auto text-sm sm:text-base text-[#a3a3a3] font-light leading-relaxed">
                        High-density textiles engineered for the modern disruptor. Precision silhouettes crafted to command presence without saying a word.
                    </p>

                    {/* Action CTA */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            variant="orange"
                            size="lg"
                            className="w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-[#F25623]/25 hover:scale-105 transition-all"
                        >
                            <Link href="/products">
                                Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest border-white/20 bg-black/40 text-white hover:bg-white/10 hover:border-white/40"
                        >
                            <Link href="/products?filter=drops">
                                View Lookbook
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 2. MANIFESTO BANNER: "DESIGNED TO DISRUPT" (Directly from design_ref.png) */}
            <section className="text-center py-12 px-4 border-y border-[#262626] bg-[#141414]/50 rounded-2xl">
                <div className="max-w-3xl mx-auto space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white font-sans">
                        DESIGNED TO DISRUPT
                    </h2>
                    <p className="text-xs sm:text-sm text-[#888888] uppercase tracking-wider leading-relaxed font-mono font-medium max-w-2xl mx-auto">
                        LUXURY STAPLES FOR THE MODERN DISRUPTOR. PRECISION-TAILORED PIECES THAT BREAK CONVENTION AND REDEFINE PRESENCE. THIS ISN'T JUST FASHION—IT'S A STATEMENT.
                    </p>
                </div>
            </section>

            {/* 3. FEATURED DROPS GRID (Inspired by design_ref.png) */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#F25623] tracking-widest mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>ARCHIVE & CURRENT RELEASES</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                            Signature Drops
                        </h2>
                    </div>

                    {/* Filter categories */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                        {['all', 'hoodies', 'tees', 'outerwear'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    'px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold text-[11px] transition-all whitespace-nowrap',
                                    activeCategory === cat
                                        ? 'bg-[#F25623] text-white shadow-md shadow-[#F25623]/25'
                                        : 'bg-[#222222] text-[#888888] hover:text-white hover:bg-[#2c2c2c]'
                                )}
                            >
                                {cat === 'all' ? 'All Pieces' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4-column product grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center pt-6">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8 border-[#333] bg-[#1a1a1a] text-white hover:border-[#F25623] hover:text-[#F25623] text-xs uppercase tracking-widest font-bold"
                    >
                        <Link href="/products">
                            Explore Full Collection <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* 4. INFINITE MARQUEE TICKER TAPE (From design_ref.png) */}
            <section className="relative overflow-hidden bg-black border-y border-[#282828] py-4 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-mono uppercase tracking-[0.25em] text-[#d4d4d4]">
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> LIMITED EDITION
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> NEW ARRIVAL
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> EXCLUSIVE DROP
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> HIGH DENSITY COTTON
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> LIMITED EDITION
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> NEW ARRIVAL
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> EXCLUSIVE DROP
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> STREET LUXURY
                    </span>
                    {/* Duplicate for seamless infinite loop */}
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> LIMITED EDITION
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> NEW ARRIVAL
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> EXCLUSIVE DROP
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> HIGH DENSITY COTTON
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> LIMITED EDITION
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> NEW ARRIVAL
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> EXCLUSIVE DROP
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#F25623]" /> STREET LUXURY
                    </span>
                </div>
            </section>

            {/* 5. EDITORIAL BRAND STORY: OUR MISSION & OUR VISION (From design_ref.png) */}
            <section className="space-y-12">
                {/* Block 1: Our Mission (Text Left, Image Right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#171717] rounded-2xl border border-[#262626] p-6 lg:p-10">
                    <div className="space-y-4 max-w-lg">
                        <div className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#F25623]">
                            #01 ETHOS
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
                            Our Mission
                        </h3>
                        <p className="text-sm text-[#888888] leading-relaxed">
                            Pair text with an image to focus on your chosen product, collection, or drop. Add details on availability, style, or silhouette construction. Engineered to bridge elevated runway design with gritty street culture.
                        </p>
                        <div className="pt-2">
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 text-xs font-bold uppercase tracking-wider"
                            >
                                <Link href="/products">Learn More</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gradient-to-br from-[#1f1f1f] to-[#121212] border border-[#333] flex flex-col justify-between p-8">
                        <div className="text-[10px] font-mono tracking-widest text-[#737373] uppercase">DMART / MISSION / 01</div>
                        <div className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase font-mono">
                            BUILT FOR<br />THE STREETS
                        </div>
                        <div className="text-xs text-[#F25623] font-mono uppercase">EST. 2026 &bull; PHNOM PENH</div>
                    </div>
                </div>

                {/* Block 2: Our Vision (Image Left, Text Right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#171717] rounded-2xl border border-[#262626] p-6 lg:p-10">
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gradient-to-tr from-[#1a1a1a] via-[#222] to-[#161616] border border-[#333] order-2 md:order-1 flex flex-col justify-between p-8">
                        <div className="text-[10px] font-mono tracking-widest text-[#737373] uppercase">DMART / ARCHIVE / 02</div>
                        <div className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase font-mono">
                            TIMELESS<br />HEAVYWEIGHT
                        </div>
                        <div className="text-xs text-[#888] font-mono uppercase">PRE-SHRUNK &bull; 460 GSM FLEECE</div>
                    </div>

                    <div className="space-y-4 max-w-lg order-1 md:order-2">
                        <div className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#F25623]">
                            #02 DIRECTION
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
                            Our Vision
                        </h3>
                        <p className="text-sm text-[#888888] leading-relaxed">
                            Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or craftsmanship. Our pieces are crafted with timeless cuts that outlast passing hype.
                        </p>
                        <div className="pt-2">
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 text-xs font-bold uppercase tracking-wider"
                            >
                                <Link href="/products">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
