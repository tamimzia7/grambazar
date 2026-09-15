<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Growable permission catalogue. Super admins implicitly hold every
     * permission; the "admin" role is granted this default set, which a
     * super admin can later edit.
     *
     * @return array<int, array{name: string, label: string, group: string}>
     */
    public static function catalogue(): array
    {
        return [
            // Users
            ['name' => 'users.view', 'label' => 'ব্যবহারকারী দেখুন', 'group' => 'ব্যবহারকারী'],
            ['name' => 'users.edit', 'label' => 'ব্যবহারকারী সম্পাদনা', 'group' => 'ব্যবহারকারী'],
            ['name' => 'users.manage_status', 'label' => 'লগইন স্ট্যাটাস পরিবর্তন', 'group' => 'ব্যবহারকারী'],
            // Farmers
            ['name' => 'farmers.view', 'label' => 'কৃষক দেখুন', 'group' => 'কৃষক'],
            ['name' => 'farmers.approve', 'label' => 'কৃষক অনুমোদন', 'group' => 'কৃষক'],
            ['name' => 'farmers.reject', 'label' => 'কৃষক প্রত্যাখ্যান', 'group' => 'কৃষক'],
            ['name' => 'farmers.suspend', 'label' => 'কৃষক স্থগিত', 'group' => 'কৃষক'],
            // Products
            ['name' => 'products.view', 'label' => 'পণ্য দেখুন', 'group' => 'পণ্য'],
            ['name' => 'products.create', 'label' => 'পণ্য তৈরি', 'group' => 'পণ্য'],
            ['name' => 'products.edit', 'label' => 'পণ্য সম্পাদনা', 'group' => 'পণ্য'],
            ['name' => 'products.moderate', 'label' => 'পণ্য মডারেশন', 'group' => 'পণ্য'],
            ['name' => 'products.stock', 'label' => 'স্টক পরিচালনা', 'group' => 'পণ্য'],
            // Categories
            ['name' => 'categories.view', 'label' => 'ক্যাটাগরি দেখুন', 'group' => 'ক্যাটাগরি'],
            ['name' => 'categories.create', 'label' => 'ক্যাটাগরি তৈরি', 'group' => 'ক্যাটাগরি'],
            ['name' => 'categories.edit', 'label' => 'ক্যাটাগরি সম্পাদনা', 'group' => 'ক্যাটাগরি'],
            ['name' => 'categories.manage_status', 'label' => 'ক্যাটাগরি স্ট্যাটাস', 'group' => 'ক্যাটাগরি'],
            // Orders
            ['name' => 'orders.view', 'label' => 'অর্ডার দেখুন', 'group' => 'অর্ডার'],
            ['name' => 'orders.update', 'label' => 'অর্ডার স্ট্যাটাস আপডেট', 'group' => 'অর্ডার'],
            ['name' => 'orders.payment', 'label' => 'পেমেন্ট স্ট্যাটাস পরিবর্তন', 'group' => 'অর্ডার'],
            // Coupons
            ['name' => 'coupons.view', 'label' => 'কুপন দেখুন', 'group' => 'কুপন'],
            ['name' => 'coupons.create', 'label' => 'কুপন তৈরি', 'group' => 'কুপন'],
            ['name' => 'coupons.edit', 'label' => 'কুপন সম্পাদনা', 'group' => 'কুপন'],
            ['name' => 'coupons.manage', 'label' => 'কুপন স্ট্যাটাস/মুছুন', 'group' => 'কুপন'],
            // Reports
            ['name' => 'reports.view', 'label' => 'রিপোর্ট দেখুন', 'group' => 'রিপোর্ট'],
            ['name' => 'reports.print', 'label' => 'রিপোর্ট প্রিন্ট', 'group' => 'রিপোর্ট'],
            ['name' => 'reports.download', 'label' => 'রিপোর্ট ডাউনলোড', 'group' => 'রিপোর্ট'],
            // Site management
            ['name' => 'site.manage', 'label' => 'সাইট সেটিংস পরিচালনা', 'group' => 'সাইট ম্যানেজমেন্ট'],
            // Audit log
            ['name' => 'audit.view', 'label' => 'অডিট লগ দেখুন', 'group' => 'অডিট লগ'],
        ];
    }

    /**
     * Seed the permission catalogue and default admin role grants.
     */
    public function run(): void
    {
        foreach (self::catalogue() as $index => $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                [
                    'label' => $permission['label'],
                    'group' => $permission['group'],
                    'sort_order' => $index,
                ],
            );
        }

        $adminPermissionIds = Permission::pluck('id')->all();

        foreach ($adminPermissionIds as $permissionId) {
            DB::table('role_permission')->updateOrInsert(
                ['role' => UserRole::Admin->value, 'permission_id' => $permissionId],
            );
        }
    }
}
