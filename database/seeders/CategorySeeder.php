<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Seed the initial GramBazar root categories.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'চাল', 'slug' => 'chal', 'description' => 'দেশি ও আটপ চাল', 'sort_order' => 1],
            ['name' => 'শাক-সবজি', 'slug' => 'shak-sobji', 'description' => 'তাজা শাক ও সবজি', 'sort_order' => 2],
            ['name' => 'ফল', 'slug' => 'fol', 'description' => 'তাজা ফল', 'sort_order' => 3],
            ['name' => 'মাছ', 'slug' => 'mach', 'description' => 'দেশি মাছ', 'sort_order' => 4],
            ['name' => 'দেশি মুরগি', 'slug' => 'deshi-murgi', 'description' => 'খাঁটি দেশি মুরগি', 'sort_order' => 5],
            ['name' => 'বীজ', 'slug' => 'bij', 'description' => 'উন্নতমানের বীজ', 'sort_order' => 6],
            ['name' => 'মসলা', 'slug' => 'moshola', 'description' => 'খাঁটি মসলা', 'sort_order' => 7],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                [...$category, 'is_active' => true],
            );
        }
    }
}
