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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('crops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->string('planting_season_primary')->nullable();
            $table->string('harvesting_period')->nullable();
            $table->string('growing_duration_days')->nullable();
            $table->string('ph_preference')->nullable();
            $table->text('soil_requirement')->nullable();
            $table->timestamps();
        });

        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained()->onDelete('cascade');
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('crop_id')->constrained()->onDelete('cascade');
            $table->foreignId('soil_id')->constrained('soils')->onDelete('cascade');
            $table->foreignId('climate_id')->constrained('climates')->onDelete('cascade');
            $table->float('confidence_score');
            $table->date('recommendation_date');
            $table->timestamps();
        });

        Schema::create('crop_fertilizers', function (Blueprint $table) {
            $table->id();
            $table->string('crop_name');
            $table->string('variety_and_condition')->nullable();
            $table->string('nutrient');
            $table->string('soil_level');
            $table->string('recommendation_amount');
            $table->string('unit');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crop_fertilizers');
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('crops');
        Schema::dropIfExists('categories');
    }
};
