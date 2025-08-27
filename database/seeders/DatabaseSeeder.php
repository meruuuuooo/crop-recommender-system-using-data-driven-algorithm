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
            'name' => 'Test User',
            'firstname' => 'Test',
            'middlename' => 'Middle',
            'lastname' => 'User',
            'contact_number' => '1234567890',
            'email' => 'test@example.com',
        ]);

        (new LocationSeeder)->run();

        (new FarmerFarmSeeder)->run();

        (new CategorySeeder)->run();

        (new CropSeeder)->run();
        // (new FertilizerSeeder)->run(); // Disabled temporarily

        (new SoilClimateSeeder)->run();
        (new RecommendationSeeder)->run();

    }
}
