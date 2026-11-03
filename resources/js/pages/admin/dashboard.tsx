import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Search,
    Calendar,
    Eye,
    Star,
    Layers,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

// Heatmap scale
const HEATMAP_HOURS = [
    '9 am',
    '10 am',
    '11 am',
    '12 pm',
    '1 pm',
    '2 pm',
    '3 pm',
];
const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 7x7 heatmap data replicating admin_dashboard_ref.png pattern (cross in center with heavy density)
const HEATMAP_MATRIX = [
    // 9 am
    [150, 180, 240, 420, 220, 190, 120],
    // 10 am
    [190, 260, 680, 1250, 620, 310, 160],
    // 11 am
    [240, 520, 1420, 2380, 1310, 480, 210],
    // 12 pm
    [310, 950, 2150, 2890, 2240, 890, 290],
    // 1 pm
    [260, 580, 1530, 2460, 1410, 510, 240],
    // 2 pm
    [180, 290, 710, 1310, 690, 340, 170],
    // 3 pm
    [140, 170, 230, 410, 210, 180, 110],
];

function getCellColor(val: number) {
    if (val >= 2000) {
        return 'bg-[#F25623] text-white shadow-xs'; // Bright signature orange
    }
    if (val >= 1000) {
        return 'bg-[#d9481a] text-white'; // Medium-high orange
    }
    if (val >= 500) {
        return 'bg-[#7c2d12] text-white/80'; // Dark reddish/brown
    }
    if (val >= 200) {
        return 'bg-[#431407] text-white/60'; // Deep dark burnt
    }
    return 'bg-muted text-foreground/30'; // Base idle
}

const TOP_PRODUCTS = [
    {
        name: 'MagStand Pro 1',
        revenue: '$24,500',
        sales: 846,
        growth: '+32%',
        growthPositive: true,
        reviews: 570,
        views: 978,
    },
    {
        name: 'MagStand Pro 2',
        revenue: '$16,300',
        sales: 598,
        growth: '+26%',
        growthPositive: true,
        reviews: 385,
        views: 945,
    },
    {
        name: 'MagStand Pro 3',
        revenue: '$12,980',
        sales: 389,
        growth: '+13%',
        growthPositive: true,
        reviews: 127,
        views: 437,
    },
    {
        name: 'MagStand Pro 4',
        revenue: '$10,984',
        sales: 265,
        growth: '-11%',
        growthPositive: false,
        reviews: 190,
        views: 265,
    },
];

const SALES_BY_COUNTRY = [
    { name: 'United Kingdom', flag: '🇬🇧', products: '6.3K Products' },
    { name: 'Indonesia', flag: '🇮🇩', products: '5.2K Products' },
    { name: 'Malaysia', flag: '🇲🇾', products: '4.7K Products' },
    { name: 'China', flag: '🇨🇳', products: '4.5K Products' },
    { name: 'Thailand', flag: '🇹🇭', products: '3.2K Products' },
    { name: 'Philippines', flag: '🇵🇭', products: '2.9K Products' },
];

