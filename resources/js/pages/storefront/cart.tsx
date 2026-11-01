import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useCart } from '@/hooks/use-cart';
import { ProductThumb } from '@/components/product-thumb';
import { QuantityStepper } from '@/components/quantity-stepper';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { formatMoney } from '@/lib/money';
import {
    Trash2,
    ArrowRight,
    ShoppingBag,
    Truck,
    ShieldCheck,
    Store,
} from 'lucide-react';

export default function CartView() {
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
        <div className="space-y-8">
            <Head title="Your Shopping Cart — DMart Groceries" />

            <div className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Shopping Cart
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {items.length} unique item{items.length === 1 ? '' : 's'} in your cart
                    </p>
                </div>

                {items.length > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearCart}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear Cart</span>
                    </Button>
                )}
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left: Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Free Shipping Progress Card */}
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                                <span className="flex items-center gap-1.5">
                                    <Truck className="w-4 h-4 text-emerald-600" />
                                    {centsNeededForFreeShipping > 0
                                        ? `Add ${formatMoney(centsNeededForFreeShipping)} more to get FREE Delivery!`
                                        : '🎉 You have unlocked FREE Delivery!'}
                                </span>
                                <span>{progressToFreeShipping}%</span>
                            </div>
                            <div className="w-full bg-emerald-200/60 dark:bg-emerald-900 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progressToFreeShipping}%` }}
                                />
                            </div>
                        </div>

                        {/* Items Rows */}
                        <div className="border rounded-2xl bg-card divide-y overflow-hidden shadow-xs">
                            {items.map(({ id, product, quantity }) => (
                                <div key={id} className="p-4 sm:p-5 flex gap-4 items-center justify-between">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <Link href={`/products/${product.slug}`} className="shrink-0">
                                            <ProductThumb
                                                name={product.name}
                                                imageUrl={product.image_url}
                                                size="md"
                                                className="rounded-xl"
                                            />
                                        </Link>
                                        <div className="min-w-0 space-y-0.5">
                                            <div className="text-[10px] font-mono text-muted-foreground uppercase">
                                                {product.sku}
                                            </div>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="font-semibold text-sm hover:text-emerald-600 transition-colors block truncate max-w-[200px] sm:max-w-[320px]"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="text-xs text-muted-foreground">
                                                {formatMoney(product.price_cents)} &bull; {product.unit}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Stepper & Line Total */}
                                    <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                                        <QuantityStepper
                                            value={quantity}
                                            onChange={(qty) => updateQuantity(product.id, qty)}
                                            min={1}
                                            max={product.stock}
                                            size="sm"
                                        />

                                        <div className="text-right min-w-[70px]">
                                            <div className="text-sm font-bold text-foreground">
                                                {formatMoney(product.price_cents * quantity)}
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(product.id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <Button asChild variant="outline" size="sm" className="text-xs">
                                <Link href="/products">
                                    &larr; Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar */}
                    <div className="border rounded-2xl bg-card p-6 space-y-5 shadow-xs sticky top-24">
                        <h2 className="font-bold text-base tracking-tight text-foreground">
                            Order Summary
                        </h2>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="font-medium text-foreground">{formatMoney(subtotalCents)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Local Delivery (Phnom Penh)</span>
                                <span className="font-medium text-foreground">
                                    {shippingFeeCents === 0 ? (
                                        <span className="text-emerald-600 font-bold">FREE</span>
                                    ) : (
                                        formatMoney(shippingFeeCents)
                                    )}
                                </span>
                            </div>
                            <div className="pt-3 border-t flex justify-between text-base font-bold text-foreground">
                                <span>Estimated Total</span>
                                <span className="text-emerald-700 dark:text-emerald-400">
                                    {formatMoney(totalCents)}
                                </span>
                            </div>
                        </div>

                        <Button asChild size="xl" variant="emerald" className="w-full font-bold shadow-md gap-2">
                            <Link href="/checkout">
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>

                        <div className="p-3 bg-muted/40 rounded-xl space-y-1.5 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Safe Mock KHQR Checkout</span>
                            </div>
                            <p>
                                Simulated Bakong payment. No real credit card or bank account required for this demo.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="Your cart is empty"
                    description="Looks like you haven't added any fresh groceries to your cart yet. Explore our pantry and farm-fresh items."
                    actionLabel="Explore Products"
                    actionHref="/products"
                    icon={ShoppingBag}
                />
            )}
        </div>
    );
}
