import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/empty-state';
import { CartProduct } from '@/hooks/use-cart';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductsIndexProps {
    products: CartProduct[];
    categories: Category[];
    initialCategory?: string;
    initialSearch?: string;
}

export default function ProductsIndex({
    products = [],
    categories = [],
    initialCategory,
    initialSearch = '',
}: ProductsIndexProps) {
    const [search, setSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
    const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
    const [inStockOnly, setInStockOnly] = useState(false);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search query
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.sku.toLowerCase().includes(q) ||
                    p.category_name.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (selectedCategory && selectedCategory !== 'all') {
            result = result.filter(
                (p) => (p as any).category_slug === selectedCategory || p.category_name.toLowerCase().includes(selectedCategory.replace(/-/g, ' '))
            );
        }

        // In-stock filter
        if (inStockOnly) {
            result = result.filter((p) => p.stock > 0);
        }

        // Sort
        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price_cents - b.price_cents);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price_cents - a.price_cents);
        } else if (sortBy === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [products, search, selectedCategory, inStockOnly, sortBy]);

    const hasActiveFilters = search || selectedCategory !== 'all' || inStockOnly || sortBy !== 'featured';

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSortBy('featured');
        setInStockOnly(false);
    };

    return (
        <div className="space-y-6">
            <Head title="Products Catalog — DMart Fresh Groceries" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Grocery Catalog
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search produce, milk, snacks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-9 h-10 rounded-xl bg-card"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <Button
                    type="button"
                    variant={selectedCategory === 'all' ? 'emerald' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="rounded-full text-xs shrink-0 font-medium"
                >
                    All Items ({products.length})
                </Button>
                {categories.map((cat) => (
                    <Button
                        key={cat.slug}
                        type="button"
                        variant={selectedCategory === cat.slug ? 'emerald' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.slug)}
                        className="rounded-full text-xs shrink-0 font-medium"
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Sub-Filters / Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-xl border text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-foreground">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>In Stock Only</span>
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-background border rounded-lg px-2.5 py-1 text-xs font-medium focus:ring-1 focus:ring-emerald-500"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Alphabetical</option>
                    </select>

                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No products found"
                    description={`We couldn't find any items matching "${search || selectedCategory}". Try checking your spelling or clearing your active filters.`}
                    actionLabel="Reset All Filters"
                    onAction={clearFilters}
                />
            )}
        </div>
    );
}
