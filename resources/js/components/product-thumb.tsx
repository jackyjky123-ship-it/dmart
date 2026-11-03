import React from 'react';
import { cn } from '@/lib/utils';

interface ProductThumbProps {
    name: string;
    imageUrl?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const PALETTE = [
    { bg: 'bg-muted', text: 'text-[#F25623]' },
    { bg: 'bg-card', text: 'text-foreground' },
    { bg: 'bg-muted', text: 'text-amber-400' },
    { bg: 'bg-card', text: 'text-[#F25623]' },
    { bg: 'bg-muted', text: 'text-muted-foreground' },
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

export function ProductThumb({
    name,
    imageUrl,
    size = 'md',
    className,
}: ProductThumbProps) {
    const letter = (name?.trim()?.[0] || 'D').toUpperCase();
    const theme = getPalette(name || '');

    if (imageUrl) {
        return (
            <div
                className={cn(
                    'relative flex items-center justify-center overflow-hidden bg-muted',
                    SIZE_CLASSES[size],
                    className,
                )}
            >
                <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center border border-foreground/5 font-mono font-black tracking-tight shadow-inner select-none',
                theme.bg,
                theme.text,
                SIZE_CLASSES[size],
                className,
            )}
        >
            {letter}
        </div>
    );
}
