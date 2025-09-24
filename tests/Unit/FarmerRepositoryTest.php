<?php

declare(strict_types=1);

use App\Models\Farmer;
use App\Repositories\FarmerRepository;

it('can create, find, update, and delete a farmer using the repository', function () {
    $repo = new FarmerRepository();
    $farmer = $repo->create([
        'firstname' => 'Test',
        'middlename' => 'T',
        'lastname' => 'User',
        'contact_number' => '1234567890',
        'farming_experience' => 5,
        'registration_date' => now(),
        'location_id' => 1, // You may need to adjust this
        'user_id' => 1, // You may need to adjust this
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
