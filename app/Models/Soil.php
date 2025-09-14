<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soil extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id',
        'soil_type',
        'nitrogen_level',
        'phosphorus_level',
        'potassium_level',
        'nitrogen',
        'phosphorus',
        'potassium',
        'pH',
        'test_date',
    ];

    protected function casts(): array
    {
        return [
            'test_date' => 'datetime',
            'pH' => 'float',
            'nitrogen' => 'float',
            'phosphorus' => 'float',
            'potassium' => 'float',
        ];
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function farmer()
    {
        return $this->farm->farmer();
    }
}
