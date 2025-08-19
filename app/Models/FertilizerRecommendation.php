<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FertilizerRecommendation extends Model
{
    protected $fillable = [
        'fertilizer_id',
        'crop_id',
        'usage_rate',
        'notes'
    ];

    public function fertilizer()
    {
        return $this->belongsTo(Fertilizer::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
