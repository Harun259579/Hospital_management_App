<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\User;
use App\Models\Appointment;
use App\Models\MedicalHistory;
use App\Models\Patient;

class DoctorController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

        public function stats()
    {
        return response()->json([
            'patients' => Patient::count(),
            'appointments'=>Appointment::count(),
            'histories'=>MedicalHistory::count(),
        ]);
    }


    public function index()
{
    
        $doctors = Doctor::with('user','specialities','shedules')->paginate(20);
        return response()->json($doctors);
   
}


    public function store(Request $req)
    {
        $this->authorizeAdmin($req->user());

        $data = $req->validate([
            'user_id' => 'required|exists:users,id',
            'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif', 
            'bio' => 'nullable|string',
            'fee' => 'nullable|numeric',
            'visiting_address' => 'nullable|string',
            'shift'=>'nullable|string'
        ]);

         if ($req->hasFile('photo')) {
        $file = $req->file('photo');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/doctors'), $filename);
        $data['photo'] = '/uploads/doctors/' . $filename;
    }

        $doctor = Doctor::create($data);
        return response()->json($doctor, 201);
    }

    public function show($id)
    {
        $doctor = Doctor::with('user','specialities','shedules')->findOrFail($id);
        return response()->json($doctor);
    }

 public function update(Request $req, $id)
{
    $this->authorizeAdmin($req->user()); // ✅ Admin authorization check (optional, তুমি চাইলে বাদ দিতে পারো)

    $doctor = Doctor::with('user')->findOrFail($id);

    // ✅ Validate fields
    $data = $req->validate([
       
            'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif', 
            'bio' => 'nullable|string',
            'fee' => 'nullable|numeric',
            'visiting_address' => 'nullable|string',
            'shift'=>'nullable|string'

    ]);

    // ✅ Update user info (users table)
    if (isset($data['name']) || isset($data['email'])) {
        $userData = [];
        if (isset($data['name'])) $userData['name'] = $data['name'];
        if (isset($data['email'])) $userData['email'] = $data['email'];
        $doctor->user->update($userData);
    }

    // ✅ Handle photo upload (save in /public/uploads/admins)
    if ($req->hasFile('photo')) {
        // পুরনো photo delete করবে যদি থাকে
        if ($doctor->photo && file_exists(public_path($doctor->photo))) {
            unlink(public_path($doctor->photo));
        }

        $file = $req->file('photo');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/doctors'), $filename);
        $data['photo'] = '/uploads/doctors/' . $filename;
    }

    // ✅ Update admin info
    $doctor->update(array_filter($data, function ($key) {
        return in_array($key, ['bio', 'fee','visiting_address','shift', 'photo']);
    }, ARRAY_FILTER_USE_KEY));

    return response()->json([
        'message' => 'Doctor updated successfully',
        'data' => $doctor->load('user'),
    ]);
}



    public function destroy(Request $req, $id)
{
    $this->authorizeAdmin($req->user());

    
    $doctor = Doctor::findOrFail($id);

    
    $user = $doctor->user;
    if($user){
        $user->delete();  
    }

   
    $doctor->delete();

    return response()->json(null, 204);
}

public function myProfile(Request $request)
{
    $user = $request->user();

    $doctor = Doctor::with('user')
        ->where('user_id', $user->id)
        ->firstOrFail();

    return response()->json($doctor);
}



    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') abort(403, 'Unauthorized');
    }
}
