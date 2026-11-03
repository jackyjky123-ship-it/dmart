import React from 'react';
import { Link } from '@inertiajs/react';
import {
    ShoppingCart,
    MapPin,
    Instagram,
    Facebook,
    Twitter,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom WhatsApp Icon for 100% fidelity to reference
function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.2.301-.777.98-.953 1.18-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.301.301-.501.101-.201.05-.376-.025-.527-.075-.15-.677-1.631-.928-2.233-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.527.075-.802.376-.275.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.23 1.377.197 1.896.12.578-.087 1.78-.727 2.031-1.43.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.174L2 22l4.982-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.14-.492-4.4-1.336l-.315-.21-2.956.775.789-2.883-.23-.33A8.163 8.163 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2 4.522 0 8.2 3.678 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z" />
        </svg>
    );
}

// Pointer finger icon like the reference banner
function PointerHandIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M9 3a2 2 0 0 1 2 2v6.2l.8-.4a2 2 0 0 1 2.7.7l.1.2 2 3.5a2 2 0 0 1-.2 2.2l-.1.1-1.8 1.8c-.8.8-1.8 1.4-2.9 1.6L11 21H7a4 4 0 0 1-4-4v-5a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2h1zm0 2H8v6H5v5a2 2 0 0 0 2 2h3.6c.6-.1 1.2-.4 1.7-.9l1.8-1.8-1.9-3.2-2.2 1.1V5z" />
        </svg>
    );
}

export interface HeroBannerProps {
    storeName?: string;
    offerText?: string;
    discountPercent?: string;
    headlineSmall?: string;
    headlineMain?: string;
    headlineScript?: string;
    locationTitle?: string;
    locationSubtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    backgroundImageUrl?: string;
    className?: string;
}

