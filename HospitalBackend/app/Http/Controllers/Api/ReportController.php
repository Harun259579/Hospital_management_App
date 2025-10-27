<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Billing;
use App\Models\Appointment;
use App\Models\Doctor;
use Carbon\Carbon;
use DB;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * ✅ Daily Income Report (Full Bill Details)
     */
    public function dailyIncome()
    {
        $today = Carbon::today();

        // Full bill list (today)
        $bills = Billing::whereDate('created_at', $today)
            ->select('id', 'patient_id', 'amount', 'cost_description', 'status', 'payment_date', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bills);
    }

    /**
     * ✅ Monthly Income Report (Full Bill Details)
     */
    public function monthlyIncome()
    {
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;

        $bills = Billing::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->select('id', 'patient_id', 'amount', 'cost_description', 'status', 'payment_date', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bills);
    }

    /**
     * ✅ Yearly Income Report (Full Bill Details)
     */
    public function yearlyIncome()
    {
        $year = Carbon::now()->year;

        $bills = Billing::whereYear('created_at', $year)
            ->select('id', 'patient_id', 'amount', 'cost_description', 'status', 'payment_date', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bills);
    }

    /**
     * ✅ Doctor-wise Earnings Report
     */
    public function doctorEarnings()
    {
        $data = Billing::select('doctor_id', DB::raw('SUM(amount) as total_earnings'))
            ->groupBy('doctor_id')
            ->with(['doctor.user:id,name'])
            ->get()
            ->map(function ($item) {
                return [
                    'doctor_name' => $item->doctor->user->name ?? 'Unknown',
                    'total_earnings' => $item->total_earnings,
                ];
            });

        return response()->json($data);
    }

    /**
     * ✅ Appointment Summary Report
     */
    public function appointmentReport(Request $req)
    {
        $from = $req->query('from', Carbon::now()->subMonth());
        $to = $req->query('to', Carbon::now());

        $appointments = Appointment::whereBetween('date', [$from, $to])->get();

        $data = $appointments
            ->groupBy('date')
            ->map(function ($group) {
                return [
                    'date' => $group->first()->date,
                    'total_appointments' => $group->count(),
                    'completed' => $group->where('status', 'completed')->count(),
                    'pending' => $group->where('status', 'pending')->count(),
                ];
            })
            ->values();

        return response()->json($data);
    }
}
