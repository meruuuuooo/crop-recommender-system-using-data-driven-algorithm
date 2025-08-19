<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = [
        'name',
        'crop_season',
        'description',
        'variety',
        'category'
    ];

    public function nutrients()
    {
        return $this->hasOne(CropNutrient::class);
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }

    public function fertilizerRecommendations()
    {
        return $this->hasMany(FertilizerRecommendation::class);
    }

    public function pesticideRecommendations()
    {
        return $this->hasMany(PesticideRecommendation::class);
    }

    public function cropCalendar()
    {
        return $this->hasMany(CropCalendar::class);
    }
}
