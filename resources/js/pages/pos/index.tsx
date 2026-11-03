import React, { useMemo, useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import {
    Search,
    Trash2,
    Banknote,
    QrCode,
    Printer,
    CheckCircle2,
    RotateCcw,
    X,
    Plus,
    Minus,
    ShoppingBag,
    Receipt as ReceiptIcon,
    User,
    Layers,
    Loader2,
    Tag,
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price_cents: number;
    compare_at_price_cents: number | null;
    stock: number;
    unit?: string;
    category_name?: string;
    category_slug?: string;
    image_url: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    product_count: number;
}

interface Cashier {
    name: string;
}

interface ReceiptItem {
    name: string;
    sku: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
}

interface CompletedReceipt {
    order_number: string;
    created_at: string;
    cashier_name?: string;
    customer_name?: string;
    payment_method: string;
    items: ReceiptItem[];
    subtotal_cents: number;
    total_cents: number;
    cash_tendered_cents: number | null;
    change_cents: number | null;
}

interface PosLineItem {
    product: Product;
    quantity: number;
}

interface PosTicket {
    id: string;
    label: string;
    customerName: string;
    items: PosLineItem[];
}

interface PosIndexProps {
    products?: Product[];
    categories?: Category[];
    cashier?: Cashier;
}

export default function PosIndex({
    products = [],
    categories = [],
    cashier,
}: PosIndexProps) {
    const page = usePage();
    const { t } = useTranslation();

    // Tickets state for holding sales (Ticket 1, Ticket 2, etc.)
    const [tickets, setTickets] = useState<PosTicket[]>([
        { id: '1', label: 'Ticket 1', customerName: '', items: [] },
    ]);
    const [activeTicketId, setActiveTicketId] = useState<string>('1');

    // Filter and search state
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Modals and submission state
    const [cashModalOpen, setCashModalOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [completedReceipt, setCompletedReceipt] = useState<CompletedReceipt | null>(null);
    const [tenderedCents, setTenderedCents] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Active ticket resolution
    const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];
    const ticketItems = activeTicket?.items || [];

    // Financial totals (no fake taxes - in DMart subtotal = total)
    const subtotalCents = useMemo(
        () => ticketItems.reduce((acc, item) => acc + item.product.price_cents * item.quantity, 0),
        [ticketItems]
    );
    const totalCents = subtotalCents;
    const totalItemCount = useMemo(
        () => ticketItems.reduce((acc, item) => acc + item.quantity, 0),
        [ticketItems]
    );

    // Change calculation
    const changeCents = Math.max(0, tenderedCents - totalCents);
    const isUnderTendered = tenderedCents < totalCents;

    // Filter real products by search and category
    const filteredProducts = useMemo(() => {
        let result = [...products];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.sku.toLowerCase().includes(q) ||
                    (p.category_name && p.category_name.toLowerCase().includes(q))
            );
        }
        if (selectedCategory !== 'all') {
            result = result.filter((p) => p.category_slug === selectedCategory);
        }
        return result;
    }, [products, search, selectedCategory]);

    // Total products count across active categories
    const totalProductCount = useMemo(
        () => categories.reduce((sum, c) => sum + (c.product_count || 0), 0) || products.length,
        [categories, products]
    );

    // Flash listener to capture receipt from server if returned via Inertia flash
    useEffect(() => {
        const cleanup = router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            if (flash?.receipt) {
                setCompletedReceipt(flash.receipt as CompletedReceipt);
                setReceiptModalOpen(true);
            }
        });
        return cleanup;
    }, []);

    // Ticket helper methods
    const updateActiveTicket = (updater: (prevTicket: PosTicket) => PosTicket) => {
        setTickets((prev) =>
            prev.map((t) => (t.id === activeTicketId ? updater(t) : t))
        );
    };

    const handleAddToCart = (product: Product) => {
        if (product.stock <= 0) {
            toast.error(t('":name" is currently out of stock.', { name: product.name }));
            return;
        }

        const existing = ticketItems.find((i) => i.product.id === product.id);
        const currentQty = existing ? existing.quantity : 0;

        if (currentQty >= product.stock) {
            toast.warning(t('Cannot add more than :count available unit(s).', { count: product.stock }));
            return;
        }

        if (existing) {
            updateActiveTicket((tState) => ({
                ...tState,
                items: tState.items.map((i) =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            }));
        } else {
            updateActiveTicket((tState) => ({
                ...tState,
                items: [...tState.items, { product, quantity: 1 }],
            }));
        }
    };

    const handleUpdateQuantity = (productId: number, newQty: number) => {
        const item = ticketItems.find((i) => i.product.id === productId);
        if (!item) return;

        if (newQty <= 0) {
            updateActiveTicket((tState) => ({
                ...tState,
                items: tState.items.filter((i) => i.product.id !== productId),
            }));
            return;
        }

        if (newQty > item.product.stock) {
            toast.warning(t('Only :count unit(s) of ":name" in stock.', { count: item.product.stock, name: item.product.name }));
            return;
        }

        updateActiveTicket((tState) => ({
            ...tState,
            items: tState.items.map((i) =>
                i.product.id === productId ? { ...i, quantity: newQty } : i
            ),
        }));
    };

    const handleRemoveItem = (productId: number) => {
        updateActiveTicket((tState) => ({
            ...tState,
            items: tState.items.filter((i) => i.product.id !== productId),
        }));
    };

    const handleClearActiveTicket = () => {
        updateActiveTicket((tState) => ({
            ...tState,
            customerName: '',
            items: [],
        }));
        toast.info(t('Ticket items cleared.'));
    };

    // Hold and create a new ticket
    const handleNewTicket = () => {
        if (tickets.length >= 6) {
            toast.warning(t('Maximum of 6 held tickets allowed.'));
            return;
        }
        const nextNumber = tickets.length + 1;
        const newTicket: PosTicket = {
            id: String(Date.now()),
            label: `Ticket ${nextNumber}`,
            customerName: '',
            items: [],
        };
        setTickets((prev) => [...prev, newTicket]);
        setActiveTicketId(newTicket.id);
        toast.success(t('Created :label', { label: t(newTicket.label) }));
    };

    // Close or discard a ticket
    const handleCloseTicket = (ticketId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (tickets.length <= 1) {
            handleClearActiveTicket();
            return;
        }
        const remaining = tickets.filter((tkt) => tkt.id !== ticketId);
        setTickets(remaining);
        if (activeTicketId === ticketId) {
            setActiveTicketId(remaining[0].id);
        }
    };

    // Open Cash Tender Dialog
    const handleOpenCashModal = () => {
        if (ticketItems.length === 0) return;
        setTenderedCents(totalCents);
        setCashModalOpen(true);
    };

    // Open QR Code Dialog
    const handleOpenQrModal = () => {
        if (ticketItems.length === 0) return;
        setQrModalOpen(true);
    };

    // Real submission to the backend pos.sales.store endpoint
    const handleCompleteSale = (paymentMethod: 'cash' | 'khqr') => {
        if (ticketItems.length === 0 || isSubmitting) return;

        if (paymentMethod === 'cash' && isUnderTendered) {
            toast.error(t('Cash tendered must cover the sale total.'));
            return;
        }

        setIsSubmitting(true);

        const payload = {
            items: ticketItems.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
            })),
            payment_method: paymentMethod,
            cash_tendered_cents: paymentMethod === 'cash' ? tenderedCents : undefined,
            customer_name: activeTicket.customerName?.trim() || undefined,
        };

        router.post('/pos/sales', payload, {
            preserveScroll: true,
            onSuccess: (res) => {
                setIsSubmitting(false);
                setCashModalOpen(false);
                setQrModalOpen(false);

                // Check flashed receipt in props or fallback to response
                const flashedReceipt = (res.props as any)?.flash?.receipt as CompletedReceipt | undefined;
                if (flashedReceipt) {
                    setCompletedReceipt(flashedReceipt);
                    setReceiptModalOpen(true);
                }

                // Reset or prune the completed ticket
                setTickets((prev) => {
                    if (prev.length > 1) {
                        const remaining = prev.filter((tkt) => tkt.id !== activeTicket.id);
                        setActiveTicketId(remaining[0].id);
                        return remaining;
                    } else {
                        return [{ id: '1', label: 'Ticket 1', customerName: '', items: [] }];
                    }
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                const firstError = Object.values(errors)[0] as string | undefined;
                toast.error(firstError || t('Failed to complete POS sale.'));
            },
        });
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-[#121212] text-white">
            <Head title={`${t('POS Terminal')} — DMART`} />

            {/* Print Stylesheet for 80mm Thermal Receipt */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden !important;
                    }
                    #receipt-print-area, #receipt-print-area * {
                        visibility: visible !important;
                    }
                    #receipt-print-area {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 80mm !important;
                        margin: 0 !important;
                        padding: 8px !important;
                        background: white !important;
                        color: black !important;
                        font-family: monospace !important;
                    }
                }
            `}</style>

            {/* 1. LEFT PANEL: Real Product Catalog, Search & Categories */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#141414] border-r border-[#242424] overflow-hidden">
                {/* Search Bar & Filter Header */}
                <div className="p-4 border-b border-[#242424] bg-[#171717] flex items-center justify-between gap-4 shrink-0">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
                        <Input
                            type="text"
                            placeholder={t('Search by name or SKU...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-9 rounded-full border-[#2d2d2d] bg-[#202020] text-xs text-white placeholder:text-[#666] focus:border-[#F25623]"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#888]">
                        <span className="hidden sm:inline">{t('Active Catalog:')}</span>
                        <Badge variant="outline" className="border-[#333] text-white bg-[#222]">
                            {t(':count items', { count: filteredProducts.length })}
                        </Badge>
                    </div>
                </div>

                {/* Category Chips Bar (Built from real database categories) */}
                <div className="px-4 py-2.5 border-b border-[#242424] bg-[#161616] flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                            'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
                            selectedCategory === 'all'
                                ? 'bg-[#F25623] text-white border-[#F25623] shadow-sm shadow-[#F25623]/25'
                                : 'bg-[#202020] text-[#a3a3a3] border-[#2d2d2d] hover:text-white hover:border-[#444]'
                        )}
                    >
                        {t('All Drops')} <span className="text-[10px] opacity-75 font-mono ml-1">({totalProductCount})</span>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={cn(
                                'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
                                selectedCategory === cat.slug
                                    ? 'bg-[#F25623] text-white border-[#F25623] shadow-sm shadow-[#F25623]/25'
                                    : 'bg-[#202020] text-[#a3a3a3] border-[#2d2d2d] hover:text-white hover:border-[#444]'
                            )}
                        >
                            {t(cat.name)}
                            <span className="text-[10px] opacity-75 font-mono ml-1">({cat.product_count})</span>
                        </button>
                    ))}
                </div>

                {/* Product Catalog Grid */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#737373]">
                            <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5] text-[#444]" />
                            <div className="font-bold text-sm text-white mb-1">{t('No products found')}</div>
                            <div className="text-xs max-w-xs">
                                {search
                                    ? t('No active items match ":search". Try searching another name or SKU.', { search })
                                    : t('No active items available in this category.')}
                            </div>
                            {search && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearch('')}
                                    className="mt-4 border-[#333] text-xs"
                                >
                                    {t('Clear Search')}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                            {filteredProducts.map((p) => {
                                const inCartItem = ticketItems.find((i) => i.product.id === p.id);
                                const isOutOfStock = p.stock <= 0;
                                const isLowStock = p.stock > 0 && p.stock <= 5;

                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        disabled={isOutOfStock}
                                        onClick={() => handleAddToCart(p)}
                                        className={cn(
                                            'relative flex flex-col justify-between text-left p-3 rounded-xl border transition-all select-none group',
                                            isOutOfStock
                                                ? 'bg-[#181818] border-[#242424] opacity-45 cursor-not-allowed'
                                                : 'bg-[#1c1c1c] border-[#282828] hover:border-[#F25623] hover:bg-[#202020] active:scale-[0.98]'
                                        )}
                                    >
                                        <div>
                                            {/* Product Thumbnail (Letter-tile fallback or real image) */}
                                            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2.5 bg-[#242424]">
                                                <ProductThumb
                                                    name={p.name}
                                                    imageUrl={p.image_url}
                                                    size="full"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />

                                                {/* Stock Status Badge */}
                                                {isOutOfStock ? (
                                                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500/90 text-white">
                                                        {t('Sold Out')}
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/90 text-black">
                                                        {t(':count left', { count: p.stock })}
                                                    </span>
                                                ) : null}

                                                {/* In Cart Indicator */}
                                                {inCartItem && (
                                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F25623] text-white shadow-md">
                                                        {t(':count in cart', { count: inCartItem.quantity })}
                                                    </span>
                                                )}
                                            </div>

                                            {/* SKU & Category */}
                                            <div className="flex items-center justify-between text-[10px] text-[#737373] font-mono mb-0.5">
                                                <span>{p.sku}</span>
                                                <span className="truncate max-w-[80px]">{p.category_name ? t(p.category_name) : ''}</span>
                                            </div>

                                            {/* Name */}
                                            <h4 className="font-semibold text-xs text-white leading-snug line-clamp-2 group-hover:text-[#F25623] transition-colors">
                                                {p.name}
                                            </h4>
                                        </div>

                                        {/* Price & Stock info */}
                                        <div className="mt-3 pt-2 border-t border-[#282828] flex items-baseline justify-between">
                                            <span className="font-black font-sans text-sm text-[#F25623]">
                                                {formatMoney(p.price_cents)}
                                            </span>
                                            <span className="text-[10px] text-[#737373] font-mono">
                                                {t('Stock:')} {p.stock}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. RIGHT PANEL: Register Drawer, Held Tickets & Checkout Settlement */}
            <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#171717] flex flex-col shrink-0 overflow-hidden">
                {/* Tickets Switcher & Cashier Tag */}
                <div className="p-3 border-b border-[#242424] bg-[#1a1a1a] flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
                        {tickets.map((tkt) => {
                            const itemCount = tkt.items.reduce((acc, i) => acc + i.quantity, 0);
                            const isActive = tkt.id === activeTicketId;
                            return (
                                <button
                                    key={tkt.id}
                                    type="button"
                                    onClick={() => setActiveTicketId(tkt.id)}
                                    className={cn(
                                        'px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border shrink-0',
                                        isActive
                                            ? 'bg-[#282828] border-[#F25623] text-white'
                                            : 'bg-[#1c1c1c] border-[#2d2d2d] text-[#888] hover:text-white'
                                    )}
                                >
                                    <span>{t(tkt.label)}</span>
                                    {itemCount > 0 && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#F25623] text-white">
                                            {itemCount}
                                        </span>
                                    )}
                                    {tickets.length > 1 && (
                                        <span
                                            onClick={(e) => handleCloseTicket(tkt.id, e)}
                                            className="ml-1 text-[#666] hover:text-rose-400 p-0.5"
                                            title={t('Close Ticket')}
                                        >
                                            <X className="w-3 h-3" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        <Button
                            type="button"
                            variant="outline"
                            size="icon-xs"
                            onClick={handleNewTicket}
                            className="border-[#333] bg-[#222] text-[#888] hover:text-white hover:border-[#F25623] rounded-lg shrink-0"
                            title={t('Hold Sale')}
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#888] shrink-0 pl-2 border-l border-[#2d2d2d]">
                        <User className="w-3.5 h-3.5 text-[#F25623]" />
                        <span className="text-white font-semibold truncate max-w-[120px]">{cashier?.name || t('Cashier')}</span>
                    </div>
                </div>

                {/* Customer Name or Reference Field */}
                <div className="px-4 py-2 border-b border-[#242424] bg-[#161616] flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-[#737373] uppercase tracking-wider shrink-0">
                        {t('Customer:')}
                    </span>
                    <input
                        type="text"
                        placeholder={t('Walk-in customer (optional name/note)')}
                        value={activeTicket.customerName}
                        onChange={(e) =>
                            updateActiveTicket((tState) => ({ ...tState, customerName: e.target.value }))
                        }
                        className="w-full bg-transparent border-0 text-xs text-white placeholder:text-[#555] focus:outline-none"
                    />
                    {ticketItems.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearActiveTicket}
                            className="text-[#737373] hover:text-rose-400 text-[11px] font-mono shrink-0"
                            title={t('Clear Cart')}
                        >
                            {t('Clear Cart')}
                        </button>
                    )}
                </div>

                {/* Cart basket column headers when items exist */}
                {ticketItems.length > 0 && (
                    <div className="px-4 py-1.5 text-[10px] uppercase font-mono text-[#737373] flex items-center justify-between border-b border-[#242424] bg-[#161616] shrink-0">
                        <span>{t('Item')}</span>
                        <div className="flex items-center gap-8 pr-12">
                            <span>{t('Qty')}</span>
                            <span>{t('Price')}</span>
                        </div>
                    </div>
                )}

                {/* Ticket Line Items List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
                    {ticketItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#666]">
                            <ReceiptIcon className="w-12 h-12 mb-3 stroke-[1.2] text-[#333]" />
                            <div className="font-semibold text-xs text-white mb-1">{t('Current ticket is empty')}</div>
                            <p className="text-[11px] text-[#737373] max-w-xs leading-relaxed">
                                {t('Tap items from the catalog on the left to add products to this order.')}
                            </p>
                        </div>
                    ) : (
                        ticketItems.map((item) => (
                            <div
                                key={item.product.id}
                                className="p-2.5 rounded-xl border border-[#262626] bg-[#1d1d1d] flex items-center justify-between gap-3 group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <ProductThumb
                                        name={item.product.name}
                                        imageUrl={item.product.image_url}
                                        size="sm"
                                        className="shrink-0 rounded-lg"
                                    />
                                    <div className="min-w-0">
                                        <div className="font-semibold text-xs text-white truncate max-w-[170px] sm:max-w-[200px]">
                                            {item.product.name}
                                        </div>
                                        <div className="text-[10px] text-[#737373] font-mono">
                                            {formatMoney(item.product.price_cents)} &times; {item.quantity}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Quantity Stepper */}
                                    <div className="flex items-center border border-[#333] rounded-lg bg-[#141414] overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                            className="w-7 h-7 flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-mono font-bold text-white">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            className="w-7 h-7 flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222] disabled:opacity-30 disabled:hover:bg-transparent"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Line Total */}
                                    <div className="w-16 text-right font-mono font-bold text-xs text-white">
                                        {formatMoney(item.product.price_cents * item.quantity)}
                                    </div>

                                    {/* Remove Line Item */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.product.id)}
                                        className="text-[#666] hover:text-rose-400 p-1"
                                        title={t('Remove item')}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Calculation & Settlement Bar */}
                <div className="p-4 border-t border-[#242424] bg-[#141414] space-y-3 shrink-0">
                    <div className="space-y-1.5 text-xs text-[#a3a3a3] font-mono">
                        <div className="flex justify-between">
                            <span>{t('Item Count')}</span>
                            <span className="text-white">{t(':count unit(s)', { count: totalItemCount })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('Subtotal')}</span>
                            <span className="text-white">{formatMoney(subtotalCents)}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#242424]">
                            <span>{t('Total Amount')}</span>
                            <span className="text-lg text-[#F25623]">{formatMoney(totalCents)}</span>
                        </div>
                    </div>

                    {/* Payment Settlement Trigger Buttons: Cash or KHQR */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            disabled={ticketItems.length === 0}
                            onClick={handleOpenCashModal}
                            className="h-12 rounded-xl border-[#333] bg-[#202020] hover:bg-[#282828] hover:border-[#F25623] text-white flex items-center justify-center gap-2"
                        >
                            <Banknote className="w-4 h-4 text-[#F25623]" />
                            <span className="text-xs font-bold uppercase tracking-wider">{t('Pay / Tender')}</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            disabled={ticketItems.length === 0}
                            onClick={handleOpenQrModal}
                            className="h-12 rounded-xl border-[#333] bg-[#202020] hover:bg-[#282828] hover:border-emerald-400 text-white flex items-center justify-center gap-2"
                        >
                            <QrCode className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">{t('KHQR Pay')}</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* CASH TENDER DIALOG */}
            <Dialog open={cashModalOpen} onOpenChange={setCashModalOpen}>
                <DialogContent className="max-w-md bg-[#1a1a1a] border-[#333] text-white">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                            <Banknote className="w-5 h-5 text-[#F25623]" />
                            <span>{t('Cash Settlement')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2 text-xs">
                        {/* Due Total */}
                        <div className="p-3 bg-[#222] rounded-xl border border-[#333] flex justify-between font-mono text-sm">
                            <span className="text-[#a3a3a3]">{t('Total Due:')}</span>
                            <span className="text-[#F25623] font-bold text-base">{formatMoney(totalCents)}</span>
                        </div>

                        {/* Tendered Input */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-mono uppercase text-[#a3a3a3]">
                                {t('Received Cash')} ($)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={(tenderedCents / 100).toFixed(2)}
                                onChange={(e) =>
                                    setTenderedCents(Math.round(parseFloat(e.target.value || '0') * 100))
                                }
                                className="bg-[#222] border-[#333] text-white font-mono text-lg font-bold h-12"
                            />
                        </div>

                        {/* Quick Tender Denomination Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setTenderedCents(totalCents)}
                                className="flex-1 min-w-[70px] py-2 rounded-lg border border-[#333] bg-[#222] text-xs font-mono font-bold hover:border-[#F25623]"
                            >
                                {t('Exact Amount')}
                            </button>
                            {[10, 20, 50, 100, 200].map((amt) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setTenderedCents(amt * 100)}
                                    className="flex-1 min-w-[50px] py-2 rounded-lg border border-[#333] bg-[#222] text-xs font-mono font-bold hover:border-[#F25623]"
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>

                        {/* Change Due Display */}
                        <div
                            className={cn(
                                'p-3 rounded-xl border flex justify-between font-mono text-sm',
                                isUnderTendered
                                    ? 'bg-rose-950/20 border-rose-900/50 text-rose-400'
                                    : 'bg-[#111] border-[#333]'
                            )}
                        >
                            <span className="text-[#a3a3a3]">{t('Change Due:')}</span>
                            <span className={cn('font-bold', isUnderTendered ? 'text-rose-400' : 'text-emerald-400 text-base')}>
                                {isUnderTendered
                                    ? t('Short by :amount', { amount: formatMoney(totalCents - tenderedCents) })
                                    : formatMoney(changeCents)}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCashModalOpen(false)}
                            disabled={isSubmitting}
                            className="border-[#333]"
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            variant="orange"
                            onClick={() => handleCompleteSale('cash')}
                            disabled={isUnderTendered || isSubmitting}
                            className="font-bold uppercase tracking-wider text-xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                    {t('Recording Sale...')}
                                </>
                            ) : (
                                t('Complete Sale')
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* KHQR PAYMENT DIALOG */}
            <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
                <DialogContent className="max-w-md bg-[#1a1a1a] border-[#333] text-white text-center">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white flex items-center justify-center gap-2">
                            <QrCode className="w-5 h-5 text-emerald-400" />
                            <span>{t('Bakong / KHQR Instant Pay')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        {/* Dynamic KHQR Card */}
                        <div className="w-56 h-56 mx-auto bg-white p-4 rounded-2xl flex flex-col items-center justify-between shadow-xl">
                            <div className="text-[10px] font-mono font-bold text-red-600 tracking-wider">
                                KHQR &bull; BAKONG
                            </div>
                            <QrCode className="w-40 h-40 text-black stroke-[1.5]" />
                            <div className="text-[9px] font-mono text-zinc-600">
                                {t('DMART STORE #01')}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-[#a3a3a3]">{t('Amount to collect:')}</div>
                            <div className="text-2xl font-black text-white font-mono">{formatMoney(totalCents)}</div>
                        </div>

                        <p className="text-[11px] text-[#737373] max-w-xs mx-auto">
                            {t('Customer scans with any Cambodian banking app (Bakong, ABA, Acleda). Tap below once transaction confirms.')}
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setQrModalOpen(false)}
                            disabled={isSubmitting}
                            className="border-[#333]"
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            variant="orange"
                            onClick={() => handleCompleteSale('khqr')}
                            disabled={isSubmitting}
                            className="font-bold uppercase tracking-wider text-xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                    {t('Recording Sale...')}
                                </>
                            ) : (
                                t('Confirm KHQR Payment')
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* COMPLETED SALE & 80MM THERMAL RECEIPT MODAL */}
            <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
                <DialogContent className="max-w-md bg-[#1a1a1a] border-[#333] text-white">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>{t('Sale Completed')}</span>
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePrintReceipt}
                                className="h-8 gap-1.5 text-xs border-[#444] text-white"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>{t('Print Receipt')}</span>
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {completedReceipt && (
                        <div
                            id="receipt-print-area"
                            className="p-5 bg-white text-slate-900 border rounded-xl font-mono text-xs space-y-3 shadow-inner max-h-[60vh] overflow-y-auto"
                        >
                            {/* Receipt Store Header */}
                            <div className="text-center space-y-1">
                                <div className="font-black text-base tracking-tight">{t('DMART FLAGSHIP STORE')}</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{t('Store Receipt')}</div>
                                <div className="text-[10px] text-slate-600">{t('Samdach Penn Nouth St (214), Phnom Penh')}</div>
                                <div className="text-[10px] text-slate-600">{t('Tel: +855 23 888 999')}</div>
                                <div className="border-b border-dashed border-slate-400 my-2" />
                                <div className="flex justify-between text-[10px]">
                                    <span>{t('Receipt:')} {completedReceipt.order_number}</span>
                                    <span>{completedReceipt.created_at}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span>{t('Cashier:')} {completedReceipt.cashier_name || cashier?.name || t('Staff')}</span>
                                    <span>{t('Reg #01')}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span>{t('Customer:')} {completedReceipt.customer_name || t('Walk-in')}</span>
                                    <span className="uppercase">{t(completedReceipt.payment_method)}</span>
                                </div>
                                <div className="border-b border-dashed border-slate-400 my-2" />
                            </div>

                            {/* Itemized Lines */}
                            <div className="space-y-1.5 text-[11px]">
                                {completedReceipt.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <div className="truncate max-w-[220px]">
                                            {item.quantity}x {item.name}
                                        </div>
                                        <div className="font-bold">
                                            {formatMoney(item.line_total_cents)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-b border-dashed border-slate-400 my-2" />

                            {/* Financial Summary */}
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>{t('Subtotal:')}</span>
                                    <span>{formatMoney(completedReceipt.subtotal_cents)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{t('TOTAL:')}</span>
                                    <span>{formatMoney(completedReceipt.total_cents)}</span>
                                </div>
                                {completedReceipt.cash_tendered_cents !== null && (
                                    <>
                                        <div className="flex justify-between text-[11px] text-slate-600">
                                            <span>{t('Cash Tendered:')}</span>
                                            <span>{formatMoney(completedReceipt.cash_tendered_cents)}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                                            <span>{t('Change Due:')}</span>
                                            <span>{formatMoney(completedReceipt.change_cents || 0)}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="border-b border-dashed border-slate-400 my-3" />

                            {/* Receipt Footer Message */}
                            <div className="text-center text-[10px] text-slate-600 space-y-0.5">
                                <div className="font-bold">*** {t('Thank you for shopping with us!')} ***</div>
                                <div>{t('Keep this receipt for 30-day exchanges')}</div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="orange"
                            className="w-full uppercase font-bold text-xs"
                            onClick={() => setReceiptModalOpen(false)}
                        >
                            {t('Next Sale / Close')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
