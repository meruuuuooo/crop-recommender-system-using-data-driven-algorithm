<?php

use App\Models\Category;
use App\Models\Crop;

test('crop model can be created with new fields', function () {
    $category = Category::factory()->create();

    $crop = Crop::factory()->create([
        'name' => 'Test Rice',
        'crop_season' => 'wet',
        'soil_type' => 'clay',
        'time_of_planting' => 'May-June',
        'plant_population_per_hectare' => '100,000 plants/ha',
        'maturity' => '120 days',
        'volume_of_production' => '5 tons/ha',
        'distance_of_planting_hills' => '30 cm',
        'distance_of_planting_rows' => '60 cm',
        'yield_per_hectare' => '4-6 tons/ha',
        'category_id' => $category->id,
    ]);

    expect($crop->name)->toBe('Test Rice');
    expect($crop->crop_season)->toBe('wet');
    expect($crop->soil_type)->toBe('clay');
    expect($crop->time_of_planting)->toBe('May-June');
    expect($crop->plant_population_per_hectare)->toBe('100,000 plants/ha');
    expect($crop->maturity)->toBe('120 days');
    expect($crop->volume_of_production)->toBe('5 tons/ha');
    expect($crop->distance_of_planting_hills)->toBe('30 cm');
    expect($crop->distance_of_planting_rows)->toBe('60 cm');
    expect($crop->yield_per_hectare)->toBe('4-6 tons/ha');
    expect($crop->category_id)->toBe($category->id);
});

test('crop has category relationship', function () {
    $category = Category::factory()->create(['name' => 'Cereals']);
    $crop = Crop::factory()->create(['category_id' => $category->id]);

    expect($crop->category)->not->toBeNull();
    expect($crop->category->name)->toBe('Cereals');
});
