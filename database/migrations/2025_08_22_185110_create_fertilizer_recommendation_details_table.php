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
        Schema::create('fertilizer_recommendation_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crop_variety_id')->constrained('crop_varieties')->onDelete('cascade');
            $table->foreignId('soil_type_id')->constrained('soil_types')->onDelete('cascade');
            $table->foreignId('season_id')->constrained('seasons')->onDelete('cascade');
            $table->foreignId('nutrient_type_id')->constrained('nutrient_types')->onDelete('cascade');
            $table->foreignId('fertilizer_level_id')->constrained('fertilizer_levels')->onDelete('cascade');
            $table->float('amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fertilizer_recommendation_details');
    }
};
