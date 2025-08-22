<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SoilTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $soilTypes = [
            ['soil_condition' => 'Clay'],
            ['soil_condition' => 'Sandy'],
            ['soil_condition' => 'Loam'],
            ['soil_condition' => 'Silt'],
            ['soil_condition' => 'Peat'],
            ['soil_condition' => 'Chalk'],
            ['soil_condition' => 'Sandy Loam'],
            ['soil_condition' => 'Clay Loam'],
            ['soil_condition' => 'Silt Loam'],
        ];

        foreach ($soilTypes as $soilType) {
            \App\Models\SoilType::create($soilType);
        }
    }
}
