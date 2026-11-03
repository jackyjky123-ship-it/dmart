import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Truck,
    Package,
    MapPin,
    Phone,
    ShieldCheck,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    name: string;
    sku: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
}

interface OrderDetailProps {
    order?: {
        id: number;
        order_number: string;
        channel: string;
        status: string;
        customer_name: string;
        customer_phone: string;
        shipping_address: string;
        shipping_city: string;
        total_cents: number;
        subtotal_cents: number;
        shipping_fee_cents: number;
        created_at: string;
        payment_method: string;
        tracking_number: string | null;
        carrier: string | null;
        items: OrderItem[];
    };
}

export default function OrderShow({ order: initialOrder }: OrderDetailProps) {
    const { t } = useTranslation();
    const order = initialOrder || {
        id: 102,
        order_number: 'DM-00102',
        channel: 'online',
        status: 'shipped',
        customer_name: 'Vannak Chan',
        customer_phone: '+855 98 765 432',
        shipping_address: '#18B St 310, Boeung Keng Kang 1',
        shipping_city: 'Phnom Penh',
        total_cents: 2185,
        subtotal_cents: 2185,
        shipping_fee_cents: 0,
        created_at: '2026-11-01 10:30',
        payment_method: 'khqr',
        tracking_number: 'DM-TRK-9905',
        carrier: 'Grab Express',
        items: [
            { name: 'Roasted Salted Cashews', sku: 'SNAK-CSH-002', quantity: 2, unit_price_cents: 580, line_total_cents: 1160 },
            { name: 'Aged White Cheddar Block', sku: 'DAIR-CHD-004', quantity: 1, unit_price_cents: 520, line_total_cents: 520 },
            { name: 'Cold Brew Coffee Concentrate', sku: 'BEV-CLD-001', quantity: 1, unit_price_cents: 699, line_total_cents: 699 },
        ],
    };

    const [status, setStatus] = useState(order.status);

    const steps = [
        { key: 'placed', label: t('Order Placed'), time: order.created_at, done: true },
        { key: 'paid', label: t('Payment Confirmed'), time: t('Mock KHQR verified'), done: ['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(status) },
        { key: 'processing', label: t('Packed & Ready'), time: t('DMart Fulfillment'), done: ['processing', 'shipped', 'delivered', 'completed'].includes(status) },
        { key: 'shipped', label: t('Out for Delivery'), time: order.carrier ? `${order.carrier} (${order.tracking_number})` : t('Dispatched'), done: ['shipped', 'delivered', 'completed'].includes(status) },
        { key: 'delivered', label: t('Delivered'), time: t('Delivered to Door'), done: ['delivered', 'completed'].includes(status) },
    ];

    const handleCancel = () => {
        setStatus('cancelled');
        toast.info(t('Order :number cancelled.', { number: order.order_number }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Head title={`Order ${order.order_number} — DMart Groceries`} />

            {/* Back Button & Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <Link href="/orders">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            {t('All Orders')}
                        </Link>
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                        {t('Order')} #{order.order_number}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                    {status === 'pending_payment' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="text-xs text-rose-600 hover:text-rose-700"
                        >
                            {t('Cancel Order')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Step Timeline */}
            <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                <h2 className="text-sm font-bold tracking-tight text-foreground">
                    {t('Fulfillment Progress')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                    {steps.map((step, idx) => (
                        <div key={step.key} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 relative">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                    step.done
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <div className="space-y-0.5">
                                <div className={`text-xs font-semibold ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.label}
                                </div>
                                <div className="text-[10px] text-muted-foreground leading-tight">
                                    {step.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {order.tracking_number && (
                    <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                        <span className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            {t('Shipped via')} <strong>{order.carrier}</strong>
                        </span>
                        <span className="font-mono bg-muted px-2 py-0.5 rounded-md">
                            {t('Tracking:')} {order.tracking_number}
                        </span>
                    </div>
                )}
            </div>

            {/* 2 Cols: Line Items & Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Line Items Table */}
                <div className="md:col-span-2 border rounded-3xl bg-card overflow-hidden shadow-xs">
                    <div className="p-5 border-b font-bold text-sm">
                        {t('Items Purchased')} ({order.items.length})
                    </div>
                    <div className="divide-y text-xs">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <div className="font-medium text-foreground text-sm">{item.name}</div>
                                    <div className="text-[10px] font-mono text-muted-foreground">{item.sku}</div>
                                    <div className="text-muted-foreground">
                                        {formatMoney(item.unit_price_cents)} &times; {item.quantity}
                                    </div>
                                </div>
                                <div className="font-bold text-sm text-foreground">
                                    {formatMoney(item.line_total_cents)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="p-5 bg-muted/20 border-t space-y-2 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Subtotal')}</span>
                            <span className="font-medium text-foreground">{formatMoney(order.subtotal_cents)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Delivery Fee')}</span>
                            <span className="font-medium text-foreground">
                                {order.shipping_fee_cents === 0 ? t('Free Shipping') : formatMoney(order.shipping_fee_cents)}
                            </span>
                        </div>
                        <div className="pt-2 border-t flex justify-between text-base font-bold text-foreground">
                            <span>{t('Grand Total')}</span>
                            <span className="text-emerald-700 dark:text-emerald-400">
                                {formatMoney(order.total_cents)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Shipping Address & Customer Info */}
                <div className="border rounded-3xl bg-card p-6 space-y-5 shadow-xs text-xs">
                    <h2 className="font-bold text-sm tracking-tight text-foreground">
                        {t('Delivery Destination')}
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                                <div className="font-semibold text-foreground">{order.customer_name}</div>
                                <div className="text-muted-foreground">{order.shipping_address}</div>
                                <div className="text-muted-foreground">{order.shipping_city}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-muted-foreground">{order.customer_phone}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                        <div className="text-muted-foreground">{t('Payment Method')}:</div>
                        <div className="font-medium capitalize flex items-center gap-1.5 text-foreground">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>{t('Mock KHQR Payment (Bakong)')}</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">
                            <Link href="/products">
                                {t('Shop More Groceries')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
