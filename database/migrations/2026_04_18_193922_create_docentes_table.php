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
    Schema::create('docentes', function (Blueprint $table) {
        $table->id();
        
        // Conexión para su login (RNF02)
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        
        // Datos del profesor
        $table->string('numero_empleado')->unique();
        $table->string('nombre');
        $table->string('apellido_paterno');
        $table->string('apellido_materno');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('docentes');
    }
};
