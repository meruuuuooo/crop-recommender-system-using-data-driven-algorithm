<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{

    use HasFactory;
    protected $fillable = ['name', 'region_code'];

    public function Municipality()
    {
        return $this->hasMany(Municipality::class);
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
