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
import { cn } from '@/lib/utils';

// Heatmap scale
const HEATMAP_HOURS = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'];
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
    return 'bg-[#222222] text-white/30'; // Base idle
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
    const [hoveredCell, setHoveredCell] = useState<{ hour: string; day: string; val: number } | null>(null);

    return (
        <div className="space-y-6 text-white pb-12">
            <Head title="Metric Flow — Analytics Dashboard" />

            {/* 1. TOP KPI METRIC CARDS ROW (From admin_dashboard_ref.png) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-3 shadow-md hover:border-[#383838] transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#a3a3a3] font-medium">Total Revenue</span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#818cf8] bg-[#818cf8]/15 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3" /> +12.5%
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-1.5 font-sans">
                        <span className="text-[#F25623]">$</span> 24,500
                    </div>
                    <div className="text-[10px] text-[#737373] font-mono">
                        From Jun 01,2024 To Jun 29, 2024
                    </div>
                </div>

                {/* Total Order */}
                <div className="rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-3 shadow-md hover:border-[#383838] transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#a3a3a3] font-medium">Total Order</span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#818cf8] bg-[#818cf8]/15 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3" /> +8.2%
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                        1,240
                    </div>
                    <div className="text-[10px] text-[#737373] font-mono">
                        From Jun 01,2024 To Jun 29, 2024
                    </div>
                </div>

                {/* New Customer */}
                <div className="rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-3 shadow-md hover:border-[#383838] transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#a3a3a3] font-medium">New customer</span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full">
                            <ArrowDownRight className="w-3 h-3" /> -4.3%
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                        320
                    </div>
                    <div className="text-[10px] text-[#737373] font-mono">
                        From Jun 01,2024 To Jun 29, 2024
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-3 shadow-md hover:border-[#383838] transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#a3a3a3] font-medium">Conversion rate</span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#818cf8] bg-[#818cf8]/15 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3" /> +2.1%
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                        3.2 %
                    </div>
                    <div className="text-[10px] text-[#737373] font-mono">
                        From Jun 01,2024 To Jun 29, 2024
                    </div>
                </div>
            </div>

            {/* 2. MID ANALYTICS ROW: ORDERS BY TIME HEATMAP + MONTHLY SALES CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Orders by time (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white tracking-tight">
                            Orders by time
                        </h3>

                        {/* Legend */}
                        <div className="flex items-center gap-2 text-[10px] text-[#888] font-mono">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#431407]" />
                                <span>200&gt;</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#7c2d12]" />
                                <span>500&gt;</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#d9481a]" />
                                <span>1,000&gt;</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#F25623]" />
                                <span>2,000&gt;</span>
                            </div>
                        </div>
                    </div>

                    {/* Heatmap Matrix Table */}
                    <div className="pt-2">
                        <div className="grid grid-cols-8 gap-1.5 text-center items-center">
                            {/* Empty top-left cell */}
                            <div className="text-[10px] font-mono text-[#666]" />

                            {/* Column Days Header */}
                            {HEATMAP_DAYS.map((day) => (
                                <div key={day} className="text-[10px] font-mono text-[#888]">
                                    {day}
                                </div>
                            ))}

                            {/* Row per hour */}
                            {HEATMAP_HOURS.map((hr, rIdx) => (
                                <React.Fragment key={hr}>
                                    <div className="text-[10px] font-mono text-[#888] text-right pr-1">
                                        {hr}
                                    </div>

                                    {HEATMAP_DAYS.map((day, cIdx) => {
                                        const val = HEATMAP_MATRIX[rIdx][cIdx];
                                        return (
                                            <div
                                                key={`${hr}-${day}`}
                                                onMouseEnter={() => setHoveredCell({ hour: hr, day, val })}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                className={cn(
                                                    'aspect-square rounded-md transition-transform duration-150 cursor-pointer flex items-center justify-center text-[9px] font-mono',
                                                    getCellColor(val),
                                                    hoveredCell?.hour === hr && hoveredCell?.day === day
                                                        ? 'scale-115 ring-2 ring-white z-10'
                                                        : 'hover:scale-105'
                                                )}
                                                title={`${day} at ${hr}: ${val} orders`}
                                            />
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Interactive Status Footer */}
                        <div className="mt-3 text-[11px] text-[#737373] font-mono flex items-center justify-between">
                            <span>Peak Rush: 11 am – 1 pm</span>
                            {hoveredCell ? (
                                <span className="text-[#F25623] font-bold">
                                    {hoveredCell.day} {hoveredCell.hour}: {hoveredCell.val} orders
                                </span>
                            ) : (
                                <span>Hover cell for exact count</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Monthly Sales performance Chart (7 cols) */}
                <div className="lg:col-span-7 rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-4 shadow-md flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white tracking-tight">
                            Monthly Sales performance
                        </h3>

                        {/* Chart Legend */}
                        <div className="flex items-center gap-4 text-xs font-mono">
                            <span className="flex items-center gap-1.5 text-xs text-[#a3a3a3]">
                                <span className="w-3 h-0.5 bg-[#F25623]" /> Sales
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-[#a3a3a3]">
                                <span className="w-3 h-0.5 bg-[#818cf8]" /> Target
                            </span>
                        </div>
                    </div>

                    {/* SVG Chart Graphic */}
                    <div className="relative w-full h-56 pt-2">
                        {/* Grid lines & Y-axis labels */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-[#666]">
                            {['6000', '4500', '3000', '1500', '0'].map((val) => (
                                <div key={val} className="w-full flex items-center gap-3">
                                    <span className="w-7 text-right">{val}</span>
                                    <div className="flex-1 border-b border-[#262626]" />
                                </div>
                            ))}
                        </div>

                        {/* SVG Dual Curves */}
                        <svg className="absolute inset-0 w-full h-full pl-10 pr-4 pb-6 overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F25623" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#F25623" stopOpacity="0" />
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
                            <circle cx="390" cy="50" r="4" fill="#F25623" stroke="#fff" strokeWidth="2" />
                            <circle cx="390" cy="120" r="4" fill="#818cf8" stroke="#fff" strokeWidth="2" />
                        </svg>

                        {/* Interactive Tooltip Card on April (replicating design_ref) */}
                        <div className="absolute top-14 right-20 sm:right-28 bg-[#111111]/95 border border-[#333] rounded-xl p-3 shadow-xl backdrop-blur-md text-[11px] space-y-1 z-20 pointer-events-none">
                            <div className="font-mono text-[#a3a3a3] font-bold">April 1, 2025</div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-white">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F25623]" /> Total sales
                                </span>
                                <span className="font-mono font-bold text-white">4790</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-[#a3a3a3]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" /> Target sales
                                </span>
                                <span className="font-mono font-bold text-[#818cf8]">3830</span>
                            </div>
                        </div>

                        {/* X-axis months */}
                        <div className="absolute bottom-0 left-10 right-4 flex justify-between text-[10px] font-mono text-[#888]">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM ROW: SALES BY COUNTRY + TOP PRODUCT SALES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Sales by Country (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white tracking-tight">
                            Sales by Country
                        </h3>
                        <button type="button" className="text-xs font-mono text-[#888] hover:text-[#F25623] transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 pt-1">
                        {SALES_BY_COUNTRY.map((country) => (
                            <div
                                key={country.name}
                                className="p-3 rounded-xl bg-[#222222] border border-[#2d2d2d] hover:border-[#F25623]/60 transition-colors space-y-1"
                            >
                                <div className="text-xl leading-none">{country.flag}</div>
                                <div className="text-xs font-bold text-white truncate">{country.name}</div>
                                <div className="text-[10px] font-mono text-[#888]">{country.products}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Top Product Sales (7 cols) */}
                <div className="lg:col-span-7 rounded-2xl border border-[#262626] bg-[#1a1a1a] p-5 space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white tracking-tight">
                            Top Product Sales
                        </h3>
                        <Link href="/admin/products" className="text-xs font-mono text-[#888] hover:text-[#F25623] transition-colors">
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-[#262626] text-[10px] font-mono uppercase tracking-wider text-[#737373]">
                                    <th className="pb-3 font-semibold">PRODUCT</th>
                                    <th className="pb-3 font-semibold">REVENUE</th>
                                    <th className="pb-3 font-semibold">SALES</th>
                                    <th className="pb-3 font-semibold">GROWTH</th>
                                    <th className="pb-3 font-semibold">REVIEWS</th>
                                    <th className="pb-3 font-semibold">VIEWS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#242424]">
                                {TOP_PRODUCTS.map((prod) => (
                                    <tr key={prod.name} className="hover:bg-[#222222]/60 transition-colors">
                                        <td className="py-3.5 font-semibold text-white">
                                            {prod.name}
                                        </td>
                                        <td className="py-3.5 font-mono text-white font-medium">
                                            {prod.revenue}
                                        </td>
                                        <td className="py-3.5 font-mono text-[#a3a3a3]">
                                            {prod.sales}
                                        </td>
                                        <td className="py-3.5 font-mono font-bold">
                                            <span className={cn(
                                                'inline-flex items-center gap-0.5',
                                                prod.growthPositive ? 'text-[#818cf8]' : 'text-rose-400'
                                            )}>
                                                {prod.growthPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {prod.growth}
                                            </span>
                                        </td>
                                        <td className="py-3.5 font-mono text-[#a3a3a3]">
                                            {prod.reviews}
                                        </td>
                                        <td className="py-3.5 font-mono text-[#a3a3a3]">
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
