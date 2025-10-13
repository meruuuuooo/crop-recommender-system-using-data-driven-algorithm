<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Climate>
 */
class ClimateFactory extends Factory
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
            'temperature' => fake()->randomFloat(1, 20.0, 35.0), // Celsius
            'rainfall' => fake()->randomFloat(2, 0, 500), // mm
            'humidity' => fake()->randomFloat(1, 40.0, 95.0), // percentage
            'season' => fake()->randomElement(['Dry', 'Wet']),
            'climate_record_date' => fake()->date(),
        ];
    }
}
