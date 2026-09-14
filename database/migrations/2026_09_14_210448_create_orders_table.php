<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name', 100);
            $table->string('customer_phone', 20);
            $table->string('customer_email', 255)->nullable();
            $table->string('delivery_address', 255);
            $table->string('delivery_area', 100)->nullable();
            $table->string('delivery_district', 100);
            $table->string('delivery_instructions', 500)->nullable();
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('payment_method', 20);
            $table->string('payment_status', 20)->default('unpaid');
            $table->string('order_status', 20)->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('order_number');
            $table->index('user_id');
            $table->index('order_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
