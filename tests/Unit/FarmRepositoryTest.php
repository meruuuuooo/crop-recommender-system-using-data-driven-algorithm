<?php

declare(strict_types=1);

use App\Models\Farm;
use App\Repositories\FarmRepository;

it('can create, find, update, and delete a farm using the repository', function () {
    $repo = new FarmRepository();
    $farm = $repo->create([
        'name' => 'Test Farm',
        'total_area' => 10,
        'cropping_system' => 'Mono',
        'prev_crops' => 'Rice',
        'farmer_id' => 1, // You may need to adjust this
        'location_id' => 1, // You may need to adjust this
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
