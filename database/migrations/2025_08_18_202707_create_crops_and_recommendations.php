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
        Schema::create('crops', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('crop_season')->nullable();
            $table->text('description')->nullable();
            $table->string('variety')->nullable();
            $table->string('category')->nullable();
            $table->timestamps();
        });

        Schema::create('crop_nutrients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crop_id')->constrained()->cascadeOnDelete();
            $table->decimal('nitrogen', 5, 2)->nullable();
            $table->decimal('phosphorus', 5, 2)->nullable();
            $table->decimal('potassium', 5, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('farm_id')->constrained()->cascadeOnDelete();
            $table->foreignId('crop_id')->constrained()->cascadeOnDelete();
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->date('recommendation_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('crop_nutrients');
        Schema::dropIfExists('crops');
    }
};
