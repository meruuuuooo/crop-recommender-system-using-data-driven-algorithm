<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fertilizer extends Model
{
    use HasFactory;
    protected $fillable = [
        'company',
        'product_name',
        'type_of_product',
        'guaranteed_analysis',
        'target_crops',
        'registration_number',
        'expiry_date'
    ];
}
