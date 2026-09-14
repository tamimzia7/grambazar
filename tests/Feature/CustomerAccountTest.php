<?php

use App\Enums\ProductUnit;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

if (! function_exists('checkoutPayload')) {
    function checkoutPayload(array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'তামিম জিয়া',
            'customer_phone' => '01712345678',
            'customer_email' => 'tamim@example.com',
            'delivery_address' => 'বাড়ি ১২, রোড ৫',
            'delivery_area' => 'সিংগাইর',
            'delivery_district' => 'মানিকগঞ্জ',
            'delivery_instructions' => 'বিকেলের আগে দিন',
        ], $overrides);
    }
}

it('redirects guests away from account pages', function () {
    $this->get(route('account.dashboard'))
        ->assertRedirect(route('login'));

    $this->get(route('account.orders.index'))
        ->assertRedirect(route('login'));
});

it('shows the account dashboard with order totals and recent orders', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'total' => 260,
    ]);

    $this->actingAs($user)
        ->get(route('account.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('account/dashboard')
            ->where('total_orders', 1)
            ->where('recent_orders.0.order_number', $order->order_number));
});

it('lists only the customers own orders on the account orders page', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();

    Order::factory()->create(['user_id' => $customer->id]);
    $otherOrder = Order::factory()->create(['user_id' => $otherCustomer->id]);

    $this->actingAs($customer)
        ->get(route('account.orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('account/orders/index')
            ->has('orders.data', 1)
            ->whereNot('orders.data.0.order_number', $otherOrder->order_number));
});

it('allows a customer to view the details of their own order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('account.orders.show', ['order' => $order->order_number]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('account/orders/show')
            ->where('order.order_number', $order->order_number));
});

it('forbids a customer from viewing another customers order', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($intruder)
        ->get(route('account.orders.show', ['order' => $order->order_number]))
        ->assertForbidden();
});

it('lets customers update their profile including phone', function () {
    $user = User::factory()->create(['phone' => '01711111111']);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'আপডেটেড নাম',
            'phone' => '01822222222',
            'email' => $user->email,
        ])
        ->assertSessionHasNoErrors();

    $user->refresh();

    expect($user->name)->toBe('আপডেটেড নাম');
    expect($user->phone)->toBe('01822222222');
});

it('rejects a profile phone number that is already in use', function () {
    $user = User::factory()->create(['phone' => '01711111111']);
    User::factory()->create(['phone' => '01911111111']);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '01911111111',
        ])
        ->assertSessionHasErrors('phone');
});

it('lets customers change their password with the current password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ])
        ->assertSessionHasNoErrors();

    expect(Hash::check('new-password-123', $user->refresh()->password))->toBeTrue();
});

it('rejects a password change with a wrong current password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ])
        ->assertSessionHasErrors('current_password');
});

it('preserves the guest cart after registration', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'unit' => ProductUnit::Kilogram,
    ]);

    $this->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2]);

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '01712345678',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();

    $this->get(route('cart.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('items.0.id', $product->id)
            ->where('items.0.quantity', 2)
            ->where('count', 2));
});

it('attaches authenticated checkout orders to the customer', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'unit' => ProductUnit::Kilogram,
    ]);

    $this->actingAs($user)->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $this->actingAs($user)->post(route('checkout.store'), checkoutPayload([
        'customer_email' => $user->email,
    ]))->assertRedirect();

    $order = Order::firstOrFail();
    expect($order->user_id)->toBe($user->id);

    $this->actingAs($user)
        ->get(route('account.orders.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', $order->order_number));
});
