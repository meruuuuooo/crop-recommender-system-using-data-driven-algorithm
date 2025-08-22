<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FertilizerRecommendationDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'crop_variety_id',
        'soil_type_id',
        'season_id',
        'nutrient_type_id',
        'fertilizer_level_id',
        'amount',
    ];

    public function cropVariety()
    {
        return $this->belongsTo(CropVariety::class);
    }

    public function soilType()
    {
        return $this->belongsTo(SoilType::class);
    }

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function nutrientType()
    {
        return $this->belongsTo(NutrientType::class);
    }

    public function fertilizerLevel()
    {
        return $this->belongsTo(FertilizerLevel::class);
    }
}
