<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'season',
        'description',
        'varieties',
        'category_id',
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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
