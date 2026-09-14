<?php

namespace App\Models;

use App\Enums\FarmerApprovalStatus;
use Database\Factories\FarmerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $display_name
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $village
 * @property string|null $district
 * @property string|null $bio
 * @property string|null $profile_image
 * @property FarmerApprovalStatus $approval_status
 */
#[Fillable([
    'user_id',
    'display_name',
    'phone',
    'address',
    'village',
    'district',
    'bio',
    'profile_image',
    'approval_status',
])]
class Farmer extends Model
{
    /** @use HasFactory<FarmerFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function isApproved(): bool
    {
        return $this->approval_status === FarmerApprovalStatus::Approved;
    }

    protected function casts(): array
    {
        return [
            'approval_status' => FarmerApprovalStatus::class,
        ];
    }
}
