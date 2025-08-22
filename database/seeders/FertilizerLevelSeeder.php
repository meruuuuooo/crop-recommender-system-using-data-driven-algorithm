<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class FertilizerLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            ['level' => 'Very Low'],
            ['level' => 'Low'],
            ['level' => 'Medium'],
            ['level' => 'High'],
            ['level' => 'Very High'],
        ];

        foreach ($levels as $level) {
            \App\Models\FertilizerLevel::create($level);
        }
    }
}
