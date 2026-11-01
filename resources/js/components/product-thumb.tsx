import React from 'react';
import { cn } from '@/lib/utils';

interface ProductThumbProps {
    name: string;
    imageUrl?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const PALETTE = [
    { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300' },
    { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300' },
    { bg: 'bg-sky-100 dark:bg-sky-950/60', text: 'text-sky-700 dark:text-sky-300' },
    { bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300' },
    { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300' },
    { bg: 'bg-teal-100 dark:bg-teal-950/60', text: 'text-teal-700 dark:text-teal-300' },
    { bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300' },
    { bg: 'bg-orange-100 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300' },
];

function getPalette(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PALETTE.length;
    return PALETTE[index];
}

const SIZE_CLASSES = {
    sm: 'w-10 h-10 text-sm rounded-lg',
    md: 'w-16 h-16 text-xl rounded-xl',
    lg: 'w-24 h-24 text-3xl rounded-2xl',
    xl: 'w-36 h-36 text-5xl rounded-3xl',
    full: 'w-full h-full text-4xl rounded-xl',
};

export function ProductThumb({ name, imageUrl, size = 'md', className }: ProductThumbProps) {
    const letter = (name?.trim()?.[0] || 'D').toUpperCase();
    const theme = getPalette(name || '');

    if (imageUrl) {
        return (
            <div className={cn('relative overflow-hidden flex items-center justify-center bg-muted', SIZE_CLASSES[size], className)}>
                <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center font-bold tracking-tight select-none shadow-xs border border-black/5 dark:border-white/5',
                theme.bg,
                theme.text,
                SIZE_CLASSES[size],
                className
            )}
        >
            <span>{letter}</span>
        </div>
    );
}
