<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(PermissionSeeder::class);
    $this->actingAs(User::factory()->asAdmin()->create());
});

it('creates a root category', function () {
    $this->post(route('admin.categories.store'), [
        'name' => 'দ্বিতীয় শ্রেণীর সবজি',
        'slug' => 'ditiya-sobji',
    ])->assertRedirect();

    $this->assertDatabaseHas('categories', ['name' => 'দ্বিতীয় শ্রেণীর সবজি', 'parent_id' => null]);
});

it('creates a sub-category under a root category', function () {
    $root = Category::factory()->create();

    $this->post(route('admin.categories.store'), [
        'name' => 'উপ-ক্যাটাগরি',
        'slug' => 'sub-cat',
        'parent_id' => $root->id,
    ])->assertRedirect();

    $this->assertDatabaseHas('categories', ['slug' => 'sub-cat', 'parent_id' => $root->id]);
});

it('rejects a sub-category under another sub-category', function () {
    $root = Category::factory()->create();
    $child = Category::factory()->create(['parent_id' => $root->id]);

    $this->post(route('admin.categories.store'), [
        'name' => 'গভীর উপ-ক্যাটাগরি',
        'slug' => 'deep-sub',
        'parent_id' => $child->id,
    ])->assertSessionHasErrors('parent_id');

    $this->assertDatabaseMissing('categories', ['slug' => 'deep-sub']);
});

it('toggles a category active state', function () {
    $category = Category::factory()->create(['is_active' => true]);

    $this->post(route('admin.categories.toggle-active', $category))->assertRedirect();

    expect($category->refresh()->is_active)->toBeFalse();
});

it('refuses to delete a category that still has products', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    $this->delete(route('admin.categories.destroy', $category))
        ->assertRedirect()
        ->assertSessionHas('flash.error');

    $this->assertModelExists($category);
});

it('deletes an empty category and logs it', function () {
    $category = Category::factory()->create(['name' => 'ফাঁকা ক্যাটাগরি']);

    $this->delete(route('admin.categories.destroy', $category))->assertRedirect();

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    $this->assertDatabaseHas('audit_logs', [
        'action' => 'category.deleted',
        'target_type' => 'category',
        'target_id' => $category->id,
    ]);
});

it('renders the category tree with product totals', function () {
    $root = Category::factory()->create();
    Product::factory()->count(2)->create(['category_id' => $root->id]);

    $this->get(route('admin.categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories/index')
            ->where('categories.0.id', $root->id)
            ->where('categories.0.products_count', 2));
});
