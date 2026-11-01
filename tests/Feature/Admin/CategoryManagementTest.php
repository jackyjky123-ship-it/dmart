<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests and customers cannot access admin categories', function () {
    $this->get('/admin/categories')->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get('/admin/categories')->assertForbidden();
});

test('admin can view categories with product counts', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create(['name' => 'Produce', 'slug' => 'produce']);
    Product::factory()->count(3)->create(['category_id' => $category->id]);

    $this->actingAs($admin)->get('/admin/categories')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories/index')
            ->has('categories', 1)
            ->where('categories.0.name', 'Produce')
            ->where('categories.0.product_count', 3)
        );
});

test('admin can create a category with auto-generated slug', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/categories', [
        'name' => 'Dairy & Eggs',
        'description' => 'Fresh local dairy',
    ]);

    $response->assertRedirect('/admin/categories');
    $this->assertDatabaseHas('categories', [
        'name' => 'Dairy & Eggs',
        'slug' => 'dairy-eggs',
        'description' => 'Fresh local dairy',
    ]);
});

test('admin can update a category', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create(['name' => 'Old Name', 'slug' => 'old-name']);

    $response = $this->actingAs($admin)->patch("/admin/categories/{$category->id}", [
        'name' => 'New Name',
        'slug' => 'new-name',
        'description' => 'Updated description',
    ]);

    $response->assertRedirect('/admin/categories');
    expect($category->fresh()->name)->toBe('New Name')
        ->and($category->fresh()->slug)->toBe('new-name');
});

test('admin can delete an empty category', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/categories/{$category->id}");

    $response->assertRedirect('/admin/categories');
    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('admin cannot delete a category with existing products', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($admin)->delete("/admin/categories/{$category->id}");

    $response->assertSessionHasErrors('category');
    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});
