<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CropCalendar extends Model
{
    protected $table = 'crop_calendar';

    protected $fillable = [
        'crop_id',
        'activity',
        'start_date',
        'end_date'
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
