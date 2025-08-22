<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SoilType>
 */
class SoilTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'soil_condition' => fake()->randomElement(['Clay', 'Sandy', 'Loam', 'Silt', 'Peat', 'Chalk']),
        ];
    }
}
