<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    /**
     * Seed core demo accounts for each role and sample customer profiles.
     */
    public function run(): void
    {
        $users = [
            [
                'email' => 'admin@dmart.test',
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => UserRole::Admin,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'email' => 'cashier@dmart.test',
                'name' => 'Cashier User',
                'password' => Hash::make('password'),
                'role' => UserRole::Cashier,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'email' => 'customer@dmart.test',
                'name' => 'Customer User',
                'password' => Hash::make('password'),
                'role' => UserRole::Customer,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'email' => 'jacob@example.com',
                'name' => 'Jacob Jones',
                'password' => Hash::make('password'),
                'role' => UserRole::Customer,
                'is_active' => true,
                'email_verified_at' => now()->subDays(20),
            ],
            [
                'email' => 'bessie@example.com',
                'name' => 'Bessie Cooper',
                'password' => Hash::make('password'),
                'role' => UserRole::Customer,
                'is_active' => true,
                'email_verified_at' => now()->subDays(15),
            ],
            [
                'email' => 'ralph@example.com',
                'name' => 'Ralph Edwards',
                'password' => Hash::make('password'),
                'role' => UserRole::Customer,
                'is_active' => true,
                'email_verified_at' => now()->subDays(10),
            ],
            [
                'email' => 'esther@example.com',
                'name' => 'Esther Howard',
                'password' => Hash::make('password'),
                'role' => UserRole::Customer,
                'is_active' => true,
                'email_verified_at' => now()->subDays(5),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
