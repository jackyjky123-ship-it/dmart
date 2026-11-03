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
        items: Array<{
            name: string;
            sku: string;
            quantity: number;
            unit_price_cents: number;
            line_total_cents: number;
        }>;
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
            {
                name: 'Honeycrisp Apples',
                sku: 'PROD-APP-002',
                quantity: 2,
                unit_price_cents: 320,
                line_total_cents: 640,
            },
            {
                name: 'Sparkling Mineral Water (6x330ml)',
                sku: 'BEV-SPK-002',
                quantity: 1,
                unit_price_cents: 480,
                line_total_cents: 480,
            },
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
            toast.success(
                t('Mock KHQR payment confirmed! Order transitioned to Paid.'),
            );
        }, 500);
    };

    const handleSimulateFailure = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            setStatus('failed');
            toast.error(
                t(
                    'Simulated payment failed (insufficient funds or bank timeout).',
                ),
            );
        }, 500);
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <Head title={`${t('Mock KHQR Payment')} — ${order.order_number}`} />

            {/* Prominent Demo Notice */}
            <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-xs dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div className="space-y-1 text-xs">
                    <div className="text-sm font-bold">
                        {t('Demo Payment Simulator — No Real Money Involved')}
                    </div>
                    <p className="text-amber-800 dark:text-amber-300">
                        {t(
                            'This screen simulates a Cambodian Bakong KHQR checkout. You can trigger simulated payment success or failure using the buttons below to test the order lifecycle.',
                        )}
                    </p>
                </div>
            </div>

            {/* Main Payment Card */}
            <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/40 p-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                                {t('Order Ref:')}
                            </span>
                            <span className="font-mono text-sm font-bold text-foreground">
                                {order.order_number}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyRef}
                                className="text-muted-foreground hover:text-foreground"
                                aria-label="Copy order reference"
                            >
                                {copied ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </div>
                        <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground">
                            {formatMoney(order.total_cents)} USD
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <StatusBadge status={status} />
                    </div>
                </div>

                {status === 'paid' ? (
                    /* Success State */
                    <div className="space-y-5 p-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-950">
                            <CheckCircle2 className="h-9 w-9" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground">
                                {t('Payment Confirmed!')}
                            </h2>
                            <p className="mx-auto max-w-md text-xs text-muted-foreground sm:text-sm">
                                {t(
                                    'Thank you! Your mock KHQR transaction was successful. The DMart team is preparing your grocery bag for delivery.',
                                )}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-xl bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-700"
                            >
                                <Link href="/orders/105">
                                    <span>
                                        {t('Track Order & View Timeline')}
                                    </span>
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-xl"
                            >
                                <Link href="/products">
                                    {t('Continue Shopping')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : status === 'failed' ? (
                    /* Failure State */
                    <div className="space-y-5 p-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-sm dark:bg-rose-950">
                            <XCircle className="h-9 w-9" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground">
                                {t('Simulation Failed')}
                            </h2>
                            <p className="mx-auto max-w-md text-xs text-muted-foreground sm:text-sm">
                                {t(
                                    'The simulated KHQR transaction timed out or was rejected. You can retry the simulation below.',
                                )}
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 pt-2">
                            <Button
                                onClick={() => setStatus('pending_payment')}
                                className="rounded-xl"
                            >
                                {t('Retry Payment')}
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-xl"
                            >
                                <Link href="/cart">{t('Back to Cart')}</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Pending State - Show Mock QR */
                    <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-8 md:grid-cols-2">
                        {/* Mock QR Visual Box */}
                        <div className="flex flex-col items-center">
                            <div className="w-64 space-y-3 rounded-2xl border-2 border-red-600 bg-white p-4 text-center text-slate-900 shadow-lg">
                                {/* KHQR Header */}
                                <div className="rounded-md bg-red-600 px-3 py-1 text-sm font-black tracking-widest text-white uppercase">
                                    {t('KHQR • BAKONG')}
                                </div>

                                <div className="text-xs font-bold text-slate-800">
                                    {t('DMart Grocery Phnom Penh')}
                                </div>

                                {/* QR Code Decorative Box */}
                                <div className="mx-auto flex aspect-square w-44 flex-col items-center justify-between rounded-xl border-4 border-slate-900 bg-white p-2">
                                    <div className="flex w-full justify-between">
                                        <div className="h-8 w-8 rounded-sm border-4 border-slate-900" />
                                        <div className="h-8 w-8 rounded-sm border-4 border-slate-900" />
                                    </div>
                                    <div className="text-center font-mono text-[9px] font-bold text-slate-400">
                                        {t('DEMO KHQR PAYLOAD')}
                                    </div>
                                    <div className="flex w-full items-end justify-between">
                                        <div className="h-8 w-8 rounded-sm border-4 border-slate-900" />
                                        <div className="h-4 w-4 rounded-xs bg-red-600" />
                                    </div>
                                </div>

                                <div className="text-xs font-extrabold tracking-tight text-red-600">
                                    {formatMoney(order.total_cents)} USD
                                </div>
                                <div className="font-mono text-[10px] text-slate-400">
                                    {t('SCAN TO TEST SIMULATION')}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Simulation Controls */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-foreground">
                                    {t('Interactive Simulation Controls')}
                                </h3>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    {t(
                                        'Since this is a student/portfolio project without live bank credentials, use these action buttons to simulate backend gateway responses.',
                                    )}
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
                                    className="w-full gap-2 font-bold shadow-md"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{t('Simulate Payment Success')}</span>
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSimulateFailure}
                                    disabled={isSimulating}
                                    variant="outline"
                                    size="lg"
                                    className="h-11 w-full gap-2 rounded-xl border-rose-300 font-semibold text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                >
                                    <XCircle className="h-4 w-4" />
                                    <span>{t('Simulate Payment Failure')}</span>
                                </Button>
                            </div>

                            <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />{' '}
                                    {t('Awaiting payment...')}
                                </span>
                                <Link
                                    href="/cart"
                                    className="text-rose-600 hover:underline"
                                >
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
