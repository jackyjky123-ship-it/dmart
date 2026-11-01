import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { Price } from '@/components/price';
import { QuantityStepper } from '@/components/quantity-stepper';
import { StatusBadge } from '@/components/status-badge';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { CartProduct, useCart } from '@/hooks/use-cart';
import {
    ShoppingCart,
    Truck,
    ShieldCheck,
    RotateCcw,
    ChevronRight,
    ArrowLeft,
    Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductShowProps {
    product: CartProduct & { description: string };
    relatedProducts?: CartProduct[];
}

export default function ProductShow({ product, relatedProducts = [] }: ProductShowProps) {
    const { addToCart, items } = useCart();
    const [quantity, setQuantity] = useState(1);
    const cartItem = items.find((i) => i.product.id === product.id);

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    const handleAdd = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="space-y-12">
            <Head title={`${product.name} — DMart Groceries`} />

            {/* Breadcrumb & Back */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <Link href="/" className="hover:text-foreground">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/products" className="hover:text-foreground">Catalog</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/products?category=${(product as any).category_slug || ''}`} className="hover:text-foreground">
                    {product.category_name}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
            </div>

            {/* Main Product Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left: Product Image / Tile */}
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-muted/40 border p-6 flex items-center justify-center shadow-xs">
                    <ProductThumb name={product.name} imageUrl={product.image_url} size="xl" className="w-48 h-48 md:w-64 md:h-64 shadow-md" />

                    {isOutOfStock ? (
                        <div className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                            Out of Stock
                        </div>
                    ) : isLowStock ? (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                            Only {product.stock} items left
                        </div>
                    ) : (
                        <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                            In Stock
                        </div>
                    )}
                </div>

                {/* Right: Info & Actions */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                                {product.category_name}
                            </span>
                            <span className="text-muted-foreground">&bull;</span>
                            <span className="text-xs font-mono text-muted-foreground">SKU: {product.sku}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                            {product.name}
                        </h1>
                        <div className="text-sm text-muted-foreground">Unit: {product.unit}</div>
                    </div>

                    {/* Price Block */}
                    <div className="p-4 rounded-2xl bg-muted/30 border space-y-1">
                        <div className="text-xs text-muted-foreground">Retail Price</div>
                        <Price cents={product.price_cents} compareAtCents={product.compare_at_price_cents} size="xl" />
                        {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
                            <div className="text-xs text-emerald-600 font-semibold pt-1">
                                Save ${( (product.compare_at_price_cents - product.price_cents) / 100 ).toFixed(2)} with DMart value pricing
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About this item</h3>
                        <p className="text-sm leading-relaxed text-foreground/90">
                            {product.description}
                        </p>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3">
                            <QuantityStepper
                                value={quantity}
                                onChange={setQuantity}
                                min={1}
                                max={product.stock}
                                disabled={isOutOfStock}
                                size="lg"
                            />
                            <Button
                                size="lg"
                                variant="emerald"
                                disabled={isOutOfStock}
                                onClick={handleAdd}
                                className="flex-1 font-bold shadow-md gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>Add {quantity} to Cart</span>
                            </Button>
                        </div>

                        {cartItem && (
                            <div className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                                <Check className="w-4 h-4" />
                                <span>You have {cartItem.quantity} of this item in your cart</span>
                            </div>
                        )}
                    </div>

                    {/* Guarantees */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t text-xs">
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-card border">
                            <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold">Local 30-min Delivery</div>
                                <div className="text-muted-foreground text-[11px]">Free delivery on orders over $35</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-card border">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold">Quality Freshness</div>
                                <div className="text-muted-foreground text-[11px]">Picked fresh daily in Phnom Penh</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-bold tracking-tight">More in {product.category_name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((rel) => (
                            <ProductCard key={rel.id} product={rel} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
