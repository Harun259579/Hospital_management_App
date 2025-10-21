<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\MedicalHistory;
use App\Models\Billing;
use Illuminate\Support\Facades\Storage;

class PatientController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

       public function stats()
    {
        return response()->json([

            'doctors' => Doctor::count(),
            'appointments'=>Appointment::count(),
            'histories'=>MedicalHistory::count(),
        ]);
    }

    // 🧾 All Patients
  public function index()
{
    $patients = Patient::with('user')->get();
    return response()->json(['data' => $patients]);
}



    // ➕ Create Patient
   public function store(Request $req)
{
    $this->authorizeCreate($req->user()); // Ensure the user has the correct permissions (admin or staff)

    // Validate incoming data
    $validated = $req->validate([
        'user_id' => 'required|exists:users,id',    // Ensure user_id exists in the users table
        'dob' => 'nullable|date',                    // Date of birth (optional)
        'gender' => 'nullable|string',               // Gender (optional)
        'phone' => 'nullable|string',                // Phone (optional)
        'address' => 'nullable|string',              // Address (optional)
        'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif|max:2048', // Photo upload validation
    ]);

    // Handle photo upload if provided
    if ($req->hasFile('photo')) {
        $photo = $req->file('photo');
        // Store the photo in the 'patients' folder in public storage
        $photoPath = $photo->store('patients', 'public');  
        // Save the file path to the database
        $validated['photo'] = $photoPath;
    }

    // Create new patient record with validated data
    $patient = Patient::create($validated);

    return response()->json([
        'message' => 'Patient created successfully',
        'data' => $patient,
    ], 201);  // Return the created patient data with a 201 status code
}


    // 🔍 Single Patient
    public function show(Request $req, $id)
    {
        $patient = Patient::with('user', 'appointments', 'medicalHistories')->findOrFail($id);

        // Allow patient to view only their own record
        if ($req->user()->role === 'patient' && $req->user()->id !== $patient->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($patient);
    }

    // ✏️ Update Patient
   public function update(Request $req, $id)
{
    // Ensure the user is authorized to update (either admin or the patient themself)
    $user = $req->user();
    $patient = Patient::findOrFail($id);

    // Only allow admin or the patient to update their own record
    if (!($user->role === 'admin' || $user->role === 'staff' || ($user->role === 'patient' && $user->id === $patient->user_id))) {
    return response()->json(['message' => 'Unauthorized'], 403);
}


    // Validate the incoming request data
    $data = $req->validate([
        'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif|max:2048', // Photo validation
        'dob' => 'nullable|date',
        'gender' => 'nullable|string',
        'phone' => 'nullable|string',
        'address' => 'nullable|string',
    ]);

    // 🖼️ Handle photo update if a new photo is provided
    if ($req->hasFile('photo')) {
        // Delete old photo if it exists
        if ($patient->photo && file_exists(public_path($patient->photo))) {
            unlink(public_path($patient->photo));  // Remove old photo from storage
        }

        // Store the new photo
        $file = $req->file('photo');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/patients'), $filename);  // Move the new photo to the public directory

        // Save the photo path in the database
        $data['photo'] = '/uploads/patients/' . $filename;
    }

    // Update the patient record with validated data
    $patient->update($data);

    // 👤 Optionally, update related user info (name, email) if provided
    if ($req->has('name') || $req->has('email')) {
        $patient->user->update([
            'name' => $req->input('name', $patient->user->name),
            'email' => $req->input('email', $patient->user->email),
        ]);
    }

    return response()->json([
        "message" => "Patient updated successfully",
        "data" => $patient->load('user'),  // Return updated patient data with related user info
    ]);
}

public function getBillingData($id)
{
    try {
        $billingData = Billing::where('patient_id', $id)->get();
        return response()->json($billingData);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to load billing data'], 500);
    }
}


public function myProfile(Request $request)
{
    $user = $request->user(); // Logged-in user

    $patient = \App\Models\Patient::with('user')
        ->where('user_id', $user->id)
        ->firstOrFail();

    return response()->json($patient);
}


    // 🗑️ Delete Patient
    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());

        // Find the patient
        $patient = Patient::findOrFail($id);

        // Delete the patient's photo if it exists
        if ($patient->photo && Storage::exists("public/{$patient->photo}")) {
            Storage::delete("public/{$patient->photo}");  // Delete the photo
        }

        // Delete associated user (if exists)
        $user = $patient->user;
        if ($user) {
            $user->delete();
        }

        // Delete the patient record
        $patient->delete();

        return response()->json(null, 204);
    }

    // 🔒 Only Admin or Staff can create patients
    protected function authorizeCreate($user)
    {
        if (!in_array($user->role, ['admin', 'staff'])) {
            abort(403, 'Unauthorized');
        }
    }

    // 🔒 Only Admin can delete or update
    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }
}
