import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselDots,
    CarouselProgressBar,
    CarouselAutoplayToggle,
    type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingBag,
    ArrowRight,
    Sparkles,
    Truck,
    Clock,
    ShieldCheck,
    Coffee,
    Wheat,
    Apple,
    QrCode,
    Terminal,
    Flame,
    CheckCircle2,
    Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSlide {
    id: string;
    tabLabel: string;
    tabIcon: React.ReactNode;
    pill: string;
    pillIcon: React.ReactNode;
    title: string;
    description: string;
    primaryCta: {
        text: string;
        href: string;
        icon: React.ReactNode;
    };
    secondaryCta: {
        text: string;
        href: string;
        icon?: React.ReactNode;
    };
    badges: { label: string; highlight: string }[];
    theme: {
        bgGradient: string;
        accentColor: string;
        badgeColor: string;
        cardBg: string;
        ringColor: string;
    };
    showcase: {
        title: string;
        subtitle: string;
        mainItem: {
            title: string;
            price: string;
            tag: string;
            detail: string;
            badge: string;
        };
        secondaryItem: {
            title: string;
            price: string;
            tag: string;
        };
        guarantee: string;
    };
}

const HERO_SLIDES: HeroSlide[] = [
    {
        id: 'fresh-produce',
        tabLabel: 'Fresh Harvest',
        tabIcon: <Apple className="h-4 w-4 text-emerald-400" />,
        pill: 'Morning Harvest • Direct from Kandal & Battambang Farms',
        pillIcon: <Sparkles className="h-3.5 w-3.5 text-amber-300" />,
        title: 'Farm-Fresh Produce Delivered in 35 Minutes',
        description:
            'Crisp morning bok choy, sweet Battambang mandarins, fragrant lemongrass, and certified fresh herbs sourced daily at dawn for your Phnom Penh kitchen.',
        primaryCta: {
            text: 'Shop Fresh Produce',
            href: '/products?category=produce',
            icon: <ShoppingBag className="mr-2 h-4 w-4" />,
        },
        secondaryCta: {
            text: "Today's Specials",
            href: '/products',
            icon: <ArrowRight className="ml-1.5 h-4 w-4" />,
        },
        badges: [
            { highlight: '35 mins', label: 'Average Delivery' },
            { highlight: '100% Crisp', label: 'Freshness Guarantee' },
            { highlight: 'Free Over $35', label: 'City-wide Shipping' },
        ],
        theme: {
            bgGradient: 'from-emerald-900 via-teal-900 to-slate-950',
            accentColor: 'bg-amber-400 hover:bg-amber-300 text-emerald-950',
            badgeColor:
                'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
            cardBg: 'bg-emerald-950/50 border-emerald-700/40',
            ringColor: 'ring-emerald-500/30',
        },
        showcase: {
            title: 'Dawn Farm Selection',
            subtitle: 'Picked 4:30 AM today',
            mainItem: {
                title: 'Battambang Sweet Mandarins',
                price: '$3.20',
                detail: 'per kg • Grade A sweet & juicy',
                tag: 'Citrus Harvest',
                badge: 'Top Seller ★ 4.9',
            },
            secondaryItem: {
                title: 'Crisp Baby Bok Choy',
                price: '$1.45',
                tag: 'Hydroponic Green',
            },
            guarantee: 'Zero-wilt replacement guarantee on all farm deliveries',
        },
    },
    {
        id: 'bakery-coffee',
        tabLabel: 'Artisan Bakery',
        tabIcon: <Wheat className="h-4 w-4 text-amber-400" />,
        pill: 'Oven-Fresh 7:00 AM • Mondulkiri Arabica Roast',
        pillIcon: <Coffee className="h-3.5 w-3.5 text-amber-300" />,
        title: 'Warm French Baguettes & Handcrafted Cold Brew',
        description:
            'Golden sourdough, flaky pure-butter croissants, and iced Phnom Penh coffee brewed with single-origin beans from the cool hills of Mondulkiri.',
        primaryCta: {
            text: 'Order Morning Bakes',
            href: '/products?category=bakery',
            icon: <Wheat className="mr-2 h-4 w-4" />,
        },
        secondaryCta: {
            text: 'Explore Cold Brews',
            href: '/products?category=beverages',
            icon: <ArrowRight className="ml-1.5 h-4 w-4" />,
        },
        badges: [
            { highlight: '2x Daily', label: 'Fresh Oven Drops' },
            { highlight: 'French Butter', label: 'No Margarine' },
            { highlight: 'Highland Beans', label: 'Mondulkiri Origin' },
        ],
        theme: {
            bgGradient: 'from-amber-950 via-stone-900 to-slate-950',
            accentColor: 'bg-amber-400 hover:bg-amber-300 text-amber-950',
            badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
            cardBg: 'bg-stone-900/60 border-amber-800/40',
            ringColor: 'ring-amber-500/30',
        },
        showcase: {
            title: 'Morning Breakfast Combo',
            subtitle: 'Ready to enjoy warm at your desk',
            mainItem: {
                title: 'Crusty Traditional Baguette',
                price: '$1.50',
                detail: 'Freshly baked with unbleached flour',
                tag: 'Daily Oven',
                badge: 'Warm at 7:00 AM',
            },
            secondaryItem: {
                title: 'Mondulkiri Iced Robusta',
                price: '$2.25',
                tag: 'Rich & Sweet',
            },
            guarantee: 'Baked twice daily so you never get day-old bread',
        },
    },
    {
        id: 'pantry-spices',
        tabLabel: 'Pantry & Spices',
        tabIcon: <Flame className="h-4 w-4 text-rose-400" />,
        pill: 'GI-Certified Kampot Pepper & Royal Jasmine Rice',
        pillIcon: <ShieldCheck className="h-3.5 w-3.5 text-rose-300" />,
        title: 'Authentic Kampot Spices & Royal Jasmine Rice',
        description:
            'Stock your pantry with world-renowned Kampot black and red peppercorns, award-winning Phka Rumduol jasmine rice, and essential kitchen seasonings.',
        primaryCta: {
            text: 'Stock Your Pantry',
            href: '/products?category=household',
            icon: <ShoppingBag className="mr-2 h-4 w-4" />,
        },
        secondaryCta: {
            text: 'All Pantry Items',
            href: '/products',
            icon: <ArrowRight className="ml-1.5 h-4 w-4" />,
        },
        badges: [
            { highlight: 'GI-Certified', label: 'Kampot Origin' },
            { highlight: 'Phka Rumduol', label: 'World Champ Rice' },
            { highlight: 'Zero Additives', label: 'Pure Ingredients' },
        ],
        theme: {
            bgGradient: 'from-rose-950 via-slate-900 to-stone-950',
            accentColor: 'bg-rose-400 hover:bg-rose-300 text-rose-950',
            badgeColor: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
            cardBg: 'bg-rose-950/40 border-rose-800/30',
            ringColor: 'ring-rose-500/30',
        },
        showcase: {
            title: 'Pantry Heritage Trio',
            subtitle: 'Essential Cambodian flavor foundation',
            mainItem: {
                title: 'Kampot Black Pepper (100g Jar)',
                price: '$4.50',
                detail: 'Sun-dried floral & pungent peppercorns',
                tag: 'Protected GI',
                badge: 'Artisanal Batch',
            },
            secondaryItem: {
                title: 'Phka Rumduol Jasmine Rice 5kg',
                price: '$6.80',
                tag: 'Fragrant Grain',
            },
            guarantee:
                'Certified origin stamps verified on every harvest package',
        },
    },
    {
        id: 'instant-khqr',
        tabLabel: 'Instant Pay & POS',
        tabIcon: <QrCode className="h-4 w-4 text-cyan-400" />,
        pill: 'Bakong KHQR Simulation • Cash on Delivery • In-Store POS',
        pillIcon: <Terminal className="h-3.5 w-3.5 text-cyan-300" />,
        title: 'Seamless Bakong KHQR Checkout & Live POS Counter',
        description:
            'Shop online with instant mock KHQR payment simulation or pay cash with exact driver change. All orders share live stock ledger with our cashier POS counter.',
        primaryCta: {
            text: 'Start Shopping Online',
            href: '/products',
            icon: <ShoppingBag className="mr-2 h-4 w-4" />,
        },
        secondaryCta: {
            text: 'Switch to POS Terminal',
            href: '/pos',
            icon: <Terminal className="ml-1.5 h-4 w-4" />,
        },
        badges: [
            { highlight: '< 3s QR Scan', label: 'Bakong Simulation' },
            { highlight: 'Exact Change', label: 'Cash on Delivery' },
            { highlight: 'Live Sync', label: 'Web & POS Counter' },
        ],
        theme: {
            bgGradient: 'from-slate-950 via-indigo-950 to-teal-950',
            accentColor: 'bg-cyan-400 hover:bg-cyan-300 text-cyan-950',
            badgeColor: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
            cardBg: 'bg-indigo-950/60 border-cyan-700/30',
            ringColor: 'ring-cyan-500/30',
        },
        showcase: {
            title: 'Phnom Penh Mart POS & QR',
            subtitle: 'Synchronized real-time inventory',
            mainItem: {
                title: 'Bakong Mock QR Checkout',
                price: 'Instant',
                detail: 'Scan simulation with auto-restock protection',
                tag: 'KHQR Gateway',
                badge: 'Live Simulator',
            },
            secondaryItem: {
                title: '80mm Thermal Receipt',
                price: 'Ready',
                tag: 'In-Store POS',
            },
            guarantee:
                'One shared inventory ledger across web shoppers and cashier counter',
        },
    },
];

