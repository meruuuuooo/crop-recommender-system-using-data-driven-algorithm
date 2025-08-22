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
            ['category_id' => 2, 'name' => 'Apple'],
            ['category_id' => 2, 'name' => 'Cacao'],
            ['category_id' => 2, 'name' => 'Cashew/Pili Nut'],
            ['category_id' => 2, 'name' => 'Chico'],
            ['category_id' => 2, 'name' => 'Coffee'],
            ['category_id' => 2, 'name' => 'Dragon Fruit'],
            ['category_id' => 2, 'name' => 'Duhat (Java Plum)'],
            ['category_id' => 2, 'name' => 'Jackfruit'],
            ['category_id' => 2, 'name' => 'Mango'],
            ['category_id' => 2, 'name' => 'Santol (Cotton Fruit)'],
            ['category_id' => 2, 'name' => 'Sugar Apple (Atis)'],
            ['category_id' => 2, 'name' => 'Star Apple (Caimito)'],
            ['category_id' => 10, 'name' => 'Bell Pepper'],
            ['category_id' => 10, 'name' => 'Black Pepper'],
            ['category_id' => 10, 'name' => 'Chilli Green (Sinigang)'],
            ['category_id' => 10, 'name' => 'Pepper'],
            ['category_id' => 11, 'name' => 'Muskmelon/Honeydew'],
            ['category_id' => 11, 'name' => 'Watermelon'],
            ['category_id' => 12, 'name' => 'Kudzu (Pure)'],
            ['category_id' => 12, 'name' => 'Kudzu (With Grass)'],
            ['category_id' => 12, 'name' => 'Lemon Grass'],
            ['category_id' => 12, 'name' => 'Pasture Grass'],
            ['category_id' => 6, 'name' => 'Palm Date'],
            ['category_id' => 6, 'name' => 'Coconut'],
            ['category_id' => 7, 'name' => 'Abaca (Cordage)'],
            ['category_id' => 7, 'name' => 'Abaca (Pulp)'],
            ['category_id' => 7, 'name' => 'Banana (Fruit)'],
            ['category_id' => 7, 'name' => 'Banana (Pulp)'],
            ['category_id' => 7, 'name' => 'Mung Bean'],
            ['category_id' => 7, 'name' => 'Peanut'],
            ['category_id' => 7, 'name' => 'Pineapple'],
            ['category_id' => 7, 'name' => 'Tobacco (Filler)'],
            ['category_id' => 7, 'name' => 'Tobacco (Virginia)'],
            ['category_id' => 7, 'name' => 'Tobacco (Wrapper)'],
            ['category_id' => 8, 'name' => 'Rice'],
            ['category_id' => 9, 'name' => 'Arrowroot'],
            ['category_id' => 9, 'name' => 'Camote'],
            ['category_id' => 9, 'name' => 'Cassava'],
            ['category_id' => 9, 'name' => 'Gabi'],
            ['category_id' => 9, 'name' => 'Tugi'],
            ['category_id' => 9, 'name' => 'Ubi'],
            ['category_id' => 13, 'name' => 'Ampalaya (Bitter Gourd)'],
            ['category_id' => 13, 'name' => 'Baguio (Beans)'],
            ['category_id' => 13, 'name' => 'Batao'],
            ['category_id' => 13, 'name' => 'Broccoli'],
            ['category_id' => 13, 'name' => 'Cabbage'],
            ['category_id' => 13, 'name' => 'Carrots'],
            ['category_id' => 13, 'name' => 'Cauliflower'],
            ['category_id' => 13, 'name' => 'Celery'],
            ['category_id' => 13, 'name' => 'Chayote'],
            ['category_id' => 13, 'name' => 'Cucumber'],
            ['category_id' => 13, 'name' => 'Eggplant'],
            ['category_id' => 13, 'name' => 'Garlic'],
            ['category_id' => 13, 'name' => 'Ginger (Local)'],
            ['category_id' => 13, 'name' => 'Ginger (Imported)'],
            ['category_id' => 13, 'name' => 'Jute (Saluyot)'],
            ['category_id' => 13, 'name' => 'Lettuce'],
            ['category_id' => 1, 'name' => 'White Corn'],
            ['category_id' => 1, 'name' => 'Yellow Corn'],
        ];

        foreach ($crops as $crop) {
            Crop::factory()->create([
                'name' => $crop['name'],
                'category_id' => $crop['category_id'],
            ]);
        }


    }
}
