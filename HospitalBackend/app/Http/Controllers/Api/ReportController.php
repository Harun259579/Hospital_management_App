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

    // Daily income
    public function dailyIncome()
    {
        $today = Carbon::today();
        $total = Billing::whereDate('created_at', $today)->sum('amount');

        return response()->json([
            'date' => $today->toDateString(),
            'total_income' => $total
        ]);
    }

    // monthly income
    public function monthlyIncome()
    {
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;

        $total = Billing::whereYear('created_at', $year)
                        ->whereMonth('created_at', $month)
                        ->sum('amount');

        return response()->json([
            'month' => Carbon::now()->format('F Y'),
            'total_income' => $total
        ]);
    }

    // Doctor-wise earnings report
    public function doctorEarnings()
    {
        $data = Billing::select('doctor_id', DB::raw('SUM(amount) as total'))
            ->groupBy('doctor_id')
            ->with('doctor.user')
            ->get();

        return response()->json($data);
    }

    //  Appointment summary
    public function appointmentReport(Request $req)
    {
        $from = $req->query('from', Carbon::now()->subMonth());
        $to = $req->query('to', Carbon::now());

        $count = Appointment::whereBetween('date', [$from, $to])->count();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'total_appointments' => $count
        ]);
    }
}
