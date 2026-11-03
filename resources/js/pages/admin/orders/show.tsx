import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import {
    ArrowLeft,
    CheckCircle2,
    Truck,
    Package,
    MapPin,
    Phone,
    ShieldCheck,
    Save,
    RotateCcw,
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

export default function AdminOrderShow({ order: initialOrder }: OrderDetailProps) {
    const { t } = useTranslation();
    const order = initialOrder || {
        id: 103,
        order_number: 'DM-00103',
        channel: 'online',
        status: 'paid',
        customer_name: 'Chenda Meas',
        customer_phone: '+855 77 112 233',
        shipping_address: '#88 St 51, Toul Kork',
        shipping_city: 'Phnom Penh',
        total_cents: 1099,
        subtotal_cents: 899,
        shipping_fee_cents: 200,
        created_at: '2026-11-01 14:15',
        payment_method: 'khqr',
        tracking_number: '',
        carrier: 'Grab Express',
        items: [
            { name: 'Campari Vine Tomatoes', sku: 'PROD-TOM-005', quantity: 1, unit_price_cents: 280, line_total_cents: 280 },
            { name: 'French Butter Baguette', sku: 'BAKE-BAG-002', quantity: 2, unit_price_cents: 175, line_total_cents: 350 },
            { name: 'Sea Salt Kettle Potato Chips', sku: 'SNAK-KTL-001', quantity: 1, unit_price_cents: 220, line_total_cents: 220 },
        ],
    };

    const [status, setStatus] = useState(order.status);
    const [carrier, setCarrier] = useState(order.carrier || 'Grab Express');
    const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(t('Order :number status updated to :status!', { number: order.order_number, status: status.toUpperCase() }));
    };

    const handleCancelAndRestock = () => {
        setStatus('cancelled');
        toast.info(t('Order :number cancelled. Items automatically returned to stock ledger.', { number: order.order_number }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Head title={t('Fulfill Order :number — DMart Admin', { number: order.order_number })} />

            {/* Back Button & Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <Link href="/admin/orders">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            {t('All Orders')}
                        </Link>
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                        {t('Fulfill #:number', { number: order.order_number })}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                </div>
            </div>

            {/* Fulfillment Status Transition Form Card */}
            <form onSubmit={handleUpdateStatus} className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                    <h2 className="font-bold text-sm tracking-tight text-foreground">
                        {t('Update Fulfillment Pipeline')}
                    </h2>
                    <span className="text-xs text-muted-foreground">{t('Order Channel:')} <strong className="uppercase">{t(order.channel)}</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="orderStatus" className="text-xs">{t('Order Status')}</Label>
                        <select
                            id="orderStatus"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full h-10 px-3 bg-background border rounded-xl text-xs font-semibold focus:ring-1 focus:ring-purple-500"
                        >
                            <option value="pending_payment">{t('Pending Payment')}</option>
                            <option value="paid">{t('Paid (Confirmed)')}</option>
                            <option value="processing">{t('Processing & Packing')}</option>
                            <option value="shipped">{t('Shipped / Out for Delivery')}</option>
                            <option value="delivered">{t('Delivered to Customer')}</option>
                            <option value="cancelled">{t('Cancelled')}</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="carrier" className="text-xs">{t('Local Delivery Carrier')}</Label>
                        <Input
                            id="carrier"
                            value={carrier}
                            onChange={(e) => setCarrier(e.target.value)}
                            placeholder={t('e.g. Grab Express, J&T')}
                            className="h-10 text-xs rounded-xl"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tracking" className="text-xs">{t('Tracking Number')}</Label>
                        <Input
                            id="tracking"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder={t('e.g. DM-TRK-1038')}
                            className="h-10 text-xs rounded-xl font-mono"
                        />
                    </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelAndRestock}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" /> {t('Cancel & Restock Order')}
                    </Button>

                    <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm">
                        <Save className="w-3.5 h-3.5" />
                        <span>{t('Save Status')}</span>
                    </Button>
                </div>
            </form>

            {/* Line Items & Destination Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Items */}
                <div className="md:col-span-2 border rounded-3xl bg-card overflow-hidden shadow-xs">
                    <div className="p-5 border-b font-bold text-sm">
                        {t('Order Items Snapshot (:count)', { count: order.items.length })}
                    </div>
                    <div className="divide-y text-xs">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between gap-4">
                                <div>
                                    <div className="font-semibold text-foreground text-sm">{item.name}</div>
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

                    <div className="p-5 bg-muted/20 border-t space-y-2 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Subtotal')}</span>
                            <span className="font-medium text-foreground">{formatMoney(order.subtotal_cents)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('Delivery Fee')}</span>
                            <span className="font-medium text-foreground">{formatMoney(order.shipping_fee_cents)}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between text-base font-bold text-foreground">
                            <span>{t('Total')}</span>
                            <span className="text-purple-700 dark:text-purple-400">
                                {formatMoney(order.total_cents)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Destination */}
                <div className="border rounded-3xl bg-card p-6 space-y-4 shadow-xs text-xs">
                    <h3 className="font-bold text-sm text-foreground">{t('Delivery Customer')}</h3>
                    <div className="space-y-2 text-muted-foreground">
                        <div className="font-semibold text-foreground text-sm">{order.customer_name}</div>
                        <div>{order.customer_phone}</div>
                        <div className="pt-2 border-t text-foreground font-medium">
                            {order.shipping_address}
                        </div>
                        <div>{order.shipping_city}</div>
                    </div>

                    <div className="pt-3 border-t">
                        <div className="text-muted-foreground">{t('Payment:')}</div>
                        <div className="font-semibold uppercase text-foreground">{order.payment_method}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
