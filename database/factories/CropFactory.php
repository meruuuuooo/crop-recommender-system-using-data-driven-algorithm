<?php

namespace Database\Factories;

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
    public function definition(): array
    {
        $crops = ['Rice', 'Corn', 'Tomato', 'Cabbage', 'Lettuce', 'Carrot', 'Eggplant', 'Potato'];
        $seasons = ['wet', 'dry', 'all'];
        $soilTypes = ['clay', 'loam', 'sandy', 'silt'];
        $plantingTimes = ['May-June', 'October-November', 'January-February', 'March-April'];
        $maturityPeriods = ['90 days', '120 days', '60-90 days', '3-4 months'];

        return [
            'category_id' => \App\Models\Category::factory(),
            'name' => fake()->randomElement($crops),
            'crop_season' => fake()->randomElement($seasons),
            'soil_type' => fake()->randomElement($soilTypes),
            'time_of_planting' => fake()->randomElement($plantingTimes),
            'maturity' => fake()->randomElement($maturityPeriods),
        ];
    }
}
