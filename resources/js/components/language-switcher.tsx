import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Check, ChevronDown, Globe, Languages } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { LocaleOption } from '@/types/i18n';

export const AVAILABLE_LOCALES: LocaleOption[] = [
    {
        code: 'en',
        label: 'English',
        shortLabel: 'EN',
        nativeName: 'English',
    },
    {
        code: 'km',
        label: 'Khmer',
        shortLabel: 'ខ្មែរ',
        nativeName: 'ភាសាខ្មែរ',
    },
];

export interface LanguageSwitcherProps {
    variant?: 'header' | 'compact' | 'dropdown' | 'toggle';
    className?: string;
    align?: 'start' | 'center' | 'end';
}

export function LanguageSwitcher({
    variant = 'header',
    className,
    align = 'end',
}: LanguageSwitcherProps) {
    const { locale } = useTranslation();
    const [isPending, setIsPending] = useState(false);

    const currentLocale = locale || 'en';
    const currentOption =
        AVAILABLE_LOCALES.find((item) => item.code === currentLocale) ||
        AVAILABLE_LOCALES[0];

    const switchLocale = (targetLocale: string) => {
        if (targetLocale === currentLocale || isPending) {
            return;
        }

        setIsPending(true);

        router.post(
            '/locale',
            { locale: targetLocale },
            {
                preserveScroll: true,
                preserveState: false,
                onFinish: () => {
                    setIsPending(false);
                },
            }
        );
    };

    // Inline segmented toggle variant
    if (variant === 'toggle') {
        return (
            <div
                role="group"
                aria-label="Language selection"
                className={cn(
                    'inline-flex items-center rounded-lg border border-neutral-800 bg-neutral-950/80 p-0.5 text-xs font-mono select-none',
                    className
                )}
            >
                {AVAILABLE_LOCALES.map((loc) => {
                    const isActive = currentLocale === loc.code;
                    return (
                        <button
                            key={loc.code}
                            type="button"
                            onClick={() => switchLocale(loc.code)}
                            disabled={isPending || isActive}
                            className={cn(
                                'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer disabled:cursor-default',
                                isActive
                                    ? 'bg-[#F25623] text-white shadow-xs'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                            )}
                            aria-pressed={isActive}
                        >
                            {loc.shortLabel}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Trigger button based on variant
    const renderTrigger = () => {
        if (variant === 'compact') {
            return (
                <Button
                    variant="outline"
                    size="xs"
                    disabled={isPending}
                    aria-label={`Current language: ${currentOption.label}. Change language`}
                    className={cn(
                        'h-7 rounded-lg border-neutral-800 bg-neutral-900/90 text-neutral-300 hover:text-white hover:border-[#F25623]/60 px-2 text-xs font-mono gap-1.5 transition-colors',
                        className
                    )}
                >
                    <Languages className="w-3.5 h-3.5 text-[#F25623] shrink-0" />
                    <span className="font-semibold">{currentOption.shortLabel}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                </Button>
            );
        }

        if (variant === 'dropdown') {
            return (
                <Button
                    variant="outline"
                    disabled={isPending}
                    aria-label={`Current language: ${currentOption.label}. Change language`}
                    className={cn(
                        'h-10 rounded-xl border-neutral-800 bg-neutral-900/90 text-neutral-200 hover:text-white hover:bg-neutral-800 hover:border-[#F25623]/60 px-3.5 text-sm font-medium gap-2.5 justify-between transition-colors',
                        className
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#F25623] shrink-0" />
                        <span>{currentOption.nativeName}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                </Button>
            );
        }

        // Default: 'header' variant
        return (
            <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                aria-label={`Current language: ${currentOption.label}. Change language`}
                className={cn(
                    'h-8.5 rounded-full border-[#333333] bg-[#222222] text-[#d4d4d4] hover:text-white hover:bg-[#2c2c2c] hover:border-[#F25623]/60 px-3 text-xs font-medium gap-1.5 transition-colors',
                    className
                )}
            >
                <Languages className="w-3.5 h-3.5 text-[#F25623] shrink-0" />
                <span className="font-semibold tracking-wide">{currentOption.shortLabel}</span>
                <ChevronDown className="w-3 h-3 text-white/50 shrink-0" />
            </Button>
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {renderTrigger()}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                className="w-52 rounded-xl p-1.5 shadow-xl border border-[#333] bg-[#1a1a1a] text-white z-50 animate-in fade-in-80"
            >
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider font-mono text-[#a3a3a3] px-2 py-1">
                    Language / ភាសា
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#2e2e2e]" />
                {AVAILABLE_LOCALES.map((loc) => {
                    const isActive = currentLocale === loc.code;
                    return (
                        <DropdownMenuItem
                            key={loc.code}
                            onClick={() => switchLocale(loc.code)}
                            className={cn(
                                'flex items-center justify-between rounded-lg cursor-pointer px-2.5 py-2 text-xs transition-colors my-0.5',
                                isActive
                                    ? 'bg-[#F25623]/15 text-[#F25623] font-semibold'
                                    : 'text-neutral-300 hover:bg-[#282828] hover:text-white focus:bg-[#282828] focus:text-white'
                            )}
                        >
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={cn(
                                        'font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border',
                                        isActive
                                            ? 'bg-[#F25623]/20 border-[#F25623]/40 text-[#F25623]'
                                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                    )}
                                >
                                    {loc.code.toUpperCase()}
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs leading-tight">{loc.nativeName}</span>
                                    {loc.nativeName !== loc.label && (
                                        <span className="text-[10px] text-neutral-400 leading-tight">
                                            {loc.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {isActive && (
                                <Check className="w-4 h-4 text-[#F25623] shrink-0 ml-2" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageSwitcher;
