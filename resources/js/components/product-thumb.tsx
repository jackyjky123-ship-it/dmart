import React from 'react';
import { cn } from '@/lib/utils';

interface ProductThumbProps {
    name: string;
    imageUrl?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const PALETTE = [
    { bg: 'bg-[#222222]', text: 'text-[#F25623]' },
    { bg: 'bg-[#1e1e1e]', text: 'text-white' },
    { bg: 'bg-[#262626]', text: 'text-amber-400' },
    { bg: 'bg-[#1c1c1c]', text: 'text-[#F25623]' },
    { bg: 'bg-[#242424]', text: 'text-zinc-300' },
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
            <div className={cn('relative overflow-hidden flex items-center justify-center bg-[#202020]', SIZE_CLASSES[size], className)}>
                <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center font-black tracking-tight select-none shadow-inner border border-white/5 font-mono',
                theme.bg,
                theme.text,
                SIZE_CLASSES[size],
                className
            )}
        >
            {letter}
        </div>
    );
}
