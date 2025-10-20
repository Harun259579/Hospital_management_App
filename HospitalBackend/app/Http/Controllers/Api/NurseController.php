<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Nurse;
use App\Models\Doctor;
use App\Models\Patient;

class NurseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

         public function stats()
    {
        return response()->json([
            'doctors' => Doctor::count(),
            'nurses'=>Nurse::count(),
            'patients'=>Patient::count(),
        ]);
    }

    // 🧾 All Nurses
    public function index(Request $req)
    {
        return response()->json(Nurse::with('user')->paginate(20));
    }



    // ➕ Create Nurse
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
            'shift' => 'nullable|in:morning,evening,night',
        ]);

        // 📸 Handle photo upload
        if ($req->hasFile('photo')) {
            $file = $req->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/nurses'), $filename);
            $data['photo'] = '/uploads/nurses/' . $filename;
        }

        $nurse = Nurse::create($data);

        return response()->json([
            "message" => "Nurse created successfully",
            "data" => $nurse
        ], 201);
    }

    // 🔍 Single Nurse
    public function show($id)
    {
        return response()->json(Nurse::with('user')->findOrFail($id));
    }

    // ✏️ Update Nurse
    public function update(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());

        $nurse = Nurse::findOrFail($id);

        $data = $req->validate([
            'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif|max:2048',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'shift' => 'nullable|in:morning,evening,night',
        ]);

        // 🖼️ Photo update
        if ($req->hasFile('photo')) {
            // Delete old photo if exists
            if ($nurse->photo && file_exists(public_path($nurse->photo))) {
                unlink(public_path($nurse->photo));
            }

            $file = $req->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/nurses'), $filename);
            $data['photo'] = '/uploads/nurses/' . $filename;
        }

        $nurse->update($data);

        // Update related user info if passed
        if ($req->has('name') || $req->has('email')) {
            $nurse->user->update([
                'name' => $req->input('name', $nurse->user->name),
                'email' => $req->input('email', $nurse->user->email),
            ]);
        }

        return response()->json([
            "message" => "Nurse updated successfully",
            "data" => $nurse->load('user')
        ]);
    }

public function myProfile(Request $request)
{
    $user = $request->user(); // Logged-in user

    $nurse = Nurse::with('user') // প্রয়োজনে অন্য সম্পর্ক থাকলে এখানে যুক্ত করো
        ->where('user_id', $user->id)
        ->firstOrFail();

    return response()->json($nurse);
}

    // 🗑️ Delete Nurse
    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());

        $nurse = Nurse::findOrFail($id);

        // Delete photo if exists
        if ($nurse->photo && file_exists(public_path($nurse->photo))) {
            unlink(public_path($nurse->photo));
        }

        // Delete associated user
        if ($nurse->user) {
            $nurse->user->delete();
        }

        $nurse->delete();

        return response()->json(["message" => "Nurse deleted successfully"], 200);
    }

    // 🔒 Only Admin
    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }
}
