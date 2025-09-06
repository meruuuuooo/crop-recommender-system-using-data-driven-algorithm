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
            'name' => $this->faker->word(),
            'category_id' => Category::factory(),
            'crop_season' => $this->faker->randomElement(['Spring', 'Summer', 'Fall', 'Winter']),
            'maturity' => $this->faker->randomElement(['90 days', '120 days', '60-90 days', '3-4 months']),
            'soil_type' => $this->faker->randomElement(['clay', 'loam', 'sandy', 'silt']),
            'time_of_planting' => $this->faker->randomElement(['May-June', 'October-November', 'January-February', 'March-April']),
        ];
    }
}
