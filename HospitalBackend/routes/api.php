 <?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers Import
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\NurseController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\DoctorSheduleController;
use App\Http\Controllers\Api\DoctorSpecialityController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\MedicalHistoryController;
use App\Http\Controllers\Api\BillingController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Api\AdminController;



// ====================== AUTH ROUTES ======================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/nurses', [NurseController::class, 'index']);
Route::get('/staffs', [StaffController::class, 'index']);
Route::get('/patients', [PatientController::class, 'index']);
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::get('/medical-histories', [MedicalHistoryController::class, 'index']);

// Authenticated routes (Sanctum protected)
Route::middleware('auth:sanctum')->group(function () {

    // ======================  USER / PROFILE ======================
    Route::get('/me', [AuthController::class, 'me']); 


    // =============Admin =============================
    Route::get('/admins', [AdminController::class, 'index']);
    Route::get('/admins/{id}', [AdminController::class, 'show']);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::put('/admins/{id}', [AdminController::class, 'update']);
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/profile', [AdminController::class, 'myProfile']);

    // ====================== DOCTOR ======================
    
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{id}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
    Route::get('/doctor/stats', [DoctorController::class, 'stats']);
    Route::get('/doctor/profile', [DoctorController::class, 'myProfile']);

    // ======================  NURSE ======================
    
    Route::post('/nurses', [NurseController::class, 'store']);
    Route::get('/nurses/{id}', [NurseController::class, 'show']);
    Route::put('/nurses/{id}', [NurseController::class, 'update']);
    Route::delete('/nurses/{id}', [NurseController::class, 'destroy']);
    Route::get('/nurse/stats', [NurseController::class, 'stats']);
    Route::get('/nurse/profile', [NurseController::class, 'myProfile']);

    // ====================== STAFF ======================
   
    Route::post('/staffs', [StaffController::class, 'store']);
    Route::get('/staffs/{id}', [StaffController::class, 'show']);
    Route::put('/staffs/{id}', [StaffController::class, 'update']);
    Route::delete('/staffs/{id}', [StaffController::class, 'destroy']);
    Route::get('/staff/stats', [StaffController::class, 'stats']);
    Route::get('/staff/profile', [StaffController::class, 'myProfile']);

    // ====================== PATIENT ======================
    
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy']);
    Route::get('/patient/stats', [PatientController::class, 'stats']);
    Route::get('/patient/profile', [PatientController::class, 'myProfile']);
    Route::get('/patient/{id}/billing', [PatientController::class, 'getBillingData']);

    // ======================  APPOINTMENTS ======================
    
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    //===========================Message============================
    Route::get('/contact-messages', [ContactController::class, 'index']);
    Route::post('/contact-messages/{id}/reply', [ContactController::class, 'reply']);
    Route::delete('/contact-messages/{id}', [ContactController::class, 'destroy']);


    // ======================  DOCTOR SHEDULE ======================
    Route::get('/doctor-shedules', [DoctorSheduleController::class, 'index']);
    Route::post('/doctor-shedules', [DoctorSheduleController::class, 'store']);
    Route::put('/doctor-shedules/{id}', [DoctorSheduleController::class, 'update']);
    Route::delete('/doctor-shedules/{id}', [DoctorSheduleController::class, 'destroy']);

    // ======================  SPECIALITIES ======================
    Route::get('/specialities', [DoctorSpecialityController::class, 'index']);
    Route::post('/specialities', [DoctorSpecialityController::class, 'store']);
    Route::get('/specialities/{id}', [DoctorSpecialityController::class, 'show']);
    Route::put('/specialities/{id}', [DoctorSpecialityController::class, 'update']);
    Route::delete('/specialities/{id}', [DoctorSpecialityController::class, 'destroy']);

    // ====================== BILLING ======================
    Route::get('/billings', [BillingController::class, 'index']);
    Route::get('/billings/{id}', [BillingController::class, 'show']);
    Route::post('/billings', [BillingController::class, 'store']);
    Route::put('/billings/{id}/mark-paid', [BillingController::class, 'markPaid']);
    Route::delete('/billings/{id}', [BillingController::class, 'destroy']);
    Route::get('/billings/{id}/invoice', [BillingController::class, 'downloadInvoice']);
    Route::get('/billings/patient/{id}', [BillingController::class, 'getByPatient']);


    // ====================== MEDICAL HISTORY ======================
   
    Route::post('/medical-histories', [MedicalHistoryController::class, 'store']);
    Route::get('/medical-histories/{id}', [MedicalHistoryController::class, 'show']);
    Route::put('/medical-histories/{id}', [MedicalHistoryController::class, 'update']);
    Route::delete('/medical-histories/{id}', [MedicalHistoryController::class, 'destroy']);

    // ====================== INVENTORY ======================
    Route::get('/inventories', [InventoryController::class, 'index']);
    Route::post('/inventories', [InventoryController::class, 'store']);
    Route::put('/inventories/{id}', [InventoryController::class, 'update']);
    Route::delete('/inventories/{id}', [InventoryController::class, 'destroy']);

    // ====================== REPORTS ======================
    Route::get('/reports/daily-income', [ReportController::class, 'dailyIncome']);
    Route::get('/reports/monthly-income', [ReportController::class, 'monthlyIncome']);
    Route::get('/reports/doctor-earnings', [ReportController::class, 'doctorEarnings']);
    Route::get('/reports/appointments', [ReportController::class, 'appointmentReport']);
});

