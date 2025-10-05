<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropPesticide extends Model
{
    use HasFactory;

    protected $fillable = [
        'crop_id',
        'pesticide_id',
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function pesticide()
    {
        return $this->belongsTo(Pesticide::class);
    }
}
