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
            $table->float('total_area')->nullable();
            $table->string('prev_crops')->nullable();
            $table->foreignId('farmer_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('soils', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->string('soil_type');
            $table->string('nitrogen_level');
            $table->string('phosphorus_level')->nullable();
            $table->string('potassium_level')->nullable();
            $table->float('nitrogen');
            $table->float('phosphorus');
            $table->float('potassium');
            $table->float('pH');
            $table->date('test_date');
            $table->timestamps();
        });

        Schema::create('climates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->float('temperature');
            $table->float('rainfall');
            $table->float('humidity');
            $table->date('climate_record_date');
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
