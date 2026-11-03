import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import { ShoppingBag, ChevronRight, PackageCheck, Clock } from 'lucide-react';

interface OrderItem {
    name: string;
    sku: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
}

interface Order {
    id: number;
    order_number: string;
    channel: string;
    status: string;
    customer_name: string;
    total_cents: number;
    subtotal_cents: number;
    shipping_fee_cents: number;
    item_count: number;
    created_at: string;
    payment_method: string;
    items: OrderItem[];
}

interface OrdersIndexProps {
    orders?: Order[];
}

export default function OrdersIndex({ orders = [] }: OrdersIndexProps) {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const filteredOrders = orders.filter((o) => {
        if (filter === 'active') {
            return ['pending_payment', 'paid', 'processing', 'shipped'].includes(o.status);
        }
        if (filter === 'completed') {
            return ['delivered', 'completed', 'cancelled'].includes(o.status);
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <Head title="Order History — DMart Groceries" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        {t('My Orders')}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t('Track your deliveries and review past grocery purchases')}
                    </p>
                </div>

                <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border text-xs">
                    <Button
                        type="button"
                        variant={filter === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('all')}
                        className={`h-7 px-3 text-xs rounded-lg ${filter === 'all' ? 'bg-emerald-600 text-white' : ''}`}
                    >
                        {t('All')} ({orders.length})
                    </Button>
                    <Button
                        type="button"
                        variant={filter === 'active' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('active')}
                        className={`h-7 px-3 text-xs rounded-lg ${filter === 'active' ? 'bg-emerald-600 text-white' : ''}`}
                    >
                        {t('Active')}
                    </Button>
                    <Button
                        type="button"
                        variant={filter === 'completed' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('completed')}
                        className={`h-7 px-3 text-xs rounded-lg ${filter === 'completed' ? 'bg-emerald-600 text-white' : ''}`}
                    >
                        {t('Completed')}
                    </Button>
                </div>
            </div>

            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="border rounded-2xl bg-card p-5 sm:p-6 transition-all hover:border-emerald-500/40 hover:shadow-sm space-y-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-sm text-foreground">
                                            {order.order_number}
                                        </span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{t('Ordered :date', { date: order.created_at })}</span>
                                        <span>&bull;</span>
                                        <span className="capitalize">{order.payment_method.toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                                        {formatMoney(order.total_cents)}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                        {t(':count items', { count: order.items.length })}
                                    </div>
                                </div>
                            </div>

                            {/* Items Preview */}
                            <div className="text-xs space-y-1 text-muted-foreground">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>{formatMoney(item.line_total_cents)}</span>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="text-[11px] text-muted-foreground/80 italic">
                                        {t('+ :count more items...', { count: order.items.length - 3 })}
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                                    <Link href={`/orders/${order.id}`}>
                                        <span>{t('View Details & Timeline')}</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={t('No orders found')}
                    description={t('You have not placed any orders yet.')}
                    actionLabel={t('Shop Groceries')}
                    actionHref="/products"
                    icon={ShoppingBag}
                />
            )}
        </div>
    );
}
