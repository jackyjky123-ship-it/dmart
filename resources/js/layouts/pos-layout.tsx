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
                    <Link href="/pos" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            <Terminal className="w-4 h-4" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold tracking-tight text-white text-base">DMart POS</span>
                            <span className="text-xs text-slate-400 font-mono">Reg #01</span>
                        </div>
                    </Link>

                    <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-800 text-[11px] py-0 hidden sm:flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online &bull; SQLite Sync
                    </Badge>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 text-xs">
                    {/* Live Clock */}
                    <div className="hidden md:flex items-center gap-1 text-slate-300 font-mono bg-slate-800/80 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{currentTime || '00:00:00'}</span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1">
                        <Button
                            asChild
                            variant={url === '/pos' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-8 text-xs ${url === '/pos' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Link href="/pos">
                                <Terminal className="w-3.5 h-3.5 mr-1.5" />
                                Terminal
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant={url.startsWith('/pos/sales') ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-8 text-xs ${url.startsWith('/pos/sales') ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Link href="/pos/sales">
                                <History className="w-3.5 h-3.5 mr-1.5" />
                                Sales & Receipts
                            </Link>
                        </Button>
                    </div>

                    {/* Cashier Info */}
                    <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-700 text-slate-300">
                        <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-200 flex items-center justify-center font-bold text-[10px]">
                            DC
                        </div>
                        <span className="font-medium text-xs">Dara Chan</span>
                    </div>

                    {/* Portal Switchers */}
                    <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-slate-700">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800" title="Go to Storefront">
                            <Link href="/">
                                <Store className="w-4 h-4 text-emerald-400" />
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800" title="Go to Admin Back Office">
                            <Link href="/admin">
                                <Shield className="w-4 h-4 text-purple-400" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800" title="Toggle Dark/Light">
                            {resolvedAppearance === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            {/* POS Body */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}
