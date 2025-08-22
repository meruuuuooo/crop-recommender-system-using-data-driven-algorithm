<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class FertilizerRecommendationDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample fertilizer recommendation details
        // This demonstrates the complex relationships in the ERD

        for ($i = 1; $i <= 20; $i++) {
            \App\Models\FertilizerRecommendationDetails::create([
                'crop_variety_id' => rand(1, 13), // Based on seeded crop varieties
                'soil_type_id' => rand(1, 9),     // Based on seeded soil types
                'season_id' => rand(1, 5),        // Based on seeded seasons
                'nutrient_type_id' => rand(1, 10), // Based on seeded nutrient types
                'fertilizer_level_id' => rand(1, 5), // Based on seeded fertilizer levels
                'amount' => fake()->randomFloat(2, 10, 500), // kg/hectare
            ]);
        }
    }
}
