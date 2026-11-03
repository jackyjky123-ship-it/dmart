import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '@/components/product-card';
import { ProductThumb } from '@/components/product-thumb';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CartProduct, useCart } from '@/hooks/use-cart';
import { useTranslation } from '@/hooks/use-translation';
import {
    ShoppingCart,
    Heart,
    Truck,
    ShieldCheck,
    RotateCcw,
    ChevronRight,
    Star,
    Maximize2,
    Check,
    Ruler,
    Sparkles,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductImage {
    id: number;
    url: string;
    alt?: string;
}

interface ProductDetailProps {
    product?:
        | (CartProduct & { description?: string; images?: ProductImage[] })
        | null;
    relatedProducts?: CartProduct[];
}

const DEFAULT_STREETWEAR_PRODUCT = {
    id: 101,
    name: 'Essential Oversized Hoodie',
    slug: 'essential-oversized-hoodie',
    sku: 'HD-ESS-01',
    price_cents: 5999,
    compare_at_price_cents: 8999,
    stock: 24,
    unit: 'Charcoal Gray',
    category_name: 'Hoodies & Fleece',
    image_url: null,
    images: [] as ProductImage[],
    description:
        'Premium heavyweight cotton hoodie with an oversized fit for ultimate comfort and modern style. Tailored with dropped shoulders and double-needle reinforced seams.',
};

const COLOR_OPTIONS = [
    { name: 'Charcoal Gray', hex: '#374151', class: 'bg-[#374151]' },
    { name: 'Heather Gray', hex: '#9ca3af', class: 'bg-[#9ca3af]' },
    { name: 'Warm Beige', hex: '#d6cebe', class: 'bg-[#d6cebe]' },
    { name: 'Jet Black', hex: '#111827', class: 'bg-[#111827]' },
    { name: 'Brand Orange', hex: '#F25623', class: 'bg-[#F25623]' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const DEFAULT_RELATED: CartProduct[] = [
    {
        id: 102,
        name: 'Minimal Everyday Hoodie',
        slug: 'minimal-everyday-hoodie',
        sku: 'HD-MIN-02',
        price_cents: 5499,
        compare_at_price_cents: null,
        stock: 16,
        unit: 'Sand Beige',
        category_name: 'Hoodies',
        image_url: null,
    },
    {
        id: 103,
        name: 'Classic Boxy Sweatshirt',
        slug: 'classic-boxy-sweatshirt',
        sku: 'SW-BOX-03',
        price_cents: 4999,
        compare_at_price_cents: null,
        stock: 20,
        unit: 'Jet Black',
        category_name: 'Sweatshirts',
        image_url: null,
    },
    {
        id: 104,
        name: 'Zip Up Fleece Hoodie',
        slug: 'zip-up-fleece-hoodie',
        sku: 'HD-ZIP-04',
        price_cents: 6499,
        compare_at_price_cents: null,
        stock: 12,
        unit: 'Oatmeal Heather',
        category_name: 'Hoodies',
        image_url: null,
    },
    {
        id: 105,
        name: 'Essential Street Hoodie',
        slug: 'essential-street-hoodie',
        sku: 'HD-STR-05',
        price_cents: 5999,
        compare_at_price_cents: 7999,
        stock: 10,
        unit: 'Pitch Black',
        category_name: 'Hoodies',
        image_url: null,
    },
];

export default function ProductShow({
    product: propProduct,
    relatedProducts = [],
}: ProductDetailProps) {
    const { t } = useTranslation();
    const product = propProduct || DEFAULT_STREETWEAR_PRODUCT;
    const { addToCart, items } = useCart();

    const gallery =
        product.images && product.images.length > 0
            ? product.images.map((img) => ({
                  id: img.id,
                  url: img.url,
                  label: img.alt || product.name,
              }))
            : product.image_url
              ? [{ id: 0, url: product.image_url, label: product.name }]
              : [];

    const [selectedImage, setSelectedImage] = useState<string | null>(
        gallery[0]?.url || product.image_url || null,
    );
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeTab, setActiveTab] = useState<
        'details' | 'materials' | 'fit' | 'shipping'
    >('details');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const [zoomOpen, setZoomOpen] = useState(false);

    const isOutOfStock = product.stock <= 0;
    const cartItem = items.find((i) => i.product.id === product.id);

    const handleAdd = () => {
        addToCart({
            ...product,
            unit: `${selectedColor.name} / ${selectedSize}`,
        });
        toast.success(
            t('Added :name (:size) to bag', {
                name: product.name,
                size: selectedSize,
            }),
        );
    };

    const related =
        relatedProducts.length > 0 ? relatedProducts : DEFAULT_RELATED;

    return (
        <div className="space-y-16 pb-12 text-foreground">
            <Head title={`${product.name} — DMART Exclusive Drops`} />

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                <Link
                    href="/"
                    className="transition-colors hover:text-[#F25623]"
                >
                    {t('Home')}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <Link
                    href="/products"
                    className="transition-colors hover:text-[#F25623]"
                >
                    {t('Catalog')}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="max-w-[280px] truncate font-semibold text-foreground">
                    {product.name}
                </span>
            </div>

            {/* Main Product Container (Inspired by product_detail_layout.png) */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 xl:gap-12">
                {/* Left Column: Vertical Thumbnails + Main Viewport (7 cols) */}
                <div className="flex flex-col-reverse gap-4 sm:flex-row lg:col-span-7">
                    {/* Thumbnail Stack */}
                    {gallery.length > 1 && (
                        <div className="flex shrink-0 gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
                            {gallery.map((thumb) => (
                                <button
                                    key={thumb.id}
                                    onClick={() => setSelectedImage(thumb.url)}
                                    className={cn(
                                        'relative h-20 w-16 overflow-hidden rounded-lg border bg-card transition-all sm:h-24 sm:w-20',
                                        selectedImage === thumb.url
                                            ? 'border-[#F25623] ring-1 ring-[#F25623]'
                                            : 'border-border opacity-70 hover:border-foreground/30 hover:opacity-100',
                                    )}
                                >
                                    <img
                                        src={thumb.url}
                                        alt={thumb.label}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main High-Res Viewport */}
                    <div className="group relative aspect-3/4 flex-1 overflow-hidden rounded-2xl border border-border bg-card">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <ProductThumb
                                name={product.name}
                                size="full"
                                className="h-full w-full rounded-2xl"
                            />
                        )}

                        {/* Zoom button */}
                        {selectedImage && (
                            <button
                                onClick={() => setZoomOpen(true)}
                                className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-black/60 text-white shadow-lg backdrop-blur-md transition-all hover:border-[#F25623] hover:bg-[#F25623]"
                                title="Expand preview"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Information, Selectors & Checkout (5 cols) */}
                <div className="space-y-6 lg:col-span-5">
                    {/* Category Tag */}
                    <div className="inline-block rounded-full border border-border bg-muted px-3 py-1 font-mono text-[10px] tracking-widest text-[#F25623] uppercase">
                        {t('New Arrival • Limited Drop')}
                    </div>

                    {/* Title & Reviews */}
                    <div className="space-y-2">
                        <h1 className="font-sans text-3xl font-black tracking-tight text-foreground uppercase sm:text-4xl">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 text-xs">
                            <div className="flex items-center text-amber-400">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            </div>
                            <span className="font-semibold text-foreground">
                                4.8
                            </span>
                            <span className="text-muted-foreground">
                                ({t(':count reviews', { count: 128 })})
                            </span>
                        </div>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-3">
                        <span className="font-sans text-3xl font-black text-foreground">
                            ${(product.price_cents / 100).toFixed(2)}
                        </span>
                        {product.compare_at_price_cents && (
                            <span className="font-mono text-lg text-muted-foreground line-through">
                                $
                                {(product.compare_at_price_cents / 100).toFixed(
                                    2,
                                )}
                            </span>
                        )}
                        <span className="rounded border border-[#F25623]/40 bg-[#F25623]/20 px-2 py-0.5 text-xs font-bold tracking-wider text-[#F25623] uppercase">
                            {t('33% OFF')}
                        </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {product.description ||
                            DEFAULT_STREETWEAR_PRODUCT.description}
                    </p>

                    {/* Color Swatches */}
                    <div className="space-y-2 pt-2">
                        <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            {t('Color')}:{' '}
                            <span className="font-bold text-foreground">
                                {selectedColor.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setSelectedColor(c)}
                                    className={cn(
                                        'h-7 w-7 rounded-full border-2 transition-transform duration-150',
                                        c.class,
                                        selectedColor.name === c.name
                                            ? 'scale-110 border-foreground ring-2 ring-[#F25623]'
                                            : 'border-transparent hover:scale-105',
                                    )}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('Size')}:{' '}
                                <span className="font-bold text-foreground">
                                    {selectedSize}
                                </span>
                            </span>
                            <button
                                onClick={() => setSizeGuideOpen(true)}
                                className="flex items-center gap-1 text-[11px] tracking-wider text-[#F25623] uppercase hover:underline"
                            >
                                <Ruler className="h-3.5 w-3.5" />
                                <span>{t('Size Guide')}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {SIZES.map((sz) => (
                                <button
                                    key={sz}
                                    onClick={() => setSelectedSize(sz)}
                                    className={cn(
                                        'h-11 w-12 rounded-lg border text-xs font-bold tracking-wider uppercase transition-all',
                                        selectedSize === sz
                                            ? 'border-foreground bg-white text-black shadow-md'
                                            : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                                    )}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions: Add to Cart + Wishlist */}
                    <div className="flex items-center gap-3 pt-3">
                        <Button
                            variant="orange"
                            size="lg"
                            disabled={isOutOfStock}
                            onClick={handleAdd}
                            className="h-12 flex-1 gap-2 rounded-xl text-xs font-black tracking-widest uppercase shadow-lg shadow-[#F25623]/25"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            <span>{t('Add to Cart')}</span>
                        </Button>

                        <button
                            onClick={() => {
                                setIsWishlisted(!isWishlisted);
                                toast(
                                    isWishlisted
                                        ? t('Removed from wishlist')
                                        : t('Saved to wishlist'),
                                );
                            }}
                            className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-xl border transition-all',
                                isWishlisted
                                    ? 'border-[#F25623] bg-[#F25623]/20 text-[#F25623]'
                                    : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                            )}
                            title={t('Add to Wishlist')}
                        >
                            <Heart
                                className={cn(
                                    'h-5 w-5',
                                    isWishlisted ? 'fill-[#F25623]' : '',
                                )}
                            />
                        </button>
                    </div>

                    {/* Trust Badges (From product_detail_layout.png) */}
                    <div className="grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
                        <div className="space-y-1">
                            <Truck className="mx-auto h-4 w-4 text-[#F25623]" />
                            <div className="text-[11px] font-bold tracking-wider text-foreground uppercase">
                                {t('Free Shipping')}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                {t('On orders over $99')}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <RotateCcw className="mx-auto h-4 w-4 text-[#F25623]" />
                            <div className="text-[11px] font-bold tracking-wider text-foreground uppercase">
                                {t('Easy Returns')}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                {t('30-day return policy')}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <ShieldCheck className="mx-auto h-4 w-4 text-[#F25623]" />
                            <div className="text-[11px] font-bold tracking-wider text-foreground uppercase">
                                {t('Secure Payment')}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                {t('100% secure checkout')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabbed Product Details Section (Inspired by product_detail_layout.png) */}
            <section className="space-y-8 border-t border-border pt-12">
                {/* Tab Triggers */}
                <div className="flex items-center gap-8 overflow-x-auto border-b border-border pb-3 font-mono text-sm tracking-wider uppercase">
                    {[
                        { key: 'details', label: t('Details') },
                        { key: 'materials', label: t('Materials') },
                        { key: 'fit', label: t('Size & Fit') },
                        { key: 'shipping', label: t('Shipping & Returns') },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={cn(
                                'border-b-2 pb-2 font-bold whitespace-nowrap transition-all',
                                activeTab === tab.key
                                    ? 'border-[#F25623] text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Display */}
                <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-border bg-background p-6 md:grid-cols-2 lg:p-8">
                    <div className="space-y-4">
                        {activeTab === 'details' && (
                            <>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Crafted from high-density, custom-knit
                                    heavyweight fleece, this piece delivers an
                                    uncompromising drape and substantial
                                    silhouette that holds its form all day.
                                </p>
                                <ul className="space-y-2.5 pt-2 text-xs text-foreground">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-[#F25623]" />
                                        <span>
                                            Signature boxy oversized fit with
                                            dropped shoulder seam
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-[#F25623]" />
                                        <span>
                                            Double-lined deep hood with custom
                                            matte hardware aglets
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-[#F25623]" />
                                        <span>
                                            Heavy-gauge 2x2 ribbed cuffs and hem
                                            for lifetime stretch recovery
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-[#F25623]" />
                                        <span>
                                            Pre-shrunk fabric to preserve exact
                                            drape after washing
                                        </span>
                                    </li>
                                </ul>
                            </>
                        )}

                        {activeTab === 'materials' && (
                            <>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    100% Ring-Spun Combed Organic Cotton (460
                                    GSM). Milled in Portugal with custom enzyme
                                    wash treatment for vintage softness.
                                </p>
                                <ul className="space-y-2.5 pt-2 text-xs text-foreground">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-[#F25623]" />
                                        <span>
                                            Zero synthetic polyester blend
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-[#F25623]" />
                                        <span>
                                            Low-impact reactive dyes resistant
                                            to fading
                                        </span>
                                    </li>
                                </ul>
                            </>
                        )}

                        {activeTab === 'fit' && (
                            <>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Intentionally cut oversized. For a classic
                                    relaxed streetwear look, take your true
                                    size. For a tailored silhouette, size down
                                    one size.
                                </p>
                                <div className="pt-2 text-xs text-muted-foreground">
                                    Model is 6'1" (185cm) and wears a size
                                    Large.
                                </div>
                            </>
                        )}

                        {activeTab === 'shipping' && (
                            <>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Orders ship worldwide within 24-48 hours.
                                    DHL Express delivery takes 2-4 business
                                    days. Free returns and size exchanges within
                                    30 days of delivery.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Material Specification Card */}
                    <div className="relative flex aspect-16/10 flex-col justify-between overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted to-card p-6">
                        <div className="font-mono text-[11px] tracking-widest text-[#F25623] uppercase">
                            Material Specification
                        </div>
                        <div className="font-mono text-xl font-black tracking-tight text-foreground uppercase sm:text-2xl">
                            460 GSM Heavyweight Dense Fleece
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                            Double-needle reinforcement &bull; Anti-shrink
                            pre-wash
                        </div>
                    </div>
                </div>
            </section>

            {/* "You May Also Like" Recommendation Grid (From product_detail_layout.png) */}
            <section className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-sans text-2xl font-black tracking-tight text-foreground uppercase">
                        {t('You May Also Like')}
                    </h2>
                    <Link
                        href="/products"
                        className="flex items-center gap-1 font-mono text-xs tracking-wider text-[#F25623] uppercase hover:underline"
                    >
                        <span>{t('View All')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-4">
                    {related.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </section>

            {/* Size Guide Modal */}
            <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
                <DialogContent className="max-w-md border-border bg-card text-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black tracking-wider text-foreground uppercase">
                            Hoodie Sizing Guide (Inches)
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2 text-xs">
                        <table className="w-full border-collapse border border-border text-left">
                            <thead>
                                <tr className="bg-muted text-muted-foreground">
                                    <th className="border border-border p-2">
                                        Size
                                    </th>
                                    <th className="border border-border p-2">
                                        Chest
                                    </th>
                                    <th className="border border-border p-2">
                                        Length
                                    </th>
                                    <th className="border border-border p-2">
                                        Sleeve
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-foreground">
                                <tr>
                                    <td className="border border-border p-2 font-bold text-foreground">
                                        S
                                    </td>
                                    <td className="border border-border p-2">
                                        44"
                                    </td>
                                    <td className="border border-border p-2">
                                        27"
                                    </td>
                                    <td className="border border-border p-2">
                                        24"
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2 font-bold text-foreground">
                                        M
                                    </td>
                                    <td className="border border-border p-2">
                                        47"
                                    </td>
                                    <td className="border border-border p-2">
                                        28"
                                    </td>
                                    <td className="border border-border p-2">
                                        25"
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2 font-bold text-foreground">
                                        L
                                    </td>
                                    <td className="border border-border p-2">
                                        50"
                                    </td>
                                    <td className="border border-border p-2">
                                        29"
                                    </td>
                                    <td className="border border-border p-2">
                                        26"
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2 font-bold text-foreground">
                                        XL
                                    </td>
                                    <td className="border border-border p-2">
                                        53"
                                    </td>
                                    <td className="border border-border p-2">
                                        30"
                                    </td>
                                    <td className="border border-border p-2">
                                        27"
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2 font-bold text-foreground">
                                        XXL
                                    </td>
                                    <td className="border border-border p-2">
                                        56"
                                    </td>
                                    <td className="border border-border p-2">
                                        31"
                                    </td>
                                    <td className="border border-border p-2">
                                        28"
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-[11px] text-muted-foreground">
                            Measured flat across garments. Tolerance +/- 0.5
                            inches.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Zoom Image Modal */}
            <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
                <DialogContent className="max-w-4xl overflow-hidden border-border bg-black p-0">
                    <img
                        src={selectedImage || undefined}
                        alt="Expanded preview"
                        className="h-auto max-h-[85vh] w-full object-contain"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
