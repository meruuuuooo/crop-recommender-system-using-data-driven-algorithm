<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropVariety extends Model
{
    use HasFactory;

    protected $fillable = [
        'crop_id',
        'variety',
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function fertilizerRecommendationDetails()
    {
        return $this->hasMany(FertilizerRecommendationDetails::class);
    }
}
