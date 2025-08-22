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
            ['id' => 6, 'name' => 'Palm Trees'],
            ['id' => 7, 'name' => 'Plantation Crops'],
            ['id' => 8, 'name' => 'Rice'],
            ['id' => 9, 'name' => 'Root Crops'],
            ['id' => 10, 'name' => 'Fruit Vegetables'],
            ['id' => 11, 'name' => 'Fruits'],
            ['id' => 12, 'name' => 'Grasses'],
            ['id' => 13, 'name' => 'Other Vegetables'],
        ];

        foreach ($crop_categories as $category) {
            Category::factory()->create([
                'id' => $category['id'],
                'name' => $category['name'],
            ]);
        }

    }
}
