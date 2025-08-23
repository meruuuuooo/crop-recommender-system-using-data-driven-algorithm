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
        $plantPopulations = ['100,000 plants/ha', '80,000 plants/ha', '120,000 plants/ha', '60,000 plants/ha'];
        $maturityPeriods = ['90 days', '120 days', '60-90 days', '3-4 months'];
        $volumesOfProduction = ['5 tons/ha', '10 tons/ha', '15 tons/ha', '20 tons/ha'];
        $distancesOfPlantingHills = ['30 cm', '40 cm', '50 cm', '60 cm'];
        $distancesOfPlantingRows = ['60 cm', '70 cm', '80 cm', '90 cm'];
        $yields = ['4-6 tons/ha', '3-5 tons/ha', '25-30 sacks/ha', '2-4 tons/ha'];

        return [
            'category_id' => \App\Models\Category::factory(),
            'name' => fake()->randomElement($crops),
            'crop_season' => fake()->randomElement($seasons),
            'soil_type' => fake()->randomElement($soilTypes),
            'time_of_planting' => fake()->randomElement($plantingTimes),
            'plant_population_per_hectare' => fake()->randomElement($plantPopulations),
            'maturity' => fake()->randomElement($maturityPeriods),
            'volume_of_production' => fake()->randomElement($volumesOfProduction),
            'distance_of_planting_hills' => fake()->randomElement($distancesOfPlantingHills),
            'distance_of_planting_rows' => fake()->randomElement($distancesOfPlantingRows),
            'yield_per_hectare' => fake()->randomElement($yields),
        ];
    }
}
