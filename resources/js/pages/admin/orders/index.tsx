import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import {
    ShoppingBag,
    Search,
    ChevronRight,
    Store,
    Terminal,
    SlidersHorizontal,
} from 'lucide-react';

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
    customer_phone: string;
    total_cents: number;
    subtotal_cents: number;
    shipping_fee_cents: number;
    created_at: string;
    payment_method: string;
    tracking_number: string | null;
    carrier: string | null;
    items: OrderItem[];
}

interface OrdersIndexProps {
    orders?: Order[];
}

export default function AdminOrdersIndex({ orders = [] }: OrdersIndexProps) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [channelFilter, setChannelFilter] = useState<
        'all' | 'online' | 'pos'
    >('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = orders.filter((o) => {
        const matchesSearch =
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.customer_name.toLowerCase().includes(search.toLowerCase());
        const matchesChannel =
            channelFilter === 'all' || o.channel === channelFilter;
        const matchesStatus =
            statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesChannel && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <Head title={t('Orders & Fulfillment — DMart Admin')} />

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {t('Orders & Fulfillment')}
                    </h1>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {t(
                            'Track deliveries, manage status transitions, and audit POS counter sales',
                        )}
                    </p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-xs sm:flex-row">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('Search order # or customer...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 rounded-xl pl-9 text-xs"
                    />
                </div>

                <div className="flex w-full items-center gap-2 overflow-x-auto text-xs sm:w-auto">
                    <div className="flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
                        <Button
                            type="button"
                            variant={
                                channelFilter === 'all' ? 'default' : 'ghost'
                            }
                            size="sm"
                            onClick={() => setChannelFilter('all')}
                            className={`h-7 rounded-lg px-3 text-xs ${channelFilter === 'all' ? 'bg-purple-600 text-white' : ''}`}
                        >
                            {t('All Channels')}
                        </Button>
                        <Button
                            type="button"
                            variant={
                                channelFilter === 'online' ? 'default' : 'ghost'
                            }
                            size="sm"
                            onClick={() => setChannelFilter('online')}
                            className={`h-7 rounded-lg px-3 text-xs ${channelFilter === 'online' ? 'bg-purple-600 text-white' : ''}`}
                        >
                            {t('Online Storefront')}
                        </Button>
                        <Button
                            type="button"
                            variant={
                                channelFilter === 'pos' ? 'default' : 'ghost'
                            }
                            size="sm"
                            onClick={() => setChannelFilter('pos')}
                            className={`h-7 rounded-lg px-3 text-xs ${channelFilter === 'pos' ? 'bg-purple-600 text-white' : ''}`}
                        >
                            {t('POS Register')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b bg-muted/40 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            <tr>
                                <th className="p-3.5">{t('Order #')}</th>
                                <th className="p-3.5">{t('Channel')}</th>
                                <th className="p-3.5">{t('Customer')}</th>
                                <th className="p-3.5">{t('Items')}</th>
                                <th className="p-3.5">{t('Total')}</th>
                                <th className="p-3.5">{t('Status')}</th>
                                <th className="p-3.5">{t('Date')}</th>
                                <th className="p-3.5 text-right">
                                    {t('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map((order) => (
                                <tr
                                    key={order.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <td className="p-3.5 font-mono font-bold text-foreground">
                                        {order.order_number}
                                    </td>
                                    <td className="p-3.5">
                                        <Badge
                                            variant="outline"
                                            className="gap-1 py-0 font-mono text-[10px] uppercase"
                                        >
                                            {order.channel === 'online' ? (
                                                <Store className="h-3 w-3 text-emerald-600" />
                                            ) : (
                                                <Terminal className="h-3 w-3 text-blue-600" />
                                            )}
                                            <span>{t(order.channel)}</span>
                                        </Badge>
                                    </td>
                                    <td className="p-3.5">
                                        <div className="font-semibold text-foreground">
                                            {order.customer_name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {order.customer_phone}
                                        </div>
                                    </td>
                                    <td className="p-3.5 text-muted-foreground">
                                        {t(':count items', {
                                            count: order.items.length,
                                        })}
                                    </td>
                                    <td className="p-3.5 font-bold text-foreground">
                                        {formatMoney(order.total_cents)}
                                    </td>
                                    <td className="p-3.5">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="p-3.5 text-muted-foreground">
                                        {order.created_at}
                                    </td>
                                    <td className="p-3.5 text-right">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700"
                                        >
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                            >
                                                <span>{t('Fulfill')}</span>
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
