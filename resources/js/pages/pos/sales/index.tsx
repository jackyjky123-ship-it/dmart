import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatMoney } from '@/lib/money';
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
    items: SaleItem[];
}

interface PosSalesIndexProps {
    sales?: Sale[];
}

export default function PosSalesIndex({ sales = [] }: PosSalesIndexProps) {
    const [search, setSearch] = useState('');
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    const filteredSales = sales.filter(
        (s) =>
            s.order_number.toLowerCase().includes(search.toLowerCase()) ||
            s.payment_method.toLowerCase().includes(search.toLowerCase())
    );

    const triggerPrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
            <Head title="POS Sales History & Receipts — DMart" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
                        <Link href="/pos">
                            <ArrowLeft className="w-3.5 h-3.5" /> Terminal
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-600" />
                            <span>Cashier Sales History</span>
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Register #01 &bull; Dara Chan &bull; Today's completed counter transactions
                        </p>
                    </div>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search sale #..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 text-xs rounded-xl bg-card"
                    />
                </div>
            </div>

            {/* Sales Table */}
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                            <tr>
                                <th className="p-3.5">Sale #</th>
                                <th className="p-3.5">Timestamp</th>
                                <th className="p-3.5">Method</th>
                                <th className="p-3.5">Items</th>
                                <th className="p-3.5">Total</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-3.5 font-mono font-bold text-foreground">
                                        {sale.order_number}
                                    </td>
                                    <td className="p-3.5 text-muted-foreground">
                                        {sale.created_at}
                                    </td>
                                    <td className="p-3.5">
                                        <Badge variant="outline" className="text-[10px] capitalize gap-1">
                                            {sale.payment_method === 'cash' ? (
                                                <Banknote className="w-3 h-3 text-emerald-600" />
                                            ) : (
                                                <QrCode className="w-3 h-3 text-blue-600" />
                                            )}
                                            <span>{sale.payment_method}</span>
                                        </Badge>
                                    </td>
                                    <td className="p-3.5 text-muted-foreground">
                                        {sale.items.length} items ({sale.items.reduce((a, b) => a + b.quantity, 0)} pcs)
                                    </td>
                                    <td className="p-3.5 font-bold text-foreground">
                                        {formatMoney(sale.total_cents)}
                                    </td>
                                    <td className="p-3.5 text-right">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedSale(sale)}
                                            className="h-7 text-xs rounded-lg gap-1"
                                        >
                                            <Printer className="w-3 h-3 text-blue-600" />
                                            <span>Reprint</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reprint Modal */}
            <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Reprint Receipt — {selectedSale?.order_number}</span>
                            <Button size="sm" onClick={triggerPrint} className="h-8 gap-1.5 text-xs">
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print</span>
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedSale && (
                        <div className="p-6 bg-white text-slate-900 border rounded-xl font-mono text-xs space-y-3 shadow-inner max-h-[60vh] overflow-y-auto">
                            <div className="text-center space-y-1">
                                <div className="font-black text-base tracking-tight">DMART GROCERY & MINI-MART</div>
                                <div className="text-[10px] text-slate-600">#24 Samdach Penn Nouth St (214), Phnom Penh</div>
                                <div className="text-[10px] text-slate-600">Tel: +855 23 888 999</div>
                                <div className="border-b border-dashed border-slate-400 my-2" />
                                <div className="flex justify-between text-[10px]">
                                    <span>Order: {selectedSale.order_number} (REPRINT)</span>
                                    <span>{selectedSale.created_at}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span>Cashier: Dara Chan</span>
                                    <span>Reg #01</span>
                                </div>
                                <div className="border-b border-dashed border-slate-400 my-2" />
                            </div>

                            <div className="space-y-1 text-[11px]">
                                {selectedSale.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <div className="truncate max-w-[200px]">
                                            {item.quantity}x {item.name}
                                        </div>
                                        <div className="font-bold">
                                            {formatMoney(item.line_total_cents)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-b border-dashed border-slate-400 my-2" />

                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between font-bold text-sm">
                                    <span>TOTAL:</span>
                                    <span>{formatMoney(selectedSale.total_cents)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-600">
                                    <span>Payment Method:</span>
                                    <span className="capitalize">{selectedSale.payment_method}</span>
                                </div>
                            </div>

                            <div className="border-b border-dashed border-slate-400 my-3" />

                            <div className="text-center text-[10px] text-slate-600">
                                *** DUPLICATE CUSTOMER COPY ***
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedSale(null)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
