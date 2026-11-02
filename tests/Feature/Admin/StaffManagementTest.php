<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests, customers, and cashiers cannot access staff management', function () {
    $this->get('/admin/staff')->assertRedirect(route('login'));

    $customer = User::factory()->create();
    $this->actingAs($customer)->get('/admin/staff')->assertForbidden();

    $cashier = User::factory()->cashier()->create();
    $this->actingAs($cashier)->get('/admin/staff')->assertForbidden();
});

test('admin can view staff list with cashiers and admins', function () {
    $admin = User::factory()->admin()->create(['name' => 'Super Admin']);
    User::factory()->cashier()->create(['name' => 'Counter Cashier']);
    User::factory()->create(['name' => 'Regular Customer']); // Not staff

    $this->actingAs($admin)->get('/admin/staff')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/staff/index')
            ->has('staff', 2)
        );
});

test('admin can create a new staff account', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/staff', [
        'name' => 'New Cashier',
        'email' => 'newcashier@dmart.test',
        'role' => UserRole::Cashier->value,
        'password' => 'password123',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'name' => 'New Cashier',
        'email' => 'newcashier@dmart.test',
        'role' => UserRole::Cashier->value,
        'is_active' => true,
    ]);
});

test('admin can toggle staff active status', function () {
    $admin = User::factory()->admin()->create();
    $staff = User::factory()->cashier()->create(['is_active' => true]);

    $response = $this->actingAs($admin)->patch("/admin/staff/{$staff->id}/status", [
        'is_active' => false,
    ]);

    $response->assertRedirect();
    expect($staff->fresh()->is_active)->toBeFalse();

    $this->actingAs($admin)->patch("/admin/staff/{$staff->id}/status", [
        'is_active' => true,
    ]);

    expect($staff->fresh()->is_active)->toBeTrue();
});

test('admin cannot deactivate their own account', function () {
    $admin = User::factory()->admin()->create(['is_active' => true]);

    $response = $this->actingAs($admin)->patch("/admin/staff/{$admin->id}/status", [
        'is_active' => false,
    ]);

    $response->assertSessionHasErrors('is_active');
    expect($admin->fresh()->is_active)->toBeTrue();
});

test('admin can reset staff password', function () {
    $admin = User::factory()->admin()->create();
    $staff = User::factory()->cashier()->create(['password' => Hash::make('old-password')]);

    $response = $this->actingAs($admin)->patch("/admin/staff/{$staff->id}/password", [
        'password' => 'new-secret-password-123',
    ]);

    $response->assertRedirect();
    expect(Hash::check('new-secret-password-123', $staff->fresh()->password))->toBeTrue();
});
