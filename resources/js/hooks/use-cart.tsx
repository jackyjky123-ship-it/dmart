import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface CartProduct {
    id: number;
    name: string;
    slug: string;
    sku: string;
    category_name: string;
    price_cents: number;
    compare_at_price_cents?: number | null;
    stock: number;
    image_url?: string | null;
    unit: string;
}

export interface CartItem {
    id: number;
    product: CartProduct;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: CartProduct, quantity?: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    itemCount: number;
    subtotalCents: number;
    shippingFeeCents: number;
    freeShippingThresholdCents: number;
    progressToFreeShipping: number;
    totalCents: number;
}

const FREE_SHIPPING_THRESHOLD = 3500; // $35.00
const FLAT_SHIPPING_FEE = 200; // $2.00

const CART_STORAGE_KEY = 'dmart_cart_v2';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Storage can be unavailable in private browsing; the cart still works in memory.
        }
    }, [items]);

    const addToCart = (product: CartProduct, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                const newQty = Math.min(existing.quantity + quantity, product.stock);
                toast.success(`Updated ${product.name} quantity to ${newQty}`);
                return prev.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: newQty } : item
                );
            }
            toast.success(`Added ${product.name} to cart`);
            return [...prev, { id: product.id, product, quantity: Math.min(quantity, product.stock) }];
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) => {
                if (item.product.id === productId) {
                    const clamped = Math.min(quantity, item.product.stock);
                    return { ...item, quantity: clamped };
                }
                return item;
            })
        );
    };

    const removeFromCart = (productId: number) => {
        setItems((prev) => {
            const item = prev.find((i) => i.product.id === productId);
            if (item) {
                toast.info(`Removed ${item.product.name} from cart`);
            }
            return prev.filter((i) => i.product.id !== productId);
        });
    };

    const clearCart = () => {
        setItems([]);
    };

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotalCents = items.reduce((acc, item) => acc + item.product.price_cents * item.quantity, 0);
    const shippingFeeCents = subtotalCents >= FREE_SHIPPING_THRESHOLD || subtotalCents === 0 ? 0 : FLAT_SHIPPING_FEE;
    const totalCents = subtotalCents + shippingFeeCents;
    const progressToFreeShipping = Math.min(100, Math.round((subtotalCents / FREE_SHIPPING_THRESHOLD) * 100));

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                itemCount,
                subtotalCents,
                shippingFeeCents,
                freeShippingThresholdCents: FREE_SHIPPING_THRESHOLD,
                progressToFreeShipping,
                totalCents,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
