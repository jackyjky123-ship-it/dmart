import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/money';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    category_id: number;
    category_name: string;
    price_cents: number;
    compare_at_price_cents: number | null;
    stock: number;
    low_stock_threshold: number;
    is_active: boolean;
    image_url: string | null;
}

interface ProductsIndexProps {
    products?: {
        data: Product[];
        current_page?: number;
        last_page?: number;
        total?: number;
        links?: Array<{ url: string | null; label: string; active: boolean }>;
    } | Product[];
    categories?: Array<{ id: number; name: string; slug: string }>;
    filters?: {
        search?: string;
        category_id?: string;
        is_active?: string;
        low_stock?: string;
    };
}

export default function AdminProductsIndex({ products: propProducts, categories = [], filters = {} }: ProductsIndexProps) {
    const productList: Product[] = Array.isArray(propProducts)
        ? propProducts
        : propProducts?.data || [];

    const paginationLinks = !Array.isArray(propProducts) ? propProducts?.links : null;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || 'all');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/products', {
            search: search.trim() || undefined,
            category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
        }, { preserveState: true });
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        router.get('/admin/products', {
            search: search.trim() || undefined,
            category_id: catId !== 'all' ? catId : undefined,
        }, { preserveState: true });
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete product "${product.name}"?`)) {
            router.delete(`/admin/products/${product.id}`, {
                onSuccess: () => toast.success(`Product "${product.name}" deleted.`),
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || 'Failed to delete product.');
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Products Management — DMart Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Product Catalog
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Manage grocery items, SKU prices, inventory limits and media
                    </p>
                </div>

                <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 shadow-sm text-xs">
                    <Link href="/admin/products/create">
                        <Plus className="w-4 h-4" />
                        <span>Add New Product</span>
                    </Link>
                </Button>
            </div>

            {/* Search & Category Filter */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border shadow-xs">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search SKU or product name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 text-xs rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Department:
                    </span>
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="bg-background border rounded-lg px-2.5 py-1 text-xs font-medium focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="all">All Departments</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id.toString()}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </form>

            {/* Products Table */}
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                            <tr>
                                <th className="p-3.5">Product</th>
                                <th className="p-3.5">SKU</th>
                                <th className="p-3.5">Category</th>
                                <th className="p-3.5">Price</th>
                                <th className="p-3.5">Stock</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {productList.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        No products found. Click "Add New Product" to create one.
                                    </td>
                                </tr>
                            ) : (
                                productList.map((product) => {
                                    const isLowStock = product.stock <= product.low_stock_threshold;

                                    return (
                                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-3.5">
                                                <div className="flex items-center gap-3">
                                                    <ProductThumb
                                                        name={product.name}
                                                        imageUrl={product.image_url}
                                                        size="sm"
                                                        className="rounded-lg shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-foreground truncate max-w-[200px]">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground font-mono">{product.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3.5 font-mono text-muted-foreground">
                                                {product.sku}
                                            </td>
                                            <td className="p-3.5">
                                                <Badge variant="outline" className="text-[10px] py-0">
                                                    {product.category_name}
                                                </Badge>
                                            </td>
                                            <td className="p-3.5">
                                                <div className="font-bold text-foreground">
                                                    {formatMoney(product.price_cents)}
                                                </div>
                                                {product.compare_at_price_cents && (
                                                    <div className="text-[10px] text-muted-foreground line-through">
                                                        {formatMoney(product.compare_at_price_cents)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3.5">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] font-semibold ${
                                                        isLowStock
                                                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                                                    }`}
                                                >
                                                    {product.stock} units
                                                </Badge>
                                            </td>
                                            <td className="p-3.5">
                                                <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                                            </td>
                                            <td className="p-3.5 text-right space-x-1">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs text-purple-600 hover:text-purple-700"
                                                    title="Edit Product"
                                                >
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product)}
                                                    className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {paginationLinks && paginationLinks.length > 3 && (
                    <div className="p-3.5 border-t flex items-center justify-between">
                        <div className="flex gap-1">
                            {paginationLinks.map((link, idx) => (
                                <Button
                                    key={idx}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-7 px-2.5 text-xs"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
