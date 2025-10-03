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
            'name' => fake()->words(2, true).' Farm',
            'total_area' => fake()->randomFloat(2, 0.5, 100), // in hectares
            'prev_crops' => implode(', ', fake()->randomElements(['Rice', 'Corn', 'Tomato', 'Cabbage', 'Eggplant'], 2)),
            'farmer_id' => \App\Models\Farmer::factory(),
            'location_id' => \App\Models\Location::factory(),
        ];
    }
}
