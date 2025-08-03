<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('responses', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id'); // Tambahkan kolom UUID setelah ID
        });
    }

    public function down()
    {
        Schema::table('responses', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
