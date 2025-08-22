<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CropVarietySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Common crop varieties in the Philippines
        $varieties = [
            // Rice varieties
            ['crop_id' => 1, 'variety' => 'IR64'],
            ['crop_id' => 1, 'variety' => 'PSB Rc82'],
            ['crop_id' => 1, 'variety' => 'NSIC Rc160'],
            ['crop_id' => 1, 'variety' => 'NSIC Rc222'],

            // Corn varieties
            ['crop_id' => 2, 'variety' => 'Pioneer 30G12'],
            ['crop_id' => 2, 'variety' => 'NK6410'],
            ['crop_id' => 2, 'variety' => 'Dekalb 818'],

            // Tomato varieties
            ['crop_id' => 3, 'variety' => 'Determinate'],
            ['crop_id' => 3, 'variety' => 'Indeterminate'],
            ['crop_id' => 3, 'variety' => 'Cherry'],

            // Cabbage varieties
            ['crop_id' => 4, 'variety' => 'Green Coronet'],
            ['crop_id' => 4, 'variety' => 'Scorpio'],
            ['crop_id' => 4, 'variety' => 'Legacy'],
        ];

        foreach ($varieties as $variety) {
            \App\Models\CropVariety::create($variety);
        }
    }
}
