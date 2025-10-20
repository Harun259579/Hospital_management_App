<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('nurses', function (Blueprint $table) {
        $table->string('photo')->nullable()->after('user_id'); // Add a string column for photo
    });
}

public function down()
{
    Schema::table('nurses', function (Blueprint $table) {
        $table->dropColumn('photo'); // Remove the column if rolling back
    });
}

};
