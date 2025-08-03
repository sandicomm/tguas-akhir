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
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama section (contoh: "Section 1")
            $table->text('description')->nullable(); // Deskripsi section
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreignId('form_id')
                ->constrained('forms')
                ->onDelete('cascade');  // Hapus response jika responden dihapus
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
