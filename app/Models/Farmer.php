<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class farmer extends Model
{

    use HasFactory;
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
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
}
