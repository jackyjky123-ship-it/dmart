import React from 'react';
import { Link } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { CartProduct, useCart } from '@/hooks/use-cart';
import { Plus, Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: CartProduct;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { addToCart, items } = useCart();
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock <= 0;
    const cartItem = items.find((i) => i.product.id === product.id);
    const hasDiscount = Boolean(product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents);

    return (
        <div
            className={cn(
                'group relative flex flex-col justify-between rounded-xl border border-[#282828] bg-[#1a1a1a] p-3 sm:p-4 text-white transition-all duration-200 hover:border-[#F25623]/80 hover:shadow-lg hover:shadow-[#F25623]/10',
                className
            )}
        >
            <div>
                {/* Image Preview with Badges */}
                <Link
                    href={`/products/${product.slug}`}
                    className="block relative aspect-square w-full mb-3 rounded-lg overflow-hidden bg-[#222222]"
                >
                    <ProductThumb
                        name={product.name}
                        imageUrl={product.image_url}
                        size="full"
                        className="rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Sale / Drop Badge */}
                    {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-[#F25623] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                            Sale
                        </span>
                    )}

                    {/* Stock status indicator */}
                    {isOutOfStock ? (
                        <span className="absolute top-2 right-2 bg-neutral-900/90 text-neutral-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-700">
                            Sold Out
                        </span>
                    ) : isLowStock ? (
                        <span className="absolute top-2 right-2 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            Few Left
                        </span>
                    ) : (
                        <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-xs text-[10px] font-mono text-white/90 px-2 py-0.5 rounded">
                            QUICK VIEW
                        </span>
                    )}
                </Link>

                {/* Title & SKU */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#737373] font-mono">
                        <span className="uppercase">{product.category_name || 'Apparel'}</span>
                        <span>{product.sku}</span>
                    </div>

                    <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-white group-hover:text-[#F25623] transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>
            </div>

            {/* Price & Add to Cart button */}
            <div className="mt-4 pt-3 border-t border-[#282828] flex items-center justify-between gap-2">
                <Price
                    cents={product.price_cents}
                    compareAtCents={product.compare_at_price_cents}
                    size="md"
                    className="text-white"
                />

                <Button
                    type="button"
                    size="sm"
                    variant={cartItem ? "outline" : "orange"}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product)}
                    className={cn(
                        'font-bold text-xs h-8 px-3 rounded-lg uppercase tracking-wider transition-all',
                        cartItem ? 'border-[#F25623] text-[#F25623] hover:bg-[#F25623]/10' : ''
                    )}
                >
                    {cartItem ? (
                        <>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            <span>{cartItem.quantity}</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            <span>Add</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
