<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory;

class InventoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $req)
    {
        $this->authorizeStaffOrAdmin($req->user());
        $items = Inventory::paginate(30);
        return response()->json($items);
    }

   // Store method in InventoryController
public function store(Request $req)
{
    $this->authorizeStaffOrAdmin($req->user());
    $data = $req->validate([
        'item_name' => 'required|string|max:255',
        'stock' => 'required|integer',
        'unit' => 'nullable|string',
        'expiry_date' => 'nullable|date',
        'category' => 'nullable|string'
    ]);
    $item = Inventory::create($data);
    return response()->json($item, 201); // Return created item
}


    public function show(Request $req, $id)
    {
        $this->authorizeStaffOrAdmin($req->user());
        $item = Inventory::findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $req, $id)
    {
        $this->authorizeStaffOrAdmin($req->user());
        $item = Inventory::findOrFail($id);
        $data = $req->validate([
            'item_name' => 'nullable|string|max:255',
            'stock' => 'nullable|integer',
            'unit' => 'nullable|string',
            'expiry_date' => 'nullable|date',
            'category'=>'nullable|string'
        ]);
        $item->update($data);
        return response()->json($item);
    }

    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());
        Inventory::destroy($id);
        return response()->json(null, 204);
    }

    protected function authorizeStaffOrAdmin($user)
    {
        if (!in_array($user->role, ['admin','staff'])) abort(403,'Unauthorized');
    }

    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') abort(403,'Unauthorized');
    }
}
