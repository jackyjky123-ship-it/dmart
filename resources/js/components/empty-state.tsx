import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
    actionHref?: string;
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon = PackageOpen,
    actionLabel,
    onAction,
    actionHref,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-2xl bg-muted/20 my-6',
                className
            )}
        >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4 shadow-xs">
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">{description}</p>
            {actionLabel && (
                <div>
                    {actionHref ? (
                        <Button asChild>
                            <a href={actionHref}>{actionLabel}</a>
                        </Button>
                    ) : (
                        <Button onClick={onAction}>{actionLabel}</Button>
                    )}
                </div>
            )}
        </div>
    );
}
