<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'crop_season',
        'description',
    ];

    public function nutrients()
    {
        return $this->hasOne(CropNutrient::class);
    }

    public function varieties()
    {
        return $this->hasMany(CropVariety::class);
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
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
