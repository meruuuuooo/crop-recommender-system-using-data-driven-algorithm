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
            ['name' => 'Fruit Trees'],
            ['name' => 'Palm Trees'],
            ['name' => 'Plantation Crops'],
            ['name' => 'Rice'],
            ['name' => 'Root Crops'],
            ['name' => 'Fruit Vegetables'],
            ['name' => 'Fruits'],
            ['name' => 'Grasses'],
            ['name' => 'Vegetables'],
        ];

        foreach ($crop_categories as $category) {
            Category::create([
                'name' => $category['name'],
            ]);
        }

    }
}
