<?php

test('user can switch locale between en and km', function () {
    $response = $this->post(route('locale.update'), ['locale' => 'km']);
    $response->assertRedirect();
    $response->assertSessionHas('locale', 'km');
    $response->assertCookie('locale', 'km');
});

test('invalid locale is rejected', function () {
    $response = $this->post(route('locale.update'), ['locale' => 'invalid']);
    $response->assertSessionHasErrors('locale');
});

test('inertia receives locale and translations props', function () {
    $this->withSession(['locale' => 'km'])
        ->get('/')
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'km')
            ->has('translations')
        );
});

test('locale falls back to cookie when session is not set', function () {
    $this->withCookie('locale', 'km')
        ->get('/')
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'km')
        );
});

test('unsupported locale falls back to en', function () {
    $this->withSession(['locale' => 'fr'])
        ->get('/')
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'en')
        );
});
