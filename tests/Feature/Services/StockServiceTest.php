<?php

use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Services\StockService;

test('it can increment product stock and record movement', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
    ]);

    $service = new StockService;
    $movement = $service->increment($product, 5, StockMovementType::Restock, [
        'reason' => 'Shipment arrived',
    ]);

    expect($product->fresh()->stock)->toBe(15)
        ->and($movement->quantity_delta)->toBe(5)
        ->and($movement->type)->toBe(StockMovementType::Restock)
        ->and($movement->reason)->toBe('Shipment arrived');
});

test('it can decrement product stock and record movement', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
    ]);

    $service = new StockService;
    $movement = $service->decrement($product, 4, StockMovementType::Sale, [
        'reason' => 'Online sale',
    ]);

    expect($product->fresh()->stock)->toBe(6)
        ->and($movement->quantity_delta)->toBe(-4)
        ->and($movement->type)->toBe(StockMovementType::Sale)
        ->and($movement->reason)->toBe('Online sale');
});

test('it throws InsufficientStockException when decrementing below zero', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 3,
    ]);

    $service = new StockService;

    expect(fn () => $service->decrement($product, 5, StockMovementType::Sale))
        ->toThrow(InsufficientStockException::class);

    expect($product->fresh()->stock)->toBe(3);
});

test('it can adjust stock positively or negatively with an actor', function () {
    $category = Category::factory()->create();
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
    ]);

    $service = new StockService;
    $movement = $service->adjust($product, -3, 'Inventory audit shrinkage', $admin);

    expect($product->fresh()->stock)->toBe(7)
        ->and($movement->quantity_delta)->toBe(-3)
        ->and($movement->type)->toBe(StockMovementType::Adjustment)
        ->and($movement->reason)->toBe('Inventory audit shrinkage')
        ->and($movement->user_id)->toBe($admin->id);
});

test('it throws InsufficientStockException when adjustment reduces stock below zero', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 2,
    ]);

    $service = new StockService;

    expect(fn () => $service->adjust($product, -5, 'Adjustment'))
        ->toThrow(InsufficientStockException::class);

    expect($product->fresh()->stock)->toBe(2);
});

test('it rejects non-positive increment and decrement quantities', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
    ]);

    $service = new StockService;

    expect(fn () => $service->increment($product, 0, StockMovementType::Restock))
        ->toThrow(InvalidArgumentException::class)
        ->and(fn () => $service->increment($product, -1, StockMovementType::Restock))
        ->toThrow(InvalidArgumentException::class)
        ->and(fn () => $service->decrement($product, 0, StockMovementType::Sale))
        ->toThrow(InvalidArgumentException::class)
        ->and(fn () => $service->decrement($product, -1, StockMovementType::Sale))
        ->toThrow(InvalidArgumentException::class);

    expect($product->fresh()->stock)->toBe(10)
        ->and($product->movements()->count())->toBe(0);
});

test('it rejects a zero stock adjustment', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
    ]);

    $service = new StockService;

    expect(fn () => $service->adjust($product, 0, 'No change'))
        ->toThrow(InvalidArgumentException::class);

    expect($product->fresh()->stock)->toBe(10)
        ->and($product->movements()->count())->toBe(0);
});

test('decrement uses the database stock rather than a stale model value', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
    ]);

    Product::query()->whereKey($product->id)->update(['stock' => 2]);

    $service = new StockService;

    expect(fn () => $service->decrement($product, 5, StockMovementType::Sale))
        ->toThrow(InsufficientStockException::class);

    expect($product->fresh()->stock)->toBe(2)
        ->and($product->movements()->count())->toBe(0);
});
