<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Nurse;
use App\Models\Staff;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $req)
    {
        $validated = $req->validate([
            'name'=> 'required|string|max:100',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:8',
            'role'=>['required',Rule::in(['admin','doctor','nurse','staff','patient'])]

        ]);
        $user=User::create([
            'name'=>$validated['name'],
            'email'=>$validated['email'],
            'password'=>Hash::make($validated['password']),
            'role'=>$validated['role']

        ]);


        
    $user->refresh();

  
    if ($user->role === 'patient') 
    {
        Patient::firstOrCreate(
            ['user_id' => $user->id],
            ['dob'=>null,'gender'=>null,'phone' => null, 'address' => null,'status'=>'out']
        );
    }

    if ($user->role === 'doctor') 
    {
        Doctor::Create(
            ['user_id' => $user->id],
            ['photo' => null, 'bio' => null, 'fee' => 0.00, 'visiting_address' => null,'shift'=>'morning']
        );
    }
     if ($user->role === 'nurse') 
    {
       Nurse::firstOrCreate(
            ['user_id' => $user->id],
            ['dob'=>null,'gender'=>null,'phone' => null, 'address' => null,'shift'=>null]
        );
    }
     if ($user->role === 'staff') 
    {
      Staff::firstOrCreate(
            ['user_id' => $user->id],
            ['dob'=>null,'gender'=>null,'phone' => null, 'address' => null,'shift'=>'morning']
        );
    }

        $token=$user->createToken('api')->plainTextToken;
        return response()->json(['user'=>$user,'token'=>$token]);
    }

    public function login(Request $req)
    {
        $req->validate([
            'email'=>'required|email',
            'password'=>'required'

        ]);
        $user=User::where('email',$req->email)->first();
        if(!$user || !Hash::check($req->password,$user->password))
        {
            return response()->json(['message'=>'Invalid Credential'],401);
        }
        $token=$user->createToken('api')->plainTextToken;
        return response()->json(['user'=>$user,'token'=>$token]);
    }
    public function me(Request $req)
    {
        return $req->user();
    }
}
