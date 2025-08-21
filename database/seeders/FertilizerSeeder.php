<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Fertilizer;

class FertilizerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = Storage::disk('public')->path('csv/fertilizer.csv');

        if (!file_exists($csvFile)){
            $this->command->error('CSV file not found: ' . $csvFile);
            return;
        }

        $file = fopen($csvFile, 'r');

        $header = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false){
            Fertilizer::factory()->create([
                'company' => $row[1],
                'product_name' => $row[2],
                'type_of_product' => $row[3],
                'guaranteed_analysis' => $row[4],
                'target_crops' => $row[5],
                'registration_number' => $row[6],
                'expiry_date' => $row[7],
            ]);
        }

        fclose($file);

        $this->command->info('Fertilizer data seeded successfully!');

    }
}
