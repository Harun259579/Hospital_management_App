<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MedicalHistory;
use App\Models\Patient;

class MedicalHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $req)
    {
        $user = $req->user();
        if ($user->role === 'patient') {
            $patient = $user->patientProfile;
            if (!$patient) return response()->json([], 200);
            $histories = MedicalHistory::with('doctor.user')->where('patient_id',$patient->id)->get();
        } else {
            $histories = MedicalHistory::with('patient.user','doctor.user')->get();
        }
        return response()->json($histories);
    }

    public function store(Request $req)
    {
        // Only doctor can create medical history
        if ($req->user()->role !== 'doctor') return response()->json(['message'=>'Unauthorized'],403);

        $validated = $req->validate([
            'patient_id' => 'required|exists:patients,id',
            'diagnosis' => 'nullable|string',
            'prescription' => 'nullable|string',
            'date' => 'required|date',
        ]);

        // link doctor via doctor_profile
        $doctor = $req->user()->doctorProfile ?? null;
        if (!$doctor) return response()->json(['message'=>'Doctor profile not found'], 400);

        $mh = MedicalHistory::create(array_merge($validated, ['doctor_id' => $doctor->id]));
        return response()->json($mh, 201);
    }

    public function show(Request $req, $id)
    {
        $mh = MedicalHistory::with('doctor.user','patient.user')->findOrFail($id);
        $user = $req->user();

        if ($user->role === 'patient' && $mh->patient->user_id !== $user->id) return response()->json(['message'=>'Unauthorized'],403);
        return response()->json($mh);
    }

    public function update(Request $req, $id)
    {
        $mh = MedicalHistory::findOrFail($id);
        if ($req->user()->role !== 'doctor') return response()->json(['message'=>'Unauthorized'],403);

        // ensure doctor owner
        $doc = $req->user()->doctorProfile;
        if (!$doc || $mh->doctor_id !== $doc->id) return response()->json(['message'=>'Unauthorized'],403);

        $data = $req->validate([
            'diagnosis' => 'nullable|string',
            'prescription' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $mh->update($data);
        return response()->json($mh);
    }

    public function destroy(Request $req, $id)
    {
        // only admin can delete
        if ($req->user()->role !== 'admin') return response()->json(['message'=>'Unauthorized'],403);
        MedicalHistory::destroy($id);
        return response()->json(null,204);
    }
}
