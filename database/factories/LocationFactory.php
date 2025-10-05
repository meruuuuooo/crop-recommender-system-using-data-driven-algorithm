<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'province_id' => 1,
            'municipality_id' => rand(1, 10), // Assuming you have 10 municipalities
            'barangay_id' => rand(1, 50), // Assuming you have
            'street' => $this->faker->streetAddress,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
