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
            'n_level' => fake()->randomElement(['Low', 'Medium', 'High']),
            'p_level' => fake()->randomElement(['Low', 'Medium', 'High']),
            'k_level' => fake()->randomElement(['Low', 'Medium', 'High']),
            'ph' => fake()->randomFloat(1, 4.0, 9.0),
            'test_date' => fake()->date(),
        ];
    }
}
