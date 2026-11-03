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
            {
                name: 'Roasted Salted Cashews',
                sku: 'SNAK-CSH-002',
                quantity: 2,
                unit_price_cents: 580,
                line_total_cents: 1160,
            },
            {
                name: 'Aged White Cheddar Block',
                sku: 'DAIR-CHD-004',
                quantity: 1,
                unit_price_cents: 520,
                line_total_cents: 520,
            },
            {
                name: 'Cold Brew Coffee Concentrate',
                sku: 'BEV-CLD-001',
                quantity: 1,
                unit_price_cents: 699,
                line_total_cents: 699,
            },
        ],
    };

    const [status, setStatus] = useState(order.status);

    const steps = [
        {
            key: 'placed',
            label: t('Order Placed'),
            time: order.created_at,
            done: true,
        },
        {
            key: 'paid',
            label: t('Payment Confirmed'),
            time: t('Mock KHQR verified'),
            done: [
                'paid',
                'processing',
                'shipped',
                'delivered',
                'completed',
            ].includes(status),
        },
        {
            key: 'processing',
            label: t('Packed & Ready'),
            time: t('DMart Fulfillment'),
            done: ['processing', 'shipped', 'delivered', 'completed'].includes(
                status,
            ),
        },
        {
            key: 'shipped',
            label: t('Out for Delivery'),
            time: order.carrier
                ? `${order.carrier} (${order.tracking_number})`
                : t('Dispatched'),
            done: ['shipped', 'delivered', 'completed'].includes(status),
        },
        {
            key: 'delivered',
            label: t('Delivered'),
            time: t('Delivered to Door'),
            done: ['delivered', 'completed'].includes(status),
        },
    ];

    const handleCancel = () => {
        setStatus('cancelled');
        toast.info(
            t('Order :number cancelled.', { number: order.order_number }),
        );
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <Head title={`Order ${order.order_number} — DMart Groceries`} />

            {/* Back Button & Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                    >
                        <Link href="/orders">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            {t('All Orders')}
                        </Link>
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
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
            <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs">
                <h2 className="text-sm font-bold tracking-tight text-foreground">
                    {t('Fulfillment Progress')}
                </h2>

                <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-5">
                    {steps.map((step, idx) => (
                        <div
                            key={step.key}
                            className="relative flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1.5"
                        >
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    step.done
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {step.done ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    idx + 1
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <div
                                    className={`text-xs font-semibold ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}
                                >
                                    {step.label}
                                </div>
                                <div className="text-[10px] leading-tight text-muted-foreground">
                                    {step.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {order.tracking_number && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Truck className="h-4 w-4 text-emerald-600" />
                            {t('Shipped via')} <strong>{order.carrier}</strong>
                        </span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono">
                            {t('Tracking:')} {order.tracking_number}
                        </span>
                    </div>
                )}
            </div>

            {/* 2 Cols: Line Items & Customer Details */}
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
                {/* Line Items Table */}
                <div className="overflow-hidden rounded-3xl border bg-card shadow-xs md:col-span-2">
                    <div className="border-b p-5 text-sm font-bold">
                        {t('Items Purchased')} ({order.items.length})
                    </div>
                    <div className="divide-y text-xs">
                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between gap-4 p-4"
                            >
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium text-foreground">
                                        {item.name}
                                    </div>
                                    <div className="font-mono text-[10px] text-muted-foreground">
                                        {item.sku}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {formatMoney(item.unit_price_cents)}{' '}
                                        &times; {item.quantity}
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-foreground">
                                    {formatMoney(item.line_total_cents)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 border-t bg-muted/20 p-5 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Subtotal')}</span>
                            <span className="font-medium text-foreground">
                                {formatMoney(order.subtotal_cents)}
                            </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Delivery Fee')}</span>
                            <span className="font-medium text-foreground">
                                {order.shipping_fee_cents === 0
                                    ? t('Free Shipping')
                                    : formatMoney(order.shipping_fee_cents)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-base font-bold text-foreground">
                            <span>{t('Grand Total')}</span>
                            <span className="text-emerald-700 dark:text-emerald-400">
                                {formatMoney(order.total_cents)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Shipping Address & Customer Info */}
                <div className="space-y-5 rounded-3xl border bg-card p-6 text-xs shadow-xs">
                    <h2 className="text-sm font-bold tracking-tight text-foreground">
                        {t('Delivery Destination')}
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <div className="space-y-0.5">
                                <div className="font-semibold text-foreground">
                                    {order.customer_name}
                                </div>
                                <div className="text-muted-foreground">
                                    {order.shipping_address}
                                </div>
                                <div className="text-muted-foreground">
                                    {order.shipping_city}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Phone className="h-4 w-4 shrink-0 text-emerald-600" />
                            <span className="text-muted-foreground">
                                {order.customer_phone}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <div className="text-muted-foreground">
                            {t('Payment Method')}:
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground capitalize">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            <span>{t('Mock KHQR Payment (Bakong)')}</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            asChild
                            className="w-full rounded-xl bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-700"
                        >
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
