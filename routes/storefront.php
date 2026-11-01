<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $categories = Category::withCount('products')
        ->orderBy('name')
        ->get()
        ->map(fn ($cat) => [
            'id' => $cat->id,
            'name' => $cat->name,
            'slug' => $cat->slug,
            'description' => $cat->description ?? '',
            'product_count' => $cat->products_count,
        ]);

    $featuredProducts = Product::with(['category', 'primaryImage'])
        ->where('is_active', true)
        ->take(8)
        ->get()
        ->map(fn ($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'price_cents' => $product->price_cents,
            'compare_at_price_cents' => $product->compare_at_price_cents,
            'stock' => $product->stock,
            'unit' => 'unit',
            'category_name' => $product->category?->name ?? 'Grocery',
            'image_url' => $product->primaryImage?->path ? asset('storage/'.$product->primaryImage->path) : null,
        ]);

    return Inertia::render('storefront/home', [
        'categories' => $categories,
        'featuredProducts' => $featuredProducts,
    ]);
})->name('home');

Route::get('/products', function () {
    return Inertia::render('storefront/products/index', [
        'products' => [],
        'categories' => [],
        'initialCategory' => 'all',
        'initialSearch' => '',
    ]);
})->name('products.index');

Route::get('/products/{slug}', function (string $slug) {
    return Inertia::render('storefront/products/show', [
        'product' => null,
        'relatedProducts' => [],
    ]);
})->name('products.show');

Route::get('/cart', function () {
    return Inertia::render('storefront/cart');
})->name('cart.index');

Route::get('/checkout', function () {
    return Inertia::render('storefront/checkout');
})->name('checkout.index');

Route::get('/payment/{order}', function (string $orderId) {
    return Inertia::render('storefront/payment', [
        'order' => null,
    ]);
})->name('payment.show');

Route::get('/orders', function () {
    return Inertia::render('storefront/orders/index', [
        'orders' => [],
    ]);
})->name('orders.index');

Route::get('/orders/{order}', function (string $orderId) {
    return Inertia::render('storefront/orders/show', [
        'order' => null,
    ]);
})->name('orders.show');
