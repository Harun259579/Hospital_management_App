<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role'

    ];

   
    protected $hidden = [
        'password',
        'remember_token',
    ];

  
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function doctorProfile()
    {
        return $this->hasOne(Doctor::class, 'user_id');
    }
    public function patientProfile()
    {
        return $this->hasOne(Patient::class, 'user_id');
    }

    public function patient()
    {
        return $this->hasOne(\App\Models\Patient::class);
    }
     public function doctor()
    {
        return $this->hasOne(\App\Models\Doctors::class);
    }

    public function doctorAppointments()
    {
        return $this->hasMany(\App\Models\Appointment::class, 'doctor_id');
    }

}
