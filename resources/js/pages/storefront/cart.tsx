import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useCart } from '@/hooks/use-cart';
import { ProductThumb } from '@/components/product-thumb';
import { QuantityStepper } from '@/components/quantity-stepper';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { useTranslation } from '@/hooks/use-translation';
import { formatMoney } from '@/lib/money';
import {
    Trash2,
    ArrowRight,
    ShoppingBag,
    Truck,
    ShieldCheck,
    Store,
    Sparkles,
} from 'lucide-react';

export default function CartView() {
    const { t } = useTranslation();
    const {
        items,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotalCents,
        shippingFeeCents,
        freeShippingThresholdCents,
        progressToFreeShipping,
        totalCents,
    } = useCart();

    const centsNeededForFreeShipping = Math.max(
        0,
        freeShippingThresholdCents - subtotalCents,
    );

    return (
        <div className="space-y-8 pb-12 text-foreground">
            <Head title={t('Shopping Bag — DMART Exclusive Drops')} />

            <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                    <h1 className="font-sans text-2xl font-black tracking-tight text-foreground uppercase sm:text-3xl">
                        {t('Shopping Bag')}
                    </h1>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {items.length === 1
                            ? t(':count UNIQUE PIECE IN YOUR BAG', {
                                  count: items.length,
                              })
                            : t(':count UNIQUE PIECES IN YOUR BAG', {
                                  count: items.length,
                              })}
                    </p>
                </div>

                {items.length > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearCart}
                        className="gap-1.5 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{t('Clear Bag')}</span>
                    </Button>
                )}
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                    {/* Left: Cart Items List */}
                    <div className="space-y-4 lg:col-span-2">
                        {/* Free Shipping Progress */}
                        <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-mono font-bold tracking-wider text-foreground uppercase">
                                    <Truck className="h-4 w-4 text-[#F25623]" />
                                    {centsNeededForFreeShipping === 0
                                        ? t('Free Express Shipping unlocked!')
                                        : t(
                                              'Add :amount more for FREE Global Shipping',
                                              {
                                                  amount: formatMoney(
                                                      centsNeededForFreeShipping,
                                                  ),
                                              },
                                          )}
                                </span>
                                <span className="font-mono text-xs font-bold text-[#F25623]">
                                    {Math.round(progressToFreeShipping)}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full bg-[#F25623] transition-all duration-300"
                                    style={{
                                        width: `${progressToFreeShipping}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                            {items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ProductThumb
                                                    name={product.name}
                                                    size="full"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <div className="font-mono text-[10px] text-muted-foreground uppercase">
                                                {product.sku}
                                            </div>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="line-clamp-1 text-sm font-bold text-foreground transition-colors hover:text-[#F25623]"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="font-mono text-xs text-muted-foreground">
                                                {formatMoney(
                                                    product.price_cents,
                                                )}{' '}
                                                &bull; {product.unit}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                                        <QuantityStepper
                                            value={quantity}
                                            onChange={(qty) =>
                                                updateQuantity(product.id, qty)
                                            }
                                            min={1}
                                            max={product.stock}
                                            size="sm"
                                        />

                                        <div className="min-w-[70px] text-right">
                                            <div className="font-mono text-sm font-bold text-foreground">
                                                {formatMoney(
                                                    product.price_cents *
                                                        quantity,
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeFromCart(product.id)
                                            }
                                            className="h-8 w-8 text-muted-foreground hover:text-rose-400"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-border bg-card text-xs text-foreground hover:border-[#F25623]"
                            >
                                <Link href="/products">
                                    &larr; {t('Continue Exploring Drops')}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar */}
                    <div className="sticky top-24 space-y-5 rounded-xl border border-border bg-card p-6 shadow-lg">
                        <h2 className="font-mono text-sm font-black tracking-wider text-foreground uppercase">
                            {t('Order Summary')}
                        </h2>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between font-mono text-muted-foreground">
                                <span>{t('Subtotal')}</span>
                                <span className="font-medium text-foreground">
                                    {formatMoney(subtotalCents)}
                                </span>
                            </div>
                            <div className="flex justify-between font-mono text-muted-foreground">
                                <span>{t('Express Courier Shipping')}</span>
                                <span className="font-medium text-foreground">
                                    {shippingFeeCents === 0 ? (
                                        <span className="font-bold text-[#F25623]">
                                            {t('Free Shipping')}
                                        </span>
                                    ) : (
                                        formatMoney(shippingFeeCents)
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-3 font-mono text-base font-bold text-foreground">
                                <span>{t('Estimated Total')}</span>
                                <span className="text-[#F25623]">
                                    {formatMoney(totalCents)}
                                </span>
                            </div>
                        </div>

                        <Button
                            asChild
                            size="lg"
                            variant="orange"
                            className="h-12 w-full gap-2 text-xs font-black tracking-widest uppercase shadow-lg shadow-[#F25623]/25"
                        >
                            <Link href="/checkout">
                                <span>{t('Proceed to Checkout')}</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>

                        <div className="space-y-1.5 rounded-xl border border-border bg-background p-3 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#F25623]" />
                                <span>{t('100% Authentic Release')}</span>
                            </div>
                            <p>
                                {t(
                                    'Worldwide express delivery. Free size exchanges and returns within 30 days.',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title={t('Your shopping bag is empty')}
                    description={t(
                        "Looks like you haven't added any pieces to your bag yet. Explore our capsule drops and limited editions.",
                    )}
                    actionLabel={t('Explore Capsule Drops')}
                    actionHref="/products"
                    icon={ShoppingBag}
                />
            )}
        </div>
    );
}
