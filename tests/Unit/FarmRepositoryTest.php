<?php

declare(strict_types=1);

use App\Models\Farm;
use App\Repositories\FarmRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use App\Models\Farmer;
use App\Models\Location;
use App\Models\User;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    Artisan::call('db:seed', ['--class' => 'LocationSeeder']);
});

it('can create, find, update, and delete a farm using the repository', function () {
    $repo = new FarmRepository();
    $location = Location::first();
    $user = User::factory()->create();
    $farmer = Farmer::factory()->create(['location_id' => $location->id, 'user_id' => $user->id]);

    $farm = $repo->create([
        'name' => 'Test Farm',
        'total_area' => 10,
        'cropping_system' => 'Mono',
        'prev_crops' => 'Rice',
        'farmer_id' => $farmer->id,
        'location_id' => $location->id,
    ]);
    expect($farm)->toBeInstanceOf(Farm::class);
    $found = $repo->find($farm->id);
    expect($found)->not->toBeNull();
    $repo->update($farm->id, ['name' => 'Updated Farm']);
    $updated = $repo->find($farm->id);
    expect($updated->name)->toBe('Updated Farm');
    $repo->delete($farm->id);
    expect($repo->find($farm->id))->toBeNull();
});

it('can get all farms using the repository', function () {
    $repo = new FarmRepository();
    $location = Location::first();
    $user = User::factory()->create();
    $farmer = Farmer::factory()->create(['location_id' => $location->id, 'user_id' => $user->id]);

    Farm::factory()->count(3)->create([
        'farmer_id' => $farmer->id,
        'location_id' => $location->id,
    ]);

    $all = $repo->all();

    expect($all)->toBeArray();
    expect(count($all))->toBe(3);
    foreach ($all as $farm) {
        expect($farm)->toBeInstanceOf(Farm::class);
    }
});
