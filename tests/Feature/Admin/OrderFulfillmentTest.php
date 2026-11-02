<?php

use App\Enums\OrderStatus;
use App\Enums\StockMovementType;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests, customers, and cashiers cannot access admin orders', function () {
    $this->get('/admin/orders')->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get('/admin/orders')->assertForbidden();

    $cashier = User::factory()->cashier()->create();
    $this->actingAs($cashier)->get('/admin/orders')->assertForbidden();
});

test('admin can view all orders with status and channel filters', function () {
    $admin = User::factory()->admin()->create();

    Order::factory()->online()->create(['status' => OrderStatus::Paid]);
    Order::factory()->pos()->create(['status' => OrderStatus::Completed]);

    $this->actingAs($admin)->get('/admin/orders')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->has('orders', 2)
        );

    $this->actingAs($admin)->get('/admin/orders?channel=pos')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->has('orders', 1)
        );
});

test('admin can view order details', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    $this->actingAs($admin)->get("/admin/orders/{$order->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.id', $order->id)
        );
});

test('admin can update order status and fulfillment tracking', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->paid()->create();

    // 1. Advance to Processing
    $this->actingAs($admin)->patch("/admin/orders/{$order->id}", [
        'status' => OrderStatus::Processing->value,
    ])->assertRedirect();
    expect($order->fresh()->status)->toBe(OrderStatus::Processing);

    // 2. Advance to Shipped with tracking number
    $this->actingAs($admin)->patch("/admin/orders/{$order->id}", [
        'status' => OrderStatus::Shipped->value,
        'carrier' => 'J&T Express',
        'tracking_number' => 'JT123456789',
    ])->assertRedirect();

    expect($order->fresh()->status)->toBe(OrderStatus::Shipped)
        ->and($order->fresh()->carrier)->toBe('J&T Express')
        ->and($order->fresh()->tracking_number)->toBe('JT123456789')
        ->and($order->fresh()->shipped_at)->not->toBeNull();

    // 3. Advance to Delivered
    $this->actingAs($admin)->patch("/admin/orders/{$order->id}", [
        'status' => OrderStatus::Delivered->value,
        'carrier' => 'J&T Express',
        'tracking_number' => 'JT123456789',
    ])->assertRedirect();

    expect($order->fresh()->status)->toBe(OrderStatus::Delivered)
        ->and($order->fresh()->delivered_at)->not->toBeNull();
});

test('admin can cancel order which restocks product inventory', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create(['stock' => 10]);
    $order = Order::factory()->paid()->create();
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/cancel");

    $response->assertRedirect();
    expect($order->fresh()->status)->toBe(OrderStatus::Cancelled)
        ->and($product->fresh()->stock)->toBe(13); // 10 + 3 restored

    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => StockMovementType::Return->value,
        'quantity_delta' => 3,
    ]);
});

test('admin cannot reopen a cancelled order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->cancelled()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}", [
        'status' => OrderStatus::Processing->value,
    ]);

    $response->assertSessionHasErrors('status');
    expect($order->fresh()->status)->toBe(OrderStatus::Cancelled);
});
