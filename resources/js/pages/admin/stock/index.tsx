import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';
import {
    Boxes,
    Plus,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
    low_stock_threshold: number;
    category_name: string;
    is_low_stock: boolean;
}

interface StockMovement {
    id: number;
    product_id: number;
    product_name: string;
    sku: string;
    type: string;
    delta: number;
    reason: string;
    actor: string;
    created_at: string;
}

interface StockIndexProps {
    products?: Product[];
    movements?: StockMovement[];
    filters?: {
        search?: string;
        low_stock?: boolean | string;
    };
    errors?: Record<string, string>;
}

export default function StockIndex({
    products = [],
    movements = [],
    filters = {},
    errors = {},
}: StockIndexProps) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [filterLowStock, setFilterLowStock] = useState(Boolean(filters.low_stock));

    // Adjustment Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 0);
    const [delta, setDelta] = useState<string>('5');
    const [reason, setReason] = useState('Supplier Delivery / Restock');
    const [direction, setDirection] = useState<'add' | 'subtract'>('add');
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/stock', {
            search: search.trim() || undefined,
            low_stock: filterLowStock ? 1 : undefined,
        }, { preserveState: true });
    };

    const handleToggleLowStock = (checked: boolean) => {
        setFilterLowStock(checked);
        router.get('/admin/stock', {
            search: search.trim() || undefined,
            low_stock: checked ? 1 : undefined,
        }, { preserveState: true });
    };

    const openAdjustModal = (productId?: number) => {
        if (productId) {
            setSelectedProductId(productId);
        } else if (products.length > 0 && selectedProductId === 0) {
            setSelectedProductId(products[0].id);
        }
        setDelta('5');
        setReason('');
        setDirection('add');
        setModalOpen(true);
    };

    const handleAdjust = (e: React.FormEvent) => {
        e.preventDefault();
        const magnitude = parseInt(delta, 10);
        if (isNaN(magnitude) || magnitude <= 0) {
            toast.error(t('Delta must be a positive integer.'));
            return;
        }

        const signedDelta = direction === 'add' ? magnitude : -magnitude;
        setSubmitting(true);

        router.post(`/admin/products/${selectedProductId}/stock`, {
            delta: signedDelta,
            reason: reason.trim(),
        }, {
            onSuccess: () => {
                setModalOpen(false);
                toast.success(t('Stock adjusted successfully.'));
            },
            onError: (err) => {
                const first = Object.values(err)[0];
                toast.error(first || t('Failed to adjust stock.'));
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="space-y-8">
            <Head title={t('Inventory & Stock Ledger — DMart Admin')} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        {t('Inventory & Stock Ledger')}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t('Track shared inventory levels, audit stock adjustments, and monitor threshold warnings')}
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => openAdjustModal()}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 shadow-sm text-xs"
                    disabled={products.length === 0}
                >
                    <Plus className="w-4 h-4" />
                    <span>{t('Adjust Stock')}</span>
                </Button>
            </div>

            {/* Search & Filter Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border shadow-xs">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('Search product or SKU...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 text-xs rounded-xl"
                    />
                </div>

                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={filterLowStock}
                        onChange={(e) => handleToggleLowStock(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {t('Show Low Stock Only (≤ threshold)')}
                    </span>
                </label>
            </form>

            {/* Current Stock Levels */}
            <div className="space-y-4">
                <h2 className="font-bold text-base tracking-tight text-foreground">
                    {t('Product Stock Balances')}
                </h2>

                <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                                <tr>
                                    <th className="p-3.5">{t('Product')}</th>
                                    <th className="p-3.5">{t('SKU')}</th>
                                    <th className="p-3.5">{t('Department')}</th>
                                    <th className="p-3.5">{t('Current Stock')}</th>
                                    <th className="p-3.5">{t('Low-Stock Alert Level')}</th>
                                    <th className="p-3.5">{t('Status')}</th>
                                    <th className="p-3.5 text-right">{t('Action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            {t('No products found matching criteria.')}
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((p) => {
                                        return (
                                            <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-3.5 font-semibold text-foreground">
                                                    {p.name}
                                                </td>
                                                <td className="p-3.5 font-mono text-muted-foreground">
                                                    {p.sku}
                                                </td>
                                                <td className="p-3.5 text-muted-foreground">
                                                    {p.category_name}
                                                </td>
                                                <td className="p-3.5 font-bold text-sm">
                                                    {t(':count units', { count: p.stock })}
                                                </td>
                                                <td className="p-3.5 text-muted-foreground">
                                                    {t('Alert at ≤ :count', { count: p.low_stock_threshold })}
                                                </td>
                                                <td className="p-3.5">
                                                    {p.is_low_stock ? (
                                                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 gap-1 text-[10px]">
                                                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                                                            <span>{t('Low Stock')}</span>
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                                                            {t('Adequate')}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openAdjustModal(p.id)}
                                                        className="h-7 text-xs px-2.5 rounded-lg"
                                                    >
                                                        {t('Adjust')}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Movements Ledger */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-base tracking-tight text-foreground">
                            {t('Audit Ledger (Recent 50 Movements)')}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {t('Every restock, POS sale, online checkout, and manual adjustment is immutably recorded')}
                        </p>
                    </div>
                </div>

                <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                                <tr>
                                    <th className="p-3.5">{t('Date & Time')}</th>
                                    <th className="p-3.5">{t('Product')}</th>
                                    <th className="p-3.5">{t('SKU')}</th>
                                    <th className="p-3.5">{t('Type')}</th>
                                    <th className="p-3.5">{t('Quantity Change')}</th>
                                    <th className="p-3.5">{t('Reason / Reference')}</th>
                                    <th className="p-3.5">{t('Actor')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {movements.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            {t('No stock movement records yet.')}
                                        </td>
                                    </tr>
                                ) : (
                                    movements.map((m) => {
                                        const isPositive = m.delta > 0;
                                        return (
                                            <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                                                    {m.created_at}
                                                </td>
                                                <td className="p-3.5 font-medium text-foreground">
                                                    {m.product_name}
                                                </td>
                                                <td className="p-3.5 font-mono text-muted-foreground">
                                                    {m.sku}
                                                </td>
                                                <td className="p-3.5">
                                                    <Badge variant="outline" className="text-[10px] py-0 capitalize">
                                                        {t(m.type)}
                                                    </Badge>
                                                </td>
                                                <td className="p-3.5 font-bold">
                                                    <span className={`inline-flex items-center gap-1 ${
                                                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                                                        {isPositive ? `+${m.delta}` : m.delta}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-muted-foreground max-w-xs truncate">
                                                    {m.reason}
                                                </td>
                                                <td className="p-3.5 font-medium text-foreground">
                                                    {m.actor}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Adjustment Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Boxes className="w-5 h-5 text-purple-600" />
                            <span>{t('Adjust Inventory Balance')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAdjust} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="productSelect" className="text-xs">{t('Select Product')}</Label>
                            <select
                                id="productSelect"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(parseInt(e.target.value, 10))}
                                className="w-full h-10 px-3 bg-background border rounded-xl text-xs font-medium focus:ring-1 focus:ring-purple-500"
                            >
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.sku}) — {t('Current:')} {p.stock} {t('units')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">{t('Adjustment Type')}</Label>
                                <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setDirection('add')}
                                        className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                            direction === 'add'
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        + {t('Add Stock')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDirection('subtract')}
                                        className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                            direction === 'subtract'
                                                ? 'bg-rose-600 text-white shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        - {t('Deduct')}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="deltaQty" className="text-xs">{t('Quantity')}</Label>
                                <Input
                                    id="deltaQty"
                                    type="number"
                                    min="1"
                                    required
                                    value={delta}
                                    onChange={(e) => setDelta(e.target.value)}
                                    className="h-10 text-xs rounded-xl font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="auditReason" className="text-xs">{t('Audit Reason / Justification')}</Label>
                            <Input
                                id="auditReason"
                                required
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder={t('e.g. Supplier delivery, breakage, shrinkage write-off')}
                                className="h-10 text-xs rounded-xl"
                            />
                            {errors.reason && <p className="text-xs text-rose-600">{errors.reason}</p>}
                            {errors.delta && <p className="text-xs text-rose-600">{errors.delta}</p>}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                {submitting ? t('Applying...') : t('Apply Stock Movement')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
