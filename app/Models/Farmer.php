<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'contact_number',
        'farming_experience',
        'address',
    ];

    protected $casts = [
        'registration_date' => 'datetime',
    ];

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }
}
