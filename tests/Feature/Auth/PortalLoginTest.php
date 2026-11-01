<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin login page renders with admin portal', function () {
    $this->get('/admin/login')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('portal', 'admin')
            ->where('canResetPassword', false)
        );
});

test('pos login page renders with cashier portal', function () {
    $this->get('/pos/login')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('portal', 'cashier')
            ->where('canResetPassword', false)
        );
});

test('admin portal rejects non-admin users', function () {
    $customer = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $customer->email,
        'password' => 'password',
        'portal' => 'admin',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('admin portal rejects cashier users', function () {
    $cashier = User::factory()->cashier()->create();

    $response = $this->post(route('login.store'), [
        'email' => $cashier->email,
        'password' => 'password',
        'portal' => 'admin',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('admin portal accepts admin users and redirects to admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->post(route('login.store'), [
        'email' => $admin->email,
        'password' => 'password',
        'portal' => 'admin',
    ]);

    $this->assertAuthenticatedAs($admin);
    $response->assertRedirect('/admin');
});

test('cashier portal rejects non-cashier users', function () {
    $customer = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $customer->email,
        'password' => 'password',
        'portal' => 'cashier',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('cashier portal rejects admin users', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->post(route('login.store'), [
        'email' => $admin->email,
        'password' => 'password',
        'portal' => 'cashier',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('cashier portal accepts cashier users and redirects to pos', function () {
    $cashier = User::factory()->cashier()->create();

    $response = $this->post(route('login.store'), [
        'email' => $cashier->email,
        'password' => 'password',
        'portal' => 'cashier',
    ]);

    $this->assertAuthenticatedAs($cashier);
    $response->assertRedirect('/pos');
});

test('authenticated admin visiting admin login is redirected to dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin/login')
        ->assertRedirect('/dashboard');
});

test('authenticated cashier visiting pos login is redirected to dashboard', function () {
    $cashier = User::factory()->cashier()->create();

    $this->actingAs($cashier)->get('/pos/login')
        ->assertRedirect('/dashboard');
});

test('authenticated customer visiting admin login is redirected to dashboard', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)->get('/admin/login')
        ->assertRedirect('/dashboard');
});
