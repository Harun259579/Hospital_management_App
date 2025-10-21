<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorShedule extends Model
{
    use HasFactory;
    
    protected $table = 'doctor_shedules';
    protected $fillable = ['doctor_id', 'day_of_week', 'start_time', 'end_time'];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }
}
