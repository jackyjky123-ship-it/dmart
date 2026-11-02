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
        <div className="min-h-screen flex flex-col bg-[#141414] text-white font-sans antialiased selection:bg-[#F25623] selection:text-white">
            {/* Top Bar for POS */}
            <header className="h-14 bg-[#1a1a1a] text-white px-4 flex items-center justify-between border-b border-[#282828] shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/pos" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-[#F25623] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#F25623]/25 group-hover:scale-105 transition-transform">
                            <Terminal className="w-4 h-4" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-black tracking-widest uppercase text-white text-base">
                                DMART <span className="text-[#F25623]">POS</span>
                            </span>
                            <span className="text-[11px] text-[#737373] font-mono">Reg #01 &bull; Terminal</span>
                        </div>
                    </Link>

                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#242424] border border-[#333] text-[11px] text-white font-mono">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F25623] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F25623]" />
                        </span>
                        <span>Online &bull; Instant Sync</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs">
                    {/* Live Clock */}
                    <div className="hidden md:flex items-center gap-1.5 text-[#a3a3a3] font-mono bg-[#222] border border-[#333] px-3 py-1 rounded-full shadow-inner">
                        <Clock className="w-3.5 h-3.5 text-[#F25623]" />
                        <span>{currentTime || '00:00:00'}</span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 bg-[#222] p-0.5 rounded-full border border-[#333]">
                        <Button
                            asChild
                            variant={url === '/pos' ? 'default' : 'ghost'}
                            size="xs"
                            className={`rounded-full px-3 text-xs font-semibold ${
                                url === '/pos'
                                    ? 'bg-[#F25623] hover:bg-[#d9481a] text-white shadow-xs'
                                    : 'text-[#888] hover:text-white hover:bg-[#2c2c2c]'
                            }`}
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
                            className={`rounded-full px-3 text-xs font-semibold ${
                                url.startsWith('/pos/sales')
                                    ? 'bg-[#F25623] hover:bg-[#d9481a] text-white shadow-xs'
                                    : 'text-[#888] hover:text-white hover:bg-[#2c2c2c]'
                            }`}
                        >
                            <Link href="/pos/sales">
                                <History className="w-3.5 h-3.5 mr-1" />
                                Sales
                            </Link>
                        </Button>
                    </div>

                    {/* Portal Switchers */}
                    <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-[#333]">
                        <Button asChild variant="outline" size="xs" className="rounded-full border-[#333] bg-[#222] text-[#a3a3a3] hover:text-white hover:border-[#F25623]">
                            <Link href="/">
                                <Store className="w-3 h-3 text-[#F25623] mr-1" />
                                Storefront
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="xs" className="rounded-full border-[#333] bg-[#222] text-[#a3a3a3] hover:text-white hover:border-purple-400">
                            <Link href="/admin">
                                <Shield className="w-3 h-3 text-purple-400 mr-1" />
                                Admin
                            </Link>
                        </Button>
                    </div>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={toggleTheme}
                        className="rounded-full text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                        aria-label="Toggle theme"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-[#a3a3a3]" />
                        )}
                    </Button>
                </div>
            </header>

            {/* Main content fills viewport */}
            <main className="flex-1 flex overflow-hidden">{children}</main>
        </div>
    );
}
