<?php

namespace App\Models;

use Database\Factories\SiteSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property string $group
 */
#[Fillable(['key', 'value', 'group'])]
class SiteSetting extends Model
{
    /** @use HasFactory<SiteSettingFactory> */
    use HasFactory;

    /**
     * Fetch a setting value with a fallback when the key is not configured.
     */
    public static function get(string $key, ?string $default = null): ?string
    {
        return static::query()
            ->where('key', $key)
            ->value('value') ?? $default;
    }

    /**
     * Bulk fetch several settings as a single keyed array of ?string values.
     *
     * @param  array<int, string>  $keys
     * @param  array<string, string|null>|null  $defaults
     * @return array<string, ?string>
     */
    public static function resolveMany(array $keys, ?array $defaults = null): array
    {
        $defaults ??= array_fill_keys($keys, null);

        $stored = static::query()
            ->whereIn('key', $keys)
            ->get(['key', 'value'])
            ->mapWithKeys(fn ($setting): array => [$setting->key => $setting->value])
            ->all();

        return array_merge($defaults, $stored);
    }
}
