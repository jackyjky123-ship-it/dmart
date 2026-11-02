<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Core accounts and demo customer accounts
        $this->call(DemoUserSeeder::class);

        // 2. Default store parameters and settings
        $this->call(DemoSettingsSeeder::class);

        // 3. Demo streetwear catalog with active categories and products
        $this->call(DemoCatalogSeeder::class);

        // 4. Sample orders across 30 days with payments and stock movements
        $this->call(DemoOrderSeeder::class);
    }
}
