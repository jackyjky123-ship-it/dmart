import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import {
    QrCode,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ShoppingBag,
    Clock,
    Copy,
    Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentPageProps {
    order?: {
        id: number;
        order_number: string;
        total_cents: number;
        subtotal_cents: number;
        shipping_fee_cents: number;
        status: string;
        items: Array<{ name: string; sku: string; quantity: number; unit_price_cents: number; line_total_cents: number }>;
    };
}

export default function PaymentView({ order: initialOrder }: PaymentPageProps) {
    const { t } = useTranslation();
    const order = initialOrder || {
        id: 105,
        order_number: 'DM-00105',
        total_cents: 1344,
        subtotal_cents: 1144,
        shipping_fee_cents: 200,
        status: 'pending_payment',
        items: [
            { name: 'Honeycrisp Apples', sku: 'PROD-APP-002', quantity: 2, unit_price_cents: 320, line_total_cents: 640 },
            { name: 'Sparkling Mineral Water (6x330ml)', sku: 'BEV-SPK-002', quantity: 1, unit_price_cents: 480, line_total_cents: 480 },
        ],
    };

    const [status, setStatus] = useState<string>(order.status);
    const [copied, setCopied] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleCopyRef = () => {
        navigator.clipboard.writeText(order.order_number);
        setCopied(true);
        toast.info(t('Order reference copied to clipboard'));
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSimulateSuccess = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            setStatus('paid');
            toast.success(t('Mock KHQR payment confirmed! Order transitioned to Paid.'));
        }, 500);
    };

    const handleSimulateFailure = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            setStatus('failed');
            toast.error(t('Simulated payment failed (insufficient funds or bank timeout).'));
        }, 500);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Head title={`${t('Mock KHQR Payment')} — ${order.order_number}`} />

            {/* Prominent Demo Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                    <div className="font-bold text-sm">{t('Demo Payment Simulator — No Real Money Involved')}</div>
                    <p className="text-amber-800 dark:text-amber-300">
                        {t('This screen simulates a Cambodian Bakong KHQR checkout. You can trigger simulated payment success or failure using the buttons below to test the order lifecycle.')}
                    </p>
                </div>
            </div>

            {/* Main Payment Card */}
            <div className="border rounded-3xl bg-card overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-6 bg-muted/40 border-b flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{t('Order Ref:')}</span>
                            <span className="font-mono font-bold text-sm text-foreground">{order.order_number}</span>
                            <button
                                type="button"
                                onClick={handleCopyRef}
                                className="text-muted-foreground hover:text-foreground"
                                aria-label="Copy order reference"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-foreground mt-1">
                            {formatMoney(order.total_cents)} USD
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <StatusBadge status={status} />
                    </div>
                </div>

                {status === 'paid' ? (
                    /* Success State */
                    <div className="p-8 text-center space-y-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                            <CheckCircle2 className="w-9 h-9" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground">{t('Payment Confirmed!')}</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                                {t('Thank you! Your mock KHQR transaction was successful. The DMart team is preparing your grocery bag for delivery.')}
                            </p>
                        </div>

                        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">
                                <Link href="/orders/105">
                                    <span>{t('Track Order & View Timeline')}</span>
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-xl">
                                <Link href="/products">
                                    {t('Continue Shopping')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : status === 'failed' ? (
                    /* Failure State */
                    <div className="p-8 text-center space-y-5">
                        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                            <XCircle className="w-9 h-9" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground">{t('Simulation Failed')}</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                                {t('The simulated KHQR transaction timed out or was rejected. You can retry the simulation below.')}
                            </p>
                        </div>

                        <div className="pt-2 flex justify-center gap-3">
                            <Button onClick={() => setStatus('pending_payment')} className="rounded-xl">
                                {t('Retry Payment')}
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href="/cart">{t('Back to Cart')}</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Pending State - Show Mock QR */
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Mock QR Visual Box */}
                        <div className="flex flex-col items-center">
                            <div className="w-64 border-2 border-red-600 rounded-2xl p-4 bg-white text-slate-900 shadow-lg text-center space-y-3">
                                {/* KHQR Header */}
                                <div className="bg-red-600 text-white font-black text-sm tracking-widest py-1 px-3 rounded-md uppercase">
                                    {t('KHQR • BAKONG')}
                                </div>

                                <div className="text-xs font-bold text-slate-800">
                                    {t('DMart Grocery Phnom Penh')}
                                </div>

                                {/* QR Code Decorative Box */}
                                <div className="aspect-square w-44 mx-auto border-4 border-slate-900 p-2 rounded-xl flex flex-col justify-between items-center bg-white">
                                    <div className="w-full flex justify-between">
                                        <div className="w-8 h-8 border-4 border-slate-900 rounded-sm" />
                                        <div className="w-8 h-8 border-4 border-slate-900 rounded-sm" />
                                    </div>
                                    <div className="text-center font-mono text-[9px] text-slate-400 font-bold">
                                        {t('DEMO KHQR PAYLOAD')}
                                    </div>
                                    <div className="w-full flex justify-between items-end">
                                        <div className="w-8 h-8 border-4 border-slate-900 rounded-sm" />
                                        <div className="w-4 h-4 bg-red-600 rounded-xs" />
                                    </div>
                                </div>

                                <div className="text-xs font-extrabold text-red-600 tracking-tight">
                                    {formatMoney(order.total_cents)} USD
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                    {t('SCAN TO TEST SIMULATION')}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Simulation Controls */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-bold text-base text-foreground">{t('Interactive Simulation Controls')}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('Since this is a student/portfolio project without live bank credentials, use these action buttons to simulate backend gateway responses.')}
                                </p>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                <Button
                                    type="button"
                                    onClick={handleSimulateSuccess}
                                    loading={isSimulating}
                                    loadingText={t('Confirming Mock KHQR...')}
                                    size="lg"
                                    variant="emerald"
                                    className="w-full font-bold shadow-md gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{t('Simulate Payment Success')}</span>
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSimulateFailure}
                                    disabled={isSimulating}
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold h-11 rounded-xl gap-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>{t('Simulate Payment Failure')}</span>
                                </Button>
                            </div>

                            <div className="pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {t('Awaiting payment...')}
                                </span>
                                <Link href="/cart" className="text-rose-600 hover:underline">
                                    {t('Cancel Order')}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
