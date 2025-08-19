<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Soil extends Model
{
    protected $fillable = [
        'farm_id',
        'soil_type',
        'nitrogen',
        'phosphorus',
        'potassium',
        'pH',
        'test_date'
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
