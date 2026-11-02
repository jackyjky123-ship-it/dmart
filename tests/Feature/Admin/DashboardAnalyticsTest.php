<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests, customers, and cashiers cannot access admin dashboard', function () {
    $this->get('/admin')->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get('/admin')->assertForbidden();

    $cashier = User::factory()->cashier()->create();
    $this->actingAs($cashier)->get('/admin')->assertForbidden();
});

test('admin dashboard calculates kpi stats and revenue correctly', function () {
    $admin = User::factory()->admin()->create();
    $customers = User::factory()->count(3)->create(); // 3 customers

    // Low stock product
    Product::factory()->create(['stock' => 2, 'low_stock_threshold' => 5, 'is_active' => true]);
    Product::factory()->create(['stock' => 20, 'low_stock_threshold' => 5, 'is_active' => true]);

    // Orders attached to existing customers
    Order::factory()->paid()->create(['user_id' => $customers[0]->id, 'total_cents' => 5000]);
    Order::factory()->delivered()->create(['user_id' => $customers[1]->id, 'total_cents' => 7000]);
    Order::factory()->create(['user_id' => $customers[2]->id, 'status' => OrderStatus::PendingPayment, 'total_cents' => 3000]);

    $this->actingAs($admin)->get('/admin')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.revenue_cents', 12000) // 5000 + 7000
            ->where('stats.order_count', 3)
            ->where('stats.paid_order_count', 2)
            ->where('stats.pending_order_count', 2) // PendingPayment + Paid
            ->where('stats.customer_count', 3)
            ->where('stats.low_stock_count', 1)
        );
});

test('admin dashboard provides seven-day sales series and top products', function () {
    $admin = User::factory()->admin()->create();

    $product = Product::factory()->create(['name' => 'Signature Hoodie', 'sku' => 'HD-SIG-01']);

    $order = Order::factory()->paid()->create([
        'total_cents' => 9000,
        'created_at' => now(),
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'product_sku' => $product->sku,
        'quantity' => 2,
        'line_total_cents' => 9000,
    ]);

    $this->actingAs($admin)->get('/admin')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('salesByDay', 7)
            ->has('topProducts', 1)
            ->where('topProducts.0.name', 'Signature Hoodie')
            ->where('topProducts.0.units_sold', 2)
            ->where('topProducts.0.revenue_cents', 9000)
            ->has('ordersByHour.days', 7)
            ->has('ordersByHour.hours', 7)
        );
});
