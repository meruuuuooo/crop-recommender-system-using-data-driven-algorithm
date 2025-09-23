<?php

namespace Database\Seeders;

use App\Models\CropFertilizer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CropFertilizerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = Storage::disk('public')->path('csv/fertilizer_recommendation_v2.csv');

        if (! file_exists($csvFile)) {
            $this->command->error('CSV file not found: '.$csvFile);

            return;
        }

        $file = fopen($csvFile, 'r');

        $header = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false) {
            CropFertilizer::create([
                'crop_name' => $row[1],
                'growth_stage' => $row[2] ?: 'N/A',
                'soil_type' => $row[3] ?: 'N/A',
                'nitrogen_level' => $row[4] ?: null,
                'nitrogen_rate' => is_numeric($row[5]) ? (float) $row[5] : null,
                'phosphorus_level' => $row[6] ?: null,
                'phosphorus_rate' => is_numeric($row[7]) ? (float) $row[7] : null,
                'potassium_level' => $row[8] ?: null,
                'potassium_rate' => is_numeric($row[9]) ? (float) $row[9] : null,
                'unit_of_measure' => $row[10] ?: null,
            ]);
        }

        fclose($file);

        $this->command->info('Crop Fertilizer data seeded successfully!');

    }
}
