<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Climate extends Model
{
    protected $fillable = [
        'farm_id',
        'temperature',
        'rainfall',
        'humidity',
        'season',
        'climate_record_date'
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
