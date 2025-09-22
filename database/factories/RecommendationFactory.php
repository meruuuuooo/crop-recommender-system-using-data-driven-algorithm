<?php

namespace Database\Factories;

use App\Models\Crop;
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
            'farmer_id' => \App\Models\Farmer::factory(),
            'farm_id' => \App\Models\Farm::factory(),
            'crop_id' => random_int(1, Crop::count()), // Assuming crops are already seeded
            'soil_id' => \App\Models\Soil::factory(),
            'climate_id' => \App\Models\Climate::factory(),
            'confidence_score' => fake()->randomFloat(2, 0, 1),
            'recommendation_date' => fake()->date(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
