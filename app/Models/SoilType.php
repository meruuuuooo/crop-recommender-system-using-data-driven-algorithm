<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoilType extends Model
{
    use HasFactory;

    protected $fillable = [
        'soil_condition',
    ];

    public function fertilizerRecommendationDetails()
    {
        return $this->hasMany(FertilizerRecommendationDetails::class);
    }
}
