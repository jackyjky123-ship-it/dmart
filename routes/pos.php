<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('pos')
    ->middleware(['auth', 'active', 'role:cashier'])
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('pos/index', [
                'products' => [],
                'categories' => [],
            ]);
        })->name('pos.index');

        Route::get('/sales', function () {
            return Inertia::render('pos/sales/index', [
                'sales' => [],
            ]);
        })->name('pos.sales.index');
    });
