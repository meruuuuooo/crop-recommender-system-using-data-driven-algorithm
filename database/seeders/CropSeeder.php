<?php

namespace Database\Seeders;

use App\Models\Crop;
use Illuminate\Database\Seeder;

class CropSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $crops = [
            // 🌽 Corn
            [
                'name' => 'Sweet Corn',
                'category_id' => 1,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Sep-Oct',
                'maturity' => '55-95 DAP',
            ],

            // 🌳 Fruit Trees
            [
                'name' => 'Mango',
                'category_id' => 2,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Dec-Feb',
                'maturity' => '4-5 Years',
            ],
            [
                'name' => 'Papaya',
                'category_id' => 2,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '8-10 Months',
            ],
            [
                'name' => 'Pineapple',
                'category_id' => 2,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Year-round',
                'maturity' => '18-24 Months',
            ],
            [
                'name' => 'Banana',
                'category_id' => 2,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '9-12 Months',
            ],

            // 🌴 Palm Trees
            [
                'name' => 'Coconut',
                'category_id' => 3,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'All season',
                'maturity' => '5-6 Years',
            ],
            [
                'name' => 'Palm Oil',
                'category_id' => 3,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Clay Loam',
                'time_of_planting' => 'All season',
                'maturity' => '3-4 Years',
            ],

            // 🌱 Plantation Crops
            [
                'name' => 'Abaca',
                'category_id' => 4,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '18-24 Months',
            ],
            [
                'name' => 'Coffee',
                'category_id' => 4,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Jun-Sep',
                'maturity' => '3-4 Years',
            ],
            [
                'name' => 'Cacao',
                'category_id' => 4,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Jun-Dec',
                'maturity' => '3-5 Years',
            ],
            [
                'name' => 'Rubber',
                'category_id' => 4,
                'crop_season' => 'wet',
                'soil_type' => 'Clay Loam',
                'time_of_planting' => 'Jun-Sep',
                'maturity' => '5-7 Years',
            ],
            [
                'name' => 'Sugarcane',
                'category_id' => 4,
                'crop_season' => 'dry/wet',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Sep-Nov',
                'maturity' => '10-12 Months',
            ],

            // 🌾 Rice
            [
                'name' => 'Rice',
                'category_id' => 5,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Clay',
                'time_of_planting' => 'Jun-Jul / Nov-Dec',
                'maturity' => '110-120 DAP',
            ],

            // 🥔 Root Crops
            [
                'name' => 'Cassava',
                'category_id' => 6,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'All season',
                'maturity' => '8-12 Months',
            ],
            [
                'name' => 'Sweet Potato',
                'category_id' => 6,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'All season',
                'maturity' => '3-5 Months',
            ],
            [
                'name' => 'Taro',
                'category_id' => 6,
                'crop_season' => 'wet',
                'soil_type' => 'Clay Loam',
                'time_of_planting' => 'May-Jul',
                'maturity' => '6-12 Months',
            ],
            [
                'name' => 'Yam',
                'category_id' => 6,
                'crop_season' => 'wet',
                'soil_type' => 'Loam',
                'time_of_planting' => 'May-Jun',
                'maturity' => '8-12 Months',
            ],

            // 🍆 Fruit Vegetables
            [
                'name' => 'Ampalaya',
                'category_id' => 7,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '60-75 DAP',
            ],
            [
                'name' => 'Eggplant',
                'category_id' => 7,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'All season',
                'maturity' => '90-120 DAP',
            ],
            [
                'name' => 'Okra',
                'category_id' => 7,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '60-75 DAP',
            ],
            [
                'name' => 'Tomato',
                'category_id' => 7,
                'crop_season' => 'dry/wet',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Jan-May / Sep-Oct',
                'maturity' => '55-65 DAT',
            ],
            [
                'name' => 'Pepper',
                'category_id' => 7,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Sep-Jan',
                'maturity' => '80-90 DAP',
            ],
            [
                'name' => 'Watermelon',
                'category_id' => 7,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Sep-Mar',
                'maturity' => '80-90 DAP',
            ],
            [
                'name' => 'Cucumber',
                'category_id' => 7,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'May-Jul / Oct-Dec',
                'maturity' => '50-65 DAP',
            ],
            [
                'name' => 'Patola',
                'category_id' => 7,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Apr-May / Sep-Nov',
                'maturity' => '60-85 DAP',
            ],
            [
                'name' => 'Upo',
                'category_id' => 7,
                'crop_season' => 'dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Oct-Mar',
                'maturity' => '90-100 DAP',
            ],
            [
                'name' => 'Chayote',
                'category_id' => 7,
                'crop_season' => 'cool',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Sep-Jan',
                'maturity' => '6-10 MAT',
            ],

            // 🥬 Vegetables
            [
                'name' => 'Cabbage',
                'category_id' => 10,
                'crop_season' => 'cool/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Oct-Dec',
                'maturity' => '55-60 DAP',
            ],
            [
                'name' => 'Carrot',
                'category_id' => 10,
                'crop_season' => 'cool/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'All season',
                'maturity' => '75-103 DAP',
            ],
            [
                'name' => 'Potato',
                'category_id' => 10,
                'crop_season' => 'cool/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Sep-Jan',
                'maturity' => '110-120 DAP',
            ],
            [
                'name' => 'Radish',
                'category_id' => 10,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Oct-Mar',
                'maturity' => '45-60 DAP',
            ],
            [
                'name' => 'Pechay',
                'category_id' => 10,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '25-30 DAT',
            ],
            [
                'name' => 'Mustard',
                'category_id' => 10,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '25-30 DAT',
            ],
            [
                'name' => 'Lettuce',
                'category_id' => 10,
                'crop_season' => 'cool/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '30-45 DAT',
            ],
            [
                'name' => 'Celery',
                'category_id' => 10,
                'crop_season' => 'cool/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Sep-Jan',
                'maturity' => '65-75 DAP',
            ],
            [
                'name' => 'Chinese Cabbage',
                'category_id' => 10,
                'crop_season' => 'cool',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Oct-Dec',
                'maturity' => '55-65 DAT',
            ],
            [
                'name' => 'Broccoli',
                'category_id' => 10,
                'crop_season' => 'cool',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Oct-Dec',
                'maturity' => '50-65 DAP',
            ],
            [
                'name' => 'Cauliflower',
                'category_id' => 10,
                'crop_season' => 'cool',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Sep-Jan',
                'maturity' => '45-60 DAT',
            ],

            // 🌱 Legumes / Beans
            [
                'name' => 'Mungbean',
                'category_id' => 10,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Feb-Mar / May-Jun / Sep-Oct',
                'maturity' => '65-72 DAP',
            ],
            [
                'name' => 'Peanut',
                'category_id' => 10,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Feb-Mar',
                'maturity' => '90-110 DAP',
            ],
            [
                'name' => 'Soybean',
                'category_id' => 10,
                'crop_season' => 'wet',
                'soil_type' => 'Loam',
                'time_of_planting' => 'May-Jun',
                'maturity' => '85-100 DAP',
            ],
            [
                'name' => 'Patani',
                'category_id' => 10,
                'crop_season' => 'dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Nov-Mar',
                'maturity' => '5-6 Months',
            ],
            [
                'name' => 'Bush Sitao',
                'category_id' => 10,
                'crop_season' => 'dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Nov-Mar',
                'maturity' => '45-50 DAP',
            ],
            [
                'name' => 'Sitao',
                'category_id' => 10,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '50-65 DAP',
            ],
            [
                'name' => 'Snap Bean',
                'category_id' => 10,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'All season',
                'maturity' => '43-52 DAP',
            ],
            [
                'name' => 'Bush Snap Bean',
                'category_id' => 10,
                'crop_season' => 'dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Oct-Jan',
                'maturity' => '50 DAP',
            ],
            [
                'name' => 'Cowpea',
                'category_id' => 10,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'All season',
                'maturity' => '60-75 DAP',
            ],
            [
                'name' => 'Chick Pea',
                'category_id' => 10,
                'crop_season' => 'dry',
                'soil_type' => 'Loam',
                'time_of_planting' => 'Sep-Jan',
                'maturity' => '60-90 DAP',
            ],
            [
                'name' => 'Sweet Pea',
                'category_id' => 10,
                'crop_season' => 'cool',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Nov-Jan',
                'maturity' => '80-90 DAP',
            ],

            // 🍉 Fruits (non-trees)
            [
                'name' => 'Cantaloupe',
                'category_id' => 8,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Sep-Feb',
                'maturity' => '85-90 DAT',
            ],
            [
                'name' => 'Muskmelon',
                'category_id' => 8,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Sep-Feb',
                'maturity' => '65-80 DAP',
            ],

            // 🌿 Leafy / Aquatic Veg
            [
                'name' => 'Kangkong',
                'category_id' => 10,
                'crop_season' => 'wet/dry',
                'soil_type' => 'Clay',
                'time_of_planting' => 'All season',
                'maturity' => '30-50 DAP',
            ],

            // 🌰 Spices & Bulbs
            [
                'name' => 'Onion Bulb',
                'category_id' => 10,
                'crop_season' => 'dry',
                'soil_type' => 'Sandy Loam',
                'time_of_planting' => 'Oct-Feb',
                'maturity' => '3-4 MAT',
            ],
        ];




        foreach ($crops as $crop) {
            Crop::create([
                'name' => $crop['name'],
                'category_id' => $crop['category_id'],
                'crop_season' => $crop['crop_season'],
                'soil_type' => $crop['soil_type'],
                'time_of_planting' => $crop['time_of_planting'],
                'maturity' => $crop['maturity'],
            ]);
        }
    }
}
