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
        Schema::create('farms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('total_area', 10, 2)->nullable();
            $table->text('prev_crops')->nullable();
            $table->foreignId('farmer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('soils', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->cascadeOnDelete();
            $table->string('soil_type')->nullable();
            $table->decimal('nitrogen', 5, 2)->nullable();
            $table->decimal('phosphorus', 5, 2)->nullable();
            $table->decimal('potassium', 5, 2)->nullable();
            $table->decimal('pH', 3, 1)->nullable();
            $table->date('test_date')->nullable();
            $table->timestamps();
        });

        Schema::create('climates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->cascadeOnDelete();
            $table->decimal('temperature', 5, 2)->nullable();
            $table->decimal('rainfall', 6, 2)->nullable();
            $table->decimal('humidity', 5, 2)->nullable();
            $table->enum('season', ['wet','dry'])->nullable();
            $table->date('climate_record_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('climates');
        Schema::dropIfExists('soils');
        Schema::dropIfExists('farms');
    }
};
