<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soil extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id',
        'n_level',
        'p_level',
        'k_level',
        'ph',
        'test_date',
    ];

    protected function casts(): array
    {
        return [
            'test_date' => 'datetime',
            'ph' => 'float',
            'n_level' => 'string',
            'p_level' => 'string',
            'k_level' => 'string',
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
