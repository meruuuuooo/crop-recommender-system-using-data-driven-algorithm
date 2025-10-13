<?php

namespace Database\Factories;

use App\Models\Crop;
use App\Models\Farmer;
use App\Models\Farm;
use App\Models\Soil;
use App\Models\Climate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recommendation>
 */
class RecommendationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'farmer_id' => Farmer::factory(),
            'farm_id' => Farm::factory(),
            'crop_id' => random_int(1, Crop::count()), // Assuming crops are already seeded
            'soil_id' => Soil::factory(),
            'climate_id' => Climate::factory(),
            'suitability_score' => fake()->randomFloat(2, 0, 1),
            'recommendation_date' => fake()->date(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
