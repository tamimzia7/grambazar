<?php

use App\Models\Category;
use App\Models\Product;
use Database\Seeders\CategorySeeder;
use Illuminate\Database\QueryException;

it('defaults to an active root category', function () {
    $category = Category::factory()->create();

    expect($category->is_active)->toBeTrue()
        ->and($category->parent_id)->toBeNull()
        ->and($category->isRoot())->toBeTrue();
});

it('supports a parent and child category hierarchy', function () {
    $parent = Category::factory()->create();
    $child = Category::factory()->create(['parent_id' => $parent->id]);

    expect($child->parent->is($parent))->toBeTrue()
        ->and($parent->children()->pluck('id'))->toContain($child->id)
        ->and($child->isRoot())->toBeFalse();
});

it('enforces unique category slugs', function () {
    Category::factory()->create(['slug' => 'chal']);

    expect(fn () => Category::factory()->create(['slug' => 'chal']))
        ->toThrow(QueryException::class);
});

it('unlinks child categories when the parent is deleted', function () {
    $parent = Category::factory()->create();
    $child = Category::factory()->childOf($parent)->create();

    $parent->delete();

    expect($child->fresh()->parent_id)->toBeNull();
});

it('prevents deleting a category that still has products', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    expect(fn () => $category->delete())->toThrow(QueryException::class);
});

it('seeds the seven main root categories', function () {
    $this->seed(CategorySeeder::class);

    $slugs = ['chal', 'shak-sobji', 'fol', 'mach', 'deshi-murgi', 'bij', 'moshola'];

    expect(Category::whereNull('parent_id')->count())->toBe(7)
        ->and(Category::whereIn('slug', $slugs)->count())->toBe(7);
});
