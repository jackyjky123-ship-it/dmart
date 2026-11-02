<?php

use App\Enums\StockMovementType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests and customers cannot access admin products', function () {
    $this->get('/admin/products')->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get('/admin/products')->assertForbidden();
});

test('admin can view products list with filters and search', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create(['name' => 'Beverages']);
    $product1 = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Organic Orange Juice',
        'sku' => 'BEV-ORJ-001',
        'is_active' => true,
    ]);
    $product2 = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Sparkling Mineral Water',
        'sku' => 'BEV-WAT-002',
        'is_active' => false,
    ]);

    $response = $this->actingAs($admin)->get('/admin/products?search=Orange');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Organic Orange Juice')
        );
});

test('admin can create a product with initial stock and movement', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post('/admin/products', [
        'name' => 'Red Apples 1kg',
        'sku' => 'APP-RED-001',
        'category_id' => $category->id,
        'price' => '3.50',
        'compare_at_price' => '4.00',
        'initial_stock' => 25,
        'low_stock_threshold' => 5,
        'description' => 'Crisp organic red apples',
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/products');

    $product = Product::where('sku', 'APP-RED-001')->first();
    expect($product)->not->toBeNull()
        ->and($product->name)->toBe('Red Apples 1kg')
        ->and($product->slug)->toBe('red-apples-1kg')
        ->and($product->price_cents)->toBe(350)
        ->and($product->compare_at_price_cents)->toBe(400)
        ->and($product->stock)->toBe(25);

    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => StockMovementType::Restock->value,
        'quantity_delta' => 25,
    ]);
});

test('admin can upload images with first image set as primary', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $image1 = UploadedFile::fake()->image('apple1.jpg', 600, 600);
    $image2 = UploadedFile::fake()->image('apple2.png', 600, 600);

    $response = $this->actingAs($admin)->post("/admin/products/{$product->id}/images", [
        'images' => [$image1, $image2],
    ]);

    $response->assertRedirect();

    $images = $product->fresh()->images;
    expect($images)->toHaveCount(2)
        ->and($images[0]->is_primary)->toBeTrue()
        ->and($images[1]->is_primary)->toBeFalse();

    Storage::disk('public')->assertExists($images[0]->path);
    Storage::disk('public')->assertExists($images[1]->path);
});

test('admin can change primary product image', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $img1 = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => true]);
    $img2 = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => false]);

    $response = $this->actingAs($admin)->patch("/admin/products/{$product->id}/images/{$img2->id}/primary");

    $response->assertRedirect();
    expect($img1->fresh()->is_primary)->toBeFalse()
        ->and($img2->fresh()->is_primary)->toBeTrue();
});

test('admin can delete product image and next image is promoted to primary', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $file1 = UploadedFile::fake()->image('test1.jpg');
    $path1 = $file1->store("products/{$product->id}", 'public');

    $file2 = UploadedFile::fake()->image('test2.jpg');
    $path2 = $file2->store("products/{$product->id}", 'public');

    $img1 = ProductImage::factory()->create([
        'product_id' => $product->id,
        'path' => $path1,
        'is_primary' => true,
        'sort_order' => 0,
    ]);
    $img2 = ProductImage::factory()->create([
        'product_id' => $product->id,
        'path' => $path2,
        'is_primary' => false,
        'sort_order' => 1,
    ]);

    $response = $this->actingAs($admin)->delete("/admin/products/{$product->id}/images/{$img1->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('product_images', ['id' => $img1->id]);
    Storage::disk('public')->assertMissing($path1);

    expect($img2->fresh()->is_primary)->toBeTrue();
});

test('admin can update a product', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Original Name',
        'price_cents' => 200,
    ]);

    $response = $this->actingAs($admin)->patch("/admin/products/{$product->id}", [
        'name' => 'Updated Name',
        'sku' => $product->sku,
        'category_id' => $category->id,
        'price' => '4.75',
        'compare_at_price' => '',
        'low_stock_threshold' => 10,
        'is_active' => false,
        'description' => 'New description',
    ]);

    $response->assertRedirect('/admin/products');
    $fresh = $product->fresh();
    expect($fresh->name)->toBe('Updated Name')
        ->and($fresh->price_cents)->toBe(475)
        ->and($fresh->compare_at_price_cents)->toBeNull()
        ->and($fresh->is_active)->toBeFalse();
});

test('admin cannot create a product with more than two decimal places', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $this->actingAs($admin)->post('/admin/products', [
        'name' => 'Misplaced Decimal',
        'sku' => 'DEC-001',
        'category_id' => $category->id,
        'price' => '3.555',
        'compare_at_price' => '4.555',
    ])->assertSessionHasErrors(['price', 'compare_at_price']);

    expect(Product::where('sku', 'DEC-001')->exists())->toBeFalse();
});

test('admin can update a product without changing its active status', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => false,
    ]);

    $this->actingAs($admin)->patch("/admin/products/{$product->id}", [
        'name' => 'Inactive Product',
        'sku' => $product->sku,
        'category_id' => $category->id,
        'price' => '4.75',
    ])->assertRedirect('/admin/products');

    expect($product->fresh()->is_active)->toBeFalse();
});

test('updating a product name generates a unique slug when the name matches another slug', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Classic Tee',
        'slug' => 'classic-tee',
    ]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Other Product',
        'slug' => 'other-product',
    ]);

    $this->actingAs($admin)->patch("/admin/products/{$product->id}", [
        'name' => 'Classic Tee',
        'sku' => $product->sku,
        'category_id' => $category->id,
        'price' => '10.00',
    ])->assertRedirect('/admin/products');

    expect($product->fresh()->slug)->toBe('classic-tee-1');
});

test('admin cannot exceed the five image limit across uploads', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    ProductImage::factory()->count(4)->create(['product_id' => $product->id]);

    $this->actingAs($admin)->post("/admin/products/{$product->id}/images", [
        'images' => [
            UploadedFile::fake()->image('extra1.jpg'),
            UploadedFile::fake()->image('extra2.jpg'),
        ],
    ])->assertSessionHasErrors('images');

    expect($product->fresh()->images)->toHaveCount(4);
});

test('admin can soft delete a product', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($admin)->delete("/admin/products/{$product->id}");

    $response->assertRedirect('/admin/products');
    expect($product->fresh()->trashed())->toBeTrue();
});
