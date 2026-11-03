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
                'my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center',
                className,
            )}
        >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-xs">
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 mb-5 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
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
