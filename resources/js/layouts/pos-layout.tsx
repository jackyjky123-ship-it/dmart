import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import {
    Terminal,
    Sun,
    Moon,
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
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [currentTime, setCurrentTime] = useState('');
    const { url, props } = usePage<PosPageAuthProps>();

    const user = props.auth?.user;
    const cashierName = props.cashier?.name || user?.name || 'Cashier';
    const role = user?.role || 'cashier';

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#141414] text-white font-sans antialiased selection:bg-[#F25623] selection:text-white">
            {/* Top Bar for POS */}
            <header className="h-14 bg-[#171717] text-white px-3 sm:px-5 flex items-center justify-between border-b border-[#262626] shadow-sm shrink-0 z-30">
                {/* Left: Terminal Brand & Status */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <Link href="/pos" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-lg bg-[#202020] border border-[#2d2d2d] flex items-center justify-center p-1 shadow-md shadow-[#F25623]/15 group-hover:scale-105 group-hover:border-[#F25623]/60 transition-all shrink-0 overflow-hidden">
                            <img
                                src="/images/pos_icon.png"
                                alt="DMART POS Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1.5 leading-none">
                                <span className="font-black tracking-wider uppercase text-white text-sm sm:text-base font-sans">
                                    DMART <span className="text-[#F25623]">POS</span>
                                </span>
                                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#242424] text-zinc-300 border border-[#333]">
                                    REG #01
                                </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 hidden xs:block">
                                Counter Sales Terminal
                            </span>
                        </div>
                    </Link>

                    <div className="h-5 w-px bg-[#2a2a2a] hidden md:block" />

                    {/* Online sync indicator */}
                    <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202020] border border-[#2d2d2d] text-[11px] text-zinc-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                        <span>Instant Sync</span>
                    </div>
                </div>

                {/* Center: Mode Segmented Switcher */}
                <div className="flex items-center justify-center">
                    <nav className="flex items-center bg-[#202020] p-1 rounded-xl border border-[#2d2d2d] shadow-inner" aria-label="Terminal Navigation">
                        <Link
                            href="/pos"
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                url === '/pos'
                                    ? 'bg-[#F25623] text-white shadow-sm shadow-[#F25623]/30'
                                    : 'text-zinc-400 hover:text-white hover:bg-[#282828]'
                            }`}
                        >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Terminal</span>
                        </Link>
                        <Link
                            href="/pos/sales"
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                url.startsWith('/pos/sales')
                                    ? 'bg-[#F25623] text-white shadow-sm shadow-[#F25623]/30'
                                    : 'text-zinc-400 hover:text-white hover:bg-[#282828]'
                            }`}
                        >
                            <History className="w-3.5 h-3.5" />
                            <span>Sales Archive</span>
                        </Link>
                    </nav>
                </div>

                {/* Right: Clock, Portals, Theme & Cashier Profile */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 text-xs">
                    {/* Live Clock */}
                    <div className="hidden lg:flex items-center gap-2 text-zinc-300 font-mono text-xs bg-[#202020] border border-[#2d2d2d] px-3 py-1.5 rounded-lg shadow-inner">
                        <Clock className="w-3.5 h-3.5 text-[#F25623]" />
                        <span>{currentTime || '00:00:00'}</span>
                    </div>

                    {/* Portals Switcher Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8.5 px-2.5 rounded-lg border border-[#2d2d2d] bg-[#202020] text-zinc-300 hover:text-white hover:bg-[#282828] text-xs gap-1.5"
                                title="Switch workspace portal"
                            >
                                <Store className="w-3.5 h-3.5 text-[#F25623]" />
                                <span className="hidden xl:inline">Portals</span>
                                <ChevronDown className="w-3 h-3 text-zinc-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 border border-[#333] bg-[#1a1a1a] text-white shadow-2xl">
                            <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 px-2.5 py-1.5">
                                Switch Portal
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#282828]" />
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                <Link href="/" className="flex items-center gap-2.5 py-2 px-2.5">
                                    <ShoppingBag className="w-4 h-4 text-[#F25623] shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs text-white">Storefront</div>
                                        <div className="text-[10px] text-zinc-400">Streetwear drops & shop</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                <Link href="/admin" className="flex items-center gap-2.5 py-2 px-2.5">
                                    <Shield className="w-4 h-4 text-purple-400 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-xs text-white">Admin Console</div>
                                        <div className="text-[10px] text-zinc-400">Management & inventory</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={toggleTheme}
                        className="rounded-lg text-zinc-400 hover:text-white hover:bg-[#282828] border border-[#2d2d2d] bg-[#202020] h-8.5 w-8.5"
                        aria-label="Toggle appearance"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-zinc-400" />
                        )}
                    </Button>

                    {/* Cashier Account Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 py-1 rounded-lg border border-[#2d2d2d] bg-[#202020] hover:bg-[#282828] transition-colors focus:outline-none"
                            >
                                <div className="w-6.5 h-6.5 rounded-md bg-[#F25623] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                    {(cashierName || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <div className="text-xs font-semibold text-white leading-tight max-w-[100px] truncate">
                                        {cashierName}
                                    </div>
                                    <div className="text-[9px] text-[#F25623] font-mono leading-none uppercase">
                                        {role}
                                    </div>
                                </div>
                                <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 border border-[#333] bg-[#1a1a1a] text-white shadow-2xl">
                            <div className="px-3 py-2 border-b border-[#282828]">
                                <p className="text-xs font-semibold text-white truncate">{cashierName}</p>
                                <p className="text-[10px] text-zinc-400 truncate">{user?.email || 'cashier@dmart.test'}</p>
                                <div className="mt-1.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-mono text-zinc-400">Terminal 01 Shift Active</span>
                                </div>
                            </div>
                            <div className="py-1">
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                    <Link href="/pos/sales" className="flex items-center gap-2 text-xs py-1.5 px-2.5">
                                        <History className="w-3.5 h-3.5 text-zinc-400" />
                                        <span>Shift Sales History</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                    <Link href="/" className="flex items-center gap-2 text-xs py-1.5 px-2.5">
                                        <Store className="w-3.5 h-3.5 text-zinc-400" />
                                        <span>Storefront</span>
                                    </Link>
                                </DropdownMenuItem>
                                {role === 'admin' && (
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-[#252525] focus:bg-[#252525]">
                                        <Link href="/admin" className="flex items-center gap-2 text-xs py-1.5 px-2.5">
                                            <Shield className="w-3.5 h-3.5 text-purple-400" />
                                            <span>Admin Console</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </div>
                            <DropdownMenuSeparator className="bg-[#282828]" />
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 focus:bg-rose-950/30">
                                <Link href="/logout" method="post" as="button" className="w-full flex items-center gap-2 text-xs py-1.5 px-2.5">
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>End Shift & Sign Out</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main content fills viewport */}
            <main className="flex-1 flex overflow-hidden">{children}</main>
        </div>
    );
}
