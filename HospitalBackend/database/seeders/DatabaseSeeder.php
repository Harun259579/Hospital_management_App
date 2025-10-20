<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Nurse;
use App\Models\Staff;
use App\Models\Patient;
use App\Models\DoctorShedule;
use App\Models\DoctorSpeciality;
use App\Models\Appointment;
use App\Models\Inventory;
use App\Models\MedicalHistory;
use App\Models\Billing;
use App\Models\Admin;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        
        // ============= USERS =============
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        $staff = User::create([
            'name' => 'Staff Member',
            'email' => 'staff@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'staff'
        ]);

        $doctorUser = User::create([
            'name' => 'Dr. Mahmud Hasan',
            'email' => 'doctor@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'doctor'
        ]);

        $nurseUser = User::create([
            'name' => 'Nurse Liza',
            'email' => 'nurse@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'nurse'
        ]);

        $patientUser = User::create([
            'name' => 'Patient Karim',
            'email' => 'patient@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'patient'
        ]);

        // ============= DOCTOR =============
        
        $cardio=DoctorSpeciality::create(['name'=>'Cardiology','slug'=>'Cardiology']);
        $derma=DoctorSpeciality::create(['name'=>'Darmatologist','slug'=>'Darmatologist']);
        $nuro=DoctorSpeciality::create(['name'=>'Neurologist','slug'=>'Neurologist']);

         


          $doctor=Doctor::create([
            'user_id'=>$doctorUser->id,
            'photo'=>'null',
            'bio'=>'Expart at Cardiologist',
            'fee'=>800,
            'visiting_address'=>'Firmgate,Dhaka',
            'shift'=>'mornnig'

        ]);
        $doctor->specialities()->attach($cardio->id);

        $admin=Admin::create([
            'user_id'=>$adminUser->id,
            'photo'=>'null',
            'phone'=>'01730229408',
            'address'=>'Dhaka,Bangladesh',

        ]);

        // ============= NURSE =============
        $nurse = Nurse::create([
            'user_id' => $nurseUser->id,
            'photo'=>'null',
            'dob' => '1999-03-21',
            'gender'=>'male',
            'phone'=>01723445612,
            'address'=>'firmgate,dhaka',
            'shift' =>'morning'
        ]);

        // ============= STAFF =============
        $staffRecord = Staff::create([
            'user_id' => $staff->id,
            'photo'=>'null',
            'dob' => '1999-04-12',
            'gender'=>'male',
            'phone'=>01723445612,
            'address'=>'firmgate,dhaka',
            'shift' => 'evening'
        ]);

        // ============= PATIENT =============
        $patient = Patient::create([
            'user_id' => $patientUser->id,
            'photo'=>'null',
            'gender' => 'male',
            'phone' => '01710000003',
            'address' => 'Dhaka, Bangladesh',
            'status'=>'in'
          ]);

        // ============= DOCTOR SCHEDULE =============
        DoctorShedule::create([
            'doctor_id' => $doctor->id,
            'day_of_week' => 'sun',
            'start_time' => '10:00:00',
            'end_time' => '15:00:00',
        ]);

        DoctorShedule::create([
            'doctor_id' => $doctor->id,
            'day_of_week' => 'tue',
            'start_time' => '10:00:00',
            'end_time' => '14:00:00',
        ]);

        // ============= INVENTORY =============
        Inventory::create([
           'item_name' => 'medichine',
            'stock' => 200,
            'unit'=>10,
            'category' => 'medichine',
            'expiry_date' => '2026-01-23'
        ]);

        Inventory::create([
            'item_name' => 'Bandage',
            'stock' => 200,
            'unit'=>10,
            'category' => 'First Aid',
            'expiry_date' => '2026-01-23'
        ]);

        // ============= APPOINTMENT =============
        $appointment = Appointment::create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'date' => now()->addDays(1),
            'time'=>'10:00',
            'status' => 'pending',
            'token_id'=>'8724280828',
            'fee_snapshot'=>10

        ]);

        // ============= MEDICAL HISTORY =============
        MedicalHistory::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'diagnosis' => 'High blood pressure',
            'prescription' => 'Regular medicine and diet control',
            'date' => now()->subDays(3)
        ]);

        // ============= BILLING =============
        Billing::create([
            'patient_id' => $patient->id,
            'amount' => 1500,
            'status' => 'unpaid',
            'payment_date' => now(),
        ]);

        $this->command->info(' HospitalDatabaseSeeder successfully executed!');
    }
}
