<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class cropFertilizer extends Model
{
    use HasFactory;

    protected $fillable = [
        'crop_id',
        'fertilizer_id',
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function fertilizer()
    {
        return $this->belongsTo(Fertilizer::class);
    }
}
