<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DoctorShedule;

class DoctorSheduleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $req)
    {
        $schedules = DoctorShedule::with('doctor')->get();
        return response()->json($schedules);
    }

    public function store(Request $req)
    {
        $user = $req->user();
        $validated = $req->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'day_of_week' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        // admin or doctor themself can create schedule
        if ($user->role === 'doctor') {
            $doctor = $user->doctorProfile ?? null;
            if (!$doctor || $doctor->id != $validated['doctor_id']) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $schedule = DoctorShedule::create($validated);
        return response()->json($schedule, 201);
    }

    public function update(Request $req, $id)
    {
        $schedule = DoctorShedule::findOrFail($id);
        $user = $req->user();

        if ($user->role !== 'admin' && !($user->role === 'doctor' && $user->doctorProfile && $user->doctorProfile->id == $schedule->doctor_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $req->validate([
            'day_of_week' => 'nullable|string',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
        ]);

        $schedule->update($validated);
        return response()->json($schedule);
    }

    public function destroy(Request $req, $id)
    {
        $schedule = DoctorShedule::findOrFail($id);
        $user = $req->user();

        if ($user->role !== 'admin' && !($user->role === 'doctor' && $user->doctorProfile && $user->doctorProfile->id == $schedule->doctor_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $schedule->delete();
        return response()->json(null, 204);
    }
}

