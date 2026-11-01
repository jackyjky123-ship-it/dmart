<?php

use App\Support\MockData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('storefront/home', [
        'categories' => MockData::categories(),
        'featuredProducts' => MockData::products(),
    ]);
})->name('home');

Route::get('/products', function (Request $request) {
    return Inertia::render('storefront/products/index', [
        'products' => MockData::products(),
        'categories' => MockData::categories(),
        'initialCategory' => $request->query('category', 'all'),
        'initialSearch' => $request->query('q', ''),
    ]);
})->name('products.index');

Route::get('/products/{slug}', function (string $slug) {
    $products = MockData::products();
    $product = collect($products)->firstWhere('slug', $slug) ?? $products[0];
    $related = collect($products)
        ->where('category_name', $product['category_name'])
        ->where('id', '!==', $product['id'])
        ->take(4)
        ->values()
        ->all();

    return Inertia::render('storefront/products/show', [
        'product' => $product,
        'relatedProducts' => $related,
    ]);
})->name('products.show');

Route::get('/cart', function () {
    return Inertia::render('storefront/cart');
})->name('cart.index');

Route::get('/checkout', function () {
    return Inertia::render('storefront/checkout');
})->name('checkout.index');

Route::get('/payment/{order}', function (string $orderId) {
    $orders = MockData::orders();
    $order = collect($orders)->firstWhere('id', (int) $orderId) ?? $orders[4];

    return Inertia::render('storefront/payment', [
        'order' => $order,
    ]);
})->name('payment.show');

Route::get('/orders', function () {
    return Inertia::render('storefront/orders/index', [
        'orders' => MockData::orders(),
    ]);
})->name('orders.index');

Route::get('/orders/{order}', function (string $orderId) {
    $orders = MockData::orders();
    $order = collect($orders)->firstWhere('id', (int) $orderId) ?? $orders[1];

    return Inertia::render('storefront/orders/show', [
        'order' => $order,
    ]);
})->name('orders.show');
