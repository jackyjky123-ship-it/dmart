<?php

test('user can switch locale between en and km', function () {
    $response = $this->post(route('locale.update'), ['locale' => 'km']);
    $response->assertRedirect();
    $response->assertSessionHas('locale', 'km');
    $response->assertPlainCookie('locale', 'km');
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
    $this->withUnencryptedCookie('locale', 'km')
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

test('auth and settings pages receive localized translations in km', function () {
    $this->withSession(['locale' => 'km'])
        ->get('/login')
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'km')
            ->where('translations.Admin Sign In', 'ចូលគណនីអ្នកគ្រប់គ្រង')
            ->where('translations.Cashier Sign In', 'ចូលគណនីអ្នកគិតប្រាក់')
            ->where('translations.Log in to DMart', 'ចូលគណនី DMart')
            ->where('translations.Register', 'ចុះឈ្មោះ')
            ->where('translations.Email address', 'អាសយដ្ឋានអ៊ីមែល')
            ->where('translations.Password', 'ពាក្យសម្ងាត់')
            ->where('translations.Profile Information', 'ព័ត៌មានប្រវត្តិរូប')
            ->where('translations.Delete account', 'លុបគណនី')
        );
});
