<?php

namespace Database\Seeders;

use App\Models\Pesticide;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PesticideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = Storage::disk('public')->path('csv/pesticideV2.csv');

        if (! file_exists($csvFile)) {
            $this->command->error('CSV file not found: '.$csvFile);

            return;
        }

        $file = fopen($csvFile, 'r');

        $header = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false) {
            Pesticide::create([
                'company' => $row[0] ?? null,                    // NAME OF COMPANY
                'active_ingredient' => $row[1] ?? null,         // ACTIVE INGREDIENT
                'product_name' => $row[2] ?? null,              // PRODUCT NAME
                'concentration' => $row[3] ?? null,             // CONCENTRATION
                'formulation_type' => $row[4] ?? null,          // FORMULATION TYPE
                'uses' => $row[5] ?? null,                      // USE/S
                'toxicity_category' => $row[6] ?? null,         // TOXICITY CATEGORY
                'registration_number' => $row[7] ?? null,       // REGISTRATION NO.
                'expiry_date' => $row[8] ?? null,       // EXPIRY DATE
                'mode_of_entry' => $row[9] ?? null,             // MODE OF ENTRY
                'crops' => $row[10] ?? null,                    // CROPS
                'pests' => $row[11] ?? null,     // PESTS / WEEDS / DISEASES
                'weeds' => $row[12] ?? null,     // PESTS / WEEDS / DISEASES
                'diseases' => $row[13] ?? null,     // PESTS / WEEDS / DISEASES
                'recommended_rate' => $row[14] ?? null,         // RECOMMENDED RATE
                'MRL' => $row[15] ?? null,                      // MRL (Proposed)
                'PHI' => $row[16] ?? null,                       // PHI
                're_entry_period' => $row[17] ?? null,
            ]);
        }

        fclose($file);

        $this->command->info('Pesticide data seeded successfully!');

    }
}
