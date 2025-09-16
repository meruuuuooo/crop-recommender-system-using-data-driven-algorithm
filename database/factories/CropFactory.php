<?php

namespace Database\Factories;
use App\Models\Category;
use App\Models\Crop;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Crop>
 */
class CropFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Crop::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => $this->faker->word(),
            'time_of_planting' => $this->faker->monthName(),
            'maturity' => $this->faker->numberBetween(60, 120) . ' days',
            'ph_preference' => $this->faker->randomElement(['Acidic', 'Neutral', 'Alkaline']),
            'soil_requirement' => $this->faker->sentence(),
        ];
    }
}
