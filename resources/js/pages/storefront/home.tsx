import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { HeroBanner } from '@/components/hero-banner';
import { CartProduct, useCart } from '@/hooks/use-cart';
import { useTranslation } from '@/hooks/use-translation';
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
    {
        id: 1,
        name: 'Hoodies & Sweats',
        slug: 'hoodies',
        description: 'Heavyweight fleece with drop shoulders',
        product_count: 12,
    },
    {
        id: 2,
        name: 'Graphic Tees',
        slug: 'tees',
        description: 'Acid-wash vintage boxy cuts',
        product_count: 16,
    },
    {
        id: 3,
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Technical bombers & utility jackets',
        product_count: 8,
    },
    {
        id: 4,
        name: 'Cargos & Denim',
        slug: 'bottoms',
        description: 'Wide-leg utility cargos and relaxed denim',
        product_count: 10,
    },
    {
        id: 5,
        name: 'Accessories',
        slug: 'accessories',
        description: 'Caps, cross-body bags & hardware',
        product_count: 9,
    },
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
    const { t } = useTranslation();
    const products =
        featuredProducts.length > 0 ? featuredProducts : DEFAULT_PRODUCTS;
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
            <Head
                title={t('DMART — Limited Releases & Modern Luxury Streetwear')}
            />

            {/* 1. HERO SECTION (3D DMart 24/7 Flagship Showcase) */}
            <HeroBanner
                titleTop={t('YOUR 24/7')}
                titleBottom={t('FLAGSHIP MART')}
                badgeText={t('DMART 24/7 FLAGSHIP STORE')}
                subtitle={t(
                    'Discover limited releases, premium streetwear, and everyday essentials with seamless instant checkout and express delivery.',
                )}
                ctaText={t('Shop Now')}
                ctaHref="/products"
                secondaryCtaText={t('Explore Catalog')}
                secondaryCtaHref="/products"
            />

            {/* 2. MANIFESTO BANNER: "DESIGNED TO DISRUPT" (Directly from design_ref.png) */}
            <section className="rounded-2xl border-y border-border bg-muted/40 px-4 py-12 text-center">
                <div className="mx-auto max-w-3xl space-y-3">
                    <h2 className="font-sans text-2xl font-black tracking-widest text-foreground uppercase sm:text-3xl">
                        {t('DESIGNED TO DISRUPT')}
                    </h2>
                    <p className="mx-auto max-w-2xl font-mono text-xs leading-relaxed font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
                        {t(
                            "LUXURY STAPLES FOR THE MODERN DISRUPTOR. PRECISION-TAILORED PIECES THAT BREAK CONVENTION AND REDEFINE PRESENCE. THIS ISN'T JUST FASHION—IT'S A STATEMENT.",
                        )}
                    </p>
                </div>
            </section>

            {/* 3. FEATURED DROPS GRID (Inspired by design_ref.png) */}
            <section className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-1 flex items-center gap-2 font-mono text-xs tracking-widest text-[#F25623] uppercase">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{t('ARCHIVE & CURRENT RELEASES')}</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground uppercase sm:text-3xl">
                            {t('Signature Drops')}
                        </h2>
                    </div>

                    {/* Filter categories */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                        {['all', 'hoodies', 'tees', 'outerwear'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    'rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wider whitespace-nowrap uppercase transition-all',
                                    activeCategory === cat
                                        ? 'bg-[#F25623] text-white shadow-md shadow-[#F25623]/25'
                                        : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                            >
                                {cat === 'all' ? t('All Pieces') : t(cat)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4-column product grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="pt-6 text-center">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full border-border bg-card px-8 text-xs font-bold tracking-widest text-foreground uppercase hover:border-[#F25623] hover:text-[#F25623]"
                    >
                        <Link href="/products">
                            {t('Explore Full Collection')}{' '}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* 4. INFINITE MARQUEE TICKER TAPE (From design_ref.png) */}
            <section className="relative -mx-4 overflow-hidden border-y border-border bg-black py-4 sm:-mx-6 lg:-mx-8">
                <div className="animate-marquee flex items-center gap-8 font-mono text-xs tracking-[0.25em] whitespace-nowrap text-neutral-300 uppercase">
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('LIMITED EDITION')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('NEW ARRIVAL')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('EXCLUSIVE DROP')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('HIGH DENSITY COTTON')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('LIMITED EDITION')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('NEW ARRIVAL')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('EXCLUSIVE DROP')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('STREET LUXURY')}
                    </span>
                    {/* Duplicate for seamless infinite loop */}
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('LIMITED EDITION')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('NEW ARRIVAL')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('EXCLUSIVE DROP')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('HIGH DENSITY COTTON')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('LIMITED EDITION')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('NEW ARRIVAL')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('EXCLUSIVE DROP')}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F25623]" />{' '}
                        {t('STREET LUXURY')}
                    </span>
                </div>
            </section>

            {/* 5. EDITORIAL BRAND STORY: OUR MISSION & OUR VISION (From design_ref.png) */}
            <section className="space-y-12">
                {/* Block 1: Our Mission (Text Left, Image Right) */}
                <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 lg:p-10">
                    <div className="max-w-lg space-y-4">
                        <div className="inline-block font-mono text-[11px] tracking-widest text-[#F25623] uppercase">
                            #01 ETHOS
                        </div>
                        <h3 className="font-sans text-3xl font-black tracking-tight text-foreground uppercase sm:text-4xl">
                            {t('Our Mission')}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {t(
                                'Pair text with an image to focus on your chosen product, collection, or drop. Add details on availability, style, or silhouette construction. Engineered to bridge elevated runway design with gritty street culture.',
                            )}
                        </p>
                        <div className="pt-2">
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-foreground/20 bg-muted/50 px-6 text-xs font-bold tracking-wider text-foreground uppercase hover:border-foreground/40 hover:bg-muted"
                            >
                                <Link href="/products">{t('Learn More')}</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative flex aspect-4/3 flex-col justify-between overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted to-card p-8">
                        <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                            DMART / MISSION / 01
                        </div>
                        <div className="font-mono text-3xl font-black tracking-tighter text-foreground uppercase sm:text-4xl">
                            {t('BUILT FOR THE STREETS')}
                        </div>
                        <div className="font-mono text-xs text-[#F25623] uppercase">
                            EST. 2026 &bull; PHNOM PENH
                        </div>
                    </div>
                </div>

                {/* Block 2: Our Vision (Image Left, Text Right) */}
                <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 lg:p-10">
                    <div className="relative order-2 flex aspect-4/3 flex-col justify-between overflow-hidden rounded-xl border border-border bg-gradient-to-tr from-muted via-card to-muted p-8 md:order-1">
                        <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                            DMART / ARCHIVE / 02
                        </div>
                        <div className="font-mono text-3xl font-black tracking-tighter text-foreground uppercase sm:text-4xl">
                            {t('TIMELESS HEAVYWEIGHT')}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground uppercase">
                            PRE-SHRUNK &bull; 460 GSM FLEECE
                        </div>
                    </div>

                    <div className="order-1 max-w-lg space-y-4 md:order-2">
                        <div className="inline-block font-mono text-[11px] tracking-widest text-[#F25623] uppercase">
                            #02 DIRECTION
                        </div>
                        <h3 className="font-sans text-3xl font-black tracking-tight text-foreground uppercase sm:text-4xl">
                            {t('Our Vision')}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {t(
                                'Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or craftsmanship. Our pieces are crafted with timeless cuts that outlast passing hype.',
                            )}
                        </p>
                        <div className="pt-2">
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-foreground/20 bg-muted/50 px-6 text-xs font-bold tracking-wider text-foreground uppercase hover:border-foreground/40 hover:bg-muted"
                            >
                                <Link href="/products">{t('Learn More')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
