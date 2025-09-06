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
            ['id' => 1, 'name' => 'Corn'],
            ['id' => 2, 'name' => 'Fruit Trees'],
            ['id' => 3, 'name' => 'Palm Trees'],
            ['id' => 4, 'name' => 'Plantation Crops'],
            ['id' => 5, 'name' => 'Rice'],
            ['id' => 6, 'name' => 'Root Crops'],
            ['id' => 7, 'name' => 'Fruit Vegetables'],
            ['id' => 8, 'name' => 'Fruits'],
            ['id' => 9, 'name' => 'Grasses'],
            ['id' => 10, 'name' => 'Vegetables'],
        ];

        foreach ($crop_categories as $category) {
            Category::create([
                'id' => $category['id'],
                'name' => $category['name'],
            ]);
        }


    }
}
