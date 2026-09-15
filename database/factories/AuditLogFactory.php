<?php

namespace Database\Factories;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'actor_id' => null,
            'action' => 'farmer.approved',
            'target_type' => 'farmer',
            'target_id' => (string) fake()->randomNumber(),
            'metadata' => null,
        ];
    }
}
