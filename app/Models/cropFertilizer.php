<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropFertilizer extends Model
{

    use HasFactory;
    protected $fillable = [
        'crop_name',
        'growth_stage',
        'soil_type',
        'nitrogen_level',
        'nitrogen_rate',
        'phosphorus_level',
        'phosphorus_rate',
        'potassium_level',
        'potassium_rate',
        'unit_of_measure'
    ];

}
