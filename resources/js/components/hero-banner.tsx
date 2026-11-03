import React from 'react';
import { Link } from '@inertiajs/react';
import {
    ShoppingBag,
    Store,
    Sparkles,
    Zap,
    Truck,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

export interface HeroBannerProps {
    titleTop?: string;
    titleBottom?: string;
    subtitle?: string;
    badgeText?: string;
    ctaText?: string;
    ctaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    className?: string;
    // Backwards compatibility props
    colorways?: unknown;
    storeName?: string;
    offerText?: string;
    discountPercent?: string;
    headlineSmall?: string;
    headlineMain?: string;
    headlineScript?: string;
    locationTitle?: string;
    locationSubtitle?: string;
    backgroundImageUrl?: string;
}

export function HeroBanner({
    titleTop,
    titleBottom,
    subtitle,
    badgeText,
    ctaText,
    ctaHref = '/products',
    secondaryCtaText,
    secondaryCtaHref = '/products',
    className,
}: HeroBannerProps) {
    const { t, isKhmer } = useTranslation();

    const displayTitleTop = titleTop || t('YOUR 24/7');
    const displayTitleBottom = titleBottom || t('FLAGSHIP MART');
    const displayBadgeText = badgeText || t('DMART 24/7 FLAGSHIP STORE');
    const displaySubtitle =
        subtitle ||
        t(
            'Discover limited releases, premium streetwear, and everyday essentials with seamless instant checkout and express delivery.',
        );
    const displayCtaText = ctaText || t('Shop Now');
    const displaySecondaryCta = secondaryCtaText || t('Explore Catalog');

    return (
        <section
            aria-label="DMart 24/7 Flagship Showcase"
            className={cn(
                'relative w-full overflow-hidden select-none',
                className,
            )}
        >
            {/* 1. ATMOSPHERIC BRAND ORANGE GLOW */}
            <div
                className="pointer-events-none absolute -top-28 left-1/2 h-[420px] w-[85%] -translate-x-1/2 bg-gradient-to-b from-[#F25623]/15 via-[#F25623]/5 to-transparent blur-3xl dark:from-[#F25623]/25 dark:via-[#F25623]/8"
                aria-hidden="true"
            />

            {/* 2. MAIN HERO CARD CONTAINER: LIGHT WARM CANVAS / DARK JET BLACK */}
            <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#FFF7F0] via-[#FFFDFB] to-white p-6 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.18),0_0_50px_rgba(242,86,35,0.10)] sm:rounded-[32px] sm:p-8 md:rounded-[36px] md:p-10 lg:p-12 xl:p-14 dark:border-[#2B2B2B] dark:from-[#1C1C1C] dark:via-[#141414] dark:to-[#0D0D0D] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(242,86,35,0.12)]">
                {/* 3. INNER 2-COLUMN BALANCED COMPOSITION (Left: Brand Narrative & CTAs, Right: 3D DMart Mart Building) */}
                <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
                    {/* --- LEFT COLUMN: TYPOGRAPHY, TRUST POINTS & BUTTONS --- */}
                    <div className="flex flex-col items-start justify-center space-y-5 sm:space-y-6 lg:col-span-6 lg:space-y-7">
                        {/* Live Storefront Status Badge */}
                        <div className="animate-title-reveal inline-flex items-center gap-2 rounded-full border border-[#F25623]/25 bg-[#F25623]/10 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-[#F25623] uppercase select-none sm:px-3.5">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
                            </span>
                            <span>{displayBadgeText}</span>
                        </div>

                        {/* ANIMATED HEADLINE (Khmer-optimized leading and font scaling) */}
                        <div className="space-y-1">
                            <h1
                                className={cn(
                                    'font-sans font-black tracking-[0.03em] text-foreground select-none',
                                    isKhmer
                                        ? 'text-3xl leading-[1.2] sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl'
                                        : 'text-4xl leading-[0.95] uppercase sm:text-5xl md:text-6xl lg:text-7xl',
                                )}
                            >
                                <span
                                    className="animate-title-reveal block text-foreground"
                                    style={{ animationDelay: '80ms' }}
                                >
                                    {displayTitleTop}
                                </span>
                                <span
                                    className="animate-title-reveal animate-shimmer block cursor-default bg-gradient-to-r from-[#171717] via-[#F25623] to-[#FF875E] bg-clip-text text-transparent transition-all hover:brightness-125 dark:from-white"
                                    style={{ animationDelay: '220ms' }}
                                    title={displayTitleBottom}
                                >
                                    {displayTitleBottom}
                                </span>
                            </h1>
                        </div>

                        {/* SUBTITLE */}
                        <p
                            className={cn(
                                'animate-title-reveal max-w-sm font-normal text-muted-foreground lg:max-w-lg',
                                isKhmer
                                    ? 'text-sm leading-relaxed sm:text-base'
                                    : 'text-xs leading-relaxed sm:text-sm lg:text-[15px]',
                            )}
                            style={{ animationDelay: '360ms' }}
                        >
                            {displaySubtitle}
                        </p>

                        {/* TRUST & FEATURE PILLS */}
                        <div
                            className="animate-title-reveal flex flex-wrap items-center gap-2 pt-1 sm:gap-2.5"
                            style={{ animationDelay: '440ms' }}
                        >
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/70 px-3 py-1 text-[11px] font-medium text-foreground shadow-xs sm:text-xs dark:border-white/10 dark:bg-white/5 dark:text-[#E5E5E5]">
                                <Zap className="h-3.5 w-3.5 text-[#F25623]" />
                                <span>{t('Instant POS Sync')}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/70 px-3 py-1 text-[11px] font-medium text-foreground shadow-xs sm:text-xs dark:border-white/10 dark:bg-white/5 dark:text-[#E5E5E5]">
                                <Sparkles className="h-3.5 w-3.5 text-[#F25623]" />
                                <span>{t('100+ Exclusive Drops')}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/70 px-3 py-1 text-[11px] font-medium text-foreground shadow-xs sm:text-xs dark:border-white/10 dark:bg-white/5 dark:text-[#E5E5E5]">
                                <Truck className="h-3.5 w-3.5 text-[#F25623]" />
                                <span>{t('Express Delivery')}</span>
                            </div>
                        </div>

                        {/* CTA ACTION BUTTONS */}
                        <div
                            className="animate-title-reveal flex flex-wrap items-center gap-3.5 pt-2 sm:pt-3"
                            style={{ animationDelay: '520ms' }}
                        >
                            {/* Primary Button */}
                            <Link
                                href={ctaHref}
                                className={cn(
                                    'group inline-flex items-center gap-3.5 rounded-full px-6 py-3 sm:px-7 sm:py-3.5',
                                    'bg-gradient-to-r from-[#F25623] via-[#FA6332] to-[#E04515]',
                                    'hover:from-[#E04515] hover:via-[#D13807] hover:to-[#B83005]',
                                    'text-white shadow-lg shadow-[#F25623]/25 hover:shadow-xl hover:shadow-[#F25623]/40',
                                    'border border-[#FF875E]/30 transition-all duration-300 ease-out',
                                    'hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F25623] focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95',
                                )}
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7">
                                    <ShoppingBag className="h-3.5 w-3.5 text-[#F25623] transition-transform group-hover:scale-110" />
                                </span>
                                <span className="font-sans text-xs font-extrabold tracking-[0.14em] text-white uppercase sm:text-sm">
                                    {displayCtaText}
                                </span>
                            </Link>

                            {/* Secondary Button */}
                            <Link
                                href={secondaryCtaHref}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-5 py-3 sm:px-6 sm:py-3.5',
                                    'border border-border bg-card/70 text-foreground hover:border-[#F25623]/50 hover:bg-muted dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10',
                                    'text-xs font-bold tracking-wider uppercase transition-all duration-300 sm:text-sm',
                                    'hover:-translate-y-0.5 active:scale-95',
                                )}
                            >
                                <span>{displaySecondaryCta}</span>
                                <ArrowRight className="h-4 w-4 text-[#F25623]" />
                            </Link>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: 3D DMART STOREFRONT WITH FLOATING FEATURE BADGES --- */}
                    <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[420px] lg:col-span-6 lg:min-h-[480px]">
                        {/* Pedestal Ground Shadow */}
                        <div
                            className="pointer-events-none absolute bottom-4 left-1/2 h-24 w-[85%] -translate-x-1/2 rounded-full bg-black/15 blur-2xl dark:bg-black/60"
                            aria-hidden="true"
                        />

                        {/* Floating Micro-Badge 1: Top-Left (24/7 OPEN) */}
                        <div
                            className="animate-title-reveal absolute top-2 left-0 z-20 hidden items-center gap-2.5 rounded-2xl border border-border bg-card/95 px-3 py-2 shadow-xl backdrop-blur-md select-none sm:top-6 sm:left-4 sm:flex sm:px-3.5 dark:border-white/10 dark:bg-[#1A1A1A]/90"
                            style={{ animationDelay: '600ms' }}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10b981]/15 text-[#10b981]">
                                <Store className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] font-bold tracking-wider text-foreground uppercase">
                                    {t('24/7 OPEN')}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {t('Always Ready')}
                                </span>
                            </div>
                        </div>

                        {/* The 3D DMart Mart Building Asset */}
                        <div className="group relative z-10 w-full max-w-[480px] select-none sm:max-w-[540px] lg:max-w-[580px] xl:max-w-[620px]">
                            <picture>
                                <source
                                    srcSet="/images/dmart_3d.webp"
                                    type="image/webp"
                                />
                                <img
                                    src="/images/dmart_3d.png"
                                    alt="DMart 24/7 Flagship 3D Storefront"
                                    className="animate-hero-float h-auto w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] transition-all duration-700 ease-out group-hover:scale-105 dark:drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
                                    loading="eager"
                                />
                            </picture>
                        </div>

                        {/* Floating Micro-Badge 3: Bottom-Right (SMART POS & ATM) */}
                        <div
                            className="animate-title-reveal absolute right-0 bottom-2 z-20 hidden items-center gap-2.5 rounded-2xl border border-border bg-card/95 px-3 py-2 shadow-xl backdrop-blur-md select-none sm:right-4 sm:bottom-6 sm:flex sm:px-3.5 dark:border-white/10 dark:bg-[#1A1A1A]/90"
                            style={{ animationDelay: '700ms' }}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F25623]/15 text-[#F25623]">
                                <Zap className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] font-bold tracking-wider text-foreground uppercase">
                                    {t('SMART POS & ATM')}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {t('Instant Checkout')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
