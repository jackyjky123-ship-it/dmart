import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/money';
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
    const [search, setSearch] = useState('');
    const [channelFilter, setChannelFilter] = useState<'all' | 'online' | 'pos'>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = orders.filter((o) => {
        const matchesSearch =
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.customer_name.toLowerCase().includes(search.toLowerCase());
        const matchesChannel = channelFilter === 'all' || o.channel === channelFilter;
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesChannel && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <Head title="Orders & Fulfillment — DMart Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Orders & Fulfillment
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Track deliveries, manage status transitions, and audit POS counter sales
                    </p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border shadow-xs">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search order # or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 text-xs rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
                    <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border">
                        <Button
                            type="button"
                            variant={channelFilter === 'all' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setChannelFilter('all')}
                            className={`h-7 px-3 text-xs rounded-lg ${channelFilter === 'all' ? 'bg-purple-600 text-white' : ''}`}
                        >
                            All Channels
                        </Button>
                        <Button
                            type="button"
                            variant={channelFilter === 'online' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setChannelFilter('online')}
                            className={`h-7 px-3 text-xs rounded-lg ${channelFilter === 'online' ? 'bg-purple-600 text-white' : ''}`}
                        >
                            Online Storefront
                        </Button>
                        <Button
                            type="button"
                            variant={channelFilter === 'pos' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setChannelFilter('pos')}
                            className={`h-7 px-3 text-xs rounded-lg ${channelFilter === 'pos' ? 'bg-purple-600 text-white' : ''}`}
                        >
                            POS Register
                        </Button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                            <tr>
                                <th className="p-3.5">Order #</th>
                                <th className="p-3.5">Channel</th>
                                <th className="p-3.5">Customer</th>
                                <th className="p-3.5">Items</th>
                                <th className="p-3.5">Total</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5">Date</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-3.5 font-mono font-bold text-foreground">
                                        {order.order_number}
                                    </td>
                                    <td className="p-3.5">
                                        <Badge variant="outline" className="text-[10px] uppercase font-mono py-0 gap-1">
                                            {order.channel === 'online' ? (
                                                <Store className="w-3 h-3 text-emerald-600" />
                                            ) : (
                                                <Terminal className="w-3 h-3 text-blue-600" />
                                            )}
                                            <span>{order.channel}</span>
                                        </Badge>
                                    </td>
                                    <td className="p-3.5">
                                        <div className="font-semibold text-foreground">{order.customer_name}</div>
                                        <div className="text-[10px] text-muted-foreground">{order.customer_phone}</div>
                                    </td>
                                    <td className="p-3.5 text-muted-foreground">
                                        {order.items.length} items
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
                                            className="h-7 text-xs text-purple-600 hover:text-purple-700 gap-1"
                                        >
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <span>Fulfill</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
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
