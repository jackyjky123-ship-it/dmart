import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    // Orders
    pending_payment: {
        label: 'Pending Payment',
        className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    },
    paid: {
        label: 'Paid',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
    processing: {
        label: 'Processing',
        className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    },
    shipped: {
        label: 'Shipped',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    },
    delivered: {
        label: 'Delivered',
        className: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    },
    completed: {
        label: 'Completed',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    },

    // Stock & Active Statuses
    in_stock: {
        label: 'In Stock',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
    low_stock: {
        label: 'Low Stock',
        className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    },
    out_of_stock: {
        label: 'Out of Stock',
        className: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    },
    active: {
        label: 'Active',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
    inactive: {
        label: 'Inactive',
        className: 'bg-muted text-muted-foreground border-border',
    },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const key = status?.toLowerCase().replace(/\s+/g, '_');
    const config = STATUS_CONFIG[key] || {
        label: status.replace(/_/g, ' '),
        className: 'bg-secondary text-secondary-foreground',
    };

    return (
        <Badge
            variant="outline"
            className={cn('capitalize text-xs font-medium px-2 py-0.5 rounded-full border', config.className, className)}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5 inline-block" />
            {config.label}
        </Badge>
    );
}
