<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Farm>
 */
class FarmFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'total_area' => fake()->numberBetween(1, 1000), // in hectares
            'prev_crops' => fake()->sentence(),
            'farmer_id' => 1, // Assuming a default farmer ID
            'location_id' => 1, // Assuming a default location ID
        ];
    }
}
