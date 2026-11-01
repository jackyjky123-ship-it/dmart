<?php

use App\Models\User;

test('guests are redirected to login when accessing protected portals', function () {
    $this->get('/admin')->assertRedirect(route('login'));
    $this->get('/pos')->assertRedirect(route('login'));
});

test('customers are forbidden from admin and pos', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)->get('/admin')->assertForbidden();
    $this->actingAs($customer)->get('/pos')->assertForbidden();
});

test('cashiers are forbidden from admin but can access pos', function () {
    $cashier = User::factory()->cashier()->create();

    $this->actingAs($cashier)->get('/admin')->assertForbidden();
    $this->actingAs($cashier)->get('/pos')->assertOk();
});

test('admins can access admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin')->assertOk();
});

test('inactive users are logged out and redirected to login', function () {
    $user = User::factory()->inactive()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $this->assertGuest();
    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors('email');
});