export function HeroSlideshow() {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const handleSetApi = (carouselApi: CarouselApi) => {
        setApi(carouselApi);
        setCurrentSlideIndex(carouselApi.currentIndex);
    };

    // Update active tab when slide changes
    React.useEffect(() => {
        if (!api) return;
        const interval = setInterval(() => {
            if (api.currentIndex !== currentSlideIndex) {
                setCurrentSlideIndex(api.currentIndex);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [api, currentSlideIndex]);

    return (
        <div className="relative space-y-3">
            {/* Quick Category Jump Tabs for Slideshow */}
            <div className="hidden scrollbar-none items-center gap-2 overflow-x-auto pb-1 sm:flex">
                <span className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <Store className="h-3.5 w-3.5 text-emerald-600" /> Featured
                    Highlights:
                </span>
                <div className="flex items-center gap-2">
                    {HERO_SLIDES.map((slide, idx) => (
                        <button
                            key={slide.id}
                            type="button"
                            onClick={() => {
                                api?.scrollTo(idx);
                                setCurrentSlideIndex(idx);
                            }}
                            className={cn(
                                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200',
                                currentSlideIndex === idx
                                    ? 'scale-102 border-emerald-600 bg-emerald-600 font-semibold text-white shadow-sm'
                                    : 'border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                            )}
                        >
                            {slide.tabIcon}
                            <span>{slide.tabLabel}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* shadcn Carousel Component */}
            <Carousel
                setApi={handleSetApi}
                autoplay={true}
                autoplayInterval={6000}
                pauseOnHover={true}
                loop={true}
                className="overflow-hidden border border-white/10 shadow-2xl dark:border-white/5"
            >
                {/* Previous & Next Navigation Controls */}
                <CarouselPrevious className="-left-4 hidden border-white/20 bg-black/40 text-white shadow-lg backdrop-blur-md hover:bg-black/60 sm:left-4 md:flex" />
                <CarouselNext className="-right-4 hidden border-white/20 bg-black/40 text-white shadow-lg backdrop-blur-md hover:bg-black/60 sm:right-4 md:flex" />

                <CarouselContent>
                    {HERO_SLIDES.map((slide, slideIdx) => (
                        <CarouselItem key={slide.id}>
                            <div
                                className={cn(
                                    'relative flex min-h-[500px] flex-col justify-between overflow-hidden bg-linear-to-br p-6 text-white transition-colors duration-500 sm:p-10 lg:min-h-[540px] lg:p-12',
                                    slide.theme.bgGradient,
                                )}
                            >
                                {/* Subtle decorative atmospheric glow */}
                                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-black/20 blur-3xl" />

                                {/* Slide Main Grid: Content (Left) & Showcase Composition (Right) */}
                                <div className="relative z-10 my-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                                    {/* Left Column: Editorial Content */}
                                    <div className="space-y-5 lg:col-span-7">
                                        {/* Status / Announcement Tag */}
                                        <div className="inline-flex max-w-full items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-xs backdrop-blur-md">
                                            {slide.pillIcon}
                                            <span className="truncate">
                                                {slide.pill}
                                            </span>
                                        </div>

                                        {/* Main Headline */}
                                        <h1 className="text-3xl leading-[1.15] font-black tracking-tight text-balance sm:text-5xl lg:text-5xl">
                                            {slide.title}
                                        </h1>

                                        {/* Descriptive Copy */}
                                        <p className="max-w-xl text-sm leading-relaxed font-normal text-white/85 sm:text-base">
                                            {slide.description}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                            <Button
                                                asChild
                                                size="lg"
                                                className={cn(
                                                    'px-6 font-bold shadow-lg transition-transform active:scale-95',
                                                    slide.theme.accentColor,
                                                )}
                                            >
                                                <Link
                                                    href={slide.primaryCta.href}
                                                >
                                                    {slide.primaryCta.icon}
                                                    {slide.primaryCta.text}
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                                className="border-white/30 font-medium text-white backdrop-blur-xs hover:bg-white/10"
                                            >
                                                <Link
                                                    href={
                                                        slide.secondaryCta.href
                                                    }
                                                >
                                                    {slide.secondaryCta.text}
                                                    {slide.secondaryCta.icon}
                                                </Link>
                                            </Button>
                                        </div>

                                        {/* Value Badges Ticker */}
                                        <div className="grid max-w-xl grid-cols-3 gap-3 border-t border-white/15 pt-4">
                                            {slide.badges.map((b, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-col"
                                                >
                                                    <span className="text-sm font-extrabold tracking-tight text-white sm:text-base">
                                                        {b.highlight}
                                                    </span>
                                                    <span className="text-[11px] leading-tight text-white/70">
                                                        {b.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column: High-Craft Showcase Card */}
                                    <div className="relative lg:col-span-5">
                                        <div
                                            className={cn(
                                                'relative space-y-4 overflow-hidden rounded-2xl border p-6 shadow-2xl backdrop-blur-xl',
                                                slide.theme.cardBg,
                                            )}
                                        >
                                            {/* Card Header */}
                                            <div className="flex items-center justify-between border-b border-white/15 pb-3">
                                                <div>
                                                    <div className="text-xs font-bold tracking-wider text-white/90 uppercase">
                                                        {slide.showcase.title}
                                                    </div>
                                                    <div className="text-[11px] text-white/60">
                                                        {
                                                            slide.showcase
                                                                .subtitle
                                                        }
                                                    </div>
                                                </div>
                                                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                                                    DMart Special
                                                </span>
                                            </div>

                                            {/* Primary Showcase Item */}
                                            <div className="flex items-start justify-between gap-3 rounded-xl border border-white/15 bg-white/10 p-4 transition-colors hover:bg-white/15">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-stone-950 uppercase">
                                                            {
                                                                slide.showcase
                                                                    .mainItem
                                                                    .tag
                                                            }
                                                        </span>
                                                        <span className="text-[10px] text-white/70">
                                                            {
                                                                slide.showcase
                                                                    .mainItem
                                                                    .badge
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-bold text-white">
                                                        {
                                                            slide.showcase
                                                                .mainItem.title
                                                        }
                                                    </div>
                                                    <div className="text-xs text-white/70">
                                                        {
                                                            slide.showcase
                                                                .mainItem.detail
                                                        }
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <div className="text-lg font-black text-amber-300">
                                                        {
                                                            slide.showcase
                                                                .mainItem.price
                                                        }
                                                    </div>
                                                    <div className="text-[10px] text-white/50">
                                                        In Stock
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Secondary Showcase Item */}
                                            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-xs">
                                                <div className="flex items-center gap-2 text-white/90">
                                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                                    <span className="truncate font-medium">
                                                        {
                                                            slide.showcase
                                                                .secondaryItem
                                                                .title
                                                        }
                                                    </span>
                                                </div>
                                                <div className="ml-2 shrink-0 font-bold text-white">
                                                    {
                                                        slide.showcase
                                                            .secondaryItem.price
                                                    }
                                                </div>
                                            </div>

                                            {/* Guarantee Footer */}
                                            <div className="flex items-center gap-2 pt-1 text-[11px] text-white/80">
                                                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                                                <span>
                                                    {slide.showcase.guarantee}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Floating Badge on Corner */}
                                        <div className="absolute -right-3 -bottom-3 hidden items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xl backdrop-blur-md sm:flex">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                            <span>
                                                Phnom Penh Express Ready
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Slide Bottom Controls Row: Dots, Timer Bar, Play/Pause */}
                                <div className="relative z-10 mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-4">
                                        <CarouselDots className="[&>button]:bg-white/40 [&>button[aria-selected='true']]:bg-white" />
                                        <span className="hidden text-xs font-medium text-white/60 sm:inline">
                                            Slide {slideIdx + 1} of{' '}
                                            {HERO_SLIDES.length}
                                        </span>
                                    </div>

                                    {/* Progress Timer & Autoplay Control */}
                                    <div className="flex w-48 items-center gap-3 sm:w-64">
                                        <CarouselProgressBar className="bg-white/20 [&>div]:bg-white" />
                                        <CarouselAutoplayToggle className="text-white hover:bg-white/20 hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
