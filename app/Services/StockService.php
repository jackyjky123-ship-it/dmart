<?php

namespace App\Services;

use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Increment stock and record movement.
     *
     * @param  array{reason?: string|null, user_id?: int|null, order_id?: int|null}  $meta
     */
    public function increment(Product $product, int $qty, StockMovementType $type, array $meta = []): StockMovement
    {
        return DB::transaction(function () use ($product, $qty, $type, $meta): StockMovement {
            $product->increment('stock', $qty);

            return StockMovement::create([
                'product_id' => $product->id,
                'type' => $type,
                'quantity_delta' => $qty,
                'reason' => $meta['reason'] ?? null,
                'user_id' => $meta['user_id'] ?? null,
                'order_id' => $meta['order_id'] ?? null,
            ]);
        });
    }

    /**
     * Decrement stock and record movement. Throws if insufficient stock.
     *
     * @param  array{reason?: string|null, user_id?: int|null, order_id?: int|null}  $meta
     *
     * @throws InsufficientStockException
     */
    public function decrement(Product $product, int $qty, StockMovementType $type, array $meta = []): StockMovement
    {
        return DB::transaction(function () use ($product, $qty, $type, $meta): StockMovement {
            // Re-read current stock inside transaction
            $current = (int) DB::table('products')->where('id', $product->id)->value('stock');

            if ($current < $qty) {
                throw new InsufficientStockException("Insufficient stock for product [{$product->id}]. Current: {$current}, requested: {$qty}.");
            }

            $product->decrement('stock', $qty);

            return StockMovement::create([
                'product_id' => $product->id,
                'type' => $type,
                'quantity_delta' => -$qty,
                'reason' => $meta['reason'] ?? null,
                'user_id' => $meta['user_id'] ?? null,
                'order_id' => $meta['order_id'] ?? null,
            ]);
        });
    }

    /**
     * Adjust stock by a signed delta (positive or negative) with reason and actor.
     *
     * @throws InsufficientStockException
     */
    public function adjust(Product $product, int $delta, string $reason, ?User $actor = null): StockMovement
    {
        return DB::transaction(function () use ($product, $delta, $reason, $actor): StockMovement {
            $current = (int) DB::table('products')->where('id', $product->id)->value('stock');

            if ($current + $delta < 0) {
                throw new InsufficientStockException("Adjustment would reduce stock below zero. Current: {$current}, delta: {$delta}.");
            }

            if ($delta > 0) {
                $product->increment('stock', $delta);
            } elseif ($delta < 0) {
                $product->decrement('stock', abs($delta));
            }

            return StockMovement::create([
                'product_id' => $product->id,
                'type' => StockMovementType::Adjustment,
                'quantity_delta' => $delta,
                'reason' => $reason,
                'user_id' => $actor?->id,
                'order_id' => null,
            ]);
        });
    }
}
