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
            },
        );
    };

    // Inline segmented toggle variant
    if (variant === 'toggle') {
        return (
            <div
                role="group"
                aria-label="Language selection"
                className={cn(
                    'inline-flex items-center rounded-lg border border-neutral-800 bg-card/80 p-0.5 font-mono text-xs select-none',
                    className,
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
                                'flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150 disabled:cursor-default',
                                isActive
                                    ? 'bg-[#F25623] text-white shadow-xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
                        'h-7 gap-1.5 rounded-lg border-neutral-800 bg-card/90 px-2 font-mono text-xs text-muted-foreground transition-colors hover:border-[#F25623]/60 hover:text-foreground',
                        className,
                    )}
                >
                    <Languages className="h-3.5 w-3.5 shrink-0 text-[#F25623]" />
                    <span className="font-semibold">
                        {currentOption.shortLabel}
                    </span>
                    <ChevronDown className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
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
                        'h-10 justify-between gap-2.5 rounded-xl border-neutral-800 bg-card/90 px-3.5 text-sm font-medium text-neutral-200 transition-colors hover:border-[#F25623]/60 hover:bg-muted hover:text-foreground',
                        className,
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 shrink-0 text-[#F25623]" />
                        <span>{currentOption.nativeName}</span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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
                    'h-8.5 gap-1.5 rounded-full border-border bg-muted px-3 text-xs font-medium text-foreground transition-colors hover:border-[#F25623]/60 hover:bg-muted hover:text-foreground',
                    className,
                )}
            >
                <Languages className="h-3.5 w-3.5 shrink-0 text-[#F25623]" />
                <span className="font-semibold tracking-wide">
                    {currentOption.shortLabel}
                </span>
                <ChevronDown className="h-3 w-3 shrink-0 text-foreground/50" />
            </Button>
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{renderTrigger()}</DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                className="z-50 w-52 animate-in rounded-xl border border-border bg-card p-1.5 text-foreground shadow-xl fade-in-80"
            >
                <DropdownMenuLabel className="px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                    Language / ភាសា
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-muted" />
                {AVAILABLE_LOCALES.map((loc) => {
                    const isActive = currentLocale === loc.code;
                    return (
                        <DropdownMenuItem
                            key={loc.code}
                            onClick={() => switchLocale(loc.code)}
                            className={cn(
                                'my-0.5 flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors',
                                isActive
                                    ? 'bg-[#F25623]/15 font-semibold text-[#F25623]'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground',
                            )}
                        >
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={cn(
                                        'rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase',
                                        isActive
                                            ? 'border-[#F25623]/40 bg-[#F25623]/20 text-[#F25623]'
                                            : 'border-neutral-700 bg-muted text-muted-foreground',
                                    )}
                                >
                                    {loc.code.toUpperCase()}
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs leading-tight">
                                        {loc.nativeName}
                                    </span>
                                    {loc.nativeName !== loc.label && (
                                        <span className="text-[10px] leading-tight text-muted-foreground">
                                            {loc.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {isActive && (
                                <Check className="ml-2 h-4 w-4 shrink-0 text-[#F25623]" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageSwitcher;
