import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { SalesChart } from '@/components/sales-chart';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/money';
import {
    DollarSign,
    ShoppingBag,
    AlertTriangle,
    Boxes,
    ArrowUpRight,
    TrendingUp,
    ChevronRight,
    Clock,
    Plus,
} from 'lucide-react';

interface DaySales {
    day: string;
    sales_cents: number;
    orders: number;
}

interface TopProduct {
    name: string;
    sku: string;
    sold_qty: number;
    revenue_cents: number;
}

interface LowStockProduct {
    id: number;
    name: string;
    sku: string;
    stock: number;
    low_stock_threshold: number;
}

interface DashboardProps {
    stats?: {
        today_sales_cents: number;
        today_sales_delta_pct: number;
        orders_today_count: number;
        orders_pending_count: number;
        low_stock_count: number;
        active_products_count: number;
        sales_7d: DaySales[];
        top_products: TopProduct[];
        low_stock_products: LowStockProduct[];
    };
    recentOrders?: any[];
}

export default function AdminDashboard({ stats: initialStats, recentOrders = [] }: DashboardProps) {
    const stats = initialStats || {
        today_sales_cents: 48250,
        today_sales_delta_pct: 14.8,
        orders_today_count: 18,
        orders_pending_count: 4,
        low_stock_count: 3,
        active_products_count: 21,
        sales_7d: [
            { day: 'Mon', sales_cents: 32000, orders: 12 },
            { day: 'Tue', sales_cents: 41500, orders: 16 },
            { day: 'Wed', sales_cents: 38000, orders: 15 },
            { day: 'Thu', sales_cents: 46000, orders: 19 },
            { day: 'Fri', sales_cents: 59000, orders: 24 },
            { day: 'Sat', sales_cents: 64500, orders: 28 },
            { day: 'Sun', sales_cents: 48250, orders: 18 },
        ],
        top_products: [
            { name: 'Organic Cavendish Bananas', sku: 'PROD-BAN-001', sold_qty: 68, revenue_cents: 10132 },
            { name: 'Whole Organic Milk 1L', sku: 'DAIR-MLK-001', sold_qty: 54, revenue_cents: 12960 },
            { name: 'Artisan Sourdough Loaf', sku: 'BAKE-SOU-001', sold_qty: 38, revenue_cents: 16150 },
            { name: 'Roasted Salted Cashews', sku: 'SNAK-CSH-002', sold_qty: 26, revenue_cents: 15080 },
        ],
        low_stock_products: [
            { id: 4, name: 'Hass Avocados (Pack of 3)', sku: 'PROD-AVO-004', stock: 3, low_stock_threshold: 5 },
            { id: 8, name: 'Greek Plain Yogurt 500g', sku: 'DAIR-YOG-003', stock: 2, low_stock_threshold: 5 },
            { id: 15, name: 'Pure Coconut Water 1L', sku: 'BEV-COC-003', stock: 4, low_stock_threshold: 6 },
        ],
    };

    return (
        <div className="space-y-8">
            <Head title="Admin Dashboard — DMart Back Office" />

            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Store Overview
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Daily KPIs, sales trends, and inventory alerts for DMart Mini-Mart
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs gap-1.5 shadow-sm">
                        <Link href="/admin/products/create">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Product</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Today's Revenue */}
                <div className="p-5 rounded-2xl bg-card border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Today's Revenue</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-foreground">
                        {formatMoney(stats.today_sales_cents)}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+{stats.today_sales_delta_pct}% from yesterday</span>
                    </div>
                </div>

                {/* KPI 2: Total Orders Today */}
                <div className="p-5 rounded-2xl bg-card border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Orders Today</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-foreground">
                        {stats.orders_today_count}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                        <span className="text-amber-600 font-semibold">{stats.orders_pending_count} pending</span> fulfillment
                    </div>
                </div>

                {/* KPI 3: Low Stock Alerts */}
                <div className="p-5 rounded-2xl bg-card border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Low Stock Alerts</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-foreground">
                        {stats.low_stock_count}
                    </div>
                    <div className="text-[11px] text-amber-600 font-medium">
                        Requires reorder attention
                    </div>
                </div>

                {/* KPI 4: Active Catalog */}
                <div className="p-5 rounded-2xl bg-card border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Active Catalog</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                            <Boxes className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-foreground">
                        {stats.active_products_count} Items
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                        Across 8 categories
                    </div>
                </div>
            </div>

            {/* 2 Cols: 7-Day Revenue SVG Chart & Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* SVG Revenue Chart (2 cols) */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                        <div className="space-y-0.5">
                            <h2 className="font-bold text-base tracking-tight text-foreground">
                                7-Day Sales Performance
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Combined Online Storefront & POS sales
                            </p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-mono">
                            Asia/Phnom_Penh
                        </Badge>
                    </div>

                    <SalesChart data={stats.sales_7d} />
                </div>

                {/* Low Stock Warning Card (1 col) */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                        <h2 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>Low Stock Watchlist</span>
                        </h2>
                        <Link href="/admin/stock" className="text-xs text-purple-600 hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {stats.low_stock_products.map((item) => (
                            <div key={item.id} className="p-3 rounded-xl bg-muted/40 border flex items-center justify-between text-xs gap-3">
                                <div className="min-w-0">
                                    <div className="font-semibold text-foreground truncate">{item.name}</div>
                                    <div className="text-[10px] font-mono text-muted-foreground">{item.sku}</div>
                                </div>
                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                                    {item.stock} in stock
                                </Badge>
                            </div>
                        ))}
                    </div>

                    <Button asChild variant="outline" size="sm" className="w-full text-xs rounded-xl">
                        <Link href="/admin/stock">
                            Adjust Stock & Inventory
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Top Selling Products & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Top Selling Products */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                        <h2 className="font-bold text-base tracking-tight text-foreground">
                            Top Selling Groceries
                        </h2>
                        <span className="text-xs text-muted-foreground">Past 30 Days</span>
                    </div>

                    <div className="divide-y text-xs">
                        {stats.top_products.map((p, idx) => (
                            <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs shrink-0">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <div className="font-semibold text-foreground">{p.name}</div>
                                        <div className="text-[10px] font-mono text-muted-foreground">{p.sku}</div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-bold text-foreground">{formatMoney(p.revenue_cents)}</div>
                                    <div className="text-[10px] text-muted-foreground">{p.sold_qty} units sold</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                        <h2 className="font-bold text-base tracking-tight text-foreground">
                            Recent Storefront & POS Orders
                        </h2>
                        <Link href="/admin/orders" className="text-xs text-purple-600 hover:underline">
                            View All Orders &rarr;
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentOrders.slice(0, 4).map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className="p-3.5 rounded-xl border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between text-xs gap-3 block"
                            >
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-foreground">{order.order_number}</span>
                                        <Badge variant="outline" className="text-[9px] uppercase py-0">
                                            {order.channel}
                                        </Badge>
                                    </div>
                                    <div className="text-muted-foreground text-[11px]">
                                        {order.customer_name} &bull; {order.created_at}
                                    </div>
                                </div>

                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <div className="font-bold text-foreground">{formatMoney(order.total_cents)}</div>
                                        <StatusBadge status={order.status} className="mt-0.5" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
