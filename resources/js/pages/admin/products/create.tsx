import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    UploadCloud,
    Check,
    Save,
    Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductCreateProps {
    categories?: Category[];
}

export default function ProductCreate({ categories = [] }: ProductCreateProps) {
    const [name, setName] = useState('Fresh Dragonfruit (Red Flesh)');
    const [sku, setSku] = useState('PROD-DRG-006');
    const [categoryId, setCategoryId] = useState('1');
    const [price, setPrice] = useState('2.80');
    const [compareAt, setCompareAt] = useState('3.50');
    const [stock, setStock] = useState('35');
    const [lowStockThreshold, setLowStockThreshold] = useState('5');
    const [unit, setUnit] = useState('1 kg');
    const [description, setDescription] = useState(
        'Sweet, vibrant purple-red flesh dragonfruit grown locally in Kampong Cham. Rich in antioxidants and vitamin C.'
    );
    const [isActive, setIsActive] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Product "${name}" successfully saved to catalog!`);
        setTimeout(() => {
            router.visit('/admin/products');
        }, 500);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Head title="Create Grocery Item — DMart Admin" />

            <div className="flex items-center gap-3 pb-4 border-b">
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    <Link href="/admin/products">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Products
                    </Link>
                </Button>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Add New Product
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
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="category" className="text-xs">Category</Label>
                                <select
                                    id="category"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full h-10 px-3 bg-background border rounded-xl text-xs font-medium focus:ring-1 focus:ring-purple-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="unit" className="text-xs">Unit / Packaging</Label>
                                <Input
                                    id="unit"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="e.g. 1L carton, 250g pack"
                                    className="h-10 text-xs rounded-xl"
                                />
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
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock Card */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <h2 className="font-bold text-sm tracking-tight text-foreground pb-2 border-b">
                        Pricing & Inventory
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="compareAt" className="text-xs">Compare-At Price (USD, Optional)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                                <Input
                                    id="compareAt"
                                    type="number"
                                    step="0.01"
                                    value={compareAt}
                                    onChange={(e) => setCompareAt(e.target.value)}
                                    className="pl-7 h-10 text-xs rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="stock" className="text-xs">Initial Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="h-10 text-xs rounded-xl font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="lowStock" className="text-xs">Low Stock Alert Threshold</Label>
                            <Input
                                id="lowStock"
                                type="number"
                                value={lowStockThreshold}
                                onChange={(e) => setLowStockThreshold(e.target.value)}
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Media Upload Dropzone Card */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <h2 className="font-bold text-sm tracking-tight text-foreground pb-2 border-b">
                        Product Imagery
                    </h2>

                    <div className="border-2 border-dashed rounded-2xl p-6 text-center space-y-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-foreground">Click to upload product image</div>
                            <div className="text-[11px] text-muted-foreground">JPG, PNG, WebP up to 2MB (or falls back to letter tile)</div>
                        </div>
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
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold gap-1.5 px-6 shadow-md">
                        <Save className="w-4 h-4" />
                        <span>Save Product</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
