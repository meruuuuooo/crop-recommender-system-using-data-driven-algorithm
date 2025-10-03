<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'contact_number',
        'farming_experience',
        'registration_date',
        'location_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }

    public function soils()
    {
        return $this->hasManyThrough(Soil::class, Farm::class);
    }
}
