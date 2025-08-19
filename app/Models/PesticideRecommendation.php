<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PesticideRecommendation extends Model
{
    protected $fillable = [
        'pesticide_id',
        'crop_id',
        'usage_rate',
        'notes'
    ];

    public function pesticide()
    {
        return $this->belongsTo(Pesticide::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
