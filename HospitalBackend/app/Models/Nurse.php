<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nurse extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'photo',
        'dob',
        'gender',
        'phone',
        'address',
    ];

   
    protected $appends = ['name', 'email'];

    
    public function user()
    {
        return $this->belongsTo(User::class);
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
