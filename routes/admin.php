<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FarmerController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Management Panel
|--------------------------------------------------------------------------
|
| Every route here sits behind the authenticated, email-verified and
| administrator middlewares. Coarse gates protect whole areas while the
| permission: middleware enforces granular grants per action.
|
*/

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Users
    Route::middleware('permission:users.view')->prefix('users')->name('users.')->group(function (): void {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/report', [UserController::class, 'report'])->name('report');
        Route::get('/{user}', [UserController::class, 'show'])->name('show');
        Route::middleware('permission:users.manage_status')->post('/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('toggle-active');
    });

    // Farmers
    Route::middleware('permission:farmers.view')->prefix('farmers')->name('farmers.')->group(function (): void {
        Route::get('/', [FarmerController::class, 'index'])->name('index');
        Route::get('/{farmer}', [FarmerController::class, 'show'])->name('show');
        Route::middleware('permission:farmers.approve')->post('/{farmer}/approve', [FarmerController::class, 'approve'])->name('approve');
        Route::middleware('permission:farmers.reject')->post('/{farmer}/reject', [FarmerController::class, 'reject'])->name('reject');
        Route::middleware('permission:farmers.suspend')->post('/{farmer}/suspend', [FarmerController::class, 'suspend'])->name('suspend');
        Route::middleware('permission:farmers.suspend')->post('/{farmer}/reactivate', [FarmerController::class, 'reactivate'])->name('reactivate');
        Route::middleware('permission:users.manage_status')->post('/{farmer}/toggle-account', [FarmerController::class, 'toggleAccount'])->name('toggle-account');
    });

    // Categories
    Route::middleware('permission:categories.view')->prefix('categories')->name('categories.')->group(function (): void {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::middleware('permission:categories.create')->post('/', [CategoryController::class, 'store'])->name('store');
        Route::middleware('permission:categories.edit')->put('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::middleware('permission:categories.manage_status')->post('/{category}/toggle-active', [CategoryController::class, 'toggleActive'])->name('toggle-active');
        Route::middleware('permission:categories.manage_status')->delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
    });

    // Products
    Route::middleware('permission:products.view')->prefix('products')->name('products.')->group(function (): void {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::middleware('permission:products.edit')->put('/{product}', [ProductController::class, 'update'])->name('update');
        Route::middleware('permission:products.stock')->patch('/{product}/stock', [ProductController::class, 'updateStock'])->name('stock');
        Route::middleware('permission:products.moderate')->post('/{product}/toggle-active', [ProductController::class, 'toggleActive'])->name('toggle-active');
    });

    // Orders
    Route::middleware('permission:orders.view')->prefix('orders')->name('orders.')->group(function (): void {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/{order:order_number}', [OrderController::class, 'show'])->name('show');
        Route::middleware('permission:orders.update')->post('/{order:order_number}/status', [OrderController::class, 'updateStatus'])->name('update-status');
        Route::middleware('permission:orders.payment')->post('/{order:order_number}/payment', [OrderController::class, 'updatePayment'])->name('update-payment');
    });

    // Coupons
    Route::middleware('permission:coupons.view')->prefix('coupons')->name('coupons.')->group(function (): void {
        Route::get('/', [CouponController::class, 'index'])->name('index');
        Route::get('/create', [CouponController::class, 'create'])->name('create');
        Route::get('/{coupon}/edit', [CouponController::class, 'edit'])->name('edit');
        Route::middleware('permission:coupons.create')->post('/', [CouponController::class, 'store'])->name('store');
        Route::middleware('permission:coupons.edit')->put('/{coupon}', [CouponController::class, 'update'])->name('update');
        Route::middleware('permission:coupons.manage')->post('/{coupon}/toggle-active', [CouponController::class, 'toggleActive'])->name('toggle-active');
        Route::middleware('permission:coupons.manage')->delete('/{coupon}', [CouponController::class, 'destroy'])->name('destroy');
    });

    // Reports
    Route::middleware('permission:reports.view')->prefix('reports')->name('reports.')->group(function (): void {
        Route::get('/users', [ReportController::class, 'users'])->name('users');
        Route::get('/farmers', [ReportController::class, 'farmers'])->name('farmers');
        Route::get('/products', [ReportController::class, 'products'])->name('products');
        Route::get('/orders', [ReportController::class, 'orders'])->name('orders');
        Route::get('/sales', [ReportController::class, 'sales'])->name('sales');
    });

    // Site management
    Route::middleware('permission:site.manage')->prefix('site')->name('site.')->group(function (): void {
        Route::get('/', [SiteSettingController::class, 'index'])->name('index');
        Route::post('/', [SiteSettingController::class, 'update'])->name('update');
    });

    // Admin account management — Super Admin only
    Route::middleware('role:super_admin')->prefix('admins')->name('admins.')->group(function (): void {
        Route::get('/', [AdminUserController::class, 'index'])->name('index');
        Route::get('/create', [AdminUserController::class, 'create'])->name('create');
        Route::get('/{admin_user}/permissions', [AdminUserController::class, 'permissions'])->name('permissions');
        Route::get('/{admin_user}/edit', [AdminUserController::class, 'edit'])->name('edit');
        Route::post('/', [AdminUserController::class, 'store'])->name('store');
        Route::put('/{admin_user}', [AdminUserController::class, 'update'])->name('update');
        Route::post('/{admin_user}/toggle-active', [AdminUserController::class, 'toggleActive'])->name('toggle-active');
        Route::put('/{admin_user}/permissions', [AdminUserController::class, 'updatePermissions'])->name('update-permissions');
    });

    // Audit log
    Route::middleware('permission:audit.view')->prefix('audit-logs')->name('audit-logs.')->group(function (): void {
        Route::get('/', [AuditLogController::class, 'index'])->name('index');
    });
});
