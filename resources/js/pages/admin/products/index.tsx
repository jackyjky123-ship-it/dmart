import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import { Plus, Search, Edit, Trash2, SlidersHorizontal } from 'lucide-react';
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
    products?:
        | {
              data: Product[];
              current_page?: number;
              last_page?: number;
              total?: number;
              links?: Array<{
                  url: string | null;
                  label: string;
                  active: boolean;
              }>;
          }
        | Product[];
    categories?: Array<{ id: number; name: string; slug: string }>;
    filters?: {
        search?: string;
        category_id?: string;
        is_active?: string;
        low_stock?: string;
    };
}

export default function AdminProductsIndex({
    products: propProducts,
    categories = [],
    filters = {},
}: ProductsIndexProps) {
    const { t } = useTranslation();
    const productList: Product[] = Array.isArray(propProducts)
        ? propProducts
        : propProducts?.data || [];

    const paginationLinks = !Array.isArray(propProducts)
        ? propProducts?.links
        : null;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category_id || 'all',
    );

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/products',
            {
                search: search.trim() || undefined,
                category_id:
                    selectedCategory !== 'all' ? selectedCategory : undefined,
            },
            { preserveState: true },
        );
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        router.get(
            '/admin/products',
            {
                search: search.trim() || undefined,
                category_id: catId !== 'all' ? catId : undefined,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (product: Product) => {
        if (
            confirm(
                t('Are you sure you want to delete product ":name"?', {
                    name: product.name,
                }),
            )
        ) {
            router.delete(`/admin/products/${product.id}`, {
                onSuccess: () =>
                    toast.success(
                        t('Product ":name" deleted.', { name: product.name }),
                    ),
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || t('Failed to delete product.'));
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            <Head title={t('Products Management — DMart Admin')} />

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {t('Product Catalog')}
                    </h1>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {t(
                            'Manage grocery items, SKU prices, inventory limits and media',
                        )}
                    </p>
                </div>

                <Button
                    asChild
                    size="sm"
                    className="gap-1.5 rounded-xl bg-purple-600 text-xs text-white shadow-sm hover:bg-purple-700"
                >
                    <Link href="/admin/products/create">
                        <Plus className="h-4 w-4" />
                        <span>{t('Add New Product')}</span>
                    </Link>
                </Button>
            </div>

            {/* Search & Category Filter */}
            <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-xs sm:flex-row"
            >
                <div className="relative w-full sm:w-80">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('Search SKU or product name...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 rounded-xl pl-9 text-xs"
                    />
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <SlidersHorizontal className="h-3.5 w-3.5" />{' '}
                        {t('Department:')}
                    </span>
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="rounded-lg border bg-background px-2.5 py-1 text-xs font-medium focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="all">{t('All Departments')}</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id.toString()}>
                                {t(c.name)}
                            </option>
                        ))}
                    </select>
                </div>
            </form>

            {/* Products Table */}
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b bg-muted/40 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            <tr>
                                <th className="p-3.5">{t('Product')}</th>
                                <th className="p-3.5">{t('SKU')}</th>
                                <th className="p-3.5">{t('Category')}</th>
                                <th className="p-3.5">{t('Price')}</th>
                                <th className="p-3.5">{t('Stock')}</th>
                                <th className="p-3.5">{t('Status')}</th>
                                <th className="p-3.5 text-right">
                                    {t('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {productList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        {t(
                                            'No products found. Click "Add New Product" to create one.',
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                productList.map((product) => {
                                    const isLowStock =
                                        product.stock <=
                                        product.low_stock_threshold;

                                    return (
                                        <tr
                                            key={product.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="p-3.5">
                                                <div className="flex items-center gap-3">
                                                    <ProductThumb
                                                        name={product.name}
                                                        imageUrl={
                                                            product.image_url
                                                        }
                                                        size="sm"
                                                        className="shrink-0 rounded-lg"
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="max-w-[200px] truncate font-semibold text-foreground">
                                                            {product.name}
                                                        </div>
                                                        <div className="font-mono text-[10px] text-muted-foreground">
                                                            {product.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3.5 font-mono text-muted-foreground">
                                                {product.sku}
                                            </td>
                                            <td className="p-3.5">
                                                <Badge
                                                    variant="outline"
                                                    className="py-0 text-[10px]"
                                                >
                                                    {t(product.category_name)}
                                                </Badge>
                                            </td>
                                            <td className="p-3.5">
                                                <div className="font-bold text-foreground">
                                                    {formatMoney(
                                                        product.price_cents,
                                                    )}
                                                </div>
                                                {product.compare_at_price_cents && (
                                                    <div className="text-[10px] text-muted-foreground line-through">
                                                        {formatMoney(
                                                            product.compare_at_price_cents,
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3.5">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] font-semibold ${
                                                        isLowStock
                                                            ? 'border-amber-300 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                            : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                    }`}
                                                >
                                                    {t(':count units', {
                                                        count: product.stock,
                                                    })}
                                                </Badge>
                                            </td>
                                            <td className="p-3.5">
                                                <StatusBadge
                                                    status={
                                                        product.is_active
                                                            ? 'active'
                                                            : 'inactive'
                                                    }
                                                />
                                            </td>
                                            <td className="space-x-1 p-3.5 text-right">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs text-purple-600 hover:text-purple-700"
                                                    title={t('Edit Product')}
                                                >
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(product)
                                                    }
                                                    className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                                                    title={t('Delete Product')}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
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
                    <div className="flex items-center justify-between border-t p-3.5">
                        <div className="flex gap-1">
                            {paginationLinks.map((link, idx) => (
                                <Button
                                    key={idx}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className="h-7 px-2.5 text-xs"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveState: true },
                                        )
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
