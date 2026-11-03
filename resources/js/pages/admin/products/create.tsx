import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { ArrowLeft, UploadCloud, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductCreateProps {
    categories?: Category[];
    errors?: Record<string, string>;
}

export default function ProductCreate({
    categories = [],
    errors = {},
}: ProductCreateProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [sku, setSku] = useState('');
    const [categoryId, setCategoryId] = useState(
        categories[0]?.id?.toString() || '',
    );
    const [price, setPrice] = useState('');
    const [compareAt, setCompareAt] = useState('');
    const [stock, setStock] = useState('0');
    const [lowStockThreshold, setLowStockThreshold] = useState('5');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files).slice(
            0,
            5 - selectedFiles.length,
        );
        const newFiles = [...selectedFiles, ...filesArray].slice(0, 5);
        setSelectedFiles(newFiles);

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setPreviewUrls(newFiles.map((file) => URL.createObjectURL(file)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        if (slug) formData.append('slug', slug);
        formData.append('sku', sku);
        formData.append('category_id', categoryId);
        formData.append('price', price);
        if (compareAt) formData.append('compare_at_price', compareAt);
        formData.append('initial_stock', stock);
        formData.append('low_stock_threshold', lowStockThreshold);
        formData.append('description', description);
        formData.append('is_active', isActive ? '1' : '0');

        selectedFiles.forEach((file) => {
            formData.append('images[]', file);
        });

        router.post('/admin/products', formData, {
            onSuccess: () => {
                toast.success(
                    t('Product ":name" created successfully.', { name }),
                );
            },
            onError: (err) => {
                const first = Object.values(err)[0];
                toast.error(first || t('Failed to create product.'));
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <Head title={t('Create Grocery Item — DMart Admin')} />

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
                <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                    {t('Add New Product')}
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
                                placeholder={t('e.g. Organic Red Apples 1kg')}
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
                                    placeholder={t('e.g. FRU-APP-001')}
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
                                    <option value="" disabled>
                                        {t('Select Department')}
                                    </option>
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
                                    {t('Slug (Optional)')}
                                </Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder={t('auto-generated')}
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
                                placeholder={t(
                                    'Product details, origins, organic status...',
                                )}
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

                {/* Pricing & Stock Card */}
                <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs">
                    <h2 className="border-b pb-2 text-sm font-bold tracking-tight text-foreground">
                        {t('Pricing & Inventory')}
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                    placeholder="0.00"
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
                                {t('Compare-At Price (USD, Optional)')}
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
                                    placeholder="0.00"
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
                            <Label htmlFor="stock" className="text-xs">
                                {t('Initial Stock (Recorded in Ledger)')}
                            </Label>
                            <Input
                                id="stock"
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="h-10 rounded-xl text-xs font-medium"
                            />
                            {errors.initial_stock && (
                                <p className="text-xs text-rose-600">
                                    {errors.initial_stock}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="lowStock" className="text-xs">
                                {t('Low Stock Alert Threshold')}
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
                </div>

                {/* Media Upload Dropzone Card */}
                <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs">
                    <h2 className="border-b pb-2 text-sm font-bold tracking-tight text-foreground">
                        {t('Product Imagery (Up to 5 images)')}
                    </h2>

                    <label className="block cursor-pointer space-y-3 rounded-2xl border-2 border-dashed bg-muted/20 p-6 text-center transition-colors hover:bg-muted/40">
                        <input
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={selectedFiles.length >= 5}
                        />
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                            <UploadCloud className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-foreground">
                                {t('Click or drag images to upload')}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                                {t(
                                    'JPG, PNG, WebP up to 2MB (first image becomes primary)',
                                )}
                            </div>
                        </div>
                    </label>

                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-5 gap-3 pt-2">
                            {previewUrls.map((url, idx) => (
                                <div
                                    key={idx}
                                    className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
                                >
                                    <img
                                        src={url}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-rose-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                    {idx === 0 && (
                                        <div className="absolute bottom-1 left-1 rounded-md bg-purple-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                            {t('Primary')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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
                            {submitting ? t('Saving...') : t('Save Product')}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
