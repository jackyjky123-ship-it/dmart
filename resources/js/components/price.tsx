import React from 'react';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';

interface PriceProps {
    cents: number;
    compareAtCents?: number | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const SIZE_STYLES = {
    sm: { current: 'text-sm font-semibold', compare: 'text-xs' },
    md: { current: 'text-base font-bold', compare: 'text-xs' },
    lg: { current: 'text-xl font-bold', compare: 'text-sm' },
    xl: { current: 'text-3xl font-extrabold', compare: 'text-base' },
};

export function Price({ cents, compareAtCents, size = 'md', className }: PriceProps) {
    const hasDiscount = compareAtCents && compareAtCents > cents;
    const styles = SIZE_STYLES[size];

    return (
        <div className={cn('flex items-baseline gap-1.5 flex-wrap', className)}>
            <span className={cn('text-emerald-700 dark:text-emerald-400', styles.current)}>
                {formatMoney(cents)}
            </span>
            {hasDiscount && (
                <span className={cn('text-muted-foreground line-through decoration-muted-foreground/60', styles.compare)}>
                    {formatMoney(compareAtCents)}
                </span>
            )}
        </div>
    );
}
