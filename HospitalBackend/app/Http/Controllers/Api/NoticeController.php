<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notice;

class NoticeController extends Controller
{
    // ✅ Only admin can create
    public function store(Request $req)
    {
        $this->authorizeAdmin($req->user());

        $data = $req->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $notice = Notice::create($data);

        return response()->json([
            'message' => 'Notice created successfully',
            'data' => $notice,
        ]);
    }

    // ✅ Everyone can see active notices
    public function index()
    {
        return response()->json(Notice::where('is_active', true)->latest()->get());
    }

    // ✅ Delete notice
    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());
        $notice = Notice::findOrFail($id);
        $notice->delete();

        return response()->json(['message' => 'Notice deleted successfully']);
    }

    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }
}
