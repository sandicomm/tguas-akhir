<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('webpage', function (Blueprint $table) {
            $table->string('id');
            $table->string('type');
            //$table->enum('type', ['section','field','video','modal','accordion','collapse','carousel']);
            $table->text('style')->nullable();
            $table->text('content')->nullable();
            $table->string('element_order')->nullable();
            $table->string('element_count')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webpage');
    }
};
