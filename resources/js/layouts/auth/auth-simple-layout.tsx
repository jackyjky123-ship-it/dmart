import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Store, ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.14),transparent)] selection:bg-emerald-100 selection:text-emerald-900 transition-colors">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

            {/* Top-Right Language Switcher */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                <LanguageSwitcher variant="compact" align="end" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="flex flex-col gap-6">
                    {/* Brand Header */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 group"
                            aria-label="Back to DMart Storefront"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-700/25 group-hover:scale-105 group-hover:shadow-emerald-600/35 transition-all duration-200">
                                D
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-black tracking-tight text-foreground">
                                    D<span className="text-emerald-600 dark:text-emerald-400">Mart</span>
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>
                        </Link>

                        {(title || description) && (
                            <div className="space-y-1">
                                {title && (
                                    <h1 className="text-2xl font-black tracking-tight text-foreground">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Card Body */}
                    <div className="rounded-3xl border border-border/60 bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-950/5 dark:shadow-none">
                        {children}
                    </div>

                    {/* Bottom Return Link */}
                    <div className="text-center">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Return to Storefront</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}