<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $seasons = [
            ['season_type' => 'Wet Season'],
            ['season_type' => 'Dry Season'],
            ['season_type' => 'Rainy Season'],
            ['season_type' => 'Summer Season'],
            ['season_type' => 'All Year Round'],
        ];

        foreach ($seasons as $season) {
            \App\Models\Season::create($season);
        }
    }
}
