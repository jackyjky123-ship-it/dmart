import React, { useMemo, useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ProductThumb } from '@/components/product-thumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatMoney } from '@/lib/money';
import {
    Search,
    Trash2,
    Banknote,
    QrCode,
    CreditCard,
    Printer,
    CheckCircle2,
    RotateCcw,
    X,
    Receipt,
    Plus,
    Minus,
    Utensils,
    Layers,
    Calendar,
    Truck,
    Calculator,
    Settings,
    LogOut,
    SlidersHorizontal,
    Edit3,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
    discount_pct?: number;
}

interface PosLineItem {
    product: Product;
    quantity: number;
}

interface PosTicket {
    id: string;
    tableOrCustomer: string;
    customerName: string;
    items: PosLineItem[];
    orderType: 'in-store' | 'takeaway' | 'delivery';
}

const DEFAULT_POS_PRODUCTS: Product[] = [
    {
        id: 101,
        name: 'Essential Oversized Hoodie',
        sku: 'HD-ESS-01',
        price_cents: 5999,
        stock: 24,
        category_slug: 'hoodies',
        category_name: 'Hoodies',
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
        unit: 'Unisex',
        discount_pct: 20,
    },
    {
        id: 102,
        name: 'LA California Pullover',
        sku: 'HD-LAC-02',
        price_cents: 4500,
        stock: 18,
        category_slug: 'hoodies',
        category_name: 'Hoodies',
        image_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&q=80',
        unit: 'Heavyweight',
    },
    {
        id: 103,
        name: 'Acid Wash Vintage Boxy Tee',
        sku: 'TEE-ACD-06',
        price_cents: 3400,
        stock: 35,
        category_slug: 'tees',
        category_name: 'Tees',
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
        unit: 'Acid Wash',
        discount_pct: 15,
    },
    {
        id: 104,
        name: 'Utility Cargo Pant',
        sku: 'BOT-CRG-07',
        price_cents: 6800,
        stock: 8,
        category_slug: 'bottoms',
        category_name: 'Bottoms',
        image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
        unit: 'Ripstop',
    },
    {
        id: 105,
        name: 'Monochrome Tech Flight Bomber',
        sku: 'OUT-BMB-08',
        price_cents: 12000,
        stock: 6,
        category_slug: 'outerwear',
        category_name: 'Outerwear',
        image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=400&q=80',
        unit: 'Insulated',
        discount_pct: 10,
    },
    {
        id: 106,
        name: 'Smile Planet Cosmic Pullover',
        sku: 'HD-SMI-03',
        price_cents: 4500,
        stock: 15,
        category_slug: 'hoodies',
        category_name: 'Hoodies',
        image_url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=400&q=80',
        unit: 'Cotton Fleece',
        discount_pct: 20,
    },
];

const POS_CATEGORIES = [
    { id: 0, name: 'All Drops', slug: 'all', count: 235 },
    { id: 1, name: 'Hoodies', slug: 'hoodies', count: 34 },
    { id: 2, name: 'Tees', slug: 'tees', count: 42 },
    { id: 3, name: 'Outerwear', slug: 'outerwear', count: 18 },
    { id: 4, name: 'Bottoms', slug: 'bottoms', count: 26 },
    { id: 5, name: 'Accessories', slug: 'accessories', count: 15 },
];

