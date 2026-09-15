<?php

namespace Database\Factories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Permission>
 */
class PermissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->slug(2).'.view',
            'label' => fake()->words(2, true),
            'group' => fake()->word(),
            'sort_order' => 0,
        ];
    }
}
