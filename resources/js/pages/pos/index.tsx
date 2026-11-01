import React, { useMemo, useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { QuantityStepper } from '@/components/quantity-stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatMoney } from '@/lib/money';
import {
    Search,
    Trash2,
    Banknote,
    QrCode,
    Printer,
    CheckCircle2,
    RotateCcw,
    X,
    Receipt,
    Plus,
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    sku: string;
    price_cents: number;
    stock: number;
    category_slug: string;
    category_name: string;
    image_url: string | null;
    unit: string;
}

interface PosLineItem {
    product: Product;
    quantity: number;
}

interface PosIndexProps {
    products: Product[];
    categories: Array<{ id: number; name: string; slug: string }>;
}

export default function PosIndex({ products = [], categories = [] }: PosIndexProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Initial sale ticket with sample items
    const [ticket, setTicket] = useState<PosLineItem[]>([
        {
            product: products.find((p) => p.sku === 'DAIR-MLK-001') || products[0],
            quantity: 2,
        },
        {
            product: products.find((p) => p.sku === 'BAKE-BAG-002') || products[1],
            quantity: 1,
        },
    ]);

    // Modals
    const [cashModalOpen, setCashModalOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [lastCompletedSale, setLastCompletedSale] = useState<any>(null);

    // Cash Tender state
    const [tenderedCents, setTenderedCents] = useState<number>(1000); // $10.00 default

    // Calculations
    const subtotalCents = ticket.reduce(
        (acc, item) => acc + item.product.price_cents * item.quantity,
        0
    );
    const totalCents = subtotalCents;
    const changeCents = Math.max(0, tenderedCents - totalCents);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...products];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
            );
        }
        if (selectedCategory !== 'all') {
            result = result.filter((p) => p.category_slug === selectedCategory);
        }
        return result;
    }, [products, search, selectedCategory]);

    // Actions
    const addItem = (product: Product) => {
        setTicket((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, qty: number) => {
        if (qty <= 0) {
            removeItem(productId);
            return;
        }
        setTicket((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity: qty } : item
            )
        );
    };

    const removeItem = (productId: number) => {
        setTicket((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const clearTicket = () => {
        setTicket([]);
        setSearch('');
        searchInputRef.current?.focus();
    };

    const handleQuickCash = (amountCents: number) => {
        setTenderedCents(amountCents);
    };

    const completeCashSale = () => {
        const saleRecord = {
            order_number: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
            created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            cashier: 'Dara Chan',
            items: [...ticket],
            total_cents: totalCents,
            tendered_cents: tenderedCents,
            change_cents: changeCents,
            payment_method: 'Cash',
        };
        setLastCompletedSale(saleRecord);
        setCashModalOpen(false);
        setReceiptModalOpen(true);
        toast.success(`Sale completed! Change due: ${formatMoney(changeCents)}`);
        setTicket([]);
    };

    const completeQrSale = () => {
        const saleRecord = {
            order_number: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
            created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            cashier: 'Dara Chan',
            items: [...ticket],
            total_cents: totalCents,
            tendered_cents: totalCents,
            change_cents: 0,
            payment_method: 'KHQR',
        };
        setLastCompletedSale(saleRecord);
        setQrModalOpen(false);
        setReceiptModalOpen(true);
        toast.success(`KHQR payment received!`);
        setTicket([]);
    };

    const triggerPrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-100 dark:bg-slate-950">
            <Head title="POS Counter Terminal — DMart" />

            {/* LEFT PANE: Product Catalog & Fast Search (60%) */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-slate-800 bg-background">
                {/* Search & Category Filter Bar */}
                <div className="p-4 border-b space-y-3 bg-card shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Scan barcode or type SKU / product name... (e.g. MILK, BANANA)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-9 h-11 text-sm rounded-xl font-medium bg-background shadow-xs focus:ring-2 focus:ring-blue-600"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                        <Button
                            type="button"
                            variant={selectedCategory === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-lg h-7 text-xs px-3 ${
                                selectedCategory === 'all' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                            }`}
                        >
                            All ({products.length})
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.slug}
                                type="button"
                                variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`rounded-lg h-7 text-xs px-3 shrink-0 ${
                                    selectedCategory === cat.slug ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                                }`}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Product Grid Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => addItem(product)}
                                className="border rounded-2xl p-3 bg-card hover:bg-blue-50/40 dark:hover:bg-blue-950/20 hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between shadow-2xs group select-none active:scale-98"
                            >
                                <div className="space-y-2">
                                    <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center relative">
                                        <ProductThumb
                                            name={product.name}
                                            imageUrl={product.image_url}
                                            size="full"
                                            className="rounded-none group-hover:scale-105 transition-transform"
                                        />
                                        <span className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-xs text-[9px] font-mono px-1.5 py-0.5 rounded shadow-2xs font-semibold">
                                            {product.stock} left
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] font-mono text-muted-foreground truncate">{product.sku}</div>
                                        <h4 className="font-semibold text-xs leading-tight line-clamp-2 text-foreground group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h4>
                                    </div>
                                </div>

                                <div className="mt-3 pt-2 border-t flex items-center justify-between">
                                    <span className="font-bold text-sm text-foreground">
                                        {formatMoney(product.price_cents)}
                                    </span>
                                    <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANE: Active Sale Ticket & Payment Actions (40%) */}
            <div className="w-full md:w-96 lg:w-[420px] flex flex-col bg-card shrink-0 border-t md:border-t-0 shadow-lg">
                {/* Ticket Header */}
                <div className="p-4 border-b bg-muted/40 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-blue-600" />
                            <span className="font-extrabold text-sm tracking-tight text-foreground">Sale Ticket</span>
                            <Badge variant="outline" className="text-[10px] py-0 font-mono">#042</Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                            Cashier: Dara Chan &bull; Register 01
                        </div>
                    </div>

                    {ticket.length > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearTicket}
                            className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                        </Button>
                    )}
                </div>

                {/* Ticket Items List (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 divide-y space-y-2">
                    {ticket.length > 0 ? (
                        ticket.map(({ product, quantity }) => (
                            <div key={product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                                <div className="min-w-0 space-y-0.5">
                                    <div className="font-semibold text-foreground truncate max-w-[170px]">
                                        {product.name}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-mono">
                                        {formatMoney(product.price_cents)} &times; {quantity}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <QuantityStepper
                                        value={quantity}
                                        onChange={(qty) => updateQuantity(product.id, qty)}
                                        min={1}
                                        max={product.stock}
                                        size="sm"
                                    />
                                    <div className="font-bold min-w-[55px] text-right">
                                        {formatMoney(product.price_cents * quantity)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
                            <Receipt className="w-8 h-8 opacity-40" />
                            <div className="font-medium text-xs">Ticket is empty</div>
                            <div className="text-[11px]">Click or scan items on the left to add to sale</div>
                        </div>
                    )}
                </div>

                {/* Ticket Totals & Payment Triggers */}
                <div className="p-4 border-t bg-muted/20 space-y-3 shrink-0">
                    <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal ({ticket.reduce((a, b) => a + b.quantity, 0)} items)</span>
                            <span className="font-medium text-foreground">{formatMoney(subtotalCents)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax (Included)</span>
                            <span className="font-medium text-foreground">$0.00</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between text-lg font-black text-foreground">
                            <span>Total Due</span>
                            <span className="text-blue-600 dark:text-blue-400">
                                {formatMoney(totalCents)}
                            </span>
                        </div>
                    </div>

                    {/* Payment Trigger Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                            type="button"
                            disabled={ticket.length === 0}
                            onClick={() => {
                                setTenderedCents(Math.ceil(totalCents / 500) * 500 || 500);
                                setCashModalOpen(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-md flex items-center justify-center gap-2"
                        >
                            <Banknote className="w-5 h-5" />
                            <div className="text-left leading-tight">
                                <div className="text-xs">CASH</div>
                                <div className="text-[10px] font-normal opacity-90">Tender & Change</div>
                            </div>
                        </Button>

                        <Button
                            type="button"
                            disabled={ticket.length === 0}
                            onClick={() => setQrModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-md flex items-center justify-center gap-2"
                        >
                            <QrCode className="w-5 h-5" />
                            <div className="text-left leading-tight">
                                <div className="text-xs">KHQR</div>
                                <div className="text-[10px] font-normal opacity-90">Customer Scan</div>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* CASH TENDER & CHANGE MODAL */}
            <Dialog open={cashModalOpen} onOpenChange={setCashModalOpen}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Banknote className="w-5 h-5 text-emerald-600" />
                            <span>Cash Tender & Change</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-4 rounded-xl bg-slate-900 text-white text-center space-y-1">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Due</div>
                        <div className="text-3xl font-black text-emerald-400">
                            {formatMoney(totalCents)}
                        </div>
                    </div>

                    {/* Quick Bill Selectors */}
                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground">Quick Tender Bills</div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Exact', cents: totalCents },
                                { label: '$5.00', cents: 500 },
                                { label: '$10.00', cents: 1000 },
                                { label: '$20.00', cents: 2000 },
                                { label: '$50.00', cents: 5000 },
                                { label: '$100.00', cents: 10000 },
                            ].map((btn) => (
                                <Button
                                    key={btn.label}
                                    type="button"
                                    variant={tenderedCents === btn.cents ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleQuickCash(btn.cents)}
                                    className={`h-9 font-bold text-xs ${tenderedCents === btn.cents ? 'bg-emerald-600 text-white' : ''}`}
                                >
                                    {btn.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Tendered Input & Change Output */}
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Cash Tendered:</span>
                            <span className="font-bold text-foreground text-base">
                                {formatMoney(tenderedCents)}
                            </span>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex justify-between items-center">
                            <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                                Change Due to Customer:
                            </span>
                            <span className="font-black text-xl text-emerald-700 dark:text-emerald-300">
                                {formatMoney(changeCents)}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            onClick={completeCashSale}
                            disabled={tenderedCents < totalCents}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Complete Sale & Open Drawer</span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MOCK KHQR POS MODAL */}
            <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
                <DialogContent className="max-w-sm p-6 text-center space-y-4">
                    <DialogHeader>
                        <DialogTitle className="text-center font-bold text-base">
                            Customer Facing KHQR
                        </DialogTitle>
                    </DialogHeader>

                    {/* Simulated Customer KHQR Screen */}
                    <div className="border-2 border-red-600 rounded-2xl p-4 bg-white text-slate-900 space-y-2">
                        <div className="bg-red-600 text-white font-black text-xs tracking-widest py-1 rounded-sm uppercase">
                            KHQR BAKONG
                        </div>
                        <div className="text-xs font-bold">DMart Register #01</div>
                        <div className="aspect-square w-36 mx-auto border-4 border-slate-900 p-2 rounded-xl flex items-center justify-center font-mono text-[9px] text-slate-400 font-bold">
                            POS QR PAYLOAD
                        </div>
                        <div className="text-lg font-black text-red-600">
                            {formatMoney(totalCents)} USD
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Simulate the customer scanning the counter QR code and confirming payment on their phone.
                    </div>

                    <Button
                        type="button"
                        onClick={completeQrSale}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simulate KHQR Confirmation</span>
                    </Button>
                </DialogContent>
            </Dialog>

            {/* 80mm THERMAL RECEIPT MODAL */}
            <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Receipt Preview (80mm)</span>
                            <Button size="sm" onClick={triggerPrint} className="h-8 gap-1.5 text-xs">
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Receipt</span>
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Printable 80mm Receipt Box */}
                    <div className="p-6 bg-white text-slate-900 border rounded-xl font-mono text-xs space-y-3 shadow-inner max-h-[70vh] overflow-y-auto">
                        <div className="text-center space-y-1">
                            <div className="font-black text-base tracking-tight">DMART GROCERY & MINI-MART</div>
                            <div className="text-[10px] text-slate-600">#24 Samdach Penn Nouth St (214), Phnom Penh</div>
                            <div className="text-[10px] text-slate-600">Tel: +855 23 888 999</div>
                            <div className="border-b border-dashed border-slate-400 my-2" />
                            <div className="flex justify-between text-[10px]">
                                <span>Order: {lastCompletedSale?.order_number || 'POS-89104'}</span>
                                <span>{lastCompletedSale?.created_at || '16:40'}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span>Cashier: {lastCompletedSale?.cashier || 'Dara Chan'}</span>
                                <span>Reg #01</span>
                            </div>
                            <div className="border-b border-dashed border-slate-400 my-2" />
                        </div>

                        {/* Items */}
                        <div className="space-y-1 text-[11px]">
                            {lastCompletedSale?.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between">
                                    <div className="truncate max-w-[200px]">
                                        {item.quantity}x {item.product.name}
                                    </div>
                                    <div className="font-bold">
                                        {formatMoney(item.product.price_cents * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-b border-dashed border-slate-400 my-2" />

                        {/* Totals */}
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-sm">
                                <span>TOTAL:</span>
                                <span>{formatMoney(lastCompletedSale?.total_cents || 0)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-600">
                                <span>Payment Method:</span>
                                <span>{lastCompletedSale?.payment_method}</span>
                            </div>
                            {lastCompletedSale?.payment_method === 'Cash' && (
                                <>
                                    <div className="flex justify-between text-[11px] text-slate-600">
                                        <span>Cash Tendered:</span>
                                        <span>{formatMoney(lastCompletedSale?.tendered_cents || 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-xs text-slate-900">
                                        <span>CHANGE:</span>
                                        <span>{formatMoney(lastCompletedSale?.change_cents || 0)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="border-b border-dashed border-slate-400 my-3" />

                        <div className="text-center space-y-1 text-[10px] text-slate-600">
                            <div>THANK YOU FOR SHOPPING AT DMART!</div>
                            <div>Please retain receipt for exchange within 24 hours.</div>
                            <div className="pt-2 font-mono tracking-widest text-[9px]">
                                * * * DM-00104-RECEIPT * * *
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setReceiptModalOpen(false)}
                            className="w-full"
                        >
                            Done / Start Next Customer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
