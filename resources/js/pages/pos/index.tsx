import React, { useMemo, useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
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
    const [completedReceipt, setCompletedReceipt] =
        useState<CompletedReceipt | null>(null);
    const [tenderedCents, setTenderedCents] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Active ticket resolution
    const activeTicket =
        tickets.find((t) => t.id === activeTicketId) || tickets[0];
    const ticketItems = activeTicket?.items || [];

    // Financial totals (no fake taxes - in DMart subtotal = total)
    const subtotalCents = useMemo(
        () =>
            ticketItems.reduce(
                (acc, item) => acc + item.product.price_cents * item.quantity,
                0,
            ),
        [ticketItems],
    );
    const totalCents = subtotalCents;
    const totalItemCount = useMemo(
        () => ticketItems.reduce((acc, item) => acc + item.quantity, 0),
        [ticketItems],
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
                    (p.category_name &&
                        p.category_name.toLowerCase().includes(q)),
            );
        }
        if (selectedCategory !== 'all') {
            result = result.filter((p) => p.category_slug === selectedCategory);
        }
        return result;
    }, [products, search, selectedCategory]);

    // Total products count across active categories
    const totalProductCount = useMemo(
        () =>
            categories.reduce((sum, c) => sum + (c.product_count || 0), 0) ||
            products.length,
        [categories, products],
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
    const updateActiveTicket = (
        updater: (prevTicket: PosTicket) => PosTicket,
    ) => {
        setTickets((prev) =>
            prev.map((t) => (t.id === activeTicketId ? updater(t) : t)),
        );
    };

    const handleAddToCart = (product: Product) => {
        if (product.stock <= 0) {
            toast.error(
                t('":name" is currently out of stock.', { name: product.name }),
            );
            return;
        }

        const existing = ticketItems.find((i) => i.product.id === product.id);
        const currentQty = existing ? existing.quantity : 0;

        if (currentQty >= product.stock) {
            toast.warning(
                t('Cannot add more than :count available unit(s).', {
                    count: product.stock,
                }),
            );
            return;
        }

        if (existing) {
            updateActiveTicket((tState) => ({
                ...tState,
                items: tState.items.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
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
            toast.warning(
                t('Only :count unit(s) of ":name" in stock.', {
                    count: item.product.stock,
                    name: item.product.name,
                }),
            );
            return;
        }

        updateActiveTicket((tState) => ({
            ...tState,
            items: tState.items.map((i) =>
                i.product.id === productId ? { ...i, quantity: newQty } : i,
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
            cash_tendered_cents:
                paymentMethod === 'cash' ? tenderedCents : undefined,
            customer_name: activeTicket.customerName?.trim() || undefined,
        };

        router.post('/pos/sales', payload, {
            preserveScroll: true,
            onSuccess: (res) => {
                setIsSubmitting(false);
                setCashModalOpen(false);
                setQrModalOpen(false);

                // Check flashed receipt in props or fallback to response
                const flashedReceipt = (res.props as any)?.flash?.receipt as
                    | CompletedReceipt
                    | undefined;
                if (flashedReceipt) {
                    setCompletedReceipt(flashedReceipt);
                    setReceiptModalOpen(true);
                }

                // Reset or prune the completed ticket
                setTickets((prev) => {
                    if (prev.length > 1) {
                        const remaining = prev.filter(
                            (tkt) => tkt.id !== activeTicket.id,
                        );
                        setActiveTicketId(remaining[0].id);
                        return remaining;
                    } else {
                        return [
                            {
                                id: '1',
                                label: 'Ticket 1',
                                customerName: '',
                                items: [],
                            },
                        ];
                    }
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                const firstError = Object.values(errors)[0] as
                    | string
                    | undefined;
                toast.error(firstError || t('Failed to complete POS sale.'));
            },
        });
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="flex h-[calc(100vh-3.5rem)] w-full flex-1 flex-col overflow-hidden bg-card text-foreground lg:flex-row">
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
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-border bg-background">
                {/* Search Bar & Filter Header */}
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background p-4">
                    <div className="relative max-w-md flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('Search by name or SKU...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-full border-border bg-muted pr-9 pl-10 text-xs text-foreground placeholder:text-muted-foreground focus:border-[#F25623]"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <span className="hidden sm:inline">
                            {t('Active Catalog:')}
                        </span>
                        <Badge
                            variant="outline"
                            className="border-border bg-muted text-foreground"
                        >
                            {t(':count items', {
                                count: filteredProducts.length,
                            })}
                        </Badge>
                    </div>
                </div>

                {/* Category Chips Bar (Built from real database categories) */}
                <div className="flex shrink-0 scrollbar-none items-center gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2.5">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                            'rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all',
                            selectedCategory === 'all'
                                ? 'border-[#F25623] bg-[#F25623] text-white shadow-sm shadow-[#F25623]/25'
                                : 'border-border bg-muted text-muted-foreground hover:border-border hover:text-foreground',
                        )}
                    >
                        {t('All Drops')}{' '}
                        <span className="ml-1 font-mono text-[10px] opacity-75">
                            ({totalProductCount})
                        </span>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={cn(
                                'rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all',
                                selectedCategory === cat.slug
                                    ? 'border-[#F25623] bg-[#F25623] text-white shadow-sm shadow-[#F25623]/25'
                                    : 'border-border bg-muted text-muted-foreground hover:border-border hover:text-foreground',
                            )}
                        >
                            {t(cat.name)}
                            <span className="ml-1 font-mono text-[10px] opacity-75">
                                ({cat.product_count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Product Catalog Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredProducts.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <ShoppingBag className="mb-3 h-12 w-12 stroke-[1.5] text-muted-foreground" />
                            <div className="mb-1 text-sm font-bold text-foreground">
                                {t('No products found')}
                            </div>
                            <div className="max-w-xs text-xs">
                                {search
                                    ? t(
                                          'No active items match ":search". Try searching another name or SKU.',
                                          { search },
                                      )
                                    : t(
                                          'No active items available in this category.',
                                      )}
                            </div>
                            {search && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearch('')}
                                    className="mt-4 border-border text-xs"
                                >
                                    {t('Clear Search')}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((p) => {
                                const inCartItem = ticketItems.find(
                                    (i) => i.product.id === p.id,
                                );
                                const isOutOfStock = p.stock <= 0;
                                const isLowStock = p.stock > 0 && p.stock <= 5;

                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        disabled={isOutOfStock}
                                        onClick={() => handleAddToCart(p)}
                                        className={cn(
                                            'group relative flex flex-col justify-between rounded-xl border p-3 text-left transition-all select-none',
                                            isOutOfStock
                                                ? 'cursor-not-allowed border-border bg-card opacity-45'
                                                : 'border-border bg-card hover:border-[#F25623] hover:bg-muted active:scale-[0.98]',
                                        )}
                                    >
                                        <div>
                                            {/* Product Thumbnail (Letter-tile fallback or real image) */}
                                            <div className="relative mb-2.5 aspect-square w-full overflow-hidden rounded-lg bg-muted">
                                                <ProductThumb
                                                    name={p.name}
                                                    imageUrl={p.image_url}
                                                    size="full"
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />

                                                {/* Stock Status Badge */}
                                                {isOutOfStock ? (
                                                    <span className="absolute top-2 right-2 rounded bg-rose-500/90 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                                                        {t('Sold Out')}
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="absolute top-2 right-2 rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-black uppercase">
                                                        {t(':count left', {
                                                            count: p.stock,
                                                        })}
                                                    </span>
                                                ) : null}

                                                {/* In Cart Indicator */}
                                                {inCartItem && (
                                                    <span className="absolute bottom-2 left-2 rounded-full bg-[#F25623] px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-md">
                                                        {t(':count in cart', {
                                                            count: inCartItem.quantity,
                                                        })}
                                                    </span>
                                                )}
                                            </div>

                                            {/* SKU & Category */}
                                            <div className="mb-0.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                                                <span>{p.sku}</span>
                                                <span className="max-w-[80px] truncate">
                                                    {p.category_name
                                                        ? t(p.category_name)
                                                        : ''}
                                                </span>
                                            </div>

                                            {/* Name */}
                                            <h4 className="line-clamp-2 text-xs leading-snug font-semibold text-foreground transition-colors group-hover:text-[#F25623]">
                                                {p.name}
                                            </h4>
                                        </div>

                                        {/* Price & Stock info */}
                                        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-2">
                                            <span className="font-sans text-sm font-black text-[#F25623]">
                                                {formatMoney(p.price_cents)}
                                            </span>
                                            <span className="font-mono text-[10px] text-muted-foreground">
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
            <div className="flex w-full shrink-0 flex-col overflow-hidden bg-background lg:w-[420px] xl:w-[460px]">
                {/* Tickets Switcher & Cashier Tag */}
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-card p-3">
                    <div className="flex flex-1 scrollbar-none items-center gap-1.5 overflow-x-auto">
                        {tickets.map((tkt) => {
                            const itemCount = tkt.items.reduce(
                                (acc, i) => acc + i.quantity,
                                0,
                            );
                            const isActive = tkt.id === activeTicketId;
                            return (
                                <button
                                    key={tkt.id}
                                    type="button"
                                    onClick={() => setActiveTicketId(tkt.id)}
                                    className={cn(
                                        'flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all',
                                        isActive
                                            ? 'border-[#F25623] bg-muted text-foreground'
                                            : 'border-border bg-card text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    <span>{t(tkt.label)}</span>
                                    {itemCount > 0 && (
                                        <span className="py-0.2 rounded-full bg-[#F25623] px-1.5 font-mono text-[10px] text-white">
                                            {itemCount}
                                        </span>
                                    )}
                                    {tickets.length > 1 && (
                                        <span
                                            onClick={(e) =>
                                                handleCloseTicket(tkt.id, e)
                                            }
                                            className="ml-1 p-0.5 text-muted-foreground hover:text-rose-400"
                                            title={t('Close Ticket')}
                                        >
                                            <X className="h-3 w-3" />
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
                            className="shrink-0 rounded-lg border-border bg-muted text-muted-foreground hover:border-[#F25623] hover:text-foreground"
                            title={t('Hold Sale')}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="hidden shrink-0 items-center gap-1.5 border-l border-border pl-2 font-mono text-[11px] text-muted-foreground sm:flex">
                        <User className="h-3.5 w-3.5 text-[#F25623]" />
                        <span className="max-w-[120px] truncate font-semibold text-foreground">
                            {cashier?.name || t('Cashier')}
                        </span>
                    </div>
                </div>

                {/* Customer Name or Reference Field */}
                <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-4 py-2">
                    <span className="shrink-0 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                        {t('Customer:')}
                    </span>
                    <input
                        type="text"
                        placeholder={t('Walk-in customer (optional name/note)')}
                        value={activeTicket.customerName}
                        onChange={(e) =>
                            updateActiveTicket((tState) => ({
                                ...tState,
                                customerName: e.target.value,
                            }))
                        }
                        className="w-full border-0 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    {ticketItems.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearActiveTicket}
                            className="shrink-0 font-mono text-[11px] text-muted-foreground hover:text-rose-400"
                            title={t('Clear Cart')}
                        >
                            {t('Clear Cart')}
                        </button>
                    )}
                </div>

                {/* Cart basket column headers when items exist */}
                {ticketItems.length > 0 && (
                    <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-1.5 font-mono text-[10px] text-muted-foreground uppercase">
                        <span>{t('Item')}</span>
                        <div className="flex items-center gap-8 pr-12">
                            <span>{t('Qty')}</span>
                            <span>{t('Price')}</span>
                        </div>
                    </div>
                )}

                {/* Ticket Line Items List */}
                <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
                    {ticketItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <ReceiptIcon className="mb-3 h-12 w-12 stroke-[1.2] text-muted-foreground" />
                            <div className="mb-1 text-xs font-semibold text-foreground">
                                {t('Current ticket is empty')}
                            </div>
                            <p className="max-w-xs text-[11px] leading-relaxed text-muted-foreground">
                                {t(
                                    'Tap items from the catalog on the left to add products to this order.',
                                )}
                            </p>
                        </div>
                    ) : (
                        ticketItems.map((item) => (
                            <div
                                key={item.product.id}
                                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-2.5"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <ProductThumb
                                        name={item.product.name}
                                        imageUrl={item.product.image_url}
                                        size="sm"
                                        className="shrink-0 rounded-lg"
                                    />
                                    <div className="min-w-0">
                                        <div className="max-w-[170px] truncate text-xs font-semibold text-foreground sm:max-w-[200px]">
                                            {item.product.name}
                                        </div>
                                        <div className="font-mono text-[10px] text-muted-foreground">
                                            {formatMoney(
                                                item.product.price_cents,
                                            )}{' '}
                                            &times; {item.quantity}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                    {/* Quantity Stepper */}
                                    <div className="flex items-center overflow-hidden rounded-lg border border-border bg-background">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleUpdateQuantity(
                                                    item.product.id,
                                                    item.quantity - 1,
                                                )
                                            }
                                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center font-mono text-xs font-bold text-foreground">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleUpdateQuantity(
                                                    item.product.id,
                                                    item.quantity + 1,
                                                )
                                            }
                                            disabled={
                                                item.quantity >=
                                                item.product.stock
                                            }
                                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>

                                    {/* Line Total */}
                                    <div className="w-16 text-right font-mono text-xs font-bold text-foreground">
                                        {formatMoney(
                                            item.product.price_cents *
                                                item.quantity,
                                        )}
                                    </div>

                                    {/* Remove Line Item */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(item.product.id)
                                        }
                                        className="p-1 text-muted-foreground hover:text-rose-400"
                                        title={t('Remove item')}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Calculation & Settlement Bar */}
                <div className="shrink-0 space-y-3 border-t border-border bg-background p-4">
                    <div className="space-y-1.5 font-mono text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>{t('Item Count')}</span>
                            <span className="text-foreground">
                                {t(':count unit(s)', { count: totalItemCount })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('Subtotal')}</span>
                            <span className="text-foreground">
                                {formatMoney(subtotalCents)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 text-base font-black text-foreground">
                            <span>{t('Total Amount')}</span>
                            <span className="text-lg text-[#F25623]">
                                {formatMoney(totalCents)}
                            </span>
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
                            className="flex h-12 items-center justify-center gap-2 rounded-xl border-border bg-muted text-foreground hover:border-[#F25623] hover:bg-muted"
                        >
                            <Banknote className="h-4 w-4 text-[#F25623]" />
                            <span className="text-xs font-bold tracking-wider uppercase">
                                {t('Pay / Tender')}
                            </span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            disabled={ticketItems.length === 0}
                            onClick={handleOpenQrModal}
                            className="flex h-12 items-center justify-center gap-2 rounded-xl border-border bg-muted text-foreground hover:border-emerald-400 hover:bg-muted"
                        >
                            <QrCode className="h-4 w-4 text-emerald-400" />
                            <span className="text-xs font-bold tracking-wider uppercase">
                                {t('KHQR Pay')}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* CASH TENDER DIALOG */}
            <Dialog open={cashModalOpen} onOpenChange={setCashModalOpen}>
                <DialogContent className="max-w-md border-border bg-card text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-black tracking-wider text-foreground uppercase">
                            <Banknote className="h-5 w-5 text-[#F25623]" />
                            <span>{t('Cash Settlement')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2 text-xs">
                        {/* Due Total */}
                        <div className="flex justify-between rounded-xl border border-border bg-muted p-3 font-mono text-sm">
                            <span className="text-muted-foreground">
                                {t('Total Due:')}
                            </span>
                            <span className="text-base font-bold text-[#F25623]">
                                {formatMoney(totalCents)}
                            </span>
                        </div>

                        {/* Tendered Input */}
                        <div className="space-y-1.5">
                            <label className="font-mono text-[11px] text-muted-foreground uppercase">
                                {t('Received Cash')} ($)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={(tenderedCents / 100).toFixed(2)}
                                onChange={(e) =>
                                    setTenderedCents(
                                        Math.round(
                                            parseFloat(e.target.value || '0') *
                                                100,
                                        ),
                                    )
                                }
                                className="h-12 border-border bg-muted font-mono text-lg font-bold text-foreground"
                            />
                        </div>

                        {/* Quick Tender Denomination Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setTenderedCents(totalCents)}
                                className="min-w-[70px] flex-1 rounded-lg border border-border bg-muted py-2 font-mono text-xs font-bold hover:border-[#F25623]"
                            >
                                {t('Exact Amount')}
                            </button>
                            {[10, 20, 50, 100, 200].map((amt) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setTenderedCents(amt * 100)}
                                    className="min-w-[50px] flex-1 rounded-lg border border-border bg-muted py-2 font-mono text-xs font-bold hover:border-[#F25623]"
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>

                        {/* Change Due Display */}
                        <div
                            className={cn(
                                'flex justify-between rounded-xl border p-3 font-mono text-sm',
                                isUnderTendered
                                    ? 'border-rose-900/50 bg-rose-950/20 text-rose-400'
                                    : 'border-border bg-sidebar',
                            )}
                        >
                            <span className="text-muted-foreground">
                                {t('Change Due:')}
                            </span>
                            <span
                                className={cn(
                                    'font-bold',
                                    isUnderTendered
                                        ? 'text-rose-400'
                                        : 'text-base text-emerald-400',
                                )}
                            >
                                {isUnderTendered
                                    ? t('Short by :amount', {
                                          amount: formatMoney(
                                              totalCents - tenderedCents,
                                          ),
                                      })
                                    : formatMoney(changeCents)}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCashModalOpen(false)}
                            disabled={isSubmitting}
                            className="border-border"
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            variant="orange"
                            onClick={() => handleCompleteSale('cash')}
                            disabled={isUnderTendered || isSubmitting}
                            className="text-xs font-bold tracking-wider uppercase"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
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
                <DialogContent className="max-w-md border-border bg-card text-center text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-center gap-2 text-base font-black tracking-wider text-foreground uppercase">
                            <QrCode className="h-5 w-5 text-emerald-400" />
                            <span>{t('Bakong / KHQR Instant Pay')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Dynamic KHQR Card */}
                        <div className="mx-auto flex h-56 w-56 flex-col items-center justify-between rounded-2xl bg-white p-4 shadow-xl">
                            <div className="font-mono text-[10px] font-bold tracking-wider text-red-600">
                                KHQR &bull; BAKONG
                            </div>
                            <QrCode className="h-40 w-40 stroke-[1.5] text-black" />
                            <div className="font-mono text-[9px] text-zinc-600">
                                {t('DMART STORE #01')}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">
                                {t('Amount to collect:')}
                            </div>
                            <div className="font-mono text-2xl font-black text-foreground">
                                {formatMoney(totalCents)}
                            </div>
                        </div>

                        <p className="mx-auto max-w-xs text-[11px] text-muted-foreground">
                            {t(
                                'Customer scans with any Cambodian banking app (Bakong, ABA, Acleda). Tap below once transaction confirms.',
                            )}
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setQrModalOpen(false)}
                            disabled={isSubmitting}
                            className="border-border"
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            variant="orange"
                            onClick={() => handleCompleteSale('khqr')}
                            disabled={isSubmitting}
                            className="text-xs font-bold tracking-wider uppercase"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
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
                <DialogContent className="max-w-md border-border bg-card text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-base font-black tracking-wider text-foreground uppercase">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span>{t('Sale Completed')}</span>
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePrintReceipt}
                                className="h-8 gap-1.5 border-border text-xs text-foreground"
                            >
                                <Printer className="h-3.5 w-3.5" />
                                <span>{t('Print Receipt')}</span>
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {completedReceipt && (
                        <div
                            id="receipt-print-area"
                            className="max-h-[60vh] space-y-3 overflow-y-auto rounded-xl border bg-white p-5 font-mono text-xs text-slate-900 shadow-inner"
                        >
                            {/* Receipt Store Header */}
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
                                        {t('Receipt:')}{' '}
                                        {completedReceipt.order_number}
                                    </span>
                                    <span>{completedReceipt.created_at}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span>
                                        {t('Cashier:')}{' '}
                                        {completedReceipt.cashier_name ||
                                            cashier?.name ||
                                            t('Staff')}
                                    </span>
                                    <span>{t('Reg #01')}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span>
                                        {t('Customer:')}{' '}
                                        {completedReceipt.customer_name ||
                                            t('Walk-in')}
                                    </span>
                                    <span className="uppercase">
                                        {t(completedReceipt.payment_method)}
                                    </span>
                                </div>
                                <div className="my-2 border-b border-dashed border-slate-400" />
                            </div>

                            {/* Itemized Lines */}
                            <div className="space-y-1.5 text-[11px]">
                                {completedReceipt.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between"
                                    >
                                        <div className="max-w-[220px] truncate">
                                            {item.quantity}x {item.name}
                                        </div>
                                        <div className="font-bold">
                                            {formatMoney(item.line_total_cents)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-2 border-b border-dashed border-slate-400" />

                            {/* Financial Summary */}
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>{t('Subtotal:')}</span>
                                    <span>
                                        {formatMoney(
                                            completedReceipt.subtotal_cents,
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span>{t('TOTAL:')}</span>
                                    <span>
                                        {formatMoney(
                                            completedReceipt.total_cents,
                                        )}
                                    </span>
                                </div>
                                {completedReceipt.cash_tendered_cents !==
                                    null && (
                                    <>
                                        <div className="flex justify-between text-[11px] text-slate-600">
                                            <span>{t('Cash Tendered:')}</span>
                                            <span>
                                                {formatMoney(
                                                    completedReceipt.cash_tendered_cents,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-600">
                                            <span>{t('Change Due:')}</span>
                                            <span>
                                                {formatMoney(
                                                    completedReceipt.change_cents ||
                                                        0,
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="my-3 border-b border-dashed border-slate-400" />

                            {/* Receipt Footer Message */}
                            <div className="space-y-0.5 text-center text-[10px] text-slate-600">
                                <div className="font-bold">
                                    *** {t('Thank you for shopping with us!')}{' '}
                                    ***
                                </div>
                                <div>
                                    {t(
                                        'Keep this receipt for 30-day exchanges',
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="orange"
                            className="w-full text-xs font-bold uppercase"
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
