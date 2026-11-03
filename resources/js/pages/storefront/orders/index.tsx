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
            return [
                'pending_payment',
                'paid',
                'processing',
                'shipped',
            ].includes(o.status);
        }
        if (filter === 'completed') {
            return ['delivered', 'completed', 'cancelled'].includes(o.status);
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <Head title="Order History — DMart Groceries" />

            <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {t('My Orders')}
                    </h1>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {t(
                            'Track your deliveries and review past grocery purchases',
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border bg-muted/40 p-1 text-xs">
                    <Button
                        type="button"
                        variant={filter === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('all')}
                        className={`h-7 rounded-lg px-3 text-xs ${filter === 'all' ? 'bg-emerald-600 text-white' : ''}`}
                    >
                        {t('All')} ({orders.length})
                    </Button>
                    <Button
                        type="button"
                        variant={filter === 'active' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('active')}
                        className={`h-7 rounded-lg px-3 text-xs ${filter === 'active' ? 'bg-emerald-600 text-white' : ''}`}
                    >
                        {t('Active')}
                    </Button>
                    <Button
                        type="button"
                        variant={filter === 'completed' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('completed')}
                        className={`h-7 rounded-lg px-3 text-xs ${filter === 'completed' ? 'bg-emerald-600 text-white' : ''}`}
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
                            className="space-y-4 rounded-2xl border bg-card p-5 transition-all hover:border-emerald-500/40 hover:shadow-sm sm:p-6"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-bold text-foreground">
                                            {order.order_number}
                                        </span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>
                                            {t('Ordered :date', {
                                                date: order.created_at,
                                            })}
                                        </span>
                                        <span>&bull;</span>
                                        <span className="capitalize">
                                            {order.payment_method.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                                        {formatMoney(order.total_cents)}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                        {t(':count items', {
                                            count: order.items.length,
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Items Preview */}
                            <div className="space-y-1 text-xs text-muted-foreground">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between"
                                    >
                                        <span>
                                            {item.quantity}x {item.name}
                                        </span>
                                        <span>
                                            {formatMoney(item.line_total_cents)}
                                        </span>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="text-[11px] text-muted-foreground/80 italic">
                                        {t('+ :count more items...', {
                                            count: order.items.length - 3,
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 rounded-xl text-xs"
                                >
                                    <Link href={`/orders/${order.id}`}>
                                        <span>
                                            {t('View Details & Timeline')}
                                        </span>
                                        <ChevronRight className="h-3.5 w-3.5" />
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
