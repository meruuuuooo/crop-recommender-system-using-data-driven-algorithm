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

        $farmnames = [
            'Hacienda Luisita',
            'Banaue Rice Terraces',
            'Palawan Coconut Grove',
            'Cebu Mango Orchard',
            'Mindanao Banana Plantation',
            'Laguna Corn Fields',
            'Batangas Pineapple Patch',
            'Ilocos Durian Estate',
            'Davao Calamansi Grove',
            'Bohol Sugarcane Farm'
        ];


        return [
            'name' => fake()->randomElement($farmnames),
            'total_area' => fake()->randomFloat(2, 0.5, 100), // in hectares
            'soil_type' => fake()->randomElement(['Clay', 'Loamy', 'Peaty', 'Saline', 'Sandy']),
            'prev_crops' => implode(', ', fake()->randomElements(['Rice', 'Corn', 'Tomato', 'Cabbage', 'Eggplant'], 2)),
            'farmer_id' => rand(1, 5),
            'location_id' => rand(1, 5),
        ];
    }
}
