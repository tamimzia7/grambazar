<?php

use App\Enums\UserRole;
use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '01712345678',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/account');

    $user = User::firstWhere('email', 'test@example.com');
    expect($user->role)->toBe(UserRole::Customer);
    expect($user->phone)->toBe('01712345678');
});

test('registration requires a valid bangladeshi phone number', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '12345',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('phone');

    $this->assertGuest();
});

test('registration rejects an invalid email', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '01712345678',
        'email' => 'not-an-email',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('email');
});

test('registration rejects a duplicate email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '01712345678',
        'email' => 'taken@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('email');
});

test('registration requires password confirmation', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '01712345678',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'different-password',
    ])->assertSessionHasErrors('password');
});

test('registration ignores role and always creates a customer', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '01712345678',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'admin',
    ]);

    $user = User::firstWhere('email', 'test@example.com');
    expect($user->role)->toBe(UserRole::Customer);
});