export function HeroBanner({
    storeName = 'Store',
    offerText = 'FOR ONLINE ORDER',
    discountPercent = '30% OFF',
    headlineSmall = 'NEW ARRIVALS',
    headlineMain = 'JUST FOR',
    headlineScript = 'you',
    locationTitle = 'BUILDING NAME',
    locationSubtitle = 'MAIN ROAD, COUNTRY, 45612',
    ctaText = 'WWW.YOURSITE.COM',
    ctaHref = '/products',
    backgroundImageUrl = '/images/bg_girlshopping.png',
    className,
}: HeroBannerProps) {
    return (
        <section
            aria-label="Promotional Hero Banner"
            className={cn(
                'relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FFC72C] border border-amber-300/60 shadow-2xl transition-all',
                'min-h-[480px] sm:min-h-[520px] md:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px]',
                className
            )}
        >
            {/* 1. BACKGROUND IMAGE WITH GIRL SHOPPING */}
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundImageUrl}
                    alt="Shopping with bags at modern shopping mall"
                    className="w-full h-full object-cover object-[center_35%] lg:object-center select-none"
                    loading="eager"
                />
            </div>

            {/* 2. ATMOSPHERIC YELLOW BLENDING GRADIENTS */}
            {/* Left yellow gradient to create clean canvas for left-hand banner typography */}
            <div
                className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[55%] lg:w-[46%] z-1 pointer-events-none bg-gradient-to-r from-[#FFC72C] via-[#FFC72C]/95 via-70% to-transparent"
                aria-hidden="true"
            />

            {/* Right yellow gradient to create clean canvas for right-hand headline & CTA */}
            <div
                className="absolute inset-y-0 right-0 w-full sm:w-[65%] md:w-[55%] lg:w-[46%] z-1 pointer-events-none bg-gradient-to-l from-[#FFC72C] via-[#FFC72C]/95 via-70% to-transparent"
                aria-hidden="true"
            />

            {/* Subtle top & bottom edge warm fades */}
            <div
                className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FFC72C]/50 to-transparent z-1 pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FFC72C]/60 to-transparent z-1 pointer-events-none"
                aria-hidden="true"
            />

            {/* 3. SIGNATURE DECORATIVE GRAPHIC SHAPES (From banner_herosection_ref.png) */}
            {/* Top-Right Soft Pale Cream Crescent / Pill */}
            <div
                className="absolute -top-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#FFF3B0]/90 blur-xs z-2 pointer-events-none"
                aria-hidden="true"
            />

            {/* Middle-Left Warm Golden Circular Glow */}
            <div
                className="absolute top-1/2 -translate-y-1/2 -left-8 sm:-left-12 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#FFE169]/80 blur-xs z-2 pointer-events-none"
                aria-hidden="true"
            />

            {/* 4. MAIN BANNER CONTENT COMPOSITION (z-10) */}
            <div className="relative z-10 w-full h-full min-h-[480px] sm:min-h-[520px] md:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px] flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12">
                {/* --- TOP ROW: BRAND (LEFT) & SOCIAL MEDIA PILL (RIGHT) --- */}
                <div className="flex items-center justify-between gap-4">
                    {/* Top Left: Shopping Cart Icon + "ONLINE Store" */}
                    <div className="flex items-center gap-2 select-none group">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 flex items-center justify-center">
                            <ShoppingCart
                                className="w-6 h-6 sm:w-7 sm:h-7 text-black stroke-[2.4]"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex items-baseline">
                            <span className="font-black text-black text-base sm:text-lg tracking-wider uppercase font-sans">
                                ONLINE
                            </span>
                            <span
                                className="font-script text-white text-2xl sm:text-3xl ml-1.5 -rotate-6 inline-block select-none font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                aria-label={storeName}
                            >
                                {storeName}
                            </span>
                        </div>
                    </div>

                    {/* Top Right: Pale Cream Capsule Pill with Social Icons */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#FFF3B0]/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-black/10 shadow-sm">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-[#FFC72C] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                        >
                            <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-[#FFC72C] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                        >
                            <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter / X"
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-[#FFC72C] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                        >
                            <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                        </a>
                        <a
                            href="https://whatsapp.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-[#FFC72C] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                        >
                            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                    </div>
                </div>

                {/* --- MIDDLE ROW: PROMO OFFER (LEFT) & HEADLINE "JUST FOR you" (RIGHT) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto py-4 sm:py-6">
                    {/* Left Column (Cols 1-5): "FOR ONLINE ORDER" + "30% OFF" */}
                    <div className="lg:col-span-5 flex flex-col items-start select-none">
                        <div className="space-y-1">
                            <span className="block text-xs sm:text-sm lg:text-base font-black tracking-widest text-black uppercase leading-tight font-sans">
                                {offerText}
                            </span>
                            {/* Thin horizontal divider bar */}
                            <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-black rounded-full" />
                        </div>

                        {/* Bold 30% OFF Stack */}
                        <div className="pt-2 sm:pt-3">
                            <div className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-black tracking-tighter leading-none font-sans">
                                30%
                            </div>
                            <div className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-black tracking-tight leading-none font-sans mt-0.5">
                                OFF
                            </div>
                        </div>
                    </div>

                    {/* Center Breathing Room (Cols 6-7): Highlights the 3D Shopping Girl */}
                    <div className="hidden lg:block lg:col-span-2 pointer-events-none" />

                    {/* Right Column (Cols 8-12): "NEW ARRIVALS" + "JUST FOR you" */}
                    <div className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right select-none">
                        <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-[0.25em] text-black uppercase mb-1 sm:mb-2 font-sans">
                            {headlineSmall}
                        </span>

                        {/* Massive "JUST FOR" with white script "you" overlaid */}
                        <div className="relative inline-block leading-none">
                            <div className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-9xl font-black text-black tracking-tight uppercase leading-[0.85] font-sans">
                                JUST
                                <br />
                                FOR
                            </div>

                            {/* Flowing script "you" in crisp white overlaid across "FOR" */}
                            <span
                                className="font-script text-5xl sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-9xl text-white font-normal -rotate-6 tracking-normal select-none absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 left-3 sm:left-6 lg:left-auto lg:right-4 z-20 pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                                aria-hidden="true"
                            >
                                {headlineScript}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM ROW: LOCATION (LEFT) & CTA BUTTON (RIGHT) --- */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                    {/* Bottom Left: Location Pin + Address */}
                    <div className="flex items-center gap-2.5 select-none">
                        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                            <MapPin
                                className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[2.5]"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xs sm:text-sm tracking-wider uppercase text-black leading-tight font-sans">
                                {locationTitle}
                            </span>
                            <span className="text-[11px] sm:text-xs font-semibold text-black/80 tracking-wide leading-tight font-sans">
                                {locationSubtitle}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Right: Black Pill CTA Button with White Hand Click Icon */}
                    <Link
                        href={ctaHref}
                        className="self-start sm:self-auto inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-black text-white hover:bg-neutral-900 active:scale-95 transition-all shadow-xl hover:shadow-2xl border border-white/20 group cursor-pointer"
                    >
                        <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-sans">
                            {ctaText}
                        </span>
                        <PointerHandIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform group-hover:scale-115 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
