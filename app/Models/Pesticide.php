<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesticide extends Model
{
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
        'pest_weeds_diseases',
        'recommended_rate',
        'MRL',
        'PHI',
        're_entry_period'
    ];

    public function recommendations()
    {
        return $this->hasMany(PesticideRecommendation::class);
    }
}
