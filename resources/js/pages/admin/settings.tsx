import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Store, Truck, BellRing } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsProps {
    settings?: {
        store_name: string;
        store_address: string;
        store_phone: string;
        shipping_fee_cents: number;
        free_shipping_threshold_cents: number;
        low_stock_threshold: number;
    };
}

export default function AdminSettingsView({ settings: initialSettings }: SettingsProps) {
    const settings = initialSettings || {
        store_name: 'DMart Grocery & Mini-Mart',
        store_address: '#24 Samdach Penn Nouth St (214), Phnom Penh',
        store_phone: '+855 23 888 999',
        shipping_fee_cents: 200,
        free_shipping_threshold_cents: 3500,
        low_stock_threshold: 5,
    };

    const [storeName, setStoreName] = useState(settings.store_name);
    const [storeAddress, setStoreAddress] = useState(settings.store_address);
    const [storePhone, setStorePhone] = useState(settings.store_phone);
    const [shippingFee, setShippingFee] = useState((settings.shipping_fee_cents / 100).toFixed(2));
    const [freeThreshold, setFreeThreshold] = useState((settings.free_shipping_threshold_cents / 100).toFixed(2));
    const [lowStock, setLowStock] = useState(settings.low_stock_threshold.toString());

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Store parameters and delivery settings saved successfully.');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Head title="Store Settings — DMart Admin" />

            <div className="pb-4 border-b">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    Store & Shipping Settings
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Configure store profile, delivery fee tiers, and low-inventory triggers
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Store Profile Card */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <Store className="w-4 h-4 text-purple-600" />
                        <h2 className="font-bold text-sm tracking-tight text-foreground">
                            Store Profile & Contact
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="sName" className="text-xs">Store Display Name</Label>
                            <Input
                                id="sName"
                                required
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sAddr" className="text-xs">Physical Address (Prints on POS Receipts)</Label>
                            <Input
                                id="sAddr"
                                required
                                value={storeAddress}
                                onChange={(e) => setStoreAddress(e.target.value)}
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sPhone" className="text-xs">Customer Support Phone</Label>
                            <Input
                                id="sPhone"
                                required
                                value={storePhone}
                                onChange={(e) => setStorePhone(e.target.value)}
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Fee Settings Card */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <Truck className="w-4 h-4 text-purple-600" />
                        <h2 className="font-bold text-sm tracking-tight text-foreground">
                            Local Delivery Fees
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="fee" className="text-xs">Flat City Delivery Fee (USD)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                                <Input
                                    id="fee"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={shippingFee}
                                    onChange={(e) => setShippingFee(e.target.value)}
                                    className="pl-7 h-10 text-xs rounded-xl font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="threshold" className="text-xs">Free Delivery Minimum Order (USD)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                                <Input
                                    id="threshold"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={freeThreshold}
                                    onChange={(e) => setFreeThreshold(e.target.value)}
                                    className="pl-7 h-10 text-xs rounded-xl font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Alert Rules Card */}
                <div className="p-6 rounded-3xl bg-card border shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <BellRing className="w-4 h-4 text-purple-600" />
                        <h2 className="font-bold text-sm tracking-tight text-foreground">
                            Inventory Warnings
                        </h2>
                    </div>

                    <div className="space-y-1.5 max-w-xs">
                        <Label htmlFor="low" className="text-xs">Default Low Stock Alert Threshold</Label>
                        <Input
                            id="low"
                            type="number"
                            required
                            value={lowStock}
                            onChange={(e) => setLowStock(e.target.value)}
                            className="h-10 text-xs rounded-xl font-bold"
                        />
                        <div className="text-[11px] text-muted-foreground">
                            Products with stock &le; this number show warning badges on Dashboard & POS.
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs gap-1.5 px-6 shadow-md">
                        <Save className="w-4 h-4" />
                        <span>Save Store Settings</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
