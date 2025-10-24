<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TestName;


class TestNameController extends Controller
{
     public function index()
    {
        return response()->json(TestName::all());
    }

   public function store(Request $request)
{
    try {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $testName = TestName::create($data);
        return response()->json($testName, 201);
    } catch (\Exception $e) {
        \Log::error('Store error: '.$e->getMessage());
        return response()->json(['error' => 'Failed to create test'], 500);
    }
}


    public function show(TestName $testName)
    {
        return response()->json($testName);
    }

    public function update(Request $request, TestName $testName)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $testName->update($data);
        return response()->json($testName);
    }

    public function destroy(TestName $testName)
    {
        $testName->delete();
        return response()->json(null, 204);
    }
}
