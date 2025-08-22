<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NutrientTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nutrients = [
            ['nutrient_name' => 'Nitrogen'],
            ['nutrient_name' => 'Phosphorus'],
            ['nutrient_name' => 'Potassium'],
            ['nutrient_name' => 'Calcium'],
            ['nutrient_name' => 'Magnesium'],
            ['nutrient_name' => 'Sulfur'],
            ['nutrient_name' => 'Iron'],
            ['nutrient_name' => 'Zinc'],
            ['nutrient_name' => 'Boron'],
            ['nutrient_name' => 'Manganese'],
        ];

        foreach ($nutrients as $nutrient) {
            \App\Models\NutrientType::create($nutrient);
        }
    }
}
