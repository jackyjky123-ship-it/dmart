<?php

use App\Support\MockData;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/dashboard', [
            'stats' => MockData::adminStats(),
            'recentOrders' => MockData::orders(),
        ]);
    })->name('admin.dashboard');

    Route::get('/products', function () {
        return Inertia::render('admin/products/index', [
            'products' => MockData::products(),
            'categories' => MockData::categories(),
        ]);
    })->name('admin.products.index');

    Route::get('/products/create', function () {
        return Inertia::render('admin/products/create', [
            'categories' => MockData::categories(),
        ]);
    })->name('admin.products.create');

    Route::get('/categories', function () {
        return Inertia::render('admin/categories/index', [
            'categories' => MockData::categories(),
        ]);
    })->name('admin.categories.index');

    Route::get('/orders', function () {
        return Inertia::render('admin/orders/index', [
            'orders' => MockData::orders(),
        ]);
    })->name('admin.orders.index');

    Route::get('/orders/{order}', function (string $orderId) {
        $orders = MockData::orders();
        $order = collect($orders)->firstWhere('id', (int) $orderId) ?? $orders[2];

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    })->name('admin.orders.show');

    Route::get('/stock', function () {
        return Inertia::render('admin/stock/index', [
            'products' => MockData::products(),
        ]);
    })->name('admin.stock.index');

    Route::get('/staff', function () {
        return Inertia::render('admin/staff/index', [
            'staff' => MockData::staff(),
        ]);
    })->name('admin.staff.index');

    Route::get('/settings', function () {
        return Inertia::render('admin/settings', [
            'settings' => MockData::settings(),
        ]);
    })->name('admin.settings.edit');
});
