<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Farmer>
 */
class FarmerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => fake()->optional()->lastName(),
            'contact_number' => fake()->phoneNumber(),
            'farming_experience' => fake()->numberBetween(1, 30), // years of experience
            'registration_date' => now(),
            'location_id' => 1,
            'user_id' => 1,
        ];
    }
}