export default function AdminDashboard() {
    const { t } = useTranslation();
    const [hoveredCell, setHoveredCell] = useState<{
        hour: string;
        day: string;
        val: number;
    } | null>(null);

    return (
        <div className="space-y-6 pb-12 text-foreground">
            <Head title={t('Metric Flow — Analytics Dashboard')} />

            {/* 1. TOP KPI METRIC CARDS ROW (From admin_dashboard_ref.png) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-md transition-colors hover:border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            {t('Total Revenue')}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#818cf8]/15 px-2 py-0.5 text-[11px] font-bold text-[#818cf8]">
                            <ArrowUpRight className="h-3 w-3" /> +12.5%
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-sans text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        <span className="text-[#F25623]">$</span> 24,500
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                        {t('From Jun 01, 2024 To Jun 29, 2024')}
                    </div>
                </div>

                {/* Total Order */}
                <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-md transition-colors hover:border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            {t('Total Order')}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#818cf8]/15 px-2 py-0.5 text-[11px] font-bold text-[#818cf8]">
                            <ArrowUpRight className="h-3 w-3" /> +8.2%
                        </span>
                    </div>
                    <div className="font-sans text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        1,240
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                        {t('From Jun 01, 2024 To Jun 29, 2024')}
                    </div>
                </div>

                {/* New Customer */}
                <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-md transition-colors hover:border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            {t('New customer')}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-bold text-rose-400">
                            <ArrowDownRight className="h-3 w-3" /> -4.3%
                        </span>
                    </div>
                    <div className="font-sans text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        320
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                        {t('From Jun 01, 2024 To Jun 29, 2024')}
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-md transition-colors hover:border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            {t('Conversion rate')}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#818cf8]/15 px-2 py-0.5 text-[11px] font-bold text-[#818cf8]">
                            <ArrowUpRight className="h-3 w-3" /> +2.1%
                        </span>
                    </div>
                    <div className="font-sans text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        3.2 %
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                        {t('From Jun 01, 2024 To Jun 29, 2024')}
                    </div>
                </div>
            </div>

            {/* 2. MID ANALYTICS ROW: ORDERS BY TIME HEATMAP + MONTHLY SALES CHART */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left: Orders by time (5 cols) */}
                <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-md lg:col-span-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold tracking-tight text-foreground">
                            {t('Orders by time')}
                        </h3>

                        {/* Legend */}
                        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#431407]" />
                                <span>200&gt;</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#7c2d12]" />
                                <span>500&gt;</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#d9481a]" />
                                <span>1,000&gt;</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#F25623]" />
                                <span>2,000&gt;</span>
                            </div>
                        </div>
                    </div>

                    {/* Heatmap Matrix Table */}
                    <div className="pt-2">
                        <div className="grid grid-cols-8 items-center gap-1.5 text-center">
                            {/* Empty top-left cell */}
                            <div className="font-mono text-[10px] text-muted-foreground" />

                            {/* Column Days Header */}
                            {HEATMAP_DAYS.map((day) => (
                                <div
                                    key={day}
                                    className="font-mono text-[10px] text-muted-foreground"
                                >
                                    {t(day)}
                                </div>
                            ))}

                            {/* Row per hour */}
                            {HEATMAP_HOURS.map((hr, rIdx) => (
                                <React.Fragment key={hr}>
                                    <div className="pr-1 text-right font-mono text-[10px] text-muted-foreground">
                                        {t(hr)}
                                    </div>

                                    {HEATMAP_DAYS.map((day, cIdx) => {
                                        const val = HEATMAP_MATRIX[rIdx][cIdx];
                                        return (
                                            <div
                                                key={`${hr}-${day}`}
                                                onMouseEnter={() =>
                                                    setHoveredCell({
                                                        hour: hr,
                                                        day,
                                                        val,
                                                    })
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredCell(null)
                                                }
                                                className={cn(
                                                    'flex aspect-square cursor-pointer items-center justify-center rounded-md font-mono text-[9px] transition-transform duration-150',
                                                    getCellColor(val),
                                                    hoveredCell?.hour === hr &&
                                                        hoveredCell?.day === day
                                                        ? 'z-10 scale-115 ring-2 ring-foreground'
                                                        : 'hover:scale-105',
                                                )}
                                                title={t(
                                                    ':day at :hour: :val orders',
                                                    {
                                                        day: t(day),
                                                        hour: t(hr),
                                                        val,
                                                    },
                                                )}
                                            />
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Interactive Status Footer */}
                        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                            <span>{t('Peak Rush: 11 am – 1 pm')}</span>
                            {hoveredCell ? (
                                <span className="font-bold text-[#F25623]">
                                    {t(':day :hour: :val orders', {
                                        day: t(hoveredCell.day),
                                        hour: t(hoveredCell.hour),
                                        val: hoveredCell.val,
                                    })}
                                </span>
                            ) : (
                                <span>{t('Hover cell for exact count')}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Monthly Sales performance Chart (7 cols) */}
                <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-border bg-card p-5 shadow-md lg:col-span-7">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold tracking-tight text-foreground">
                            {t('Monthly Sales performance')}
                        </h3>

                        {/* Chart Legend */}
                        <div className="flex items-center gap-4 font-mono text-xs">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="h-0.5 w-3 bg-[#F25623]" />{' '}
                                {t('Sales')}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="h-0.5 w-3 bg-[#818cf8]" />{' '}
                                {t('Target')}
                            </span>
                        </div>
                    </div>

                    {/* SVG Chart Graphic */}
                    <div className="relative h-56 w-full pt-2">
                        {/* Grid lines & Y-axis labels */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between font-mono text-[10px] text-muted-foreground">
                            {['6000', '4500', '3000', '1500', '0'].map(
                                (val) => (
                                    <div
                                        key={val}
                                        className="flex w-full items-center gap-3"
                                    >
                                        <span className="w-7 text-right">
                                            {val}
                                        </span>
                                        <div className="flex-1 border-b border-border" />
                                    </div>
                                ),
                            )}
                        </div>

                        {/* SVG Dual Curves */}
                        <svg
                            className="absolute inset-0 h-full w-full overflow-visible pr-4 pb-6 pl-10"
                            viewBox="0 0 600 200"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient
                                    id="salesGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#F25623"
                                        stopOpacity="0.25"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#F25623"
                                        stopOpacity="0"
                                    />
                                </linearGradient>
                            </defs>

                            {/* Target Curve (Lavender / Blue) */}
                            <path
                                d="M 0 160 C 100 120, 160 170, 250 140 C 340 110, 420 160, 500 130 C 550 110, 580 90, 600 80"
                                fill="none"
                                stroke="#818cf8"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />

                            {/* Sales Area Fill */}
                            <path
                                d="M 0 140 C 100 90, 180 130, 270 120 C 360 110, 430 40, 520 60 C 560 70, 585 45, 600 30 L 600 200 L 0 200 Z"
                                fill="url(#salesGrad)"
                            />

                            {/* Sales Curve (Fiery Orange) */}
                            <path
                                d="M 0 140 C 100 90, 180 130, 270 120 C 360 110, 430 40, 520 60 C 560 70, 585 45, 600 30"
                                fill="none"
                                stroke="#F25623"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />

                            {/* Vertical Dotted Tooltip Guide on April */}
                            <line
                                x1="390"
                                y1="10"
                                x2="390"
                                y2="190"
                                stroke="#444"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />

                            {/* Points on April guide */}
                            <circle
                                cx="390"
                                cy="50"
                                r="4"
                                fill="#F25623"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                            <circle
                                cx="390"
                                cy="120"
                                r="4"
                                fill="#818cf8"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                        </svg>

                        {/* Interactive Tooltip Card on April (replicating design_ref) */}
                        <div className="pointer-events-none absolute top-14 right-20 z-20 space-y-1 rounded-xl border border-border bg-sidebar/95 p-3 text-[11px] shadow-xl backdrop-blur-md sm:right-28">
                            <div className="font-mono font-bold text-muted-foreground">
                                {t('April 1, 2025')}
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-foreground">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#F25623]" />{' '}
                                    {t('Total sales')}
                                </span>
                                <span className="font-mono font-bold text-foreground">
                                    4790
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8]" />{' '}
                                    {t('Target sales')}
                                </span>
                                <span className="font-mono font-bold text-[#818cf8]">
                                    3830
                                </span>
                            </div>
                        </div>

                        {/* X-axis months */}
                        <div className="absolute right-4 bottom-0 left-10 flex justify-between font-mono text-[10px] text-muted-foreground">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
                                (m) => (
                                    <span key={m}>{t(m)}</span>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM ROW: SALES BY COUNTRY + TOP PRODUCT SALES */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left: Sales by Country (5 cols) */}
                <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-md lg:col-span-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold tracking-tight text-foreground">
                            {t('Sales by Country')}
                        </h3>
                        <button
                            type="button"
                            className="font-mono text-xs text-muted-foreground transition-colors hover:text-[#F25623]"
                        >
                            {t('View All')}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-2">
                        {SALES_BY_COUNTRY.map((country) => (
                            <div
                                key={country.name}
                                className="space-y-1 rounded-xl border border-border bg-muted p-3 transition-colors hover:border-[#F25623]/60"
                            >
                                <div className="text-xl leading-none">
                                    {country.flag}
                                </div>
                                <div className="truncate text-xs font-bold text-foreground">
                                    {t(country.name)}
                                </div>
                                <div className="font-mono text-[10px] text-muted-foreground">
                                    {country.products.replace(
                                        'Products',
                                        t('Products'),
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Top Product Sales (7 cols) */}
                <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-md lg:col-span-7">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold tracking-tight text-foreground">
                            {t('Top Product Sales')}
                        </h3>
                        <Link
                            href="/admin/products"
                            className="font-mono text-xs text-muted-foreground transition-colors hover:text-[#F25623]"
                        >
                            {t('View All')}
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-border font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                                    <th className="pb-3 font-semibold">
                                        {t('PRODUCT')}
                                    </th>
                                    <th className="pb-3 font-semibold">
                                        {t('REVENUE')}
                                    </th>
                                    <th className="pb-3 font-semibold">
                                        {t('SALES')}
                                    </th>
                                    <th className="pb-3 font-semibold">
                                        {t('GROWTH')}
                                    </th>
                                    <th className="pb-3 font-semibold">
                                        {t('REVIEWS')}
                                    </th>
                                    <th className="pb-3 font-semibold">
                                        {t('VIEWS')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {TOP_PRODUCTS.map((prod) => (
                                    <tr
                                        key={prod.name}
                                        className="transition-colors hover:bg-muted/60"
                                    >
                                        <td className="py-3.5 font-semibold text-foreground">
                                            {prod.name}
                                        </td>
                                        <td className="py-3.5 font-mono font-medium text-foreground">
                                            {prod.revenue}
                                        </td>
                                        <td className="py-3.5 font-mono text-muted-foreground">
                                            {prod.sales}
                                        </td>
                                        <td className="py-3.5 font-mono font-bold">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-0.5',
                                                    prod.growthPositive
                                                        ? 'text-[#818cf8]'
                                                        : 'text-rose-400',
                                                )}
                                            >
                                                {prod.growthPositive ? (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="h-3 w-3" />
                                                )}
                                                {prod.growth}
                                            </span>
                                        </td>
                                        <td className="py-3.5 font-mono text-muted-foreground">
                                            {prod.reviews}
                                        </td>
                                        <td className="py-3.5 font-mono text-muted-foreground">
                                            {prod.views}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
