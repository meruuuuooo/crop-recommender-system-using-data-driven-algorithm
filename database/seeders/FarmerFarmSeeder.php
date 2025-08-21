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
         Farmer::factory(10)->create([
            'user_id' => User::inRandomOrder()->first()->id,
            'location_id' => Location::inRandomOrder()->first()->id,
        ]);

        Farm::factory(10)->create([
            'farmer_id' => rand(1, 10),
            'location_id' => rand(1, 5),
        ]);
    }
}
