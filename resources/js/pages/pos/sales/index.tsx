import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { formatMoney } from '@/lib/money';
import { useTranslation } from '@/hooks/use-translation';
import {
    History,
    Search,
    Printer,
    ArrowLeft,
    Receipt,
    Banknote,
    QrCode,
} from 'lucide-react';

interface SaleItem {
    name: string;
    sku: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
}

interface Sale {
    id: number;
    order_number: string;
    created_at: string;
    channel: string;
    status: string;
    payment_method: string;
    total_cents: number;
    subtotal_cents: number;
    cashier_name?: string;
    items: SaleItem[];
}

interface PosSalesIndexProps {
    sales?: Sale[];
}

export default function PosSalesIndex({ sales = [] }: PosSalesIndexProps) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    const filteredSales = sales.filter((s) => {
        const matchesSearch =
            !search.trim() ||
            s.order_number.toLowerCase().includes(search.toLowerCase()) ||
            s.payment_method.toLowerCase().includes(search.toLowerCase());

        const matchesDate =
            !dateFilter ||
            (() => {
                if (!s.created_at) return false;
                const d = new Date(s.created_at);
                if (isNaN(d.getTime())) return false;
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}` === dateFilter;
            })();

        return matchesSearch && matchesDate;
    });

    const triggerPrint = () => {
        window.print();
    };

    return (
        <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
            <Head title={`${t('Cashier Sales History')} — DMart`} />

            <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                    >
                        <Link href="/pos">
                            <ArrowLeft className="h-3.5 w-3.5" />{' '}
                            {t('Terminal')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
                            <History className="h-5 w-5 text-blue-600" />
                            <span>{t('Cashier Sales History')}</span>
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {t('Register #01')} &bull;{' '}
                            {t('Counter Sales Archive')} &bull;{' '}
                            {t('Scoped shift transactions')}
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    <div className="relative w-full sm:w-56">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('Search sale #...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 rounded-xl bg-card pl-9 text-xs"
                        />
                    </div>
                    <div className="relative w-full sm:w-44">
                        <Input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="h-9 rounded-xl bg-card text-xs"
                            title={t('Filter by Date')}
                        />
                    </div>
                    {(search || dateFilter) && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearch('');
                                setDateFilter('');
                            }}
                            className="h-9 text-xs"
                        >
                            {t('Reset')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Sales Table */}
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b bg-muted/40 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            <tr>
                                <th className="p-3.5">{t('Receipt #')}</th>
                                <th className="p-3.5">{t('Timestamp')}</th>
                                <th className="p-3.5">{t('Payment Method')}</th>
                                <th className="p-3.5">{t('Items')}</th>
                                <th className="p-3.5">{t('Total')}</th>
                                <th className="p-3.5 text-right">
                                    {t('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredSales.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-12 text-center text-muted-foreground"
                                    >
                                        <Receipt className="mx-auto mb-2 h-10 w-10 opacity-30" />
                                        <p className="text-sm font-semibold text-foreground">
                                            {t('No sales found')}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {search || dateFilter
                                                ? t(
                                                      'No sales matching your search filters.',
                                                  )
                                                : t(
                                                      'No sales recorded for this shift yet.',
                                                  )}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map((sale) => (
                                    <tr
                                        key={sale.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="p-3.5 font-mono font-bold text-foreground">
                                            {sale.order_number}
                                        </td>
                                        <td className="p-3.5 text-muted-foreground">
                                            {sale.created_at}
                                        </td>
                                        <td className="p-3.5">
                                            <Badge
                                                variant="outline"
                                                className="gap-1 text-[10px] capitalize"
                                            >
                                                {sale.payment_method ===
                                                'cash' ? (
                                                    <Banknote className="h-3 w-3 text-emerald-600" />
                                                ) : (
                                                    <QrCode className="h-3 w-3 text-blue-600" />
                                                )}
                                                <span>
                                                    {t(sale.payment_method)}
                                                </span>
                                            </Badge>
                                        </td>
                                        <td className="p-3.5 text-muted-foreground">
                                            {t(':count items (:qty pcs)', {
                                                count: sale.items.length,
                                                qty: sale.items.reduce(
                                                    (a, b) => a + b.quantity,
                                                    0,
                                                ),
                                            })}
                                        </td>
                                        <td className="p-3.5 font-bold text-foreground">
                                            {formatMoney(sale.total_cents)}
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedSale(sale)
                                                }
                                                className="h-7 gap-1 rounded-lg text-xs"
                                            >
                                                <Printer className="h-3 w-3 text-blue-600" />
                                                <span>
                                                    {t('Reprint Receipt')}
                                                </span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reprint Modal */}
            <Dialog
                open={!!selectedSale}
                onOpenChange={(open) => !open && setSelectedSale(null)}
            >
                <DialogContent className="max-w-md space-y-4 p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>
                                {t('Reprint Receipt — :order', {
                                    order: selectedSale?.order_number || '',
                                })}
                            </span>
                            <Button
                                size="sm"
                                onClick={triggerPrint}
                                className="h-8 gap-1.5 text-xs"
                            >
                                <Printer className="h-3.5 w-3.5" />
                                <span>{t('Print Receipt')}</span>
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedSale && (
                        <div className="max-h-[60vh] space-y-3 overflow-y-auto rounded-xl border bg-white p-6 font-mono text-xs text-slate-900 shadow-inner">
                            <div className="space-y-1 text-center">
                                <div className="text-base font-black tracking-tight">
                                    {t('DMART FLAGSHIP STORE')}
                                </div>
                                <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                    {t('Store Receipt')}
                                </div>
                                <div className="text-[10px] text-slate-600">
                                    {t(
                                        'Samdach Penn Nouth St (214), Phnom Penh',
                                    )}
                                </div>
                                <div className="text-[10px] text-slate-600">
                                    {t('Tel: +855 23 888 999')}
                                </div>
                                <div className="my-2 border-b border-dashed border-slate-400" />
                                <div className="flex justify-between text-[10px]">
                                    <span>
                                        {t('Order: :order (REPRINT)', {
                                            order: selectedSale.order_number,
                                        })}
                                    </span>
                                    <span>{selectedSale.created_at}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span>
                                        {t('Cashier:')}{' '}
                                        {selectedSale.cashier_name ||
                                            t('Staff')}
                                    </span>
                                    <span>{t('Reg #01')}</span>
                                </div>
                                <div className="my-2 border-b border-dashed border-slate-400" />
                            </div>

                            <div className="space-y-1 text-[11px]">
                                {selectedSale.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between"
                                    >
                                        <div className="max-w-[200px] truncate">
                                            {item.quantity}x {item.name}
                                        </div>
                                        <div className="font-bold">
                                            {formatMoney(item.line_total_cents)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-2 border-b border-dashed border-slate-400" />

                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>{t('TOTAL:')}</span>
                                    <span>
                                        {formatMoney(selectedSale.total_cents)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-600">
                                    <span>{t('Payment Method:')}</span>
                                    <span className="capitalize">
                                        {t(selectedSale.payment_method)}
                                    </span>
                                </div>
                            </div>

                            <div className="my-3 border-b border-dashed border-slate-400" />

                            <div className="text-center text-[10px] text-slate-600">
                                {t('*** DUPLICATE CUSTOMER COPY ***')}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedSale(null)}
                            className="w-full"
                        >
                            {t('Close')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
