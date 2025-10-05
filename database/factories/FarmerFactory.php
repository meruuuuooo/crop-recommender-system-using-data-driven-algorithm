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

        $farmerName = [
            'firstname' => ['Juan', 'Pedro', 'Maria', 'Ana', 'Luis', 'Carlos', 'Jose', 'Rosa', 'Marta', 'Carmen'],
            'lastname' => ['Dela Cruz', 'Santos', 'Reyes', 'Garcia', 'Lopez', 'Martinez', 'Rodriguez', 'Hernandez', 'Gonzalez', 'Perez'],
            'middlename' => ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.']
        ];



        return [
            'firstname' => fake()->randomElement($farmerName['firstname']),
            'middlename' => fake()->optional()->randomElement($farmerName['middlename']),
            'lastname' => fake()->randomElement($farmerName['lastname']),
            'contact_number' => fake()->phoneNumber(),
            'farming_experience' => fake()->numberBetween(1, 30), // years of experience
            'registration_date' => fake()->date(),
            'location_id' => rand(1, 20),
            'user_id' => rand(1, 2),
        ];
    }
}
