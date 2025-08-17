<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'region',
        'province',
        'municipality',
        'barangay',
    ];

    public function farms()
    {
        return $this->hasMany('App\Models\Farm');
    }
}
