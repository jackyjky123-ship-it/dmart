<?php

use App\Enums\OrderChannel;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\StockMovementType;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests and customers cannot access pos terminal', function () {
    $this->get(route('pos.index'))->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get(route('pos.index'))->assertForbidden();
});

test('cashier can view pos terminal with active products and categories', function () {
    $cashier = User::factory()->cashier()->create();
    $category = Category::factory()->create(['name' => 'Hoodies']);
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Boxy Hoodie',
        'is_active' => true,
    ]);

    $this->actingAs($cashier)->get(route('pos.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pos/index')
            ->has('products', 1)
            ->has('categories', 1)
            ->where('cashier.name', $cashier->name)
        );
});

test('cashier can complete a cash sale with tendered and change calculation', function () {
    $cashier = User::factory()->cashier()->create();
    $product = Product::factory()->create([
        'price_cents' => 3000,
        'stock' => 10,
        'is_active' => true,
    ]);

    $response = $this->actingAs($cashier)->post(route('pos.sales.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 2],
        ],
        'payment_method' => PaymentMethod::Cash->value,
        'cash_tendered_cents' => 7000,
        'customer_name' => 'Walk-in Customer',
    ]);

    $response->assertRedirect();

    $order = Order::where('cashier_id', $cashier->id)->latest('id')->first();

    expect($order)->not->toBeNull()
        ->and($order->channel)->toBe(OrderChannel::Pos)
        ->and($order->status)->toBe(OrderStatus::Completed)
        ->and($order->subtotal_cents)->toBe(6000)
        ->and($order->shipping_fee_cents)->toBe(0)
        ->and($order->total_cents)->toBe(6000)
        ->and($order->cash_tendered_cents)->toBe(7000)
        ->and($order->change_cents)->toBe(1000)
        ->and($product->fresh()->stock)->toBe(8);

    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'line_total_cents' => 6000,
    ]);

    $this->assertDatabaseHas('payments', [
        'order_id' => $order->id,
        'method' => PaymentMethod::Cash->value,
        'amount_cents' => 6000,
        'status' => PaymentStatus::Paid->value,
    ]);

    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => StockMovementType::Sale->value,
        'quantity_delta' => -2,
    ]);
});

test('cashier can complete a qr sale', function () {
    $cashier = User::factory()->cashier()->create();
    $product = Product::factory()->create([
        'price_cents' => 4500,
        'stock' => 5,
        'is_active' => true,
    ]);

    $response = $this->actingAs($cashier)->post(route('pos.sales.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 1],
        ],
        'payment_method' => PaymentMethod::Khqr->value,
    ]);

    $response->assertRedirect();

    $order = Order::where('cashier_id', $cashier->id)->latest('id')->first();

    expect($order)->not->toBeNull()
        ->and($order->payment_method)->toBe(PaymentMethod::Khqr)
        ->and($order->status)->toBe(OrderStatus::Completed)
        ->and($order->total_cents)->toBe(4500)
        ->and($product->fresh()->stock)->toBe(4);

    $this->assertDatabaseHas('payments', [
        'order_id' => $order->id,
        'method' => PaymentMethod::Khqr->value,
        'status' => PaymentStatus::Paid->value,
    ]);
});

test('cash sale fails when cash tendered is less than total', function () {
    $cashier = User::factory()->cashier()->create();
    $product = Product::factory()->create([
        'price_cents' => 5000,
        'stock' => 5,
        'is_active' => true,
    ]);

    $response = $this->actingAs($cashier)->post(route('pos.sales.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 1],
        ],
        'payment_method' => PaymentMethod::Cash->value,
        'cash_tendered_cents' => 4000, // less than 5000
    ]);

    $response->assertSessionHasErrors('cash_tendered_cents');
    expect(Order::count())->toBe(0)
        ->and($product->fresh()->stock)->toBe(5);
});

test('pos sale fails when quantity requested exceeds stock', function () {
    $cashier = User::factory()->cashier()->create();
    $product = Product::factory()->create([
        'price_cents' => 5000,
        'stock' => 2,
        'is_active' => true,
    ]);

    $response = $this->actingAs($cashier)->post(route('pos.sales.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 5],
        ],
        'payment_method' => PaymentMethod::Cash->value,
        'cash_tendered_cents' => 25000,
    ]);

    $response->assertSessionHasErrors('items');
    expect(Order::count())->toBe(0)
        ->and($product->fresh()->stock)->toBe(2);
});

test('cashier can view own sales history scoped to their account', function () {
    $cashier = User::factory()->cashier()->create();
    $otherCashier = User::factory()->cashier()->create();

    // Create 2 sales for current cashier, 1 for other cashier
    Order::factory()->pos()->create(['cashier_id' => $cashier->id]);
    Order::factory()->pos()->create(['cashier_id' => $cashier->id]);
    Order::factory()->pos()->create(['cashier_id' => $otherCashier->id]);

    $this->actingAs($cashier)->get(route('pos.sales.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pos/sales/index')
            ->has('sales', 2)
        );
});
