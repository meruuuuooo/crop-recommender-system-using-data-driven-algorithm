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
        Schema::create('soil_types', function (Blueprint $table) {
            $table->id();
            $table->string('soil_condition');
            $table->timestamps();
        });

        Schema::create('seasons', function (Blueprint $table) {
            $table->id();
            $table->string('season_type');
            $table->timestamps();
        });

        Schema::create('fertilizer_levels', function (Blueprint $table) {
            $table->id();
            $table->string('level');
            $table->timestamps();
        });

        Schema::create('nutrient_types', function (Blueprint $table) {
            $table->id();
            $table->string('nutrient_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutrient_types');
        Schema::dropIfExists('fertilizer_levels');
        Schema::dropIfExists('seasons');
        Schema::dropIfExists('soil_types');
    }
};
