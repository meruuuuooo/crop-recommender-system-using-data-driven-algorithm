<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    // use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'time_of_planting',
        'maturity',
        'ph_preference',
        'soil_requirement',
    ];

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
