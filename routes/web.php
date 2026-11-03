<?php

use App\Enums\UserRole;
use App\Http\Controllers\LocaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('locale', [LocaleController::class, 'update'])->name('locale.update');

require __DIR__.'/storefront.php';
require __DIR__.'/pos.php';
require __DIR__.'/admin.php';

Route::get('admin/login', function (Request $request) {
    return Inertia::render('auth/login', [
        'canResetPassword' => false,
        'status' => $request->session()->get('status'),
        'portal' => 'admin',
    ]);
})->name('admin.login')->middleware('guest');

Route::get('pos/login', function (Request $request) {
    return Inertia::render('auth/login', [
        'canResetPassword' => false,
        'status' => $request->session()->get('status'),
        'portal' => 'cashier',
    ]);
})->name('pos.login')->middleware('guest');

Route::middleware(['auth', 'active'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        return match ($user->role) {
            UserRole::Admin => redirect('/admin'),
            UserRole::Cashier => redirect('/pos'),
            default => redirect('/'),
        };
    })->name('dashboard');
});

require __DIR__.'/settings.php';
