<?php

use App\Enums\OrderChannel;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\StockMovementType;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when accessing checkout', function () {
    $this->get(route('checkout.index'))->assertRedirect(route('login'));
});

test('authenticated customers can view checkout page', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)->get(route('checkout.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('storefront/checkout'));
});

test('customer can place an order with valid items and shipping information', function () {
    $customer = User::factory()->create();
    $product = Product::factory()->create(['price_cents' => 2000, 'stock' => 10, 'is_active' => true]);

    $response = $this->actingAs($customer)->post(route('checkout.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 2],
        ],
        'shipping_name' => 'John Doe',
        'shipping_phone' => '+855 12 345 678',
        'shipping_address' => 'House 123, Street 456',
        'shipping_city' => 'Phnom Penh',
        'shipping_notes' => 'Leave at the front gate',
        'payment_method' => PaymentMethod::Khqr->value,
    ]);

    $order = Order::where('user_id', $customer->id)->latest('id')->first();

    expect($order)->not->toBeNull()
        ->and($order->channel)->toBe(OrderChannel::Online)
        ->and($order->status)->toBe(OrderStatus::PendingPayment)
        ->and($order->subtotal_cents)->toBe(4000)
        ->and($order->shipping_fee_cents)->toBe(0) // Free shipping above $35.00
        ->and($order->total_cents)->toBe(4000)
        ->and($order->shipping_name)->toBe('John Doe')
        ->and($product->fresh()->stock)->toBe(8); // Stock decremented immediately

    $response->assertRedirect(route('payment.show', $order));

    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'line_total_cents' => 4000,
    ]);

    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => StockMovementType::Sale->value,
        'quantity_delta' => -2,
    ]);
});

test('flat shipping fee of $2.00 is charged when subtotal is below $35.00', function () {
    $customer = User::factory()->create();
    $product = Product::factory()->create(['price_cents' => 2500, 'stock' => 10, 'is_active' => true]);

    $this->actingAs($customer)->post(route('checkout.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 1],
        ],
        'shipping_name' => 'Jane Smith',
        'shipping_phone' => '+855 98 765 432',
        'shipping_address' => 'Condo B, BKK1',
        'shipping_city' => 'Phnom Penh',
        'payment_method' => PaymentMethod::Cash->value,
    ]);

    $order = Order::where('user_id', $customer->id)->latest('id')->first();

    expect($order->subtotal_cents)->toBe(2500)
        ->and($order->shipping_fee_cents)->toBe(200)
        ->and($order->total_cents)->toBe(2700);
});

test('order placement fails when requested quantity exceeds available stock', function () {
    $customer = User::factory()->create();
    $product = Product::factory()->create(['price_cents' => 2000, 'stock' => 2, 'is_active' => true]);

    $response = $this->actingAs($customer)->post(route('checkout.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 5],
        ],
        'shipping_name' => 'John Doe',
        'shipping_phone' => '+855 12 345 678',
        'shipping_address' => 'House 123',
        'shipping_city' => 'Phnom Penh',
        'payment_method' => PaymentMethod::Khqr->value,
    ]);

    $response->assertSessionHasErrors('items');
    expect(Order::count())->toBe(0)
        ->and($product->fresh()->stock)->toBe(2);
});

test('customer can view demo payment page for their pending order', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $customer->id,
        'status' => OrderStatus::PendingPayment,
        'payment_method' => PaymentMethod::Khqr,
    ]);

    $this->actingAs($customer)->get(route('payment.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('storefront/payment')
            ->where('order.id', $order->id)
        );
});

test('customer cannot view another customer payment page', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $otherCustomer->id,
        'status' => OrderStatus::PendingPayment,
        'payment_method' => PaymentMethod::Khqr,
    ]);

    $this->actingAs($customer)->get(route('payment.show', $order))
        ->assertNotFound();
});

test('simulating payment success transitions order and payment to paid', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $customer->id,
        'status' => OrderStatus::PendingPayment,
        'payment_method' => PaymentMethod::Khqr,
    ]);
    Payment::factory()->create([
        'order_id' => $order->id,
        'status' => PaymentStatus::Pending,
        'method' => PaymentMethod::Khqr,
    ]);

    $response = $this->actingAs($customer)->post(route('payment.simulate', $order), [
        'outcome' => 'success',
    ]);

    $response->assertRedirect(route('payment.show', $order));
    expect($order->fresh()->status)->toBe(OrderStatus::Paid);

    $payment = $order->payments()->first();
    expect($payment->status)->toBe(PaymentStatus::Paid)
        ->and($payment->paid_at)->not->toBeNull();
});

test('simulating payment failure marks payment failed and keeps order pending', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $customer->id,
        'status' => OrderStatus::PendingPayment,
        'payment_method' => PaymentMethod::Khqr,
    ]);
    Payment::factory()->create([
        'order_id' => $order->id,
        'status' => PaymentStatus::Pending,
        'method' => PaymentMethod::Khqr,
    ]);

    $this->actingAs($customer)->post(route('payment.simulate', $order), [
        'outcome' => 'failure',
    ]);

    expect($order->fresh()->status)->toBe(OrderStatus::PendingPayment)
        ->and($order->payments()->first()->status)->toBe(PaymentStatus::Failed);
});

test('customer can view their order history and order details', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $customer->id]);

    $this->actingAs($customer)->get(route('orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('storefront/orders/index')
            ->has('orders', 1)
        );

    $this->actingAs($customer)->get(route('orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('storefront/orders/show')
            ->where('order.id', $order->id)
        );
});

test('customer cannot view another customer order detail', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherCustomer->id]);

    $this->actingAs($customer)->get(route('orders.show', $order))
        ->assertNotFound();
});

test('customer can cancel pending order which restocks products', function () {
    $customer = User::factory()->create();
    $product = Product::factory()->create(['stock' => 5]);
    $order = Order::factory()->create([
        'user_id' => $customer->id,
        'status' => OrderStatus::PendingPayment,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($customer)->post(route('orders.cancel', $order));

    $response->assertRedirect(route('orders.index'));
    expect($order->fresh()->status)->toBe(OrderStatus::Cancelled)
        ->and($product->fresh()->stock)->toBe(7); // 5 + 2 restored

    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => StockMovementType::Return->value,
        'quantity_delta' => 2,
    ]);
});
