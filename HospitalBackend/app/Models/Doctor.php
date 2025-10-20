<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DoctorShedule;

class Doctor extends Model
{
    use HasFactory;
    protected $table = 'doctors';
    protected $fillable=['user_id','photo','bio','fee','visiting_address','shift'];
    protected $appends=['name','email'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function specialities()
    {
        return $this->belongsToMany(DoctorSpeciality::class,'doctor_speciality','doctor_id','speciality_id');
    }
    public function shedules()
    {
        return $this->hasMany(DoctorShedule::class);
    }
    public function getNameAttribute()
    {
        return $this->user?->name;
    }
    public function getEmailAttribute()
    {
        return $this->user?->email;
    } 
}
