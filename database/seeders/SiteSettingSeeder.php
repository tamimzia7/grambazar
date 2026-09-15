<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Default GramBazar site content. Idempotent; existing values are kept.
     *
     * @return array<int, array{key: string, value: string|null, group: string}>
     */
    public static function defaults(): array
    {
        return [
            ['key' => 'site.hero_eyebrow', 'value' => 'জমির থেকে সরাসরি আপনার রান্নাঘরে', 'group' => 'homepage'],
            ['key' => 'site.hero_title', 'value' => 'তাজা খাদ্য, সরাসরি গ্রামের হাত থেকে', 'group' => 'homepage'],
            ['key' => 'site.hero_subtitle', 'value' => 'গ্রামবাজারে সরাসরি কৃষকদের কাছ থেকে টাটকা সবজি, ফল, মাছ ও মসলা কিনুন — কোনো মধ্যস্বত্বভোগী ছাড়াই। এক বিক্রেতা, সবচেয়ে সেরা দাম।', 'group' => 'homepage'],
            ['key' => 'site.brand_about', 'value' => 'সরাসরি কৃষক থেকে শহরের রান্নাঘরে — টাটকা সবজি, ফল, মাছ ও মসলা, কোনো মধ্যস্বত্বভোগী ছাড়াই।', 'group' => 'general'],
            ['key' => 'site.contact_address', 'value' => 'সিংগাইর, মানিকগঞ্জ', 'group' => 'contact'],
            ['key' => 'site.contact_phone', 'value' => '০১৭০০-০০০০০০', 'group' => 'contact'],
            ['key' => 'site.contact_email', 'value' => 'support@grambazar.test', 'group' => 'contact'],
            ['key' => 'site.contact_hours', 'value' => 'সকাল ৬টা - রাত ১০টা', 'group' => 'contact'],
            ['key' => 'site.social_facebook', 'value' => 'https://facebook.com/grambazar', 'group' => 'social'],
            ['key' => 'site.social_instagram', 'value' => 'https://instagram.com/grambazar', 'group' => 'social'],
            ['key' => 'site.social_youtube', 'value' => 'https://youtube.com/@grambazar', 'group' => 'social'],
        ];
    }

    /**
     * Seed the site settings.
     */
    public function run(): void
    {
        foreach (self::defaults() as $setting) {
            SiteSetting::firstOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'group' => $setting['group']],
            );
        }
    }
}
