<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropFertilizer extends Model
{

    use HasFactory;
    protected $fillable = [
        'crop_name',
        'variety_and_condition',
        'nutrient',
        'soil_level',
        'recommendation_amount',
        'unit',
    ];




}
