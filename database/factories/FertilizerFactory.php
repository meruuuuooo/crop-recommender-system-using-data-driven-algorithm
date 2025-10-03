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
            'company' => fake()->company(),
            'product_name' => fake()->words(2, true),
            'type_of_product' => fake()->randomElement(['Organic', 'Inorganic', 'Compound', 'Liquid', 'Granular']),
            'guaranteed_analysis' => fake()->randomElement(['N-P-K 14-14-14', 'N-P-K 16-16-16', 'N-P-K 18-18-18', 'Urea 46-0-0']),
            'target_crops' => implode(', ', fake()->randomElements(['Rice', 'Corn', 'Vegetables', 'Fruits', 'All crops'], 3)),
            'registration_number' => fake()->unique()->numerify('REG-#####'),
            'expiry_date' => fake()->dateTimeBetween('now', '+2 years')->format('Y-m-d'),
        ];
    }
}
