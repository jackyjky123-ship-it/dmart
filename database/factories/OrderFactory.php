<?php

namespace Database\Factories;

use App\Enums\OrderChannel;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotalCents = fake()->numberBetween(500, 50000);
        $shippingFeeCents = 200;

        return [
            'order_number' => 'DM-'.str_pad((string) fake()->unique()->numberBetween(1, 99999), 6, '0', STR_PAD_LEFT),
            'user_id' => User::factory(),
            'channel' => OrderChannel::Online,
            'status' => OrderStatus::PendingPayment,
            'payment_method' => PaymentMethod::Khqr,
            'cashier_id' => null,
            'subtotal_cents' => $subtotalCents,
            'shipping_fee_cents' => $shippingFeeCents,
            'total_cents' => $subtotalCents + $shippingFeeCents,
            'cash_tendered_cents' => null,
            'change_cents' => null,
            'shipping_name' => fake()->name(),
            'shipping_phone' => fake()->phoneNumber(),
            'shipping_address' => fake()->streetAddress(),
            'shipping_city' => fake()->city(),
            'shipping_notes' => null,
            'tracking_number' => null,
            'carrier' => null,
            'paid_at' => null,
            'shipped_at' => null,
            'delivered_at' => null,
            'cancelled_at' => null,
        ];
    }

    /**
     * Indicate that the order is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Paid,
            'paid_at' => now(),
        ]);
    }

    /**
     * Indicate that the order is processing.
     */
    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Processing,
            'paid_at' => now(),
        ]);
    }

    /**
     * Indicate that the order is shipped.
     */
    public function shipped(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Shipped,
            'paid_at' => now()->subDay(),
            'shipped_at' => now(),
            'tracking_number' => strtoupper(fake()->bothify('??########')),
            'carrier' => fake()->randomElement(['DHL', 'FedEx', 'UPS']),
        ]);
    }

    /**
     * Indicate that the order is delivered.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Delivered,
            'paid_at' => now()->subDays(3),
            'shipped_at' => now()->subDay(),
            'delivered_at' => now(),
            'tracking_number' => strtoupper(fake()->bothify('??########')),
            'carrier' => fake()->randomElement(['DHL', 'FedEx', 'UPS']),
        ]);
    }

    /**
     * Indicate that the order is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Cancelled,
            'cancelled_at' => now(),
        ]);
    }

    /**
     * Indicate that the order is a POS sale.
     */
    public function pos(): static
    {
        return $this->state(fn (array $attributes) => [
            'channel' => OrderChannel::Pos,
            'status' => OrderStatus::Completed,
            'payment_method' => PaymentMethod::Cash,
            'cashier_id' => User::factory()->cashier(),
            'shipping_fee_cents' => 0,
            'total_cents' => $attributes['subtotal_cents'] ?? 5000,
            'shipping_name' => null,
            'shipping_phone' => null,
            'shipping_address' => null,
            'shipping_city' => null,
            'paid_at' => now(),
        ]);
    }

    /**
     * Indicate that the order is an online order.
     */
    public function online(): static
    {
        return $this->state(fn (array $attributes) => [
            'channel' => OrderChannel::Online,
        ]);
    }
}
