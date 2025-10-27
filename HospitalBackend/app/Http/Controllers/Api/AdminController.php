<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Admin;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Nurse;
use App\Models\Staff;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Billing;
use Carbon\Carbon;


class AdminController extends Controller
{
    public function __construct()
    {
        // Sanctum authentication, public কিছু না থাকলে সব protected
        $this->middleware('auth:sanctum');
    }
    public function stats()
    {
        return response()->json([
            'doctors' => Doctor::count(),
            'nurses' => Nurse::count(),
            'staffs' => Staff::count(),
            'patients' => Patient::count(),
        ]);
    }

    // ✅ Admin list (optional)
    public function index(Request $req)
    {
        $this->authorizeAdmin($req->user());

        $admins = Admin::with('user')->paginate(20);
        return response()->json($admins);
    }

    // ✅ Admin create (only by admin)
    public function store(Request $req)
    {
        $this->authorizeAdmin($req->user());

        $data = $req->validate([
            'user_id' => 'required|exists:users,id',
            'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        // 📸 Handle photo upload
        if ($req->hasFile('photo')) {
            $file = $req->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/admins'), $filename);
            $data['photo'] = '/uploads/admins/' . $filename;
        }

        $admin = Admin::create($data);
        return response()->json($admin, 201);
    }

    // ✅ Single admin view
    public function show($id)
    {
        $admin = Admin::with('user')->findOrFail($id);
        return response()->json($admin);
    }


public function update(Request $req, $id)
{
    $this->authorizeAdmin($req->user()); // ✅ Optional check

    $admin = Admin::with('user')->findOrFail($id);

    // ✅ Validate everything
    $data = $req->validate([
        'name' => 'nullable|string|max:255',
        'email' => 'nullable|email',
        'photo' => 'nullable|file|image|mimes:jpg,jpeg,png,gif',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
    ]);

    // ✅ Update user info (users table)
    if (!empty($data['name']) || !empty($data['email'])) {
        $userData = [];
        if (!empty($data['name'])) $userData['name'] = $data['name'];
        if (!empty($data['email'])) $userData['email'] = $data['email'];
        $admin->user->update($userData);
    }

    // ✅ Handle photo upload (save in /public/uploads/admins)
    if ($req->hasFile('photo')) {
        if ($admin->photo && file_exists(public_path($admin->photo))) {
            unlink(public_path($admin->photo)); // পুরনো ছবি ডিলিট
        }

        $file = $req->file('photo');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/admins'), $filename);
        $data['photo'] = '/uploads/admins/' . $filename;
    }

    // ✅ Update admin info (admins table)
    $admin->update(array_filter($data, function ($key) {
        return in_array($key, ['photo', 'phone', 'address']);
    }, ARRAY_FILTER_USE_KEY));

    return response()->json([
        'message' => 'Admin updated successfully',
        'data' => $admin->load('user'),
    ]);
}



    // ✅ Delete admin (by admin)
    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());

        $admin = Admin::findOrFail($id);
        $user = $admin->user;

        if ($user) {
            $user->delete();
        }

        $admin->delete();

        return response()->json(null, 204);
    }

    // ✅ Logged in admin’s own profile (GET)
    public function myProfile(Request $request)
    {
        $user = $request->user();

        $admin = Admin::with('user')
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->json($admin);
    }


    public function appointmentsStats()
{
    // Example: status-wise appointments count
    $statuses = ['pending', 'approved', 'Cancelled'];
    $stats = [];

    foreach ($statuses as $status) {
        $stats[] = [
            'status' => $status,
            'appointments' => Appointment::where('status', $status)->count()
        ];
    }

    return response()->json($stats);
}

public function billingStats()
{
    // Get all months of the year, even if amount is 0
    $allMonths = collect([
        ['month_number' => 1, 'month' => 'January'],
        ['month_number' => 2, 'month' => 'February'],
        ['month_number' => 3, 'month' => 'March'],
        ['month_number' => 4, 'month' => 'April'],
        ['month_number' => 5, 'month' => 'May'],
        ['month_number' => 6, 'month' => 'June'],
        ['month_number' => 7, 'month' => 'July'],
        ['month_number' => 8, 'month' => 'August'],
        ['month_number' => 9, 'month' => 'September'],
        ['month_number' => 10, 'month' => 'October'],
        ['month_number' => 11, 'month' => 'November'],
        ['month_number' => 12, 'month' => 'December'],
    ]);

    $stats = DB::table('billings')
        ->select(
            DB::raw('MONTH(payment_date) as month_number'),
            DB::raw('SUM(amount) as amount')
        )
        ->whereYear('payment_date', date('Y'))
        ->groupBy(DB::raw('MONTH(payment_date)'))
        ->orderBy('month_number')
        ->get();

    // Merge with all months to include months with zero amount
    $result = $allMonths->map(function ($month) use ($stats) {
        $found = $stats->firstWhere('month_number', $month['month_number']);
        return [
            'month' => $month['month'],
            'amount' => $found ? $found->amount : 0,
        ];
    });

    return response()->json($result);
}

    // ✅ Authorization check
    protected function authorizeAdmin($user)
    {
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }
}
