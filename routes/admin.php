<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StockController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'active', 'role:admin'])
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/dashboard', [
                'stats' => [],
                'recentOrders' => [],
            ]);
        })->name('dashboard');

        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::resource('products', ProductController::class)->except(['show']);
        Route::post('products/{product}/images', [ProductImageController::class, 'store'])->name('products.images.store');
        Route::patch('products/{product}/images/{image}/primary', [ProductImageController::class, 'primary'])->name('products.images.primary');
        Route::delete('products/{product}/images/{image}', [ProductImageController::class, 'destroy'])->name('products.images.destroy');

        Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
        Route::post('/products/{product}/stock', [StockController::class, 'store'])->name('stock.store');

        Route::get('/orders', function () {
            return Inertia::render('admin/orders/index', [
                'orders' => [],
            ]);
        })->name('orders.index');

        Route::get('/orders/{order}', function (string $orderId) {
            return Inertia::render('admin/orders/show', [
                'order' => null,
            ]);
        })->name('orders.show');

        Route::get('/staff', function () {
            return Inertia::render('admin/staff/index', [
                'staff' => [],
            ]);
        })->name('staff.index');

        Route::get('/settings', [SettingController::class, 'edit'])->name('settings.edit');
        Route::patch('/settings', [SettingController::class, 'update'])->name('settings.update');
    });
