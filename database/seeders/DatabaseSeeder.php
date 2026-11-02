<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin account
        User::updateOrCreate(
            ['email' => 'admin@dmart.test'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => UserRole::Admin,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Cashier account
        User::updateOrCreate(
            ['email' => 'cashier@dmart.test'],
            [
                'name' => 'Cashier User',
                'password' => Hash::make('password'),
                'role' => UserRole::Cashier,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 3. Customer account
        User::updateOrCreate(
            ['email' => 'customer@dmart.test'],
            [
                'name' => 'Customer User',
                'password' => Hash::make('password'),
                'role' => UserRole::Customer,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
