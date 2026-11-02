<?php

namespace App\Services;

use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StockService
{
    /**
     * Increment stock and record movement.
     *
     * @param  array{reason?: string|null, user_id?: int|null, order_id?: int|null}  $meta
     */
    public function increment(Product $product, int $qty, StockMovementType $type, array $meta = []): StockMovement
    {
        $this->ensurePositiveQuantity($qty);

        return DB::transaction(function () use ($product, $qty, $type, $meta): StockMovement {
            Product::query()->whereKey($product->id)->increment('stock', $qty);
            $product->refresh();

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
     * The conditional UPDATE is the atomic guard. SQLite ignores row locks, so
     * the stock check must happen in the same statement that changes the row.
     *
     * @param  array{reason?: string|null, user_id?: int|null, order_id?: int|null}  $meta
     *
     * @throws InsufficientStockException
     */
    public function decrement(Product $product, int $qty, StockMovementType $type, array $meta = []): StockMovement
    {
        $this->ensurePositiveQuantity($qty);

        return DB::transaction(function () use ($product, $qty, $type, $meta): StockMovement {
            $affected = Product::query()
                ->whereKey($product->id)
                ->where('stock', '>=', $qty)
                ->decrement('stock', $qty);

            if ($affected === 0) {
                $current = (int) Product::query()->whereKey($product->id)->value('stock');

                throw new InsufficientStockException("Insufficient stock for product [{$product->id}]. Current: {$current}, requested: {$qty}.");
            }

            $product->refresh();

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
        if ($delta === 0) {
            throw new InvalidArgumentException('Stock adjustment must not be zero.');
        }

        return DB::transaction(function () use ($product, $delta, $reason, $actor): StockMovement {
            if ($delta > 0) {
                Product::query()->whereKey($product->id)->increment('stock', $delta);
            } else {
                $quantity = abs($delta);
                $affected = Product::query()
                    ->whereKey($product->id)
                    ->where('stock', '>=', $quantity)
                    ->decrement('stock', $quantity);

                if ($affected === 0) {
                    $current = (int) Product::query()->whereKey($product->id)->value('stock');

                    throw new InsufficientStockException("Adjustment would reduce stock below zero. Current: {$current}, delta: {$delta}.");
                }
            }

            $product->refresh();

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

    private function ensurePositiveQuantity(int $quantity): void
    {
        if ($quantity <= 0) {
            throw new InvalidArgumentException('Stock quantity must be greater than zero.');
        }
    }
}
