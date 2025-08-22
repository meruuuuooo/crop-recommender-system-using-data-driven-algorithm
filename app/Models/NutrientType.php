<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NutrientType extends Model
{
    use HasFactory;

    protected $fillable = [
        'nutrient_name',
    ];

    public function fertilizerRecommendationDetails()
    {
        return $this->hasMany(FertilizerRecommendationDetails::class);
    }
}
