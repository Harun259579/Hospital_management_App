<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DoctorSpeciality;
use Illuminate\Support\Str;

class DoctorSpecialityController extends Controller
{
    public function index()
    {
        $list = DoctorSpeciality::select('id','name','slug')->get();
        return response()->json($list);
    }

    public function store(Request $req)
    {
        $this->authorizeAdmin($req->user());

        $validated = $req->validate([
        'name' =>'required|string|max:255|unique:doctor_specialities,name',
        'slug'=>'required|string'
        ]);

        $speciality = DoctorSpeciality::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['slug']),
        ]);

        return response()->json($speciality, 201);
    }

    public function update(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());
        $speciality = DoctorSpeciality::findOrFail($id);

        $validated = $req->validate([
            'name' => 'required|string|max:255|unique:doctor_speciality,name,'.$speciality->id,
        ]);

        $speciality->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return response()->json($speciality);
    }

    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());
        DoctorSpeciality::destroy($id);
        return response()->json(null, 204);
    }

    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') abort(403, 'Unauthorized');
    }
}
