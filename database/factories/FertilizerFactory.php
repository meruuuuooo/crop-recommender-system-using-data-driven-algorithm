<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Fertilizer>
 */
class FertilizerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company' => $this->faker->company,
            'product_name' => $this->faker->word,
            'type_of_product' => $this->faker->word,
            'guaranteed_analysis' => $this->faker->sentence,
            'target_crops' => $this->faker->word,
            'registration_number' => $this->faker->unique()->numerify('REG-#####'),
            'expiry_date' => $this->faker->dateTimeBetween('now', '+2 years'),
        ];
    }
}
