<?php

namespace App\Support;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;

final class OrderPresenter
{
    /**
     * Shape an order for list screens.
     *
     * @return array<string, mixed>
     */
    public static function summary(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'channel' => $order->channel->value,
            'status' => $order->status->value,
            'payment_method' => $order->payment_method?->value,
            'payment_status' => self::paymentStatus($order),
            'customer_name' => $order->shipping_name ?? $order->user?->name ?? 'Walk-in customer',
            'customer_phone' => $order->shipping_phone,
            'cashier_name' => $order->cashier?->name,
            'subtotal_cents' => $order->subtotal_cents,
            'shipping_fee_cents' => $order->shipping_fee_cents,
            'total_cents' => $order->total_cents,
            'cash_tendered_cents' => $order->cash_tendered_cents,
            'change_cents' => $order->change_cents,
            'item_count' => $order->items->sum('quantity'),
            'created_at' => $order->created_at?->format('M d, Y H:i'),
            'items' => $order->items
                ->map(fn (OrderItem $item): array => self::item($item))
                ->values()
                ->all(),
        ];
    }

    /**
     * Shape an order for detail screens.
     *
     * @return array<string, mixed>
     */
    public static function detail(Order $order): array
    {
        return [
            ...self::summary($order),
            'shipping_address' => $order->shipping_address,
            'shipping_city' => $order->shipping_city,
            'shipping_notes' => $order->shipping_notes,
            'tracking_number' => $order->tracking_number,
            'carrier' => $order->carrier,
            'paid_at' => $order->paid_at?->format('M d, Y H:i'),
            'shipped_at' => $order->shipped_at?->format('M d, Y H:i'),
            'delivered_at' => $order->delivered_at?->format('M d, Y H:i'),
            'cancelled_at' => $order->cancelled_at?->format('M d, Y H:i'),
            'payments' => $order->payments
                ->sortBy('id')
                ->map(fn (Payment $payment): array => [
                    'reference' => $payment->reference,
                    'method' => $payment->method->value,
                    'status' => $payment->status->value,
                    'amount_cents' => $payment->amount_cents,
                    'paid_at' => $payment->paid_at?->format('M d, Y H:i'),
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * Shape a single order line.
     *
     * @return array<string, mixed>
     */
    public static function item(OrderItem $item): array
    {
        return [
            'name' => $item->product_name,
            'sku' => $item->product_sku,
            'quantity' => $item->quantity,
            'unit_price_cents' => $item->unit_price_cents,
            'line_total_cents' => $item->line_total_cents,
        ];
    }

    private static function paymentStatus(Order $order): ?string
    {
        if (! $order->relationLoaded('payments')) {
            return null;
        }

        return $order->payments->sortByDesc('id')->first()?->status->value;
    }
}
