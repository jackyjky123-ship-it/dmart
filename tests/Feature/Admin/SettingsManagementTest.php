<?php

use App\Models\Setting;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests and customers cannot access admin settings', function () {
    $this->get('/admin/settings')->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get('/admin/settings')->assertForbidden();
});

test('admin can view settings with existing values or defaults', function () {
    $admin = User::factory()->admin()->create();

    Setting::setValue('store_name', 'DMart Toul Kork');
    Setting::setValue('shipping_fee_cents', 250);

    $response = $this->actingAs($admin)->get('/admin/settings');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings')
            ->where('settings.store_name', 'DMart Toul Kork')
            ->where('settings.shipping_fee_cents', 250)
        );
});

test('admin can update store parameters and delivery thresholds', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch('/admin/settings', [
        'store_name' => 'DMart Express Phnom Penh',
        'store_address' => 'Street 2004, Sen Sok, Phnom Penh',
        'store_phone' => '+855 12 345 678',
        'shipping_fee' => '2.50',
        'free_shipping_threshold' => '40.00',
        'low_stock_threshold' => 8,
    ]);

    $response->assertRedirect();

    expect(Setting::getValue('store_name'))->toBe('DMart Express Phnom Penh')
        ->and(Setting::getValue('store_address'))->toBe('Street 2004, Sen Sok, Phnom Penh')
        ->and(Setting::getValue('store_phone'))->toBe('+855 12 345 678')
        ->and((int) Setting::getValue('shipping_fee_cents'))->toBe(250)
        ->and((int) Setting::getValue('free_shipping_threshold_cents'))->toBe(4000)
        ->and((int) Setting::getValue('low_stock_threshold'))->toBe(8);
});
