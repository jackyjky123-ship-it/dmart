import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useCart } from '@/hooks/use-cart';
import { ProductThumb } from '@/components/product-thumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/money';
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
        toast.info('Generating your simulated order and mock KHQR payload...');
        setTimeout(() => {
            setLoading(false);
            router.visit('/payment/105');
        }, 600);
    };

    return (
        <div className="space-y-8">
            <Head title="Checkout — DMart Groceries" />

            <div className="flex items-center gap-2 pb-4 border-b">
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    <Link href="/cart">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Cart
                    </Link>
                </Button>
                <div className="h-4 w-px bg-border mx-1" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Checkout & Delivery
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left 2 Cols: Delivery Form & Payment Choice */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Address Card */}
                    <div className="p-6 rounded-2xl bg-card border space-y-4 shadow-xs">
                        <div className="flex items-center gap-2 pb-3 border-b">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                1
                            </div>
                            <h2 className="font-bold text-base tracking-tight text-foreground">
                                Delivery Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs">Full Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-10 text-xs rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                                <Input
                                    id="phone"
                                    required
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="h-10 text-xs rounded-xl"
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label htmlFor="address" className="text-xs">Street Address / House / Condo</Label>
                                <Input
                                    id="address"
                                    required
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="h-10 text-xs rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city" className="text-xs">City / Province</Label>
                                <Input
                                    id="city"
                                    required
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    className="h-10 text-xs rounded-xl"
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label htmlFor="notes" className="text-xs">Delivery Notes for Driver (Optional)</Label>
                                <Input
                                    id="notes"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Gate code, landmark, drop-off spot..."
                                    className="h-10 text-xs rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="p-6 rounded-2xl bg-card border space-y-4 shadow-xs">
                        <div className="flex items-center gap-2 pb-3 border-b">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                2
                            </div>
                            <h2 className="font-bold text-base tracking-tight text-foreground">
                                Payment Method
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div
                                onClick={() => setForm({ ...form, paymentMethod: 'khqr' })}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                                    form.paymentMethod === 'khqr'
                                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                                        : 'border-border hover:border-muted-foreground/30'
                                }`}
                            >
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                                    <QrCode className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-bold text-xs flex items-center gap-1.5">
                                        <span>Mock KHQR</span>
                                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">Recommended</span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground leading-snug">
                                        Simulated Bakong / ABA PayWay QR. Instant simulation demo.
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => setForm({ ...form, paymentMethod: 'cash' })}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                                    form.paymentMethod === 'cash'
                                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                                        : 'border-border hover:border-muted-foreground/30'
                                }`}
                            >
                                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                                    <Banknote className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-bold text-xs">Cash on Delivery</div>
                                    <div className="text-[11px] text-muted-foreground leading-snug">
                                        Pay driver in cash upon physical grocery arrival.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <strong>Portfolio Simulation Notice:</strong> This is a demo checkout. Clicking proceed generates a mock order reference with a simulated QR code.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Order Review & Submit */}
                <div className="border rounded-2xl bg-card p-6 space-y-5 shadow-xs sticky top-24">
                    <h2 className="font-bold text-base tracking-tight text-foreground">
                        Order Review ({items.length} items)
                    </h2>

                    <div className="max-h-56 overflow-y-auto space-y-3 divide-y pr-1">
                        {items.map(({ id, product, quantity }) => (
                            <div key={id} className="pt-2 first:pt-0 flex items-center justify-between text-xs gap-3">
                                <div className="flex items-center gap-2.5 truncate">
                                    <ProductThumb name={product.name} imageUrl={product.image_url} size="sm" />
                                    <div className="truncate">
                                        <div className="font-medium truncate">{product.name}</div>
                                        <div className="text-[10px] text-muted-foreground">Qty: {quantity}</div>
                                    </div>
                                </div>
                                <div className="font-semibold shrink-0">
                                    {formatMoney(product.price_cents * quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 pt-3 border-t text-xs">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">{formatMoney(subtotalCents)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span className="font-medium text-foreground">
                                {shippingFeeCents === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatMoney(shippingFeeCents)}
                            </span>
                        </div>
                        <div className="pt-2 border-t flex justify-between text-base font-bold text-foreground">
                            <span>Total Due</span>
                            <span className="text-emerald-700 dark:text-emerald-400">
                                {formatMoney(totalCents)}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={items.length === 0}
                        loading={loading}
                        loadingText="Generating Payment..."
                        size="xl"
                        variant="emerald"
                        className="w-full font-bold shadow-md"
                    >
                        Place Order ({formatMoney(totalCents)})
                    </Button>
                </div>
            </form>
        </div>
    );
}
