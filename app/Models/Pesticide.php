<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesticide extends Model
{
    use HasFactory;

    protected $fillable = [
        'company',
        'active_ingredient',
        'product_name',
        'concentration',
        'formulation_type',
        'uses',
        'toxicity_category',
        'registration_number',
        'expiry_date',
        'mode_of_entry',
        'crops',
        'pests',
        'weeds',
        'diseases',
        'recommended_rate',
        'MRL',
        'PHI',
        're_entry_period',
    ];
}
