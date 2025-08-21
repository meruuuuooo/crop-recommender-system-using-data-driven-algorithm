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
        Schema::create('fertilizers', function (Blueprint $table) {
            $table->id();
            $table->string('company')->nullable();
            $table->string('product_name');
            $table->string('type_of_product')->nullable();
            $table->text('guaranteed_analysis')->nullable();
            $table->text('target_crops')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('expiry_date')->nullable();
            $table->timestamps();
        });

        Schema::create('pesticides', function (Blueprint $table) {
            $table->id();
            $table->string('company')->nullable();
            $table->string('active_ingredient')->nullable();
            $table->string('product_name');
            $table->string('concentration')->nullable();
            $table->string('formulation_type')->nullable();
            $table->text('uses')->nullable();
            $table->string('toxicity_category')->nullable();
            $table->string('registration_number')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('mode_of_entry')->nullable();
            $table->text('crops')->nullable();
            $table->text('pest_weeds_diseases')->nullable();
            $table->string('recommended_rate')->nullable();
            $table->string('MRL')->nullable();
            $table->string('PHI')->nullable();
            $table->string('re_entry_period')->nullable();
            $table->timestamps();
        });

        Schema::create('fertilizer_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fertilizer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('crop_id')->constrained()->cascadeOnDelete();
            $table->string('usage_rate')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pesticide_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesticide_id')->constrained()->cascadeOnDelete();
            $table->foreignId('crop_id')->constrained()->cascadeOnDelete();
            $table->string('usage_rate')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesticide_recommendations');
        Schema::dropIfExists('fertilizer_recommendations');
        Schema::dropIfExists('pesticides');
        Schema::dropIfExists('fertilizers');
    }
};
