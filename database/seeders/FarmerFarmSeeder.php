<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Farmer;
use App\Models\Farm;
use App\Models\User;
use App\Models\Location;

class FarmerFarmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Farmer::factory(250)->create()->each(function (Farmer $farmer) {
            // Assign a random location to each farmer
            $farmer->location_id = rand(1, 20);
            $farmer->user_id = rand(1, 2);
            $farmer->save();

            // Create a farm for each farmer
            Farm::factory()->create([
            'farmer_id' => $farmer->id,
            'location_id' => rand(1, 20),
            ]);
        });

        // If you want exactly 250 farms, the above will create 250 farms (one per farmer).
        // If you want more farms per farmer, adjust the Farm::factory() call accordingly.
    }
}
