<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Test; 


class TestController extends Controller
{
    public function index(Request $req)
    {
        $user = $req->user();
        $patient = $user->patientProfile;
        // price সহ সব কলাম নিয়ে আসা হচ্ছে
        return response()->json(Test::where('patient_id', $patient->id)->get());
    }

    public function store(Request $req)
    {
        $user = $req->user();
        $patient = $user->patientProfile;

       $req->validate([
        'test_name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'date' => 'required|date',
        'token_id' => 'nullable|string|max:255',  // নতুন
        ]);

        $test = Test::create([
            'patient_id' => $patient->id,
            'test_name' => $req->test_name,
            'price' => $req->price,
            'date' => $req->date,
            'status' => 'pending',
            'token_id' => $req->token_id ?? null,
        ]);


        return response()->json($test, 201);
    }
public function staffIndex()
{
    
    $tests = Test::all();
    return response()->json($tests);
}

public function updateStatus(Request $request, Test $test)
{
    $request->validate([
        'status' => 'required|in:pending,completed,cancelled',
    ]);

    $test->status = $request->status;

    if ($request->status === 'completed' && !$test->token_id) {
        $test->token_id = bin2hex(random_bytes(8));
    }

    $test->save();

    return response()->json($test);
}


public function download(Request $request, Test $test)
{
    $token = $request->query('token');

    if ($token !== $test->token_id) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    if (!$test->result_file || !Storage::exists($test->result_file)) {
        return response()->json(['message' => 'File not found'], 404);
    }

    return Storage::download($test->result_file);
}


    public function destroy(Test $test)
    {
        $test->delete();
        return response()->json(null, 204);
    }
}
