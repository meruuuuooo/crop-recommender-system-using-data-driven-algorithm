<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'meruuuuooo',
            'firstname' => 'Mel',
            'middlename' => 'David',
            'lastname' => 'Mailem',
            'contact_number' => '1234567890',
            'email' => 'mailem.meldavid@gmail.com',
        ]);

        User::factory()->create([
            'name' => 'Rusty',
            'firstname' => 'Rusty',
            'middlename' => 'E',
            'lastname' => 'Pelin',
            'contact_number' => '23241243512',
            'email' => 'rusty.pelin@gmail.com',
            'password' => bcrypt('handyRusty123'),
        ]);

        (new LocationSeeder)->run();

        (new FarmerFarmSeeder)->run();

        (new CategorySeeder)->run();

        (new CropSeeder)->run();

        (new SoilClimateSeeder)->run();

        (new RecommendationSeeder)->run();

        $this->call([
            CropFertilizerSeeder::class,
        ]);
    }
}
