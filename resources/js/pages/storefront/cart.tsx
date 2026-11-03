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

    const centsNeededForFreeShipping = Math.max(0, freeShippingThresholdCents - subtotalCents);

    return (
        <div className="space-y-8 text-white pb-12">
            <Head title="Shopping Bag — DMART Exclusive Drops" />

            <div className="flex items-center justify-between pb-4 border-b border-[#282828]">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                        {t('Shopping Bag')}
                    </h1>
                    <p className="text-xs text-[#737373] font-mono mt-0.5">
                        {items.length === 1
                            ? t(':count UNIQUE PIECE IN YOUR BAG', { count: items.length })
                            : t(':count UNIQUE PIECES IN YOUR BAG', { count: items.length })}
                    </p>
                </div>

                {items.length > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearCart}
                        className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 gap-1.5"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('Clear Bag')}</span>
                    </Button>
                )}
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left: Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Free Shipping Progress */}
                        <div className="p-4 rounded-xl border border-[#2d2d2d] bg-[#1a1a1a] space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider font-mono">
                                    <Truck className="w-4 h-4 text-[#F25623]" />
                                    {centsNeededForFreeShipping === 0
                                        ? t('Free Express Shipping unlocked!')
                                        : t('Add :amount more for FREE Global Shipping', { amount: formatMoney(centsNeededForFreeShipping) })}
                                </span>
                                <span className="text-xs font-mono text-[#F25623] font-bold">
                                    {Math.round(progressToFreeShipping)}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#252525] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#F25623] transition-all duration-300"
                                    style={{ width: `${progressToFreeShipping}%` }}
                                />
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border border-[#282828] rounded-xl bg-[#1a1a1a] divide-y divide-[#242424] overflow-hidden">
                            {items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#202020] transition-colors"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#242424] shrink-0 border border-[#333]">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ProductThumb name={product.name} size="full" />
                                            )}
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <div className="text-[10px] font-mono text-[#737373] uppercase">
                                                {product.sku}
                                            </div>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="text-sm font-bold text-white hover:text-[#F25623] transition-colors line-clamp-1"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="text-xs text-[#a3a3a3] font-mono">
                                                {formatMoney(product.price_cents)} &bull; {product.unit}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                                        <QuantityStepper
                                            value={quantity}
                                            onChange={(qty) => updateQuantity(product.id, qty)}
                                            min={1}
                                            max={product.stock}
                                            size="sm"
                                        />

                                        <div className="text-right min-w-[70px]">
                                            <div className="text-sm font-bold text-white font-mono">
                                                {formatMoney(product.price_cents * quantity)}
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(product.id)}
                                            className="h-8 w-8 text-[#737373] hover:text-rose-400"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <Button asChild variant="outline" size="sm" className="text-xs border-[#333] bg-[#1a1a1a] text-white hover:border-[#F25623]">
                                <Link href="/products">
                                    &larr; {t('Continue Exploring Drops')}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar */}
                    <div className="border border-[#282828] rounded-xl bg-[#1a1a1a] p-6 space-y-5 shadow-lg sticky top-24">
                        <h2 className="font-black text-sm uppercase tracking-wider text-white font-mono">
                            {t('Order Summary')}
                        </h2>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between text-[#a3a3a3] font-mono">
                                <span>{t('Subtotal')}</span>
                                <span className="font-medium text-white">{formatMoney(subtotalCents)}</span>
                            </div>
                            <div className="flex justify-between text-[#a3a3a3] font-mono">
                                <span>{t('Express Courier Shipping')}</span>
                                <span className="font-medium text-white">
                                    {shippingFeeCents === 0 ? (
                                        <span className="text-[#F25623] font-bold">{t('Free Shipping')}</span>
                                    ) : (
                                        formatMoney(shippingFeeCents)
                                    )}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-[#262626] flex justify-between text-base font-bold text-white font-mono">
                                <span>{t('Estimated Total')}</span>
                                <span className="text-[#F25623]">
                                    {formatMoney(totalCents)}
                                </span>
                            </div>
                        </div>

                        <Button asChild size="lg" variant="orange" className="w-full font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#F25623]/25 gap-2">
                            <Link href="/checkout">
                                <span>{t('Proceed to Checkout')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>

                        <div className="p-3 bg-[#141414] rounded-xl space-y-1.5 text-[11px] text-[#737373] border border-[#242424]">
                            <div className="flex items-center gap-1.5 font-semibold text-white">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#F25623]" />
                                <span>{t('100% Authentic Release')}</span>
                            </div>
                            <p>
                                {t('Worldwide express delivery. Free size exchanges and returns within 30 days.')}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title={t('Your shopping bag is empty')}
                    description={t("Looks like you haven't added any pieces to your bag yet. Explore our capsule drops and limited editions.")}
                    actionLabel={t('Explore Capsule Drops')}
                    actionHref="/products"
                    icon={ShoppingBag}
                />
            )}
        </div>
    );
}
