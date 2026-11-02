import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CartProduct, useCart } from '@/hooks/use-cart';
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

interface ProductDetailProps {
    product?: (CartProduct & { description?: string }) | null;
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

export default function ProductShow({ product: propProduct, relatedProducts = [] }: ProductDetailProps) {
    const product = propProduct || DEFAULT_STREETWEAR_PRODUCT;
    const { addToCart, items } = useCart();

    const gallery = (product.images && product.images.length > 0)
        ? product.images.map((img) => ({ id: img.id, url: img.url, label: img.alt || product.name }))
        : product.image_url
            ? [{ id: 0, url: product.image_url, label: product.name }]
            : [];

    const [selectedImage, setSelectedImage] = useState<string | null>(gallery[0]?.url || product.image_url || null);
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'fit' | 'shipping'>('details');
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
        toast.success(`Added ${product.name} (${selectedSize}) to bag`);
    };

    const related = relatedProducts.length > 0 ? relatedProducts : DEFAULT_RELATED;

    return (
        <div className="space-y-16 pb-12 text-white">
            <Head title={`${product.name} — DMART Exclusive Drops`} />

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-[#a3a3a3] font-mono uppercase tracking-wider">
                <Link href="/" className="hover:text-[#F25623] transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#555]" />
                <Link href="/products" className="hover:text-[#F25623] transition-colors">Shop</Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#555]" />
                <span className="text-white font-semibold truncate max-w-[280px]">{product.name}</span>
            </div>

            {/* Main Product Container (Inspired by product_detail_layout.png) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
                {/* Left Column: Vertical Thumbnails + Main Viewport (7 cols) */}
                <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
                    {/* Thumbnail Stack */}
                    {gallery.length > 1 && (
                        <div className="flex sm:flex-col gap-3 shrink-0 overflow-x-auto sm:overflow-visible">
                            {gallery.map((thumb) => (
                                <button
                                    key={thumb.id}
                                    onClick={() => setSelectedImage(thumb.url)}
                                    className={cn(
                                        'relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border transition-all bg-[#1e1e1e]',
                                        selectedImage === thumb.url
                                            ? 'border-[#F25623] ring-1 ring-[#F25623]'
                                            : 'border-[#333] opacity-70 hover:opacity-100 hover:border-[#666]'
                                    )}
                                >
                                    <img src={thumb.url} alt={thumb.label} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main High-Res Viewport */}
                    <div className="relative flex-1 aspect-3/4 rounded-2xl overflow-hidden bg-[#1c1c1c] border border-[#2d2d2d] group">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <ProductThumb
                                name={product.name}
                                size="full"
                                className="w-full h-full rounded-2xl"
                            />
                        )}

                        {/* Zoom button */}
                        {selectedImage && (
                            <button
                                onClick={() => setZoomOpen(true)}
                                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-[#F25623] hover:border-[#F25623] transition-all shadow-lg"
                                title="Expand preview"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Information, Selectors & Checkout (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Category Tag */}
                    <div className="inline-block px-3 py-1 rounded-full bg-[#222222] border border-[#333] text-[10px] font-mono uppercase tracking-widest text-[#F25623]">
                        New Arrival &bull; Limited Drop
                    </div>

                    {/* Title & Reviews */}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 text-xs">
                            <div className="flex items-center text-amber-400">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            </div>
                            <span className="font-semibold text-white">4.8</span>
                            <span className="text-[#737373]">(128 reviews)</span>
                        </div>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-white font-sans">
                            ${(product.price_cents / 100).toFixed(2)}
                        </span>
                        {product.compare_at_price_cents && (
                            <span className="text-lg line-through text-[#666] font-mono">
                                ${(product.compare_at_price_cents / 100).toFixed(2)}
                            </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-[#F25623]/20 border border-[#F25623]/40 text-[#F25623] text-xs font-bold uppercase tracking-wider">
                            33% OFF
                        </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm text-[#a3a3a3] leading-relaxed">
                        {product.description || DEFAULT_STREETWEAR_PRODUCT.description}
                    </p>

                    {/* Color Swatches */}
                    <div className="space-y-2 pt-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#a3a3a3]">
                            Color: <span className="text-white font-bold">{selectedColor.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setSelectedColor(c)}
                                    className={cn(
                                        'w-7 h-7 rounded-full border-2 transition-transform duration-150',
                                        c.class,
                                        selectedColor.name === c.name
                                            ? 'scale-110 border-white ring-2 ring-[#F25623]'
                                            : 'border-transparent hover:scale-105'
                                    )}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold uppercase tracking-wider text-[#a3a3a3]">
                                Size: <span className="text-white font-bold">{selectedSize}</span>
                            </span>
                            <button
                                onClick={() => setSizeGuideOpen(true)}
                                className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#F25623] hover:underline"
                            >
                                <Ruler className="w-3.5 h-3.5" />
                                <span>Size Guide</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {SIZES.map((sz) => (
                                <button
                                    key={sz}
                                    onClick={() => setSelectedSize(sz)}
                                    className={cn(
                                        'w-12 h-11 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all',
                                        selectedSize === sz
                                            ? 'bg-white text-black border-white shadow-md'
                                            : 'bg-[#1e1e1e] border-[#333] text-[#a3a3a3] hover:border-[#666] hover:text-white'
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
                            className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest gap-2 shadow-lg shadow-[#F25623]/25"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                        </Button>

                        <button
                            onClick={() => {
                                setIsWishlisted(!isWishlisted);
                                toast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
                            }}
                            className={cn(
                                'w-12 h-12 rounded-xl border flex items-center justify-center transition-all',
                                isWishlisted
                                    ? 'bg-[#F25623]/20 border-[#F25623] text-[#F25623]'
                                    : 'border-[#333] bg-[#1e1e1e] text-[#a3a3a3] hover:text-white hover:border-[#666]'
                            )}
                            title="Add to Wishlist"
                        >
                            <Heart className={cn('w-5 h-5', isWishlisted ? 'fill-[#F25623]' : '')} />
                        </button>
                    </div>

                    {/* Trust Badges (From product_detail_layout.png) */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#262626] text-center">
                        <div className="space-y-1">
                            <Truck className="w-4 h-4 mx-auto text-[#F25623]" />
                            <div className="text-[11px] font-bold text-white uppercase tracking-wider">Free Shipping</div>
                            <div className="text-[10px] text-[#737373]">On orders over $99</div>
                        </div>
                        <div className="space-y-1">
                            <RotateCcw className="w-4 h-4 mx-auto text-[#F25623]" />
                            <div className="text-[11px] font-bold text-white uppercase tracking-wider">Easy Returns</div>
                            <div className="text-[10px] text-[#737373]">30-day return policy</div>
                        </div>
                        <div className="space-y-1">
                            <ShieldCheck className="w-4 h-4 mx-auto text-[#F25623]" />
                            <div className="text-[11px] font-bold text-white uppercase tracking-wider">Secure Payment</div>
                            <div className="text-[10px] text-[#737373]">100% secure checkout</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabbed Product Details Section (Inspired by product_detail_layout.png) */}
            <section className="border-t border-[#262626] pt-12 space-y-8">
                {/* Tab Triggers */}
                <div className="flex items-center gap-8 border-b border-[#262626] pb-3 text-sm font-mono uppercase tracking-wider overflow-x-auto">
                    {[
                        { key: 'details', label: 'Details' },
                        { key: 'materials', label: 'Materials' },
                        { key: 'fit', label: 'Size & Fit' },
                        { key: 'shipping', label: 'Shipping & Returns' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={cn(
                                'pb-2 border-b-2 font-bold transition-all whitespace-nowrap',
                                activeTab === tab.key
                                    ? 'border-[#F25623] text-white'
                                    : 'border-transparent text-[#737373] hover:text-[#d4d4d4]'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#171717] rounded-2xl border border-[#262626] p-6 lg:p-8">
                    <div className="space-y-4">
                        {activeTab === 'details' && (
                            <>
                                <p className="text-sm text-[#a3a3a3] leading-relaxed">
                                    Crafted from high-density, custom-knit heavyweight fleece, this piece delivers an uncompromising drape and substantial silhouette that holds its form all day.
                                </p>
                                <ul className="space-y-2.5 text-xs text-[#d4d4d4] pt-2">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#F25623]" />
                                        <span>Signature boxy oversized fit with dropped shoulder seam</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#F25623]" />
                                        <span>Double-lined deep hood with custom matte hardware aglets</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#F25623]" />
                                        <span>Heavy-gauge 2x2 ribbed cuffs and hem for lifetime stretch recovery</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#F25623]" />
                                        <span>Pre-shrunk fabric to preserve exact drape after washing</span>
                                    </li>
                                </ul>
                            </>
                        )}

                        {activeTab === 'materials' && (
                            <>
                                <p className="text-sm text-[#a3a3a3] leading-relaxed">
                                    100% Ring-Spun Combed Organic Cotton (460 GSM). Milled in Portugal with custom enzyme wash treatment for vintage softness.
                                </p>
                                <ul className="space-y-2.5 text-xs text-[#d4d4d4] pt-2">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#F25623]" />
                                        <span>Zero synthetic polyester blend</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#F25623]" />
                                        <span>Low-impact reactive dyes resistant to fading</span>
                                    </li>
                                </ul>
                            </>
                        )}

                        {activeTab === 'fit' && (
                            <>
                                <p className="text-sm text-[#a3a3a3] leading-relaxed">
                                    Intentionally cut oversized. For a classic relaxed streetwear look, take your true size. For a tailored silhouette, size down one size.
                                </p>
                                <div className="text-xs text-[#737373] pt-2">
                                    Model is 6'1" (185cm) and wears a size Large.
                                </div>
                            </>
                        )}

                        {activeTab === 'shipping' && (
                            <>
                                <p className="text-sm text-[#a3a3a3] leading-relaxed">
                                    Orders ship worldwide within 24-48 hours. DHL Express delivery takes 2-4 business days. Free returns and size exchanges within 30 days of delivery.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Material Specification Card */}
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gradient-to-br from-[#1e1e1e] to-[#121212] border border-[#333] p-6 flex flex-col justify-between">
                        <div className="text-[11px] font-mono uppercase tracking-widest text-[#F25623]">
                            Material Specification
                        </div>
                        <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-mono">
                            460 GSM Heavyweight Dense Fleece
                        </div>
                        <div className="text-xs text-[#888] font-mono">
                            Double-needle reinforcement &bull; Anti-shrink pre-wash
                        </div>
                    </div>
                </div>
            </section>

            {/* "You May Also Like" Recommendation Grid (From product_detail_layout.png) */}
            <section className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white font-sans">
                        You May Also Like
                    </h2>
                    <Link
                        href="/products"
                        className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#F25623] hover:underline"
                    >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {related.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </section>

            {/* Size Guide Modal */}
            <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
                <DialogContent className="max-w-md bg-[#1a1a1a] border-[#333] text-white">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
                            Hoodie Sizing Guide (Inches)
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2 text-xs">
                        <table className="w-full text-left border-collapse border border-[#333]">
                            <thead>
                                <tr className="bg-[#242424] text-[#a3a3a3]">
                                    <th className="p-2 border border-[#333]">Size</th>
                                    <th className="p-2 border border-[#333]">Chest</th>
                                    <th className="p-2 border border-[#333]">Length</th>
                                    <th className="p-2 border border-[#333]">Sleeve</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333] text-[#d4d4d4]">
                                <tr><td className="p-2 border border-[#333] font-bold text-white">S</td><td className="p-2 border border-[#333]">44"</td><td className="p-2 border border-[#333]">27"</td><td className="p-2 border border-[#333]">24"</td></tr>
                                <tr><td className="p-2 border border-[#333] font-bold text-white">M</td><td className="p-2 border border-[#333]">47"</td><td className="p-2 border border-[#333]">28"</td><td className="p-2 border border-[#333]">25"</td></tr>
                                <tr><td className="p-2 border border-[#333] font-bold text-white">L</td><td className="p-2 border border-[#333]">50"</td><td className="p-2 border border-[#333]">29"</td><td className="p-2 border border-[#333]">26"</td></tr>
                                <tr><td className="p-2 border border-[#333] font-bold text-white">XL</td><td className="p-2 border border-[#333]">53"</td><td className="p-2 border border-[#333]">30"</td><td className="p-2 border border-[#333]">27"</td></tr>
                                <tr><td className="p-2 border border-[#333] font-bold text-white">XXL</td><td className="p-2 border border-[#333]">56"</td><td className="p-2 border border-[#333]">31"</td><td className="p-2 border border-[#333]">28"</td></tr>
                            </tbody>
                        </table>
                        <p className="text-[11px] text-[#737373]">
                            Measured flat across garments. Tolerance +/- 0.5 inches.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Zoom Image Modal */}
            <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
                <DialogContent className="max-w-4xl p-0 bg-black border-[#333] overflow-hidden">
                    <img src={selectedImage} alt="Expanded preview" className="w-full h-auto max-h-[85vh] object-contain" />
                </DialogContent>
            </Dialog>
        </div>
    );
}
