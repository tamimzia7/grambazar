<?php

namespace Database\Seeders;

use App\Enums\FarmerApprovalStatus;
use App\Enums\ProductUnit;
use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Development/demo data only. Never production data.
     * Idempotent: safe to re-run.
     */
    public function run(): void
    {
        $this->call(CategorySeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(SiteSettingSeeder::class);

        $this->seedDemoUsers();
    }

    private function seedDemoUsers(): void
    {
        $this->seedUser('super-admin@grambazar.test', 'GramBazar Super Admin', 'super_admin');
        $this->seedUser('admin@grambazar.test', 'GramBazar Admin', 'admin');

        $approvedFarmerUser = $this->seedUser('farmer@grambazar.test', 'Demo Farmer', 'farmer');
        $this->seedFarmer($approvedFarmerUser, 'Demo Farmer', FarmerApprovalStatus::Approved);

        $pendingFarmerUser = $this->seedUser('pending-farmer@grambazar.test', 'Pending Demo Farmer', 'farmer');
        $this->seedFarmer($pendingFarmerUser, 'Pending Demo Farmer', FarmerApprovalStatus::Pending);

        $this->seedUser('customer@grambazar.test', 'Demo Customer', 'customer');

        $this->seedDemoProducts($approvedFarmerUser);
    }

    private function seedUser(string $email, string $name, string $role): User
    {
        if (($user = User::where('email', $email)->first()) !== null) {
            return $user;
        }

        return match ($role) {
            'super_admin' => User::factory()->asSuperAdmin()->create(['name' => $name, 'email' => $email]),
            'admin' => User::factory()->asAdmin()->create(['name' => $name, 'email' => $email]),
            'farmer' => User::factory()->asFarmer()->create(['name' => $name, 'email' => $email]),
            default => User::factory()->asCustomer()->create(['name' => $name, 'email' => $email]),
        };
    }

    private function seedFarmer(User $user, string $displayName, FarmerApprovalStatus $approvalStatus): void
    {
        Farmer::firstOrCreate(
            ['user_id' => $user->id],
            [
                'display_name' => $displayName,
                'village' => 'Demo Village',
                'district' => 'Demo District',
                'approval_status' => $approvalStatus,
            ],
        );
    }

    private function seedDemoProducts(User $farmerUser): void
    {
        $farmer = $farmerUser->farmer;
        $categoryIds = Category::pluck('id', 'slug');

        $products = [
            [
                'slug' => 'siddho-chal',
                'name' => 'সিদ্ধ চাল (১ কেজি)',
                'short_description' => 'খাঁটি ও মোটা সিদ্ধ চাল',
                'price' => 85,
                'category' => 'chal',
                'stock_quantity' => 200,
                'is_featured' => true,
            ],
            [
                'slug' => 'taja-pabda-mach',
                'name' => 'তাজা পাবদা মাছ',
                'short_description' => 'তাজা দেশি পাবদা মাছ',
                'price' => 450,
                'category' => 'mach',
                'stock_quantity' => 50,
                'is_popular' => true,
            ],
            [
                'slug' => 'shukna-morich',
                'name' => 'শুকনা মরিচ',
                'short_description' => 'খাঁটি শুকনা মরিচ',
                'price' => 180,
                'category' => 'moshola',
                'stock_quantity' => 150,
            ],
            [
                'slug' => 'am',
                'name' => 'হিমসাগর আম',
                'short_description' => 'উপজেলার সবচেয়ে মিষ্টি আম',
                'price' => 120,
                'sale_price' => 100,
                'category' => 'fol',
                'stock_quantity' => 80,
                'is_popular' => true,
                'is_featured' => true,
            ],
            [
                'slug' => 'rui-mach',
                'name' => 'তাজা রুই মাছ',
                'short_description' => 'বড় সাইজের তাজা রুই মাছ',
                'price' => 550,
                'category' => 'mach',
                'stock_quantity' => 40,
                'is_popular' => true,
            ],
            [
                'slug' => 'deshi-murgi-asta',
                'name' => 'দেশি মুরগি (আস্ত)',
                'short_description' => 'খাঁটি দেশি মুরগি, আস্ত',
                'price' => 750,
                'unit' => ProductUnit::Piece,
                'category' => 'deshi-murgi',
                'stock_quantity' => 18,
                'is_popular' => true,
            ],
            [
                'slug' => 'misti-kumra',
                'name' => 'মিষ্টি কুমড়া',
                'short_description' => 'তাজা মিষ্টি কুমড়া',
                'price' => 40,
                'category' => 'shak-sobji',
                'stock_quantity' => 60,
                'is_seasonal' => true,
            ],
            [
                'slug' => 'palong-shak',
                'name' => 'পালং শাক (গোছা)',
                'short_description' => 'তাজা পালং শাক',
                'price' => 30,
                'unit' => ProductUnit::Piece,
                'category' => 'shak-sobji',
                'stock_quantity' => 40,
                'is_seasonal' => true,
            ],
            [
                'slug' => 'kathal',
                'name' => 'কাঁঠাল',
                'short_description' => 'পাকা কাঁঠাল',
                'price' => 300,
                'unit' => ProductUnit::Piece,
                'category' => 'fol',
                'stock_quantity' => 10,
                'is_seasonal' => true,
            ],
            [
                'slug' => 'holud-gura',
                'name' => 'হলুদ গুঁড়া',
                'short_description' => 'খাঁটি হলুদ গুঁড়া',
                'price' => 140,
                'category' => 'moshola',
                'stock_quantity' => 90,
            ],
            [
                'slug' => 'jira',
                'name' => 'জিরা',
                'short_description' => 'সুগন্ধি খাঁটি জিরা',
                'price' => 90,
                'category' => 'moshola',
                'stock_quantity' => 70,
            ],
            [
                'slug' => 'dhonia',
                'name' => 'ধনিয়া',
                'short_description' => 'খাঁটি ধনিয়া',
                'price' => 70,
                'category' => 'moshola',
                'stock_quantity' => 80,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['slug' => $product['slug']],
                [
                    'farmer_id' => $farmer->id,
                    'category_id' => $categoryIds[$product['category']],
                    'name' => $product['name'],
                    'short_description' => $product['short_description'],
                    'price' => $product['price'],
                    'sale_price' => $product['sale_price'] ?? null,
                    'unit' => $product['unit'] ?? ProductUnit::Kilogram,
                    'stock_quantity' => $product['stock_quantity'],
                    'is_featured' => $product['is_featured'] ?? false,
                    'is_popular' => $product['is_popular'] ?? false,
                    'is_seasonal' => $product['is_seasonal'] ?? false,
                    'is_active' => true,
                ],
            );
        }
    }
}
