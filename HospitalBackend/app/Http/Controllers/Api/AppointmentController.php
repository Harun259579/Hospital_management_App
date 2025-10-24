<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Str;


class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $req)
    {
        // Admin & doctor see all; patient sees own
        $user = $req->user();

        if ($user->role === 'patient') {
            $patient = $user->patientProfile ?? null;
            if (!$patient) return response()->json([], 200);
            $appointments = Appointment::with('doctor.user','patient.user')->where('patient_id', $patient->id)->get();
        } 
        elseif ($user->role === 'doctor') 
        {
            $doctor = $user->doctorProfile ?? null;
            $appointments = $doctor ? Appointment::with('patient.user')->where('doctor_id', $doctor->id)->get() : [];
        } 
        else
         {
            $appointments = Appointment::with(['doctor.user','patient.user'])->get();
        }

        return response()->json($appointments);
    }

    public function store(Request $req)
    {
        $user = $req->user();
        // Only patient can book via this endpoint
        if ($user->role !== 'patient') return response()->json(['message'=>'Only patients can book'], 403);

        $patient = $user->patientProfile ?? null;
        if (!$patient) return response()->json(['message'=>'Patient profile not found'], 400);

        $validated = $req->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i'        ]);

        // Optional: check doctor availability here

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $validated['doctor_id'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'status' => 'pending'
        ]);

        return response()->json($appointment, 201);
    }

    public function show(Request $req, $id)
    {
        $appointment = Appointment::with('doctor.user','patient.user')->findOrFail($id);
        // Authorization: patient can see own, doctor can see own appointments, admin/staff can see all
        $user = $req->user();
        if ($user->role === 'patient' && $appointment->patient->user_id !== $user->id) {
            return response()->json(['message'=>'Unauthorized'], 403);
        }
        if ($user->role === 'doctor') {
            $doc = $user->doctorProfile;
            if (!$doc || $appointment->doctor_id !== $doc->id) return response()->json(['message'=>'Unauthorized'], 403);
        }
        return response()->json($appointment);
    }
public function update(Request $req, $id)
{
    try {
        $appointment = Appointment::findOrFail($id);
        $user = $req->user();

        if (!in_array($user->role, ['admin', 'doctor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $req->validate([
            'date' => 'nullable|date',
            'time' => 'nullable',
            'status' => 'nullable|in:pending,approved,Cancelled'
        ]);

        if (isset($data['status'])) {
            if ($data['status'] === 'approved') {
                $data['token_id'] = Str::uuid()->toString();
            } else {
                $data['token_id'] = null;
            }
        }

        $appointment->update($data);

        return response()->json($appointment);
    } catch (\Exception $e) {
        \Log::error('Appointment Update Error: '.$e->getMessage());
        return response()->json(['message' => 'Server error'], 500);
    }
}


  public function destroy(Request $req, $id)
{
    $appointment = Appointment::findOrFail($id);
    $user = $req->user();

    if ($user->role === 'patient') {
        $patient = $user->patientProfile;
        if (!$patient || $appointment->patient_id !== $patient->id) {
            return response()->json(['message'=>'Unauthorized'], 403);
        }
        $appointment->update(['status' => 'cancelled']);
        return response()->json($appointment);
    }

    $this->authorizeAdmin($user);
    Appointment::destroy($id);
    return response()->json(null, 204);
}

    // Extra helper: approve appointment
    public function approve(Request $req, $id)
    {
        $this->authorizeDoctorOrAdmin($req->user());
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['status' => 'approved']);
        return response()->json($appointment);
    }

    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') abort(403,'Unauthorized');
    }

    protected function authorizeDoctorOrAdmin($user)
    {
        if (!in_array($user->role, ['admin','doctor'])) abort(403,'Unauthorized');
    }
}
