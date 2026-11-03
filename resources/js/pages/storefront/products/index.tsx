import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { CartProduct } from '@/hooks/use-cart';
import { useTranslation } from '@/hooks/use-translation';
import {
    Search,
    SlidersHorizontal,
    X,
    ArrowUpDown,
    Flame,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductsIndexProps {
    products?: CartProduct[];
    categories?: Category[];
    initialCategory?: string;
    initialSearch?: string;
}

const DEFAULT_STREETWEAR_PRODUCTS: CartProduct[] = [
    {
        id: 101,
        name: 'Essential Oversized Hoodie',
        slug: 'essential-oversized-hoodie',
        sku: 'HD-ESS-01',
        price_cents: 5999,
        compare_at_price_cents: 8999,
        stock: 24,
        unit: 'Charcoal Gray',
        category_name: 'Hoodies',
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
        category_name: 'Hoodies',
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
        category_name: 'Hoodies',
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
        category_name: 'Hoodies',
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
        category_name: 'Hoodies',
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
        category_name: 'Tees',
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
        category_name: 'Bottoms',
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

const DEFAULT_CATEGORIES: Category[] = [
    { id: 1, name: 'Hoodies & Fleece', slug: 'hoodies' },
    { id: 2, name: 'Graphic Tees', slug: 'tees' },
    { id: 3, name: 'Outerwear', slug: 'outerwear' },
    { id: 4, name: 'Bottoms & Cargo', slug: 'bottoms' },
];

export default function ProductsIndex({
    products: initialProducts = [],
    categories: initialCategories = [],
    initialCategory,
    initialSearch = '',
}: ProductsIndexProps) {
    const { t } = useTranslation();
    const rawProducts =
        initialProducts.length > 0
            ? initialProducts
            : DEFAULT_STREETWEAR_PRODUCTS;
    const categories =
        initialCategories.length > 0 ? initialCategories : DEFAULT_CATEGORIES;

    const [search, setSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        initialCategory || 'all',
    );
    const [sortBy, setSortBy] = useState<
        'featured' | 'price-asc' | 'price-desc' | 'name'
    >('featured');
    const [inStockOnly, setInStockOnly] = useState(false);

    const filteredProducts = useMemo(() => {
        let result = [...rawProducts];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.sku.toLowerCase().includes(q) ||
                    p.category_name.toLowerCase().includes(q),
            );
        }

        if (selectedCategory && selectedCategory !== 'all') {
            result = result.filter(
                (p) =>
                    (p as any).category_slug === selectedCategory ||
                    p.category_name
                        .toLowerCase()
                        .includes(selectedCategory.replace(/-/g, ' ')),
            );
        }

        if (inStockOnly) {
            result = result.filter((p) => p.stock > 0);
        }

        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price_cents - b.price_cents);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price_cents - a.price_cents);
        } else if (sortBy === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [rawProducts, search, selectedCategory, inStockOnly, sortBy]);

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSortBy('featured');
        setInStockOnly(false);
    };

    return (
        <div className="space-y-8 pb-12 text-foreground">
            <Head title="Capsule Drops & Catalog — DMART" />

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest text-[#F25623] uppercase">
                        <Flame className="h-3.5 w-3.5" />
                        <span>{t('COLLECTION CATALOG')}</span>
                    </div>
                    <h1 className="font-sans text-3xl font-black tracking-tight text-foreground uppercase sm:text-4xl">
                        {t('All Capsule Drops')}
                    </h1>
                    <p className="font-mono text-xs text-muted-foreground">
                        {t('SHOWING :current OF :total PIECES', {
                            current: filteredProducts.length,
                            total: rawProducts.length,
                        })}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('SEARCH HOODIES, TEES, SKU...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 rounded-full border-border bg-card pr-9 pl-10 text-xs text-foreground placeholder:text-[11px] placeholder:text-muted-foreground focus:border-[#F25623]"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                        'rounded-full px-4 py-2 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-all',
                        selectedCategory === 'all'
                            ? 'bg-[#F25623] text-white shadow-md shadow-[#F25623]/25'
                            : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                >
                    {t('All Items (:count)', { count: rawProducts.length })}
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.slug}
                        type="button"
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={cn(
                            'rounded-full px-4 py-2 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-all',
                            selectedCategory === cat.slug
                                ? 'bg-[#F25623] text-white shadow-md shadow-[#F25623]/25'
                                : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        {t(cat.name)}
                    </button>
                ))}
            </div>

            {/* Sub-Filters / Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-3.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
                        <SlidersHorizontal className="h-3.5 w-3.5 text-[#F25623]" />{' '}
                        {t('Filter by')}:
                    </span>
                    <label className="flex cursor-pointer items-center gap-2 text-xs select-none hover:text-foreground">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                            className="rounded border-border bg-muted text-[#F25623] focus:ring-[#F25623]"
                        />
                        <span>{t('In Stock Only')}</span>
                    </label>
                </div>

                <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                        {t('Sort by')}:
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs text-foreground focus:border-[#F25623] focus:outline-none"
                    >
                        <option value="featured">{t('Featured Drops')}</option>
                        <option value="price-asc">
                            {t('Price: Low to High')}
                        </option>
                        <option value="price-desc">
                            {t('Price: High to Low')}
                        </option>
                        <option value="name">{t('Product Name (A-Z)')}</option>
                    </select>

                    {(search ||
                        selectedCategory !== 'all' ||
                        inStockOnly ||
                        sortBy !== 'featured') && (
                        <button
                            onClick={clearFilters}
                            className="font-mono text-xs text-[#F25623] uppercase hover:underline"
                        >
                            {t('Reset')}
                        </button>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="space-y-4 rounded-2xl border border-border bg-card p-8 py-20 text-center">
                    <Sparkles className="mx-auto h-10 w-10 text-[#F25623]" />
                    <h3 className="text-lg font-bold tracking-wider text-foreground uppercase">
                        {t('No drops match your criteria')}
                    </h3>
                    <p className="mx-auto max-w-sm text-xs text-muted-foreground">
                        {t(
                            'Try clearing search terms or selecting a different category to view available archive pieces.',
                        )}
                    </p>
                    <Button
                        variant="orange"
                        size="sm"
                        onClick={clearFilters}
                        className="rounded-full"
                    >
                        {t('Reset Filters')}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {filteredProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
