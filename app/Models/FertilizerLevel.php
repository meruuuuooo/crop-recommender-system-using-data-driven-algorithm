<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FertilizerLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'level',
    ];

    public function fertilizerRecommendationDetails()
    {
        return $this->hasMany(FertilizerRecommendationDetails::class);
    }
}
