<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Show the store settings form.
     */
    public function edit(): Response
    {
        $settings = [
            'store_name' => Setting::getValue('store_name', 'DMart Grocery & Mini-Mart'),
            'store_address' => Setting::getValue('store_address', '#24 Samdach Penn Nouth St (214), Phnom Penh'),
            'store_phone' => Setting::getValue('store_phone', '+855 23 888 999'),
            'shipping_fee_cents' => (int) Setting::getValue('shipping_fee_cents', 200),
            'free_shipping_threshold_cents' => (int) Setting::getValue('free_shipping_threshold_cents', 3500),
            'low_stock_threshold' => (int) Setting::getValue('low_stock_threshold', 5),
        ];

        return Inertia::render('admin/settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update store parameters and settings.
     */
    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $shippingFeeCents = Money::parse((string) $validated['shipping_fee']);
        $freeShippingThresholdCents = Money::parse((string) $validated['free_shipping_threshold']);

        Setting::setValue('store_name', $validated['store_name']);
        Setting::setValue('store_address', $validated['store_address']);
        Setting::setValue('store_phone', $validated['store_phone']);
        Setting::setValue('shipping_fee_cents', $shippingFeeCents);
        Setting::setValue('free_shipping_threshold_cents', $freeShippingThresholdCents);
        Setting::setValue('low_stock_threshold', (int) $validated['low_stock_threshold']);

        return back()->with('status', 'Store parameters and settings updated successfully.');
    }
}
