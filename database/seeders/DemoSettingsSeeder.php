<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class DemoSettingsSeeder extends Seeder
{
    /**
     * Seed store settings and operational thresholds.
     */
    public function run(): void
    {
        $settings = [
            'store_name' => 'DMart Streetwear & Mini-Mart',
            'store_address' => '#24 Samdach Penn Nouth St (214), Phnom Penh',
            'store_phone' => '+855 23 888 999',
            'shipping_fee_cents' => '200',
            'free_shipping_threshold_cents' => '3500',
            'low_stock_threshold' => '5',
        ];

        foreach ($settings as $key => $value) {
            Setting::setValue($key, $value);
        }
    }
}
