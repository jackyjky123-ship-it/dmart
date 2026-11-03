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

export default function AdminOrderShow({
    order: initialOrder,
}: OrderDetailProps) {
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
            {
                name: 'Campari Vine Tomatoes',
                sku: 'PROD-TOM-005',
                quantity: 1,
                unit_price_cents: 280,
                line_total_cents: 280,
            },
            {
                name: 'French Butter Baguette',
                sku: 'BAKE-BAG-002',
                quantity: 2,
                unit_price_cents: 175,
                line_total_cents: 350,
            },
            {
                name: 'Sea Salt Kettle Potato Chips',
                sku: 'SNAK-KTL-001',
                quantity: 1,
                unit_price_cents: 220,
                line_total_cents: 220,
            },
        ],
    };

    const [status, setStatus] = useState(order.status);
    const [carrier, setCarrier] = useState(order.carrier || 'Grab Express');
    const [trackingNumber, setTrackingNumber] = useState(
        order.tracking_number || '',
    );

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(
            t('Order :number status updated to :status!', {
                number: order.order_number,
                status: status.toUpperCase(),
            }),
        );
    };

    const handleCancelAndRestock = () => {
        setStatus('cancelled');
        toast.info(
            t(
                'Order :number cancelled. Items automatically returned to stock ledger.',
                { number: order.order_number },
            ),
        );
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <Head
                title={t('Fulfill Order :number — DMart Admin', {
                    number: order.order_number,
                })}
            />

            {/* Back Button & Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                    >
                        <Link href="/admin/orders">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            {t('All Orders')}
                        </Link>
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                        {t('Fulfill #:number', { number: order.order_number })}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                </div>
            </div>

            {/* Fulfillment Status Transition Form Card */}
            <form
                onSubmit={handleUpdateStatus}
                className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs"
            >
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-sm font-bold tracking-tight text-foreground">
                        {t('Update Fulfillment Pipeline')}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        {t('Order Channel:')}{' '}
                        <strong className="uppercase">
                            {t(order.channel)}
                        </strong>
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="orderStatus" className="text-xs">
                            {t('Order Status')}
                        </Label>
                        <select
                            id="orderStatus"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-10 w-full rounded-xl border bg-background px-3 text-xs font-semibold focus:ring-1 focus:ring-purple-500"
                        >
                            <option value="pending_payment">
                                {t('Pending Payment')}
                            </option>
                            <option value="paid">
                                {t('Paid (Confirmed)')}
                            </option>
                            <option value="processing">
                                {t('Processing & Packing')}
                            </option>
                            <option value="shipped">
                                {t('Shipped / Out for Delivery')}
                            </option>
                            <option value="delivered">
                                {t('Delivered to Customer')}
                            </option>
                            <option value="cancelled">{t('Cancelled')}</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="carrier" className="text-xs">
                            {t('Local Delivery Carrier')}
                        </Label>
                        <Input
                            id="carrier"
                            value={carrier}
                            onChange={(e) => setCarrier(e.target.value)}
                            placeholder={t('e.g. Grab Express, J&T')}
                            className="h-10 rounded-xl text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tracking" className="text-xs">
                            {t('Tracking Number')}
                        </Label>
                        <Input
                            id="tracking"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder={t('e.g. DM-TRK-1038')}
                            className="h-10 rounded-xl font-mono text-xs"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelAndRestock}
                        className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />{' '}
                        {t('Cancel & Restock Order')}
                    </Button>

                    <Button
                        type="submit"
                        size="sm"
                        className="gap-1.5 rounded-xl bg-purple-600 text-xs font-bold text-white shadow-sm hover:bg-purple-700"
                    >
                        <Save className="h-3.5 w-3.5" />
                        <span>{t('Save Status')}</span>
                    </Button>
                </div>
            </form>

            {/* Line Items & Destination Snapshot */}
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
                {/* Items */}
                <div className="overflow-hidden rounded-3xl border bg-card shadow-xs md:col-span-2">
                    <div className="border-b p-5 text-sm font-bold">
                        {t('Order Items Snapshot (:count)', {
                            count: order.items.length,
                        })}
                    </div>
                    <div className="divide-y text-xs">
                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between gap-4 p-4"
                            >
                                <div>
                                    <div className="text-sm font-semibold text-foreground">
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
                                {formatMoney(order.shipping_fee_cents)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-base font-bold text-foreground">
                            <span>{t('Total')}</span>
                            <span className="text-purple-700 dark:text-purple-400">
                                {formatMoney(order.total_cents)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Destination */}
                <div className="space-y-4 rounded-3xl border bg-card p-6 text-xs shadow-xs">
                    <h3 className="text-sm font-bold text-foreground">
                        {t('Delivery Customer')}
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                        <div className="text-sm font-semibold text-foreground">
                            {order.customer_name}
                        </div>
                        <div>{order.customer_phone}</div>
                        <div className="border-t pt-2 font-medium text-foreground">
                            {order.shipping_address}
                        </div>
                        <div>{order.shipping_city}</div>
                    </div>

                    <div className="border-t pt-3">
                        <div className="text-muted-foreground">
                            {t('Payment:')}
                        </div>
                        <div className="font-semibold text-foreground uppercase">
                            {order.payment_method}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
