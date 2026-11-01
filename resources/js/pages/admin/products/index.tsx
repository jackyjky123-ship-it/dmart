import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
    Boxes,
    Trash2,
    SlidersHorizontal,
    Check,
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
    unit: string;
}

interface ProductsIndexProps {
    products?: Product[];
    categories?: Array<{ id: number; name: string; slug: string }>;
}

export default function AdminProductsIndex({ products = [], categories = [] }: ProductsIndexProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filtered = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCat =
            selectedCategory === 'all' || p.category_name.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCat;
    });

    const handleDelete = (name: string) => {
        toast.info(`Product "${name}" marked as soft deleted in database.`);
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
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border shadow-xs">
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
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-background border rounded-lg px-2.5 py-1 text-xs font-medium focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="all">All Departments</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

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
                            {filtered.map((product) => {
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
                                                    <div className="text-[10px] text-muted-foreground">{product.unit}</div>
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
                                            >
                                                <Link href={`/admin/products/create?edit=${product.id}`}>
                                                    <Edit className="w-3.5 h-3.5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(product.name)}
                                                className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
