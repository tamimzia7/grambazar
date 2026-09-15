<?php

use Database\Seeders\PermissionSeeder;
use Database\Seeders\SiteSettingSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->seed(SiteSettingSeeder::class);
    $this->actingAs(User::factory()->asAdmin()->create());
});

it('renders the site settings grouped by area with current values', function () {
    $this->get(route('admin.site.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/site/index')
            ->where('groups.0.items.0.key', 'site.hero_eyebrow'));
});

it('persists edited settings and logs the change', function () {
    $this->post(route('admin.site.update'), [
        'settings' => [
            'hero' => [
                'site.hero_eyebrow' => 'গ্রামবাজার থেকে সরাসরি',
                'site.hero_title' => 'তাজা পণ্য',
            ],
        ],
    ])->assertRedirect()
        ->assertSessionHas('flash.success');

    $this->assertDatabaseHas('site_settings', [
        'key' => 'site.hero_eyebrow',
        'value' => 'গ্রামবাজার থেকে সরাসরি',
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'site.settings_updated',
        'target_type' => 'site_settings',
    ]);
});

it('stores a cleared value as null', function () {
    $this->post(route('admin.site.update'), [
        'settings' => ['social' => ['site.social_facebook' => '']],
    ])->assertRedirect();

    $this->assertDatabaseHas('site_settings', [
        'key' => 'site.social_facebook',
        'value' => null,
    ]);
});