<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{

    use HasFactory;
    protected $fillable = [
        'name',
        'total_area',
        'soil_type',
        'prev_crops',
        'farmer_id',
        'location_id'
    ];

    public function farmer()
    {
        return $this->belongsTo(Farmer::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function soils()
    {
        return $this->hasMany(Soil::class);
    }

    public function climates()
    {
        return $this->hasMany(Climate::class);
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }

}
