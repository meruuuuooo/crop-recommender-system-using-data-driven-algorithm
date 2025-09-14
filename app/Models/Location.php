<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'province_id',
        'municipality_id',
        'barangay_id',
        'street',
    ];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function Municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}
