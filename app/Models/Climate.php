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
        'season',
        'climate_record_date',
    ];

    protected function casts(): array
    {
        return [
            'climate_record_date' => 'datetime',
            'temperature' => 'float',
            'rainfall' => 'float',
            'humidity' => 'float',
            'season' => 'string',
        ];
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
