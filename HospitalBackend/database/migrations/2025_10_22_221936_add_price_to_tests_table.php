<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('tests', function (Blueprint $table) {
            $table->decimal('price', 8, 2)->after('test_name'); // price কলাম যোগ করল, test_name এর পর
        });
    }


    /**
     * Reverse the migrations.
     */
     public function down()
    {
        Schema::table('tests', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
