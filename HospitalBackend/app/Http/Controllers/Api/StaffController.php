<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Staff;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Nurse;

class StaffController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

     public function stats()
    {
        return response()->json([
            'doctors' => Doctor::count(),
            'nurses' => Nurse::count(),
            'staffs' => Staff::count(),
            'patients' => Patient::count(),
        ]);
    }

    // 🧾 All Staffs
    public function index(Request $req)
    {
        return response()->json(Staff::with('user')->paginate(20));
    }

    // ➕ Create Staff
    public function store(Request $req)
    {
        $this->authorizeAdmin($req->user());

        $data = $req->validate([
            'user_id' => 'required|exists:users,id',
            'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif|max:2048',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'shift' => 'nullable|string',
        ]);

        // 📸 Handle photo upload
        if ($req->hasFile('photo')) {
            $file = $req->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/staffs'), $filename);
            $data['photo'] = '/uploads/staffs/' . $filename;
        }

        $staff = Staff::create($data);

        return response()->json([
            "message" => "Staff created successfully",
            "data" => $staff
        ], 201);
    }

    // 🔍 Single Staff
    public function show($id)
    {
        return response()->json(Staff::with('user')->findOrFail($id));
    }

    // ✏️ Update Staff
    public function update(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());

        $staff = Staff::findOrFail($id);

        $data = $req->validate([
            'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif|max:2048',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'shift' => 'nullable|string',
        ]);

        // 🖼️ Handle photo update
        if ($req->hasFile('photo')) {
            // Delete old photo if exists
            if ($staff->photo && file_exists(public_path($staff->photo))) {
                unlink(public_path($staff->photo));
            }

            $file = $req->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/staffs'), $filename);
            $data['photo'] = '/uploads/staffs/' . $filename;
        }

        $staff->update($data);

        // 👤 Update related user info if passed
        if ($req->has('name') || $req->has('email')) {
            $staff->user->update([
                'name' => $req->input('name', $staff->user->name),
                'email' => $req->input('email', $staff->user->email),
            ]);
        }

        return response()->json([
            "message" => "Staff updated successfully",
            "data" => $staff->load('user')
        ]);
    }

    // 🗑️ Delete Staff
    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());

        $staff = Staff::findOrFail($id);

        // Delete photo if exists
        if ($staff->photo && file_exists(public_path($staff->photo))) {
            unlink(public_path($staff->photo));
        }

        // Delete associated user
        if ($staff->user) {
            $staff->user->delete();
        }

        $staff->delete();

        return response()->json(["message" => "Staff deleted successfully"], 200);
    }

    public function myProfile(Request $request)
{
    // Get the currently logged-in user
    $user = $request->user(); 

    // Fetch staff member details using the user ID
    $staff = Staff::with('user') // Assuming a shift relationship exists
        ->where('user_id', $user->id) // Match the logged-in user's ID
        ->firstOrFail(); // If no staff is found, it will throw a 404 error

    // Return the staff profile as JSON response
    return response()->json($staff);
}


    // 🔒 Only Admin Access
    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }
}
