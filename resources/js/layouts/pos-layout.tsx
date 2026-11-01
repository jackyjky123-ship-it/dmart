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
    CheckCircle2,
    Wifi,
    ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PosLayout({ children }: { children: React.ReactNode }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [currentTime, setCurrentTime] = useState('');
    const { url } = usePage();

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
        <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-foreground font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
            {/* Top Bar for POS */}
            <header className="h-14 bg-slate-900 text-white px-4 flex items-center justify-between border-b border-slate-800 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/pos" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                            <Terminal className="w-4 h-4" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold tracking-tight text-white text-base">DMart POS</span>
                            <span className="text-xs text-slate-400 font-mono">Reg #01</span>
                        </div>
                    </Link>

                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-400 font-mono">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>Online &bull; SQLite Sync</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs">
                    {/* Live Clock */}
                    <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-mono bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{currentTime || '00:00:00'}</span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 bg-slate-800/60 p-0.5 rounded-xl border border-slate-700/60">
                        <Button
                            asChild
                            variant={url === '/pos' ? 'default' : 'ghost'}
                            size="xs"
                            className={`rounded-lg ${url === '/pos' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'}`}
                        >
                            <Link href="/pos">
                                <Terminal className="w-3.5 h-3.5 mr-1" />
                                Terminal
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant={url.startsWith('/pos/sales') ? 'default' : 'ghost'}
                            size="xs"
                            className={`rounded-lg ${url.startsWith('/pos/sales') ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'}`}
                        >
                            <Link href="/pos/sales">
                                <History className="w-3.5 h-3.5 mr-1" />
                                Sales
                            </Link>
                        </Button>
                    </div>

                    {/* Quick Portal Jump */}
                    <Button asChild variant="ghost" size="xs" className="hidden lg:inline-flex text-slate-400 hover:text-white text-xs">
                        <Link href="/">
                            <Store className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                            Store
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="xs" className="hidden lg:inline-flex text-slate-400 hover:text-white text-xs">
                        <Link href="/admin">
                            <Shield className="w-3.5 h-3.5 mr-1 text-purple-400" />
                            Admin
                        </Link>
                    </Button>

                    {/* Cashier Info */}
                    <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-700 text-slate-300">
                        <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-200 flex items-center justify-center font-bold text-[10px]">
                            DC
                        </div>
                        <span className="font-medium text-xs text-slate-300">Cashier #1</span>
                    </div>

                    {/* Dark Mode Toggle */}
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={toggleTheme}
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                        aria-label="Toggle theme"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                            <Moon className="h-3.5 w-3.5" />
                        )}
                    </Button>
                </div>
            </header>

            {/* Main Terminal Body */}
            <main className="flex-1 flex flex-col min-h-0">
                {children}
            </main>
        </div>
    );
}