export default function PosIndex({ products: propProducts = [] }: { products?: Product[] }) {
    const products = propProducts.length > 0 ? propProducts : DEFAULT_POS_PRODUCTS;

    // Active tickets (T1, T2, T3) for instant switching
    const [tickets, setTickets] = useState<PosTicket[]>([
        {
            id: 'T1',
            tableOrCustomer: 'Table 4',
            customerName: 'Floyd Miles',
            orderType: 'in-store',
            items: [
                { product: products[0], quantity: 1 },
                { product: products[2], quantity: 2 },
            ],
        },
        {
            id: 'T2',
            tableOrCustomer: 'Pickup 02',
            customerName: 'Bessie Co.',
            orderType: 'takeaway',
            items: [
                { product: products[1], quantity: 1 },
            ],
        },
        {
            id: 'T3',
            tableOrCustomer: 'Express 03',
            customerName: 'Ralph Edwards',
            orderType: 'delivery',
            items: [
                { product: products[4], quantity: 1 },
            ],
        },
    ]);

    const [activeTicketId, setActiveTicketId] = useState<string>('T1');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Modals
    const [cashModalOpen, setCashModalOpen] = useState(false);
    const [cardModalOpen, setCardModalOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [lastCompletedSale, setLastCompletedSale] = useState<any>(null);
    const [tenderedCents, setTenderedCents] = useState<number>(10000);

    const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];
    const ticketItems = activeTicket?.items || [];

    // Financial totals
    const subtotalCents = ticketItems.reduce((acc, item) => acc + item.product.price_cents * item.quantity, 0);
    const taxCents = Math.round(subtotalCents * 0.05); // 5% tax
    const totalCents = subtotalCents + taxCents;
    const changeCents = Math.max(0, tenderedCents - totalCents);

    // Filtering
    const filteredProducts = useMemo(() => {
        let result = [...products];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
        }
        if (selectedCategory !== 'all') {
            result = result.filter((p) => p.category_slug === selectedCategory);
        }
        return result;
    }, [products, search, selectedCategory]);

    // Ticket item helpers
    const updateActiveTicketItems = (newItems: PosLineItem[]) => {
        setTickets((prev) =>
            prev.map((t) => (t.id === activeTicketId ? { ...t, items: newItems } : t))
        );
    };

    const addItem = (product: Product) => {
        const existing = ticketItems.find((i) => i.product.id === product.id);
        if (existing) {
            updateActiveTicketItems(
                ticketItems.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
            );
        } else {
            updateActiveTicketItems([...ticketItems, { product, quantity: 1 }]);
        }
        toast.success(`Added ${product.name}`);
    };

    const updateQuantity = (productId: number, qty: number) => {
        if (qty <= 0) {
            updateActiveTicketItems(ticketItems.filter((i) => i.product.id !== productId));
        } else {
            updateActiveTicketItems(
                ticketItems.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
            );
        }
    };

    const clearActiveTicket = () => {
        updateActiveTicketItems([]);
    };

    const completeSale = (paymentMethod: string) => {
        const sale = {
            orderNumber: `DMART-POS-${Math.floor(100000 + Math.random() * 900000)}`,
            ticketId: activeTicket.id,
            customerName: activeTicket.customerName,
            orderType: activeTicket.orderType,
            items: [...ticketItems],
            subtotalCents,
            taxCents,
            totalCents,
            paymentMethod,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        setLastCompletedSale(sale);
        setCashModalOpen(false);
        setCardModalOpen(false);
        setQrModalOpen(false);
        setReceiptModalOpen(true);
        clearActiveTicket();
    };

    return (
        <div className="flex-1 flex w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-[#121212] text-white">
            <Head title="POS Cashier Register — DMART" />

            {/* 1. LEFT SLIM SIDEBAR (Inspired by pos_system_ref.png) */}
            <aside className="w-16 sm:w-20 border-r border-[#242424] bg-[#171717] flex flex-col justify-between items-center py-4 shrink-0 z-20">
                <div className="flex flex-col items-center gap-6">
                    {/* Brand mark */}
                    <div className="w-10 h-10 rounded-xl bg-[#F25623] text-white flex items-center justify-center font-black shadow-md shadow-[#F25623]/25">
                        D
                    </div>

                    {/* Navigation actions */}
                    <nav className="flex flex-col items-center gap-3">
                        <button
                            type="button"
                            className="w-11 h-11 rounded-xl bg-[#F25623] text-white flex items-center justify-center shadow-md shadow-[#F25623]/25"
                            title="Menu / Catalog"
                        >
                            <Utensils className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            className="w-11 h-11 rounded-xl text-[#737373] hover:text-white hover:bg-[#222] flex items-center justify-center transition-colors"
                            title="Table Services"
                        >
                            <Layers className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            className="w-11 h-11 rounded-xl text-[#737373] hover:text-white hover:bg-[#222] flex items-center justify-center transition-colors"
                            title="Reservation / Hold"
                        >
                            <Calendar className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            className="w-11 h-11 rounded-xl text-[#737373] hover:text-white hover:bg-[#222] flex items-center justify-center transition-colors"
                            title="Delivery Dispatch"
                        >
                            <Truck className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            className="w-11 h-11 rounded-xl text-[#737373] hover:text-white hover:bg-[#222] flex items-center justify-center transition-colors"
                            title="Accounting"
                        >
                            <Calculator className="w-5 h-5" />
                        </button>
                    </nav>
                </div>

                {/* Bottom user profiles & logout */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] border border-[#333] flex items-center justify-center text-xs font-bold text-[#F25623]" title="Floyd Miles (Cashier)">
                        FM
                    </div>
                    <Link
                        href="/"
                        className="w-9 h-9 rounded-full text-[#737373] hover:text-rose-400 hover:bg-[#222] flex items-center justify-center transition-colors"
                        title="Exit POS"
                    >
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            </aside>

            {/* 2. MAIN PRODUCT AREA (Inspired by pos_system_ref.png) */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#141414] overflow-hidden">
                {/* Search & Filter Top Bar */}
                <div className="h-16 px-6 border-b border-[#242424] bg-[#171717] flex items-center justify-between gap-4 shrink-0">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search product here..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-full border border-[#2d2d2d] bg-[#202020] text-xs text-white placeholder:text-[#666] focus:outline-none focus:border-[#F25623]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className="w-10 h-10 rounded-full border border-[#2d2d2d] bg-[#202020] text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors"
                        title="Filter settings"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Category Pills Strip (From pos_system_ref.png) */}
                <div className="px-6 py-4 flex items-center gap-3 overflow-x-auto shrink-0 border-b border-[#242424] bg-[#171717]/60">
                    {POS_CATEGORIES.map((cat) => (
                        <button
                            key={cat.slug}
                            type="button"
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-left transition-all shrink-0',
                                selectedCategory === cat.slug
                                    ? 'bg-[#F25623] border-[#F25623] text-white shadow-lg shadow-[#F25623]/25'
                                    : 'bg-[#1c1c1c] border-[#2a2a2a] text-[#888] hover:text-white hover:bg-[#242424]'
                            )}
                        >
                            <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider">{cat.name}</div>
                                <div className={cn('text-[10px] font-mono', selectedCategory === cat.slug ? 'text-white/80' : 'text-[#666]')}>
                                    {cat.count} items
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Product Cards Grid (Middle Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((p) => {
                            const cartItem = ticketItems.find((i) => i.product.id === p.id);
                            return (
                                <div
                                    key={p.id}
                                    className="rounded-2xl border border-[#282828] bg-[#1a1a1a] p-3 flex flex-col justify-between hover:border-[#F25623]/60 transition-all shadow-md group"
                                >
                                    <div>
                                        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#242424] mb-3">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <ProductThumb name={p.name} size="full" />
                                            )}

                                            {p.discount_pct && (
                                                <span className="absolute top-2 left-2 bg-[#F25623] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                                                    {p.discount_pct}% Off
                                                </span>
                                            )}

                                            <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-[#a3a3a3]">
                                                {p.unit}
                                            </span>
                                        </div>

                                        <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#F25623] transition-colors">
                                            {p.name}
                                        </h4>
                                        <div className="text-xs font-mono font-bold text-[#F25623] mt-1">
                                            ${(p.price_cents / 100).toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Action button / stepper */}
                                    <div className="mt-3 pt-2 border-t border-[#262626]">
                                        {cartItem ? (
                                            <div className="flex items-center justify-between bg-[#242424] rounded-lg p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(p.id, cartItem.quantity - 1)}
                                                    className="w-7 h-7 rounded bg-[#333] hover:bg-[#444] text-white flex items-center justify-center"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-mono font-bold text-white px-2">
                                                    {cartItem.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(p.id, cartItem.quantity + 1)}
                                                    className="w-7 h-7 rounded bg-[#F25623] text-white flex items-center justify-center"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => addItem(p)}
                                                className="w-full h-8 rounded-lg text-xs font-bold uppercase tracking-wider border-[#333] bg-[#222] text-white hover:bg-[#F25623] hover:border-[#F25623]"
                                            >
                                                Add to Dish
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Active Tables / Tickets Bar (From pos_system_ref.png) */}
                <div className="h-16 border-t border-[#242424] bg-[#171717] px-6 flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3 overflow-x-auto">
                        {tickets.map((t) => {
                            const itemCount = t.items.reduce((acc, i) => acc + i.quantity, 0);
                            const isActive = t.id === activeTicketId;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setActiveTicketId(t.id)}
                                    className={cn(
                                        'flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all text-xs',
                                        isActive
                                            ? 'bg-[#2a2a2a] border-[#F25623] text-white shadow-md'
                                            : 'bg-[#1e1e1e] border-[#2e2e2e] text-[#888] hover:text-white'
                                    )}
                                >
                                    <span className={cn('w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]', isActive ? 'bg-[#F25623] text-white' : 'bg-[#333] text-[#aaa]')}>
                                        {t.id}
                                    </span>
                                    <span className="font-semibold">{t.customerName}</span>
                                    <span className="text-[10px] font-mono text-[#777]">({itemCount} items)</span>
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => {
                                const newId = `T${tickets.length + 1}`;
                                const newTicket: PosTicket = {
                                    id: newId,
                                    tableOrCustomer: `Table ${tickets.length + 1}`,
                                    customerName: `Customer ${tickets.length + 1}`,
                                    orderType: 'in-store',
                                    items: [],
                                };
                                setTickets([...tickets, newTicket]);
                                setActiveTicketId(newId);
                                toast.success(`Created ticket ${newId}`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-[#444] text-xs text-[#a3a3a3] hover:text-white hover:border-white transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>New Ticket</span>
                        </button>
                    </div>

                    <div className="text-xs font-mono text-[#737373] hidden sm:block">
                        Active Ticket: <strong className="text-white">{activeTicket.tableOrCustomer}</strong>
                    </div>
                </div>
            </div>

            {/* 3. RIGHT ORDER & CHECKOUT DRAWER (Inspired by pos_system_ref.png) */}
            <aside className="w-80 sm:w-96 border-l border-[#242424] bg-[#1a1a1a] flex flex-col justify-between shrink-0 z-10 shadow-2xl">
                {/* Header: Table / Customer */}
                <div className="p-4 border-b border-[#242424] space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-black tracking-tight text-white font-sans">
                                {activeTicket.tableOrCustomer}
                            </h3>
                            <div className="text-xs text-[#888]">{activeTicket.customerName}</div>
                        </div>
                        <button type="button" className="text-[#737373] hover:text-white" title="Edit Customer">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Order Type Tabs: In-Store, Take Away, Delivery */}
                    <div className="grid grid-cols-3 gap-1 bg-[#121212] p-1 rounded-xl border border-[#282828] text-xs">
                        {(['in-store', 'takeaway', 'delivery'] as const).map((ot) => (
                            <button
                                key={ot}
                                type="button"
                                onClick={() => {
                                    setTickets((prev) =>
                                        prev.map((t) => (t.id === activeTicketId ? { ...t, orderType: ot } : t))
                                    );
                                }}
                                className={cn(
                                    'py-1.5 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all',
                                    activeTicket.orderType === ot
                                        ? 'bg-[#F25623] text-white shadow-xs'
                                        : 'text-[#888] hover:text-white'
                                )}
                            >
                                {ot === 'in-store' ? 'Dine in' : ot === 'takeaway' ? 'Take Away' : 'Delivery'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Middle Itemized Line Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#242424]">
                    {ticketItems.length === 0 ? (
                        <div className="text-center py-16 text-[#666] space-y-2">
                            <Receipt className="w-10 h-10 mx-auto opacity-30" />
                            <div className="text-xs uppercase font-mono tracking-wider">Ticket is empty</div>
                            <div className="text-[11px]">Select items from the catalog</div>
                        </div>
                    ) : (
                        ticketItems.map((item) => (
                            <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#242424] shrink-0 border border-[#333]">
                                    {item.product.image_url ? (
                                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ProductThumb name={item.product.name} size="full" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">
                                        {item.product.name}
                                    </div>
                                    <div className="text-[11px] font-mono text-[#888]">
                                        ${(item.product.price_cents / 100).toFixed(2)} &times; {item.quantity}
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className="text-xs font-mono font-bold text-white">
                                        ${((item.product.price_cents * item.quantity) / 100).toFixed(2)}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.product.id, 0)}
                                        className="text-[10px] text-rose-400 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Bottom Calculation & Checkout Controls */}
                <div className="p-4 border-t border-[#242424] bg-[#141414] space-y-3">
                    <div className="space-y-1.5 text-xs text-[#a3a3a3] font-mono">
                        <div className="flex justify-between">
                            <span>Sub Total</span>
                            <span className="text-white">${(subtotalCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (5%)</span>
                            <span className="text-white">${(taxCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#242424]">
                            <span>Total Amount</span>
                            <span className="text-base text-[#F25623]">${(totalCents / 100).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Quick Payment Options: Cash, Card, QR */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setCashModalOpen(true)}
                            disabled={ticketItems.length === 0}
                            className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#2d2d2d] bg-[#202020] hover:bg-[#282828] hover:border-[#F25623] text-white transition-all disabled:opacity-40"
                        >
                            <Banknote className="w-4 h-4 text-[#F25623] mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Cash</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCardModalOpen(true)}
                            disabled={ticketItems.length === 0}
                            className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#2d2d2d] bg-[#202020] hover:bg-[#282828] hover:border-blue-400 text-white transition-all disabled:opacity-40"
                        >
                            <CreditCard className="w-4 h-4 text-blue-400 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Card</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setQrModalOpen(true)}
                            disabled={ticketItems.length === 0}
                            className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#2d2d2d] bg-[#202020] hover:bg-[#282828] hover:border-emerald-400 text-white transition-all disabled:opacity-40"
                        >
                            <QrCode className="w-4 h-4 text-emerald-400 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">QR Code</span>
                        </button>
                    </div>

                    {/* Primary Action Button: Place Order */}
                    <Button
                        type="button"
                        variant="orange"
                        size="lg"
                        disabled={ticketItems.length === 0}
                        onClick={() => setCashModalOpen(true)}
                        className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#F25623]/25"
                    >
                        Place Order (${(totalCents / 100).toFixed(2)})
                    </Button>
                </div>
            </aside>

            {/* Cash Tender Dialog */}
            <Dialog open={cashModalOpen} onOpenChange={setCashModalOpen}>
                <DialogContent className="max-w-md bg-[#1a1a1a] border-[#333] text-white">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
                            Cash Settlement
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2 text-xs">
                        <div className="p-3 bg-[#222] rounded-xl border border-[#333] flex justify-between font-mono text-sm">
                            <span className="text-[#a3a3a3]">Due Total:</span>
                            <span className="text-[#F25623] font-bold">${(totalCents / 100).toFixed(2)}</span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-mono uppercase text-[#a3a3a3]">Tendered Amount ($)</label>
                            <Input
                                type="number"
                                value={tenderedCents / 100}
                                onChange={(e) => setTenderedCents(Math.round(parseFloat(e.target.value || '0') * 100))}
                                className="bg-[#222] border-[#333] text-white font-mono text-base font-bold"
                            />
                        </div>

                        <div className="flex gap-2">
                            {[20, 50, 100, 150, 200].map((amt) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setTenderedCents(amt * 100)}
                                    className="flex-1 py-1.5 rounded-lg border border-[#333] bg-[#222] text-xs font-mono font-bold hover:border-[#F25623]"
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>

                        <div className="p-3 bg-[#111] rounded-xl border border-[#333] flex justify-between font-mono text-sm">
                            <span className="text-[#a3a3a3]">Change to Return:</span>
                            <span className="text-emerald-400 font-bold">${(changeCents / 100).toFixed(2)}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCashModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="orange" onClick={() => completeSale('Cash')}>
                            Confirm &amp; Print Receipt
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Credit Card Dialog */}
            <Dialog open={cardModalOpen} onOpenChange={setCardModalOpen}>
                <DialogContent className="max-w-md bg-[#1a1a1a] border-[#333] text-white text-center">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
                            Card Terminal Ready
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-3">
                        <CreditCard className="w-12 h-12 mx-auto text-blue-400 animate-pulse" />
                        <div className="text-xs text-[#a3a3a3]">Insert, swipe or tap chip card on reader</div>
                        <div className="text-2xl font-black text-white font-mono">${(totalCents / 100).toFixed(2)}</div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCardModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="orange" onClick={() => completeSale('Credit/Debit Card')}>
                            Simulate Card Approved
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* QR Payment Dialog */}
            <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
                <DialogContent className="max-w-md bg-[#1a1a1a] border-[#333] text-white text-center">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
                            Dynamic KHQR Scan
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center">
                            <QrCode className="w-40 h-40 text-black" />
                        </div>
                        <div className="text-xs font-mono text-[#a3a3a3]">Bakong / KHQR Instant Settlement</div>
                        <div className="text-xl font-bold text-white font-mono">${(totalCents / 100).toFixed(2)}</div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setQrModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="orange" onClick={() => completeSale('KHQR Dynamic Pay')}>
                            Simulate Payment Received
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Receipt Modal */}
            <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
                <DialogContent className="max-w-sm bg-[#1a1a1a] border-[#333] text-white text-center">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider text-white flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Sale Completed
                        </DialogTitle>
                    </DialogHeader>
                    {lastCompletedSale && (
                        <div className="p-4 bg-[#111] rounded-xl border border-[#333] text-left text-xs font-mono space-y-2 mt-2">
                            <div className="text-center font-bold pb-2 border-b border-[#333]">
                                DMART STORE REGISTER #01
                            </div>
                            <div className="flex justify-between text-[11px] text-[#888]">
                                <span>Order: {lastCompletedSale.orderNumber}</span>
                                <span>{lastCompletedSale.timestamp}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-[#888]">
                                <span>Customer: {lastCompletedSale.customerName}</span>
                                <span>{lastCompletedSale.paymentMethod}</span>
                            </div>
                            <div className="py-2 border-y border-[#333] space-y-1">
                                {lastCompletedSale.items.map((i: any) => (
                                    <div key={i.product.id} className="flex justify-between">
                                        <span className="truncate max-w-[180px]">{i.product.name} x{i.quantity}</span>
                                        <span>${((i.product.price_cents * i.quantity) / 100).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between font-bold text-white pt-1">
                                <span>Total Paid</span>
                                <span>${(lastCompletedSale.totalCents / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="orange" className="w-full" onClick={() => setReceiptModalOpen(false)}>
                            <Printer className="w-4 h-4 mr-2" /> Done / Print
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
