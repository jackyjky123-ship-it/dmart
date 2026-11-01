<?php

use App\Support\MockData;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('pos')->group(function () {
    Route::get('/', function () {
        return Inertia::render('pos/index', [
            'products' => MockData::products(),
            'categories' => MockData::categories(),
        ]);
    })->name('pos.index');

    Route::get('/sales', function () {
        $posSales = collect(MockData::orders())
            ->where('channel', 'pos')
            ->values()
            ->all();

        return Inertia::render('pos/sales/index', [
            'sales' => $posSales,
        ]);
    })->name('pos.sales.index');
});
