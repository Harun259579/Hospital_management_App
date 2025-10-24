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
            $table->string('token_id')->nullable()->after('price');
            // token_id টেক্সট বা স্ট্রিং টাইপ, যদি চান অন্য টাইপ দিতে পারেন
            // nullable করলে যাদের token_id নেই তাদের জন্য ফাঁকা থাকতে পারবে
        });
    }

    public function down()
    {
        Schema::table('tests', function (Blueprint $table) {
            $table->dropColumn('token_id');
        });
    }
};
