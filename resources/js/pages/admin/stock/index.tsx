import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    Boxes,
    SlidersHorizontal,
    Plus,
    AlertTriangle,
    Check,
    ArrowUpRight,
    ArrowDownLeft,
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
    low_stock_threshold: number;
    category_name: string;
}

interface StockMovement {
    id: number;
    product_name: string;
    sku: string;
    type: 'Sale' | 'Restock' | 'Adjustment' | 'Return';
    delta: number;
    reason: string;
    actor: string;
    created_at: string;
}

interface StockIndexProps {
    products?: Product[];
}

export default function StockIndex({ products: initialProducts = [] }: StockIndexProps) {
    const [products, setProducts] = useState(initialProducts);
    const [filterLowStock, setFilterLowStock] = useState(false);

    // Ledger movements mock
    const [movements, setMovements] = useState<StockMovement[]>([
        { id: 1, product_name: 'Organic Cavendish Bananas', sku: 'PROD-BAN-001', type: 'Sale', delta: -2, reason: 'Online Order #DM-00101', actor: 'System', created_at: '2026-10-31 09:14' },
        { id: 2, product_name: 'Whole Organic Milk 1L', sku: 'DAIR-MLK-001', type: 'Sale', delta: -1, reason: 'POS Register Sale #POS-041', actor: 'Dara Chan', created_at: '2026-11-01 16:40' },
        { id: 3, product_name: 'Honeycrisp Apples', sku: 'PROD-APP-002', type: 'Restock', delta: +20, reason: 'Supplier Delivery #SUP-882', actor: 'Admin Manager', created_at: '2026-11-01 11:20' },
        { id: 4, product_name: 'Hass Avocados (Pack of 3)', sku: 'PROD-AVO-004', type: 'Adjustment', delta: -2, reason: 'Spoiled produce written off', actor: 'Admin Manager', created_at: '2026-11-01 08:30' },
    ]);

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number>(initialProducts[0]?.id || 1);
    const [delta, setDelta] = useState<string>('5');
    const [reason, setReason] = useState('Supplier Delivery / Restock');
    const [type, setType] = useState<'Restock' | 'Adjustment'>('Restock');

    const filteredProducts = products.filter((p) => {
        if (filterLowStock) return p.stock <= p.low_stock_threshold;
        return true;
    });

    const handleAdjust = (e: React.FormEvent) => {
        e.preventDefault();
        const numDelta = parseInt(delta, 10);
        if (isNaN(numDelta) || numDelta === 0) {
            toast.error('Delta must be a non-zero integer.');
            return;
        }

        const product = products.find((p) => p.id === selectedProductId);
        if (!product) return;

        setProducts((prev) =>
            prev.map((p) =>
                p.id === selectedProductId
                    ? { ...p, stock: Math.max(0, p.stock + numDelta) }
                    : p
            )
        );

        const newMovement: StockMovement = {
            id: Date.now(),
            product_name: product.name,
            sku: product.sku,
            type,
            delta: numDelta,
            reason,
            actor: 'Admin Manager',
            created_at: 'Just now',
        };

        setMovements([newMovement, ...movements]);
        setModalOpen(false);
        toast.success(`Adjusted stock for ${product.name} by ${numDelta > 0 ? `+${numDelta}` : numDelta}`);
    };

    return (
        <div className="space-y-8">
            <Head title="Inventory & Stock Ledger — DMart Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Inventory & Stock Ledger
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Track shared inventory levels, audit stock adjustments, and monitor threshold warnings
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 shadow-sm text-xs"
                >
                    <Plus className="w-4 h-4" />
                    <span>Adjust Stock</span>
                </Button>
            </div>

            {/* Current Stock Levels */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-base tracking-tight text-foreground">
                        Product Stock Balances
                    </h2>

                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={filterLowStock}
                            onChange={(e) => setFilterLowStock(e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                            Show Low Stock Only (&le; threshold)
                        </span>
                    </label>
                </div>

                <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                            <tr>
                                <th className="p-3.5">Product</th>
                                <th className="p-3.5">SKU</th>
                                <th className="p-3.5">Department</th>
                                <th className="p-3.5">Current Stock</th>
                                <th className="p-3.5">Low-Stock Alert Level</th>
                                <th className="p-3.5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.map((p) => {
                                const isLow = p.stock <= p.low_stock_threshold;
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
                                            {p.stock} units
                                        </td>
                                        <td className="p-3.5 text-muted-foreground">
                                            Alert at &le; {p.low_stock_threshold}
                                        </td>
                                        <td className="p-3.5">
                                            {isLow ? (
                                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 gap-1 text-[10px]">
                                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                                    <span>Low Stock</span>
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                                                    Adequate
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Movements Ledger */}
            <div className="space-y-4 pt-4 border-t">
                <h2 className="font-bold text-base tracking-tight text-foreground">
                    Audit Log / Stock Movements Ledger
                </h2>

                <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                            <tr>
                                <th className="p-3.5">Timestamp</th>
                                <th className="p-3.5">Product</th>
                                <th className="p-3.5">Type</th>
                                <th className="p-3.5">Delta</th>
                                <th className="p-3.5">Reason</th>
                                <th className="p-3.5">Logged By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y font-sans">
                            {movements.map((m) => (
                                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-3.5 text-muted-foreground">{m.created_at}</td>
                                    <td className="p-3.5">
                                        <div className="font-semibold text-foreground">{m.product_name}</div>
                                        <div className="text-[10px] font-mono text-muted-foreground">{m.sku}</div>
                                    </td>
                                    <td className="p-3.5">
                                        <Badge variant="outline" className="text-[10px] py-0 font-medium capitalize">
                                            {m.type}
                                        </Badge>
                                    </td>
                                    <td className="p-3.5 font-bold font-mono">
                                        <span className={m.delta > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                            {m.delta > 0 ? `+${m.delta}` : m.delta}
                                        </span>
                                    </td>
                                    <td className="p-3.5 text-muted-foreground">{m.reason}</td>
                                    <td className="p-3.5 font-medium">{m.actor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Adjust Stock Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Boxes className="w-5 h-5 text-purple-600" />
                            <span>Manual Stock Adjustment</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAdjust} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="adjProduct" className="text-xs">Product to Adjust</Label>
                            <select
                                id="adjProduct"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(parseInt(e.target.value, 10))}
                                className="w-full h-10 px-3 bg-background border rounded-xl text-xs font-medium focus:ring-1 focus:ring-purple-500"
                            >
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.sku}) &mdash; {p.stock} in stock
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="adjType" className="text-xs">Operation Type</Label>
                            <select
                                id="adjType"
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full h-10 px-3 bg-background border rounded-xl text-xs font-medium focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="Restock">Restock (Received Shipment)</option>
                                <option value="Adjustment">Adjustment (Physical Count / Damaged Correction)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="adjDelta" className="text-xs">Quantity Delta (Positive to add, Negative to deduct)</Label>
                            <Input
                                id="adjDelta"
                                type="number"
                                required
                                value={delta}
                                onChange={(e) => setDelta(e.target.value)}
                                placeholder="e.g. +10 or -3"
                                className="h-10 text-xs rounded-xl font-bold font-mono"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="adjReason" className="text-xs">Required Reason</Label>
                            <Input
                                id="adjReason"
                                required
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g. Broken jar in aisle, restock from local market..."
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                Record Adjustment
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
