<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Billing;
use App\Models\Patient;
use Barryvdh\DomPDF\Facade\Pdf;

class BillingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

  public function index(Request $req)
{
    $user = $req->user();
    
    if ($user->role === 'patient') {
        $patient = $user->patientProfile;
        if (!$patient) return response()->json([], 200);
        $bills = Billing::where('patient_id', $patient->id)->get();
    } else {
        // admin & staff can see all bills
        if (!in_array($user->role, ['admin', 'staff'])) return response()->json(['message' => 'Unauthorized'], 403);
        $bills = Billing::with('patient.user')->get();
    }

    // Calculate total amount for each bill
    $bills->map(function ($bill) {
        // If necessary, you can add some additional logic to sum up 'amount' and 'cost_description'
        $bill->total_amount = $bill->amount;
        return $bill;
    });

    return response()->json($bills);
}


public function store(Request $req)
{
    $this->authorizeStaffOrAdmin($req->user());

    $validated = $req->validate([
        'patient_id' => 'required|exists:patients,id',
        'amount' => 'required|numeric',
        'cost_description' => 'nullable|string',
        'status' => 'nullable|in:paid,unpaid'
    ]);
      $paymentDate = now()->toDateString();

    $bill = Billing::create([
        'patient_id' => $validated['patient_id'],
        'amount' => $validated['amount'],
        'cost_description' => $validated['cost_description'] ?? null,
        'status' => $validated['status'] ?? 'unpaid',
        'payment_date' => $paymentDate,
    ]);

    return response()->json([
        'message' => 'Billing created successfully',
        'data' => $bill
    ], 201);
}


    public function show(Request $req, $id)
    {
        $bill = Billing::with('patient.user')->findOrFail($id);
        $user = $req->user();

        if ($user->role === 'patient' && $bill->patient->user_id !== $user->id) return response()->json(['message'=>'Unauthorized'],403);
        if (!in_array($user->role, ['admin','staff','patient'])) return response()->json(['message'=>'Unauthorized'],403);

        return response()->json($bill);
    }

    public function markPaid(Request $req, $id)
    {
        $this->authorizeStaffOrAdmin($req->user());
        $bill = Billing::findOrFail($id);
        $bill->update(['status' => 'paid', 'payment_date' => now()]);
        return response()->json($bill);
    }
    public function downloadInvoice($id)
{
    $bill = Billing::with('patient.user')->findOrFail($id);

    // Optional: role check (admin, staff, or patient)
    $user = auth()->user();
    if ($user->role === 'patient' && $bill->patient->user_id !== $user->id) {
        abort(403, 'Unauthorized');
    }

    // Generate PDF
    $pdf = Pdf::loadView('pdf.invoice', ['bill' => $bill]);

    // Return download response
    return $pdf->download('invoice-'.$bill->id.'.pdf');
}
public function getByPatient($id)
{
    $billings = Billing::where('patient_id', $id)->orderBy('id', 'desc')->get();
    return response()->json(['data' => $billings]);
}


    public function destroy(Request $req, $id)
    {
        $this->authorizeAdmin($req->user());
        Billing::destroy($id);
        return response()->json(null,204);
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
