<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DoctorShedule;

class DoctorSheduleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);;
    }

  public function index(Request $req)
{
    // Fetch schedules based on doctor_id query parameter
    $doctorId = $req->query('doctor_id');
    
    if ($doctorId) {
        \Log::info('Fetching schedules for doctor_id: ' . $doctorId); // Log doctor_id for debugging
        
        $schedules = DoctorShedule::where('doctor_id', $doctorId)
                                  ->with('doctor')  // Assuming a relationship exists with Doctor model
                                  ->get();
        
        if ($schedules->isEmpty()) {
            \Log::info('No schedules found for doctor_id: ' . $doctorId); // Log if no schedules are found
        }
    } else {
        // Fetch all schedules if no doctor_id is provided
        $schedules = DoctorShedule::with('doctor')->get();
    }
    
    return response()->json($schedules);
}

   public function store(Request $req)
{
    \Log::info('Received data:', $req->all());  // Log the incoming request data

    $user = $req->user();
    $validated = $req->validate([
        'doctor_id' => 'required|exists:doctors,id',
        'day_of_week' => 'required|string',
        'start_time' => 'required',
        'end_time' => 'required',
    ]);

    // Check user role and authorization
    // ...

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

