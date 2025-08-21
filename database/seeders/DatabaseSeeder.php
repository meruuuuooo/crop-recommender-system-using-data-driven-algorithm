<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\FarmerFarmSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\CropSeeder;
use Database\Seeders\FertilizerSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'first_name' => 'Test',
            'middle_name' => 'Middle',
            'last_name' => 'User',
            'contact_number' => '1234567890',
            'email' => 'test@example.com',
        ]);

        (new LocationSeeder())->run();

        (new FarmerFarmSeeder())->run();

        (new CategorySeeder())->run();

        (new CropSeeder())->run();

    }
}
