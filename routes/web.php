<?php

use App\Http\Controllers\Account\DashboardController;
use App\Http\Controllers\Account\OrderController as AccountOrderController;
use App\Http\Controllers\Account\PasswordController;
use App\Http\Controllers\Account\ProfileController as AccountProfileController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/category/{category:slug}', [ShopController::class, 'index'])->name('shop.category');

Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

Route::get('/orders/{order:order_number}', [OrderController::class, 'show'])->name('orders.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('account')->name('account.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', [AccountProfileController::class, 'edit'])->name('profile');
        Route::get('/password', [PasswordController::class, 'edit'])->name('password');
        Route::get('/orders', [AccountOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order:order_number}', [AccountOrderController::class, 'show'])->name('orders.show');
    });
});

require __DIR__.'/settings.php';
