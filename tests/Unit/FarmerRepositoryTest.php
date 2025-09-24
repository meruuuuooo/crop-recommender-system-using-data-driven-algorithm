<?php

declare(strict_types=1);

use App\Models\Farmer;
use App\Repositories\FarmerRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use App\Models\Location;
use App\Models\User;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    Artisan::call('db:seed', ['--class' => 'LocationSeeder']);
});

it('can create, find, update, and delete a farmer using the repository', function () {
    $repo = new FarmerRepository();
    $location = Location::first();
    $user = User::factory()->create();
    $farmer = $repo->create([
        'firstname' => 'Mel',
        'middlename' => 'T',
        'lastname' => 'David',
        'contact_number' => '09161796490',
        'farming_experience' => 5,
        'registration_date' => now(),
        'location_id' => $location->id,
        'user_id' => $user->id,
    ]);
    expect($farmer)->toBeInstanceOf(Farmer::class);
    $found = $repo->find($farmer->id);

    expect($found)->not->toBeNull();

    $repo->update($farmer->id, ['firstname' => 'Updated']);
    $updated = $repo->find($farmer->id);

    expect($updated->firstname)->toBe('Updated');
    $repo->delete($farmer->id);

    expect($repo->find($farmer->id))->toBeNull();
});

it('can get all farmers using the repository', function () {
    $repo = new FarmerRepository();
    $location = Location::first();
    $user = User::factory()->create();

    Farmer::factory()->count(3)->create([
        'location_id' => $location->id,
        'user_id' => $user->id,
    ]);

    $all = $repo->all();

    expect($all)->toBeArray();
    expect(count($all))->toBe(3);
    foreach ($all as $farmer) {
        expect($farmer)->toBeInstanceOf(Farmer::class);
    }
});