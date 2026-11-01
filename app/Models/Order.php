<?php

namespace App\Models;

use App\Enums\OrderChannel;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $order_number
 * @property int|null $user_id
 * @property OrderChannel $channel
 * @property OrderStatus $status
 * @property PaymentMethod|null $payment_method
 * @property int|null $cashier_id
 * @property int $subtotal_cents
 * @property int $shipping_fee_cents
 * @property int $total_cents
 * @property int|null $cash_tendered_cents
 * @property int|null $change_cents
 * @property string|null $shipping_name
 * @property string|null $shipping_phone
 * @property string|null $shipping_address
 * @property string|null $shipping_city
 * @property string|null $shipping_notes
 * @property string|null $tracking_number
 * @property string|null $carrier
 * @property Carbon|null $paid_at
 * @property Carbon|null $shipped_at
 * @property Carbon|null $delivered_at
 * @property Carbon|null $cancelled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'order_number',
    'user_id',
    'channel',
    'status',
    'payment_method',
    'cashier_id',
    'subtotal_cents',
    'shipping_fee_cents',
    'total_cents',
    'cash_tendered_cents',
    'change_cents',
    'shipping_name',
    'shipping_phone',
    'shipping_address',
    'shipping_city',
    'shipping_notes',
    'tracking_number',
    'carrier',
    'paid_at',
    'shipped_at',
    'delivered_at',
    'cancelled_at',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'channel' => OrderChannel::class,
            'status' => OrderStatus::class,
            'payment_method' => PaymentMethod::class,
            'subtotal_cents' => 'integer',
            'shipping_fee_cents' => 'integer',
            'total_cents' => 'integer',
            'cash_tendered_cents' => 'integer',
            'change_cents' => 'integer',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
