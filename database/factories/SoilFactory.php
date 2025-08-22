<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Soil>
 */
class SoilFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'farm_id' => \App\Models\Farm::factory(),
            'soil_type' => fake()->randomElement(['Clay', 'Sandy', 'Loam', 'Silt', 'Peat', 'Chalk']),
            'nitrogen' => fake()->randomFloat(2, 0, 300), // ppm
            'phosphorus' => fake()->randomFloat(2, 0, 200), // ppm
            'potassium' => fake()->randomFloat(2, 0, 400), // ppm
            'pH' => fake()->randomFloat(1, 4.0, 9.0),
            'test_date' => fake()->date(),
        ];
    }
}
