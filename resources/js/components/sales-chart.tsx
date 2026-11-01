import React from 'react';
import { formatMoney } from '@/lib/money';

interface DaySales {
    day: string;
    sales_cents: number;
    orders: number;
}

interface SalesChartProps {
    data: DaySales[];
}

export function SalesChart({ data }: SalesChartProps) {
    const maxSales = Math.max(...data.map((d) => d.sales_cents), 10000);
    const height = 180;
    const paddingBottom = 28;
    const chartHeight = height - paddingBottom;

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Revenue over the last 7 days</span>
                <span className="font-medium text-foreground">Peak: {formatMoney(maxSales)}</span>
            </div>

            <div className="relative w-full h-[180px] bg-muted/10 rounded-xl p-2 border">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${data.length * 50} ${height}`} preserveAspectRatio="none">
                    {/* Background gridlines */}
                    <line x1="0" y1="0" x2={data.length * 50} y2="0" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
                    <line x1="0" y1={chartHeight / 2} x2={data.length * 50} y2={chartHeight / 2} stroke="currentColor" className="text-border" strokeDasharray="3 3" />
                    <line x1="0" y1={chartHeight} x2={data.length * 50} y2={chartHeight} stroke="currentColor" className="text-border" />

                    {data.map((item, index) => {
                        const barWidth = 26;
                        const x = index * 50 + (50 - barWidth) / 2;
                        const barHeight = Math.max(8, (item.sales_cents / maxSales) * (chartHeight - 16));
                        const y = chartHeight - barHeight;
                        const isToday = index === data.length - 1;

                        return (
                            <g key={item.day} className="group cursor-pointer">
                                {/* Bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    rx={5}
                                    className={
                                        isToday
                                            ? 'fill-purple-600 dark:fill-purple-500 hover:fill-purple-700 transition-colors'
                                            : 'fill-purple-200 dark:fill-purple-950/80 hover:fill-purple-300 dark:hover:fill-purple-900 transition-colors'
                                    }
                                />

                                {/* Value label on hover */}
                                <title>{`${item.day}: ${formatMoney(item.sales_cents)} (${item.orders} orders)`}</title>

                                {/* Day label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={height - 8}
                                    textAnchor="middle"
                                    className={`text-[10px] font-sans ${isToday ? 'fill-purple-600 dark:fill-purple-400 font-bold' : 'fill-muted-foreground'}`}
                                >
                                    {item.day}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
