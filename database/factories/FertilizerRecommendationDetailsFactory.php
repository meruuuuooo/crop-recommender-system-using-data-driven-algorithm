<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FertilizerRecommendationDetails>
 */
class FertilizerRecommendationDetailsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'crop_variety_id' => \App\Models\CropVariety::factory(),
            'soil_type_id' => \App\Models\SoilType::factory(),
            'season_id' => \App\Models\Season::factory(),
            'nutrient_type_id' => \App\Models\NutrientType::factory(),
            'fertilizer_level_id' => \App\Models\FertilizerLevel::factory(),
            'amount' => fake()->randomFloat(2, 10, 500), // amount in kg/hectare
        ];
    }
}
