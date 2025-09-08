<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Climate extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id',
        'temperature',
        'rainfall',
        'humidity',
        'climate_record_date',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
