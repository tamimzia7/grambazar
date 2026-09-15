<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('coupon_usage') && ! Schema::hasTable('coupon_usages')) {
            Schema::rename('coupon_usage', 'coupon_usages');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('coupon_usages') && ! Schema::hasTable('coupon_usage')) {
            Schema::rename('coupon_usages', 'coupon_usage');
        }
    }
};
