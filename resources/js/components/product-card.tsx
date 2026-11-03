import React from 'react';
import { Link } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { CartProduct, useCart } from '@/hooks/use-cart';
import { useTranslation } from '@/hooks/use-translation';
import { Plus, Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: CartProduct;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { t } = useTranslation();
    const { addToCart, items } = useCart();
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock <= 0;
    const cartItem = items.find((i) => i.product.id === product.id);
    const hasDiscount = Boolean(
        product.compare_at_price_cents &&
        product.compare_at_price_cents > product.price_cents,
    );

    return (
        <div
            className={cn(
                'group relative flex flex-col justify-between rounded-xl border border-border bg-card p-3 text-foreground transition-all duration-200 hover:border-[#F25623]/80 hover:shadow-lg hover:shadow-[#F25623]/10 sm:p-4',
                className,
            )}
        >
            <div>
                {/* Image Preview with Badges */}
                <Link
                    href={`/products/${product.slug}`}
                    className="relative mb-3 block aspect-square w-full overflow-hidden rounded-lg bg-muted"
                >
                    <ProductThumb
                        name={product.name}
                        imageUrl={product.image_url}
                        size="full"
                        className="rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Sale / Drop Badge */}
                    {hasDiscount && (
                        <span className="absolute top-2 left-2 rounded bg-[#F25623] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                            {t('Sale')}
                        </span>
                    )}

                    {/* Stock status indicator */}
                    {isOutOfStock ? (
                        <span className="absolute top-2 right-2 rounded border border-neutral-700 bg-card/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                            {t('Sold Out')}
                        </span>
                    ) : isLowStock ? (
                        <span className="absolute top-2 right-2 rounded bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                            {t('Few Left')}
                        </span>
                    ) : (
                        <span className="absolute right-2 bottom-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white/90 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                            {t('QUICK VIEW')}
                        </span>
                    )}
                </Link>

                {/* Title & SKU */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                        <span className="uppercase">
                            {product.category_name
                                ? t(product.category_name)
                                : t('Apparel')}
                        </span>
                        <span>{product.sku}</span>
                    </div>

                    <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-foreground transition-colors group-hover:text-[#F25623]">
                            {product.name}
                        </h3>
                    </Link>
                </div>
            </div>

            {/* Price & Add to Cart button */}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                <Price
                    cents={product.price_cents}
                    compareAtCents={product.compare_at_price_cents}
                    size="md"
                    className="text-foreground"
                />

                <Button
                    type="button"
                    size="sm"
                    variant={cartItem ? 'outline' : 'orange'}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product)}
                    className={cn(
                        'h-8 rounded-lg px-3 text-xs font-bold tracking-wider uppercase transition-all',
                        cartItem
                            ? 'border-[#F25623] text-[#F25623] hover:bg-[#F25623]/10'
                            : '',
                    )}
                >
                    {cartItem ? (
                        <>
                            <Check className="mr-1 h-3.5 w-3.5" />
                            <span>{cartItem.quantity}</span>
                        </>
                    ) : (
                        <>
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            <span>{t('Add')}</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
