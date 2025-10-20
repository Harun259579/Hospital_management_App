<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
        public function up(): void
    {
        Schema::create('doctor_speciality', function (Blueprint $table) {
             $table->id();
    $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
    $table->foreignId('speciality_id')->constrained('doctor_specialities')->onDelete('cascade');
    $table->timestamps();
        });
    }

        public function down(): void
    {
        Schema::dropIfExists('doctor_speciality');
    }
};
