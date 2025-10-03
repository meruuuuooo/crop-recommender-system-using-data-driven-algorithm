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
            'firstname' => fake()->firstName(),
            'middlename' => fake()->optional()->lastName(),
            'lastname' => fake()->lastName(),
            'contact_number' => fake()->phoneNumber(),
            'farming_experience' => fake()->numberBetween(1, 30), // years of experience
            'registration_date' => fake()->date(),
            'location_id' => \App\Models\Location::factory(),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
