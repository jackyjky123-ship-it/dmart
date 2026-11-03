import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from '@/hooks/use-translation';
import {
    Terminal,
    Clock,
    History,
    Store,
    Shield,
    LogOut,
    ShoppingBag,
    ChevronDown,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PosPageAuthProps {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role?: string;
        } | null;
    };
    cashier?: {
        name: string;
    };
    [key: string]: unknown;
}

export default function PosLayout({ children }: { children: React.ReactNode }) {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const { url, props } = usePage<PosPageAuthProps>();
    const { t, isKhmer } = useTranslation();

    const user = props.auth?.user;
    const cashierName = props.cashier?.name || user?.name || t('Cashier');
    const role = user?.role || 'cashier';

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const dateLocale = isKhmer ? 'km-KH' : 'en-US';
            setCurrentTime(
                now.toLocaleTimeString(dateLocale, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
            );
            setCurrentDate(
                now.toLocaleDateString(dateLocale, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                }),
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [isKhmer]);

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-[#F25623] selection:text-white">
            {/* Top Bar for POS */}
            <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-3 text-foreground shadow-sm sm:px-5">
                {/* Left: Terminal Brand & Status */}
                <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                    <Link
                        href="/pos"
                        className="group flex items-center gap-2.5"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted p-1 shadow-md shadow-[#F25623]/15 transition-all group-hover:scale-105 group-hover:border-[#F25623]/60">
                            <img
                                src="/images/pos_icon.png"
                                alt="DMART POS Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1.5 leading-none">
                                <span className="font-sans text-sm font-black tracking-wider text-foreground uppercase sm:text-base">
                                    DMART{' '}
                                    <span className="text-[#F25623]">POS</span>
                                </span>
                                <span className="hidden items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground sm:inline-flex">
                                    {t('REG #01')}
                                </span>
                            </div>
                            <span className="xs:block mt-0.5 hidden font-mono text-[10px] text-muted-foreground">
                                {t('Counter Sales Terminal')}
                            </span>
                        </div>
                    </Link>

                    <div className="hidden h-5 w-px bg-muted md:block" />

                    {/* Online sync indicator */}
                    <div className="hidden items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[11px] text-muted-foreground md:flex">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                        <span>{t('Instant Sync')}</span>
                    </div>
                </div>

                {/* Center: Mode Segmented Switcher */}
                <div className="flex items-center justify-center">
                    <nav
                        className="flex items-center rounded-xl border border-border bg-muted p-1 shadow-inner"
                        aria-label={t('Terminal Navigation')}
                    >
                        <Link
                            href="/pos"
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:px-4 ${
                                url === '/pos'
                                    ? 'bg-[#F25623] text-white shadow-sm shadow-[#F25623]/30'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <Terminal className="h-3.5 w-3.5" />
                            <span>{t('Cash Register')}</span>
                        </Link>
                        <Link
                            href="/pos/sales"
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:px-4 ${
                                url.startsWith('/pos/sales')
                                    ? 'bg-[#F25623] text-white shadow-sm shadow-[#F25623]/30'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <History className="h-3.5 w-3.5" />
                            <span>{t('Sales History')}</span>
                        </Link>
                    </nav>
                </div>

                {/* Right: Clock, Portals, Theme & Cashier Profile */}
                <div className="flex shrink-0 items-center gap-2 text-xs sm:gap-2.5">
                    {/* Live Clock & Date */}
                    <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-inner lg:flex">
                        <Clock className="h-3.5 w-3.5 text-[#F25623]" />
                        <span>
                            {currentDate
                                ? `${currentDate} • ${currentTime}`
                                : currentTime || '00:00:00'}
                        </span>
                    </div>

                    {/* Language Switcher */}
                    <LanguageSwitcher variant="compact" align="end" />

                    {/* Portals Switcher Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8.5 gap-1.5 rounded-lg border border-border bg-muted px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                                title={t('Switch workspace portal')}
                            >
                                <Store className="h-3.5 w-3.5 text-[#F25623]" />
                                <span className="hidden xl:inline">
                                    {t('Portals')}
                                </span>
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 rounded-xl border border-border bg-card p-1.5 text-foreground shadow-2xl"
                        >
                            <DropdownMenuLabel className="px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                                {t('Switch Portal')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-muted" />
                            <DropdownMenuItem
                                asChild
                                className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                            >
                                <Link
                                    href="/"
                                    className="flex items-center gap-2.5 px-2.5 py-2"
                                >
                                    <ShoppingBag className="h-4 w-4 shrink-0 text-[#F25623]" />
                                    <div>
                                        <div className="text-xs font-semibold text-foreground">
                                            {t('Storefront')}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {t('Streetwear drops & shop')}
                                        </div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                            >
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2.5 px-2.5 py-2"
                                >
                                    <Shield className="h-4 w-4 shrink-0 text-purple-400" />
                                    <div>
                                        <div className="text-xs font-semibold text-foreground">
                                            {t('Admin Console')}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {t('Management & inventory')}
                                        </div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <ThemeToggle className="h-8.5 w-8.5 border border-border bg-muted text-muted-foreground hover:bg-muted hover:text-foreground" />

                    {/* Cashier Account Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg border border-border bg-muted py-1 pr-2 pl-1.5 transition-colors hover:bg-muted focus:outline-none sm:pr-2.5 sm:pl-2"
                            >
                                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-[#F25623] text-xs font-bold text-white shadow-xs">
                                    {(cashierName || 'C')
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div className="hidden text-left sm:block">
                                    <div className="max-w-[100px] truncate text-xs leading-tight font-semibold text-foreground">
                                        {cashierName}
                                    </div>
                                    <div className="font-mono text-[9px] leading-none text-[#F25623] uppercase">
                                        {role}
                                    </div>
                                </div>
                                <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 rounded-xl border border-border bg-card p-1.5 text-foreground shadow-2xl"
                        >
                            <div className="border-b border-border px-3 py-2">
                                <p className="truncate text-xs font-semibold text-foreground">
                                    {cashierName}
                                </p>
                                <p className="truncate text-[10px] text-muted-foreground">
                                    {user?.email || 'cashier@dmart.test'}
                                </p>
                                <div className="mt-1.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <span className="font-mono text-[10px] text-muted-foreground">
                                        {t('Terminal 01 Shift Active')}
                                    </span>
                                </div>
                            </div>
                            <div className="py-1">
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                >
                                    <Link
                                        href="/pos/sales"
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs"
                                    >
                                        <History className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{t('Shift Sales History')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                >
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs"
                                    >
                                        <Store className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{t('Storefront')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                {role === 'admin' && (
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                                    >
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs"
                                        >
                                            <Shield className="h-3.5 w-3.5 text-purple-400" />
                                            <span>{t('Admin Console')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </div>
                            <DropdownMenuSeparator className="bg-muted" />
                            <DropdownMenuItem
                                asChild
                                className="cursor-pointer rounded-lg text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 focus:bg-rose-950/30"
                            >
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span>{t('End Shift & Sign Out')}</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main content fills viewport */}
            <main className="flex flex-1 overflow-hidden">{children}</main>
        </div>
    );
}
