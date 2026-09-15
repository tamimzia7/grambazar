<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Models\SiteSetting;
use App\Services\AuditLogService;
use Database\Seeders\SiteSettingSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

/**
 * Site content management (hero, contact and social fields). The form is
 * driven by the seeded default keys so a fresh install is fully editable.
 */
class SiteSettingController extends Controller
{
    public function index(Request $request): Response
    {
        $knownKeys = collect(SiteSettingSeeder::defaults())
            ->map(fn (array $default): string => $default['key']);

        $labels = [
            'site.hero_eyebrow' => 'হিরো — শিরোনামের উপরের লাইন',
            'site.hero_title' => 'হিরো — মূল শিরোনাম',
            'site.hero_subtitle' => 'হিরো — বর্ণনা',
            'site.brand_about' => 'ব্র্যান্ড — পরিচিতি',
            'site.contact_address' => 'যোগাযোগ — ঠিকানা',
            'site.contact_phone' => 'যোগাযোগ — ফোন',
            'site.contact_email' => 'যোগাযোগ — ইমেইল',
            'site.contact_hours' => 'যোগাযোগ — সময়সূচি',
            'site.social_facebook' => 'সোশ্যাল — ফেসবুক',
            'site.social_instagram' => 'সোশ্যাল — ইনস্টাগ্রাম',
            'site.social_youtube' => 'সোশ্যাল — ইউটিউব',
        ];

        $settings = SiteSetting::query()
            ->whereIn('key', $knownKeys)
            ->get(['key', 'value'])
            ->keyBy('key');

        $groups = collect(SiteSettingSeeder::defaults())
            ->map(function (array $default) use ($settings, $labels): array {
                $setting = $settings->get($default['key']);

                return [
                    'key' => $default['key'],
                    'label' => $labels[$default['key']] ?? $default['key'],
                    'value' => $setting !== null ? $setting->value : $default['value'],
                ];
            })
            ->groupBy('group');

        return inertia('admin/site/index', [
            'groups' => $groups->map(fn ($items, string $group): array => [
                'group' => $group,
                'items' => $items->values()->all(),
            ])->values()->all(),
            'can' => [
                'edit' => $request->user()->hasPermission('site.manage'),
            ],
        ]);
    }

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        $knownKeys = collect(SiteSettingSeeder::defaults())
            ->map(fn (array $default): string => $default['key'])
            ->flip();

        foreach ($request->validated()['settings'] as $values) {
            foreach ($values as $key => $value) {
                $key = (string) $key;

                if (! $knownKeys->has($key)) {
                    continue;
                }

                SiteSetting::updateOrCreate(['key' => $key], [
                    'value' => ($value ?? '') !== '' ? (string) $value : null,
                    'group' => (string) strstr($key, '.', true),
                ]);
            }
        }

        AuditLogService::record($request->user(), 'site.settings_updated', 'site_settings', null, [
            'keys' => array_keys($request->validated()['settings'] ?? []),
        ]);

        return back()->with('flash', ['success' => 'সাইটের তথ্য হালনাগাদ করা হয়েছে।']);
    }
}
