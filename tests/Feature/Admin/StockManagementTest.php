<?php

use App\Enums\StockMovementType;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests and customers cannot access admin stock ledger', function () {
    $this->get('/admin/stock')->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get('/admin/stock')->assertForbidden();
});

test('admin can view stock management and ledger history', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Farm Fresh Milk',
        'stock' => 12,
        'low_stock_threshold' => 5,
    ]);

    StockMovement::factory()->create([
        'product_id' => $product->id,
        'type' => StockMovementType::Restock,
        'quantity_delta' => 12,
        'reason' => 'Initial delivery',
        'user_id' => $admin->id,
    ]);

    $response = $this->actingAs($admin)->get('/admin/stock');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/stock/index')
            ->has('products', 1)
            ->where('products.0.name', 'Farm Fresh Milk')
            ->has('movements', 1)
            ->where('movements.0.reason', 'Initial delivery')
        );
});

test('admin can adjust stock positively or negatively with an audit reason', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 20,
    ]);

    $response = $this->actingAs($admin)->post("/admin/products/{$product->id}/stock", [
        'delta' => -4,
        'reason' => 'Damaged carton during restock',
    ]);

    $response->assertRedirect();
    expect($product->fresh()->stock)->toBe(16);

    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => StockMovementType::Adjustment->value,
        'quantity_delta' => -4,
        'reason' => 'Damaged carton during restock',
        'user_id' => $admin->id,
    ]);
});

test('admin cannot adjust stock below zero', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 5,
    ]);

    $response = $this->actingAs($admin)->post("/admin/products/{$product->id}/stock", [
        'delta' => -10,
        'reason' => 'Counting error',
    ]);

    $response->assertSessionHasErrors('delta');
    expect($product->fresh()->stock)->toBe(5);
});
