<?php

use App\Models\User;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Farm;
use App\Models\Location;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('can store farmer and farm data successfully', function () {
    // Create test location data
    $province = Province::factory()->create();
    $municipality = Municipality::factory()->create(['province_id' => $province->id]);
    $barangay = Barangay::factory()->create(['municipality_id' => $municipality->id]);

    $formData = [
        'farmer' => [
            'firstname' => 'John',
            'middlename' => 'M',
            'lastname' => 'Doe',
            'contact_number' => '09123456789',
            'farming_experience' => 5,
            'registration_date' => '2024-01-01',
            'province_id' => $province->id,
            'municipality_id' => $municipality->id,
            'barangay_id' => $barangay->id,
            'street' => '123 Main St',
        ],
        'farm' => [
            'name' => 'Test Farm',
            'total_area' => 10.5,
            'prev_crops' => 'Rice, Corn',
            'province_id' => $province->id,
            'municipality_id' => $municipality->id,
            'barangay_id' => $barangay->id,
        ],
    ];

    $response = $this->post(route('registration.store'), $formData);

    $response->assertRedirect(route('recommendation.crop'));
    $response->assertSessionHas('success', 'Farmer and farm registered successfully!');

    // Assert farmer was created
    $this->assertDatabaseHas('farmers', [
        'firstname' => 'John',
        'lastname' => 'Doe',
        'user_id' => $this->user->id,
    ]);

    // Assert farm was created
    $this->assertDatabaseHas('farms', [
        'name' => 'Test Farm',
        'total_area' => 10.5,
    ]);

    // Assert locations were created
    $this->assertDatabaseCount('locations', 2); // One for farmer, one for farm
});

it('handles validation errors properly', function () {
    $response = $this->post(route('registration.store'), []);

    $response->assertSessionHasErrors([
        'farmer.firstname',
        'farmer.lastname',
        'farmer.contact_number',
        'farmer.farming_experience',
        'farmer.registration_date',
        'farmer.province_id',
        'farmer.municipality_id',
        'farmer.barangay_id',
        'farmer.street',
        'farm.name',
        'farm.total_area',
        'farm.province_id',
        'farm.municipality_id',
        'farm.barangay_id',
    ]);
});

it('rolls back transaction on failure', function () {
    // Create test location data
    $province = Province::factory()->create();
    $municipality = Municipality::factory()->create(['province_id' => $province->id]);
    $barangay = Barangay::factory()->create(['municipality_id' => $municipality->id]);

    // Mock a failure by using invalid data that would pass validation but fail on insert
    $formData = [
        'farmer' => [
            'firstname' => 'John',
            'middlename' => 'M',
            'lastname' => 'Doe',
            'contact_number' => '09123456789',
            'farming_experience' => 5,
            'registration_date' => '2024-01-01',
            'province_id' => $province->id,
            'municipality_id' => $municipality->id,
            'barangay_id' => $barangay->id,
            'street' => '123 Main St',
        ],
        'farm' => [
            'name' => 'Test Farm',
            'total_area' => 10.5,
            'prev_crops' => 'Rice, Corn',
            'province_id' => 999999, // Non-existent province to cause failure
            'municipality_id' => $municipality->id,
            'barangay_id' => $barangay->id,
        ],
    ];

    $response = $this->post(route('registration.store'), $formData);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['general']);

    // Assert no farmer was created due to rollback
    $this->assertDatabaseCount('farmers', 0);
    $this->assertDatabaseCount('farms', 0);
});
