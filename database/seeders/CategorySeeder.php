<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $crop_categories = [
            ['name' => 'Corn'],
            ['name' => 'Fruits'],
            ['name' => 'Fruit Tress'],
            ['name' => 'Fruite Vegetablers'],
            ['name' => 'Grasses'],
            ['name' => 'Palm Trees'],
            ['name' => 'Plantation Crops'],
            ['name' => 'Rice'],
            ['name' => 'Root Crops'],
            ['name' => 'Vegetables'],
        ];

        foreach ($crop_categories as $category) {
            Category::factory()->create([
                'name' => $category['name'],
            ]);
        }

    }
}
