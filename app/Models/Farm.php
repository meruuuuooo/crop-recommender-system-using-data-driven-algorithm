<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{
    protected $fillable = [
        'name',
        'farmer_id',
        'location_id',
        'size',
    ];

    public function farmer()
    {
        return $this->belongsTo('App\Models\Farmer');
    }

    public function location()
    {
        return $this->belongsTo('App\Models\Location');
    }
}
