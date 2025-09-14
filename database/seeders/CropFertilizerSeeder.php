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
        $csvFile = Storage::disk('public')->path('csv/fertilizer_per_crop.csv');

        if (! file_exists($csvFile)) {
            $this->command->error('CSV file not found: '.$csvFile);

            return;
        }

        $file = fopen($csvFile, 'r');

        $header = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false) {
            CropFertilizer::create([
                'crop_name' => $row[0],
                'variety_and_condition' => $row[1] ?? 'N/A',
                'nutrient' => $row[2],
                'soil_level' => $row[3],
                'recommendation_amount' => $row[4],
                'unit' => $row[5],
            ]);
        }

        fclose($file);

        $this->command->info('Crop Fertilizer data seeded successfully!');

    }
}
