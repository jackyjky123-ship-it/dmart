<?php

use App\Http\Controllers\Pos\SaleController;
use Illuminate\Support\Facades\Route;

Route::prefix('pos')
    ->name('pos.')
    ->middleware(['auth', 'active', 'role:cashier,admin'])
    ->group(function () {
        Route::get('/', [SaleController::class, 'index'])->name('index');
        Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
        Route::get('/sales', [SaleController::class, 'sales'])->name('sales.index');
    });
