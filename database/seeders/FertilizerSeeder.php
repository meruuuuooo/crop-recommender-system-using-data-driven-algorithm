<?php

namespace Database\Seeders;

use App\Models\Fertilizer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class FertilizerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = Storage::disk('public')->path('csv/fertilizer.csv');

        if (! file_exists($csvFile)) {
            $this->command->error('CSV file not found: '.$csvFile);

            return;
        }

        $file = fopen($csvFile, 'r');

        $header = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false) {
            Fertilizer::create([
                'company' => $row[1] ?? 'Unknown Company',
                'product_name' => $row[2] ?? 'Unknown Product',
                'type_of_product' => $row[3] ?? 'Unknown Type',
                'guaranteed_analysis' => $row[4] ?? 'N/A',
                'target_crops' => $row[5] ?? 'All crops',
                'registration_number' => $row[6] ?? 'N/A',
                'expiry_date' => $row[7],
            ]);
        }

        fclose($file);

        $this->command->info('Fertilizer data seeded successfully!');

    }
}
