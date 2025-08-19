<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CropNutrient extends Model
{
    protected $fillable = [
        'crop_id',
        'nitrogen',
        'phosphorus',
        'potassium'
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
