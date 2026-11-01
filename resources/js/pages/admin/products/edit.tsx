import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

export default function ProductEdit({ product, categories = [], errors = {} }: ProductEditProps) {
    const [name, setName] = useState(product.name);
    const [slug, setSlug] = useState(product.slug);
    const [sku, setSku] = useState(product.sku);
    const [categoryId, setCategoryId] = useState(product.category_id.toString());
    const [price, setPrice] = useState(product.price);
    const [compareAt, setCompareAt] = useState(product.compare_at_price || '');
    const [lowStockThreshold, setLowStockThreshold] = useState(product.low_stock_threshold.toString());
    const [description, setDescription] = useState(product.description || '');
    const [isActive, setIsActive] = useState(product.is_active);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.patch(`/admin/products/${product.id}`, {
            name,
            slug,
            sku,
            category_id: categoryId,
            price,
            compare_at_price: compareAt || null,
            low_stock_threshold: lowStockThreshold,
            description,
            is_active: isActive ? 1 : 0,
        }, {
            onSuccess: () => toast.success(`Product "${name}" updated successfully.`),
            onError: (err) => {
                const first = Object.values(err)[0];
                toast.error(first || 'Failed to update product.');
            },
            onFinish: () => setSubmitting(false),
        });
    };

    const handleUploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        const formData = new FormData();
        Array.from(e.target.files).forEach((file) => {
            formData.append('images[]', file);
        });

        router.post(`/admin/products/${product.id}/images`, formData, {
            onSuccess: () => toast.success('Images uploaded successfully.'),
            onError: (err) => {
                const first = Object.values(err)[0];
                toast.error(first || 'Failed to upload images.');
            },
            onFinish: () => setUploading(false),
        });
    };

    const handleSetPrimary = (image: ProductImage) => {
        router.patch(`/admin/products/${product.id}/images/${image.id}/primary`, {}, {
            onSuccess: () => toast.success('Primary image updated.'),
            onError: () => toast.error('Failed to update primary image.'),
        });
    };

    const handleDeleteImage = (image: ProductImage) => {
        if (confirm('Delete this product image?')) {
            router.delete(`/admin/products/${product.id}/images/${image.id}`, {
                onSuccess: () => toast.success('Image deleted.'),
                onError: () => toast.error('Failed to delete image.'),
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Head title={`Edit ${product.name} — DMart Admin`} />

            <div className="flex items-center gap-3 pb-4 border-b">
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    <Link href="/admin/products">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Products
                    </Link>
                </Button>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
                    Edit {product.name}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information Card */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <h2 className="font-bold text-sm tracking-tight text-foreground pb-2 border-b">
                        Basic Information
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs">Product Name</Label>
                            <Input
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 text-xs rounded-xl"
                            />
                            {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="sku" className="text-xs">SKU / Code</Label>
                                <Input
                                    id="sku"
                                    required
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    className="h-10 text-xs rounded-xl font-mono"
                                />
                                {errors.sku && <p className="text-xs text-rose-600">{errors.sku}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="category" className="text-xs">Category</Label>
                                <select
                                    id="category"
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full h-10 px-3 bg-background border rounded-xl text-xs font-medium focus:ring-1 focus:ring-purple-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-xs text-rose-600">{errors.category_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="slug" className="text-xs">Slug</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="h-10 text-xs rounded-xl font-mono"
                                />
                                {errors.slug && <p className="text-xs text-rose-600">{errors.slug}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="desc" className="text-xs">Description</Label>
                            <textarea
                                id="desc"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 bg-background border rounded-xl text-xs focus:ring-1 focus:ring-purple-500"
                            />
                            {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* Pricing Card */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <h2 className="font-bold text-sm tracking-tight text-foreground pb-2 border-b">
                        Pricing & Thresholds
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="price" className="text-xs">Selling Price (USD)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="pl-7 h-10 text-xs rounded-xl font-bold"
                                />
                            </div>
                            {errors.price && <p className="text-xs text-rose-600">{errors.price}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="compareAt" className="text-xs">Compare-At Price (USD)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                                <Input
                                    id="compareAt"
                                    type="number"
                                    step="0.01"
                                    value={compareAt}
                                    onChange={(e) => setCompareAt(e.target.value)}
                                    placeholder="Optional"
                                    className="pl-7 h-10 text-xs rounded-xl"
                                />
                            </div>
                            {errors.compare_at_price && <p className="text-xs text-rose-600">{errors.compare_at_price}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="lowStock" className="text-xs">Low Stock Threshold</Label>
                            <Input
                                id="lowStock"
                                type="number"
                                value={lowStockThreshold}
                                onChange={(e) => setLowStockThreshold(e.target.value)}
                                className="h-10 text-xs rounded-xl"
                            />
                            {errors.low_stock_threshold && <p className="text-xs text-rose-600">{errors.low_stock_threshold}</p>}
                        </div>
                    </div>

                    <div className="pt-2 text-xs text-muted-foreground">
                        Current stock: <strong>{product.stock} units</strong>. To adjust inventory balances, visit the <Link href="/admin/stock" className="text-purple-600 underline font-semibold">Stock & Ledger</Link> section.
                    </div>
                </div>

                {/* Active Checkbox */}
                <div className="p-4 rounded-2xl bg-card border flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="active"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                    />
                    <Label htmlFor="active" className="text-xs cursor-pointer">
                        <span className="font-bold">Active in Catalog</span> &mdash; Customer storefront and POS can see and purchase this product.
                    </Label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button asChild variant="outline" className="rounded-xl text-xs">
                        <Link href="/admin/products">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold gap-1.5 px-6 shadow-md">
                        <Save className="w-4 h-4" />
                        <span>{submitting ? 'Saving...' : 'Update Product'}</span>
                    </Button>
                </div>
            </form>

            {/* Media Management Card */}
            <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-2 border-b">
                    <div>
                        <h2 className="font-bold text-sm tracking-tight text-foreground">
                            Product Images
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Upload photos, set primary thumbnail, or remove outdated images (max 5)
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
                            <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled={uploading}>
                                <span>
                                    <UploadCloud className="w-4 h-4" />
                                    <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
                                </span>
                            </Button>
                        </label>
                    )}
                </div>

                {product.images.length === 0 ? (
                    <div className="p-8 border-2 border-dashed rounded-2xl text-center text-muted-foreground text-xs">
                        No product images uploaded yet. The storefront and POS will display a colored letter-tile fallback.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {product.images.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-2xl border bg-muted overflow-hidden group shadow-2xs">
                                <img src={img.url} alt="Product image" className="w-full h-full object-cover" />

                                {img.is_primary ? (
                                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Primary
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleSetPrimary(img)}
                                        className="absolute top-2 left-2 h-6 text-[10px] px-2 bg-background/80 hover:bg-background backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Set Primary
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteImage(img)}
                                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-sm"
                                    title="Delete image"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
