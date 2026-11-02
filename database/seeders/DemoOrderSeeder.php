<?php

namespace Database\Seeders;

use App\Enums\OrderChannel;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\StockMovementType;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoOrderSeeder extends Seeder
{
    /**
     * Seed ~30 realistic orders across 30 days with payments and stock ledger entries.
     */
    public function run(): void
    {
        $products = Product::query()->where('is_active', true)->get();

        if ($products->isEmpty() || Order::query()->count() >= 30) {
            return;
        }

        $cashier = User::query()->where('role', UserRole::Cashier)->first();
        $customers = User::query()->where('role', UserRole::Customer)->get();
        $primaryCustomer = $customers->first();

        $maxId = (int) (Order::query()->max('id') ?? 0);
        $sequence = $maxId + 1001;

        // Preset 32 orders: mix of days ago (0 to 28), hours (9 to 15), channel, and status
        $orderTemplates = [
            // Today (Day 0)
            ['days_ago' => 0, 'hour' => 10, 'minute' => 15, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],
            ['days_ago' => 0, 'hour' => 12, 'minute' => 30, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Paid, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 0, 'hour' => 14, 'minute' => 45, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Khqr],

            // Yesterday (Day 1)
            ['days_ago' => 1, 'hour' => 9, 'minute' => 20, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Processing, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 1, 'hour' => 11, 'minute' => 40, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],
            ['days_ago' => 1, 'hour' => 13, 'minute' => 10, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Paid, 'method' => PaymentMethod::Khqr],

            // Day 2
            ['days_ago' => 2, 'hour' => 10, 'minute' => 50, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Shipped, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 2, 'hour' => 14, 'minute' => 15, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],

            // Day 3
            ['days_ago' => 3, 'hour' => 11, 'minute' => 10, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Shipped, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 3, 'hour' => 13, 'minute' => 35, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 3, 'hour' => 15, 'minute' => 0, 'channel' => OrderChannel::Online, 'status' => OrderStatus::PendingPayment, 'method' => PaymentMethod::Khqr],

            // Day 4
            ['days_ago' => 4, 'hour' => 9, 'minute' => 45, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],
            ['days_ago' => 4, 'hour' => 12, 'minute' => 15, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],

            // Day 5
            ['days_ago' => 5, 'hour' => 10, 'minute' => 30, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 5, 'hour' => 14, 'minute' => 20, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],

            // Day 6
            ['days_ago' => 6, 'hour' => 11, 'minute' => 15, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 6, 'hour' => 13, 'minute' => 50, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 6, 'hour' => 15, 'minute' => 10, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Cancelled, 'method' => PaymentMethod::Khqr],

            // Older orders (Days 8 to 28)
            ['days_ago' => 8, 'hour' => 10, 'minute' => 0, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 9, 'hour' => 12, 'minute' => 25, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],
            ['days_ago' => 11, 'hour' => 14, 'minute' => 10, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 13, 'hour' => 9, 'minute' => 30, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],
            ['days_ago' => 15, 'hour' => 11, 'minute' => 45, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 17, 'hour' => 13, 'minute' => 20, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 19, 'hour' => 10, 'minute' => 15, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 21, 'hour' => 12, 'minute' => 40, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],
            ['days_ago' => 23, 'hour' => 14, 'minute' => 30, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 25, 'hour' => 9, 'minute' => 50, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash],
            ['days_ago' => 26, 'hour' => 11, 'minute' => 20, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 27, 'hour' => 13, 'minute' => 10, 'channel' => OrderChannel::Pos, 'status' => OrderStatus::Completed, 'method' => PaymentMethod::Khqr],
            ['days_ago' => 28, 'hour' => 15, 'minute' => 5, 'channel' => OrderChannel::Online, 'status' => OrderStatus::Delivered, 'method' => PaymentMethod::Khqr],
        ];

        $sequence = 1001;

        DB::transaction(function () use ($orderTemplates, $products, $customers, $primaryCustomer, $cashier, &$sequence): void {
            foreach ($orderTemplates as $index => $tpl) {
                $createdAt = Carbon::now()
                    ->subDays($tpl['days_ago'])
                    ->setTime($tpl['hour'], $tpl['minute'], 0);

                $orderNumber = 'DM-'.str_pad((string) $sequence++, 6, '0', STR_PAD_LEFT);
                $isOnline = $tpl['channel'] === OrderChannel::Online;

                // Pick 1 to 3 items
                $itemCount = ($index % 3) + 1;
                $selectedProducts = $products->random(min($itemCount, $products->count()));

                $subtotalCents = 0;
                $itemsData = [];

                foreach ($selectedProducts as $pIdx => $product) {
                    $qty = (($index + $pIdx) % 2) + 1;
                    $lineTotal = $product->price_cents * $qty;
                    $subtotalCents += $lineTotal;

                    $itemsData[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'unit_price_cents' => $product->price_cents,
                        'quantity' => $qty,
                        'line_total_cents' => $lineTotal,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ];
                }

                $shippingFeeCents = ($isOnline && $subtotalCents < 3500) ? 200 : 0;
                $totalCents = $subtotalCents + $shippingFeeCents;

                // POS Cash calculation
                $cashTenderedCents = null;
                $changeCents = null;
                if ($tpl['channel'] === OrderChannel::Pos && $tpl['method'] === PaymentMethod::Cash) {
                    // Round up to nearest $10 or $20 in cents
                    $cashTenderedCents = (int) (ceil($totalCents / 1000) * 1000);
                    if ($cashTenderedCents < $totalCents) {
                        $cashTenderedCents += 1000;
                    }
                    $changeCents = $cashTenderedCents - $totalCents;
                }

                // Customer selection
                $customer = $customers->isNotEmpty()
                    ? $customers->get($index % $customers->count())
                    : $primaryCustomer;

                $shippingName = $isOnline ? ($customer?->name ?? 'Walk-in Customer') : null;
                $shippingPhone = $isOnline ? '+855 12 '.str_pad((string) (300000 + $index), 6, '0', STR_PAD_LEFT) : null;
                $shippingAddress = $isOnline ? '#'.($index + 12).' Samdach Sothearos Blvd, Sangkat Tonle Bassac' : null;
                $shippingCity = $isOnline ? 'Phnom Penh' : null;

                $trackingNumber = in_array($tpl['status'], [OrderStatus::Shipped, OrderStatus::Delivered], true)
                    ? 'TRK'.strtoupper(Str::random(10))
                    : null;
                $carrier = $trackingNumber ? 'J&T Express' : null;

                /** @var Order $order */
                $order = Order::create([
                    'order_number' => $orderNumber,
                    'user_id' => $isOnline ? $customer?->id : null,
                    'channel' => $tpl['channel'],
                    'status' => $tpl['status'],
                    'payment_method' => $tpl['method'],
                    'cashier_id' => $tpl['channel'] === OrderChannel::Pos ? $cashier?->id : null,
                    'subtotal_cents' => $subtotalCents,
                    'shipping_fee_cents' => $shippingFeeCents,
                    'total_cents' => $totalCents,
                    'cash_tendered_cents' => $cashTenderedCents,
                    'change_cents' => $changeCents,
                    'shipping_name' => $shippingName,
                    'shipping_phone' => $shippingPhone,
                    'shipping_address' => $shippingAddress,
                    'shipping_city' => $shippingCity,
                    'shipping_notes' => $isOnline && $index % 4 === 0 ? 'Please call upon arrival.' : null,
                    'tracking_number' => $trackingNumber,
                    'carrier' => $carrier,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                foreach ($itemsData as $itemData) {
                    $order->items()->create($itemData);
                }

                // Create Payment for non-pending orders
                $isPaidOrder = in_array($tpl['status'], [
                    OrderStatus::Paid,
                    OrderStatus::Processing,
                    OrderStatus::Shipped,
                    OrderStatus::Delivered,
                    OrderStatus::Completed,
                ], true);

                if ($isPaidOrder || $tpl['status'] === OrderStatus::Cancelled) {
                    $provider = match ($tpl['method']) {
                        PaymentMethod::Khqr => $isOnline ? 'mock-khqr' : 'pos-khqr',
                        PaymentMethod::Cash => 'pos-cash',
                    };

                    Payment::create([
                        'order_id' => $order->id,
                        'provider' => $provider,
                        'method' => $tpl['method'],
                        'reference' => 'PAY-'.strtoupper(Str::random(10)),
                        'amount_cents' => $totalCents,
                        'status' => PaymentStatus::Paid,
                        'payload' => [
                            'channel' => $tpl['channel']->value,
                            'order_number' => $orderNumber,
                        ],
                        'paid_at' => $createdAt->copy()->addMinutes(2),
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    // Record stock movement
                    foreach ($itemsData as $item) {
                        StockMovement::create([
                            'product_id' => $item['product_id'],
                            'type' => StockMovementType::Sale,
                            'quantity_delta' => -$item['quantity'],
                            'reason' => 'Sale: '.$orderNumber,
                            'user_id' => $order->user_id ?? $order->cashier_id,
                            'order_id' => $order->id,
                            'created_at' => $createdAt,
                            'updated_at' => $createdAt,
                        ]);

                        if ($tpl['status'] === OrderStatus::Cancelled) {
                            StockMovement::create([
                                'product_id' => $item['product_id'],
                                'type' => StockMovementType::Return,
                                'quantity_delta' => $item['quantity'],
                                'reason' => 'Order cancelled: '.$orderNumber,
                                'user_id' => $order->user_id ?? $order->cashier_id,
                                'order_id' => $order->id,
                                'created_at' => $createdAt->copy()->addHours(1),
                                'updated_at' => $createdAt->copy()->addHours(1),
                            ]);
                        }
                    }
                }
            }
        });
    }
}
