<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Crop;

class CropSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $crops = [
            ['name' => 'White Corn', 'category_id' => 1],
            ['name' => 'Apple', 'category_id' => 2],
            ['name' => 'Mango', 'category_id' => 2],
            ['name' => 'Orange', 'category_id' => 2],
            ['name' => 'Banana', 'category_id' => 2],
            ['name' => 'Grapes', 'category_id' => 2],
            ['name' => 'Tomato', 'category_id' => 10],
            ['name' => 'Potato', 'category_id' => 9],
            ['name' => 'Carrot', 'category_id' => 10],
            ['name' => 'Onion', 'category_id' => 10],
            ['name' => 'Wheat', 'category_id' => 1],
            ['name' => 'Rice', 'category_id' => 8],
            ['name' => 'Barley', 'category_id' => 1],
            ['name' => 'Oats', 'category_id' => 1],
            ['name' => 'Soybean', 'category_id' => 1],
            ['name' => 'Sugarcane', 'category_id' => 7],
            ['name' => 'Coconut', 'category_id' => 6],
            ['name' => 'Palm Oil', 'category_id' => 6],
            ['name' => 'Coffee', 'category_id' => 7],
            ['name' => 'Tea', 'category_id' => 7],
        ];

        foreach ($crops as $crop) {
            Crop::factory()->create([
                'name' => $crop['name'],
                'category_id' => $crop['category_id'],
            ]);
        }


    }
}
