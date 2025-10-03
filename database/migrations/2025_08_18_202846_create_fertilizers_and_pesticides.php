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
            $table->string('company');
            $table->string('product_name');
            $table->string('type_of_product');
            $table->string('guaranteed_analysis');
            $table->string('target_crops');
            $table->string('registration_number');
            $table->string('expiry_date');
            $table->timestamps();
        });

        Schema::create('pesticides', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('active_ingredient');
            $table->string('product_name');
            $table->string('concentration');
            $table->string('formulation_type');
            $table->string('uses');
            $table->string('toxicity_category');
            $table->string('registration_number');
            $table->string('expiry_date');
            $table->string('mode_of_entry');
            $table->string('crops');
            $table->string('pests');
            $table->string('weeds');
            $table->string('diseases');
            $table->longText('recommended_rate');
            $table->text('MRL');
            $table->text('PHI');
            $table->longText('re_entry_period');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesticides');
        Schema::dropIfExists('fertilizers');
    }
};
