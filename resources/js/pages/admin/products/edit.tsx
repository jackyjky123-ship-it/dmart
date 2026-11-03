import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import {
    ArrowLeft,
    UploadCloud,
    Save,
    Trash2,
    Star,
    Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductImage {
    id: number;
    path: string;
    url: string;
    is_primary: boolean;
    sort_order: number;
}

interface ProductData {
    id: number;
    name: string;
    slug: string;
    sku: string;
    category_id: number;
    description: string;
    price: string;
    compare_at_price: string;
    stock: number;
    low_stock_threshold: number;
    is_active: boolean;
    images: ProductImage[];
}

interface ProductEditProps {
    product: ProductData;
    categories?: Category[];
    errors?: Record<string, string>;
}

export default function ProductEdit({
    product,
    categories = [],
    errors = {},
}: ProductEditProps) {
    const { t } = useTranslation();
    const [name, setName] = useState(product.name);
    const [slug, setSlug] = useState(product.slug);
    const [sku, setSku] = useState(product.sku);
    const [categoryId, setCategoryId] = useState(
        product.category_id.toString(),
    );
    const [price, setPrice] = useState(product.price);
    const [compareAt, setCompareAt] = useState(product.compare_at_price || '');
    const [lowStockThreshold, setLowStockThreshold] = useState(
        product.low_stock_threshold.toString(),
    );
    const [description, setDescription] = useState(product.description || '');
    const [isActive, setIsActive] = useState(product.is_active);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.patch(
            `/admin/products/${product.id}`,
            {
                name,
                slug,
                sku,
                category_id: categoryId,
                price,
                compare_at_price: compareAt || null,
                low_stock_threshold: lowStockThreshold,
                description,
                is_active: isActive ? 1 : 0,
            },
            {
                onSuccess: () =>
                    toast.success(
                        t('Product ":name" updated successfully.', { name }),
                    ),
                onError: (err) => {
                    const first = Object.values(err)[0];
                    toast.error(first || t('Failed to update product.'));
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const handleUploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        const formData = new FormData();
        Array.from(e.target.files).forEach((file) => {
            formData.append('images[]', file);
        });

        router.post(`/admin/products/${product.id}/images`, formData, {
            onSuccess: () => toast.success(t('Images uploaded successfully.')),
            onError: (err) => {
                const first = Object.values(err)[0];
                toast.error(first || t('Failed to upload images.'));
            },
            onFinish: () => setUploading(false),
        });
    };

    const handleSetPrimary = (image: ProductImage) => {
        router.patch(
            `/admin/products/${product.id}/images/${image.id}/primary`,
            {},
            {
                onSuccess: () => toast.success(t('Primary image updated.')),
                onError: () =>
                    toast.error(t('Failed to update primary image.')),
            },
        );
    };

    const handleDeleteImage = (image: ProductImage) => {
        if (confirm(t('Delete this product image?'))) {
            router.delete(`/admin/products/${product.id}/images/${image.id}`, {
                onSuccess: () => toast.success(t('Image deleted.')),
                onError: () => toast.error(t('Failed to delete image.')),
            });
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <Head
                title={t('Edit :name — DMart Admin', { name: product.name })}
            />

            <div className="flex items-center gap-3 border-b pb-4">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                >
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        {t('Back to Products')}
                    </Link>
                </Button>
                <div className="h-4 w-px bg-border" />
                <h1 className="truncate text-xl font-black tracking-tight text-foreground sm:text-2xl">
                    {t('Edit :name', { name: product.name })}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information Card */}
                <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs">
                    <h2 className="border-b pb-2 text-sm font-bold tracking-tight text-foreground">
                        {t('Basic Information')}
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs">
                                {t('Product Name')}
                            </Label>
                            <Input
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 rounded-xl text-xs"
                            />
                            {errors.name && (
                                <p className="text-xs text-rose-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="sku" className="text-xs">
                                    {t('SKU / Code')}
                                </Label>
                                <Input
                                    id="sku"
                                    required
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    className="h-10 rounded-xl font-mono text-xs"
                                />
                                {errors.sku && (
                                    <p className="text-xs text-rose-600">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="category" className="text-xs">
                                    {t('Category')}
                                </Label>
                                <select
                                    id="category"
                                    required
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(e.target.value)
                                    }
                                    className="h-10 w-full rounded-xl border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-purple-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {t(cat.name)}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-xs text-rose-600">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="slug" className="text-xs">
                                    {t('Slug')}
                                </Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="h-10 rounded-xl font-mono text-xs"
                                />
                                {errors.slug && (
                                    <p className="text-xs text-rose-600">
                                        {errors.slug}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="desc" className="text-xs">
                                {t('Description')}
                            </Label>
                            <textarea
                                id="desc"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl border bg-background p-3 text-xs focus:ring-1 focus:ring-purple-500"
                            />
                            {errors.description && (
                                <p className="text-xs text-rose-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pricing Card */}
                <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs">
                    <h2 className="border-b pb-2 text-sm font-bold tracking-tight text-foreground">
                        {t('Pricing & Thresholds')}
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="price" className="text-xs">
                                {t('Selling Price (USD)')}
                            </Label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="h-10 rounded-xl pl-7 text-xs font-bold"
                                />
                            </div>
                            {errors.price && (
                                <p className="text-xs text-rose-600">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="compareAt" className="text-xs">
                                {t('Compare-At Price (USD)')}
                            </Label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    id="compareAt"
                                    type="number"
                                    step="0.01"
                                    value={compareAt}
                                    onChange={(e) =>
                                        setCompareAt(e.target.value)
                                    }
                                    placeholder={t('Optional')}
                                    className="h-10 rounded-xl pl-7 text-xs"
                                />
                            </div>
                            {errors.compare_at_price && (
                                <p className="text-xs text-rose-600">
                                    {errors.compare_at_price}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="lowStock" className="text-xs">
                                {t('Low Stock Threshold')}
                            </Label>
                            <Input
                                id="lowStock"
                                type="number"
                                value={lowStockThreshold}
                                onChange={(e) =>
                                    setLowStockThreshold(e.target.value)
                                }
                                className="h-10 rounded-xl text-xs"
                            />
                            {errors.low_stock_threshold && (
                                <p className="text-xs text-rose-600">
                                    {errors.low_stock_threshold}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 text-xs text-muted-foreground">
                        {t('Current stock:')}{' '}
                        <strong>
                            {t(':count units', { count: product.stock })}
                        </strong>
                        . {t('To adjust inventory balances, visit the')}{' '}
                        <Link
                            href="/admin/stock"
                            className="font-semibold text-purple-600 underline"
                        >
                            {t('Stock & Ledger')}
                        </Link>{' '}
                        {t('section.')}
                    </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
                    <input
                        type="checkbox"
                        id="active"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="active" className="cursor-pointer text-xs">
                        <span className="font-bold">
                            {t('Active in Catalog')}
                        </span>{' '}
                        &mdash;{' '}
                        {t(
                            'Customer storefront and POS can see and purchase this product.',
                        )}
                    </Label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-xl text-xs"
                    >
                        <Link href="/admin/products">{t('Cancel')}</Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="gap-1.5 rounded-xl bg-purple-600 px-6 text-xs font-bold text-white shadow-md hover:bg-purple-700"
                    >
                        <Save className="h-4 w-4" />
                        <span>
                            {submitting ? t('Saving...') : t('Update Product')}
                        </span>
                    </Button>
                </div>
            </form>

            {/* Media Management Card */}
            <div className="space-y-6 rounded-3xl border bg-card p-6 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2">
                    <div>
                        <h2 className="text-sm font-bold tracking-tight text-foreground">
                            {t('Product Images')}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {t(
                                'Upload photos, set primary thumbnail, or remove outdated images (max 5)',
                            )}
                        </p>
                    </div>

                    {product.images.length < 5 && (
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                multiple
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleUploadImages}
                                className="hidden"
                                disabled={uploading}
                            />
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs"
                                disabled={uploading}
                            >
                                <span>
                                    <UploadCloud className="h-4 w-4" />
                                    <span>
                                        {uploading
                                            ? t('Uploading...')
                                            : t('Upload Images')}
                                    </span>
                                </span>
                            </Button>
                        </label>
                    )}
                </div>

                {product.images.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed p-8 text-center text-xs text-muted-foreground">
                        {t(
                            'No product images uploaded yet. The storefront and POS will display a colored letter-tile fallback.',
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {product.images.map((img) => (
                            <div
                                key={img.id}
                                className="group relative aspect-square overflow-hidden rounded-2xl border bg-muted shadow-2xs"
                            >
                                <img
                                    src={img.url}
                                    alt="Product image"
                                    className="h-full w-full object-cover"
                                />

                                {img.is_primary ? (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                        <Star className="h-3 w-3 fill-current" />
                                        {t('Primary')}
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleSetPrimary(img)}
                                        className="absolute top-2 left-2 h-6 bg-background/80 px-2 text-[10px] opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 hover:bg-background"
                                    >
                                        {t('Set Primary')}
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteImage(img)}
                                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                    title={t('Delete image')}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
