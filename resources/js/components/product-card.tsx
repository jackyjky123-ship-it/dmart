import React from 'react';
import { Link } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartProduct, useCart } from '@/hooks/use-cart';
import { Plus, ShoppingCart, Check } from 'lucide-react';
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

    return (
        <div
            className={cn(
                'group relative flex flex-col justify-between rounded-2xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-emerald-500/40',
                className
            )}
        >
            <div>
                {/* Image / Letter Thumbnail */}
                <Link href={`/products/${product.slug}`} className="block relative aspect-square w-full mb-3 rounded-xl overflow-hidden bg-muted/40">
                    <ProductThumb name={product.name} imageUrl={product.image_url} size="full" className="rounded-none transition-transform duration-300 group-hover:scale-105" />

                    {/* Category pill */}
                    <span className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-xs text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded-md shadow-2xs">
                        {product.category_name}
                    </span>

                    {/* Stock status indicator */}
                    {isOutOfStock ? (
                        <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                            Out of stock
                        </span>
                    ) : isLowStock ? (
                        <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                            Only {product.stock} left
                        </span>
                    ) : null}
                </Link>

                {/* Title & SKU */}
                <div className="space-y-1">
                    <div className="text-[11px] font-mono text-muted-foreground">{product.sku}</div>
                    <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="text-xs text-muted-foreground">{product.unit}</div>
                </div>
            </div>

            {/* Price & Add to Cart button */}
            <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
                <Price cents={product.price_cents} compareAtCents={product.compare_at_price_cents} size="md" />

                <Button
                    type="button"
                    size="sm"
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product)}
                    className={cn(
                        'h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 transition-all',
                        cartItem
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    )}
                >
                    {cartItem ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{cartItem.quantity} in cart</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
