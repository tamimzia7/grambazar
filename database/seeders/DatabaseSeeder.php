<?php

namespace Database\Seeders;

use App\Enums\FarmerApprovalStatus;
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
     * Only development/demo data. Never production data.
     */
    public function run(): void
    {
        $this->call(CategorySeeder::class);

        $this->seedDemoUsers();
    }

    private function seedDemoUsers(): void
    {
        User::factory()->asSuperAdmin()->create([
            'name' => 'GramBazar Super Admin',
            'email' => 'super-admin@grambazar.test',
        ]);

        User::factory()->asAdmin()->create([
            'name' => 'GramBazar Admin',
            'email' => 'admin@grambazar.test',
        ]);

        $approvedFarmerUser = $this->seedFarmer(
            'Demo Farmer',
            'farmer@grambazar.test',
            FarmerApprovalStatus::Approved,
        );

        $this->seedFarmer(
            'Pending Demo Farmer',
            'pending-farmer@grambazar.test',
            FarmerApprovalStatus::Pending,
        );

        User::factory()->asCustomer()->create([
            'name' => 'Demo Customer',
            'email' => 'customer@grambazar.test',
        ]);

        $this->seedDemoProducts($approvedFarmerUser);
    }

    private function seedFarmer(
        string $name,
        string $email,
        FarmerApprovalStatus $approvalStatus,
    ): User {
        $user = User::factory()->asFarmer()->create([
            'name' => $name,
            'email' => $email,
        ]);

        Farmer::factory()->forUser($user)->create([
            'display_name' => $name,
            'village' => 'Demo Village',
            'district' => 'Demo District',
            'approval_status' => $approvalStatus,
        ]);

        return $user;
    }

    private function seedDemoProducts(User $farmerUser): void
    {
        $farmer = $farmerUser->farmer;

        $chal = Category::where('slug', 'chal')->firstOrFail();
        $mach = Category::where('slug', 'mach')->firstOrFail();
        $moshola = Category::where('slug', 'moshola')->firstOrFail();

        Product::factory()->create([
            'farmer_id' => $farmer->id,
            'category_id' => $chal->id,
            'name' => 'সিদ্ধ চাল (১ কেজি)',
            'slug' => 'siddho-chal',
            'short_description' => 'খাঁটি ও মোটা সিদ্ধ চাল',
            'price' => 85,
            'stock_quantity' => 200,
            'is_featured' => true,
        ]);

        Product::factory()->create([
            'farmer_id' => $farmer->id,
            'category_id' => $mach->id,
            'name' => 'তাজা পাবদা মাছ',
            'slug' => 'taja-pabda-mach',
            'short_description' => 'তাজা দেশি পাবদা মাছ',
            'price' => 450,
            'stock_quantity' => 50,
        ]);

        Product::factory()->create([
            'farmer_id' => $farmer->id,
            'category_id' => $moshola->id,
            'name' => 'শুকনা মরিচ',
            'slug' => 'shukna-morich',
            'short_description' => 'খাঁটি শুকনা মরিচ',
            'price' => 180,
            'stock_quantity' => 150,
        ]);
    }
}
