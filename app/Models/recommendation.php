<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{

    use HasFactory;
    protected $fillable = [
        'farmer_id',
        'farm_id',
        'crop_id',
        'soil_id',
        'climate_id',
        'confidence_score',
        'recommendation_date'
    ];

    protected function casts(): array
    {
        return [
            'recommendation_date' => 'datetime',
            'confidence_score' => 'float',
        ];
    }

    public function farmer()
    {
        return $this->belongsTo(Farmer::class);
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function soil()
    {
        return $this->belongsTo(Soil::class);
    }

    public function climate()
    {
        return $this->belongsTo(Climate::class);
    }

    public function recentRecommendations()
    {
        return Recommendation::with('crop', 'farmer', 'farm')
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get();
    }

}
