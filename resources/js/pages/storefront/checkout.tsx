import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useCart } from '@/hooks/use-cart';
import { ProductThumb } from '@/components/product-thumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import {
    ShieldCheck,
    CreditCard,
    QrCode,
    Banknote,
    Truck,
    ArrowLeft,
    CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutView() {
    const { t } = useTranslation();
    const { items, subtotalCents, shippingFeeCents, totalCents } = useCart();

    const [form, setForm] = useState({
        name: 'Sophea Pich',
        phone: '+855 12 345 678',
        address: '#42 St 240, Daun Penh',
        city: 'Phnom Penh',
        notes: 'Please ring the doorbell or call upon arrival.',
        paymentMethod: 'khqr',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        toast.info(
            t('Generating your simulated order and mock KHQR payload...'),
        );
        setTimeout(() => {
            setLoading(false);
            router.visit('/payment/105');
        }, 600);
    };

    return (
        <div className="space-y-8">
            <Head title={t('Checkout — DMart Groceries')} />

            <div className="flex items-center gap-2 border-b pb-4">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                >
                    <Link href="/cart">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        {t('Back to Cart')}
                    </Link>
                </Button>
                <div className="mx-1 h-4 w-px bg-border" />
                <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                    {t('Checkout & Delivery')}
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3"
            >
                {/* Left 2 Cols: Delivery Form & Payment Choice */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Delivery Address Card */}
                    <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                                1
                            </div>
                            <h2 className="text-base font-bold tracking-tight text-foreground">
                                {t('Delivery Details')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs">
                                    {t('Full Name')}
                                </Label>
                                <Input
                                    id="name"
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    className="h-10 rounded-xl text-xs"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs">
                                    {t('Phone Number')}
                                </Label>
                                <Input
                                    id="phone"
                                    required
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="h-10 rounded-xl text-xs"
                                />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="address" className="text-xs">
                                    {t('Street Address / House / Condo')}
                                </Label>
                                <Input
                                    id="address"
                                    required
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            address: e.target.value,
                                        })
                                    }
                                    className="h-10 rounded-xl text-xs"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city" className="text-xs">
                                    {t('City / Province')}
                                </Label>
                                <Input
                                    id="city"
                                    required
                                    value={form.city}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            city: e.target.value,
                                        })
                                    }
                                    className="h-10 rounded-xl text-xs"
                                />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="notes" className="text-xs">
                                    {t('Delivery Notes for Driver (Optional)')}
                                </Label>
                                <Input
                                    id="notes"
                                    value={form.notes}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder={t(
                                        'Gate code, landmark, drop-off spot...',
                                    )}
                                    className="h-10 rounded-xl text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                                2
                            </div>
                            <h2 className="text-base font-bold tracking-tight text-foreground">
                                {t('Payment Method')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div
                                onClick={() =>
                                    setForm({ ...form, paymentMethod: 'khqr' })
                                }
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                                    form.paymentMethod === 'khqr'
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs dark:bg-emerald-950/20'
                                        : 'border-border hover:border-muted-foreground/30'
                                }`}
                            >
                                <div className="mt-0.5 shrink-0 rounded-lg bg-emerald-100 p-2 text-emerald-700">
                                    <QrCode className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                        <span>{t('Mock KHQR')}</span>
                                        <span className="py-0.2 rounded-full bg-emerald-600 px-1.5 text-[10px] text-white">
                                            {t('Recommended')}
                                        </span>
                                    </div>
                                    <div className="text-[11px] leading-snug text-muted-foreground">
                                        {t(
                                            'Simulated Bakong / ABA PayWay QR. Instant simulation demo.',
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() =>
                                    setForm({ ...form, paymentMethod: 'cash' })
                                }
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                                    form.paymentMethod === 'cash'
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs dark:bg-emerald-950/20'
                                        : 'border-border hover:border-muted-foreground/30'
                                }`}
                            >
                                <div className="mt-0.5 shrink-0 rounded-lg bg-amber-100 p-2 text-amber-700">
                                    <Banknote className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-xs font-bold">
                                        {t('Cash on Delivery')}
                                    </div>
                                    <div className="text-[11px] leading-snug text-muted-foreground">
                                        {t(
                                            'Pay driver in cash upon physical grocery arrival.',
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <div>
                                <strong>
                                    {t('Portfolio Simulation Notice:')}
                                </strong>{' '}
                                {t(
                                    'This is a demo checkout. Clicking proceed generates a mock order reference with a simulated QR code.',
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Order Review & Submit */}
                <div className="sticky top-24 space-y-5 rounded-2xl border bg-card p-6 shadow-xs">
                    <h2 className="text-base font-bold tracking-tight text-foreground">
                        {t('Order Review')} (
                        {t(':count items', { count: items.length })})
                    </h2>

                    <div className="max-h-56 space-y-3 divide-y overflow-y-auto pr-1">
                        {items.map(({ id, product, quantity }) => (
                            <div
                                key={id}
                                className="flex items-center justify-between gap-3 pt-2 text-xs first:pt-0"
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <ProductThumb
                                        name={product.name}
                                        imageUrl={product.image_url}
                                        size="sm"
                                    />
                                    <div className="truncate">
                                        <div className="truncate font-medium">
                                            {product.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {t('Qty')}: {quantity}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 font-semibold">
                                    {formatMoney(
                                        product.price_cents * quantity,
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 border-t pt-3 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Subtotal')}</span>
                            <span className="font-medium text-foreground">
                                {formatMoney(subtotalCents)}
                            </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Delivery Fee')}</span>
                            <span className="font-medium text-foreground">
                                {shippingFeeCents === 0 ? (
                                    <span className="font-bold text-emerald-600">
                                        {t('Free Shipping')}
                                    </span>
                                ) : (
                                    formatMoney(shippingFeeCents)
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-base font-bold text-foreground">
                            <span>{t('Total Due')}</span>
                            <span className="text-emerald-700 dark:text-emerald-400">
                                {formatMoney(totalCents)}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={items.length === 0}
                        loading={loading}
                        loadingText={t('Generating Payment...')}
                        size="xl"
                        variant="emerald"
                        className="w-full font-bold shadow-md"
                    >
                        {t('Place Order (:amount)', {
                            amount: formatMoney(totalCents),
                        })}
                    </Button>
                </div>
            </form>
        </div>
    );
}
