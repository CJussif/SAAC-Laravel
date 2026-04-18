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
    Schema::create('alumnos', function (Blueprint $table) {
        $table->id();
        
        // Conexión con la tabla de usuarios (Para el login - RNF02)
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        
        // Datos del estudiante
        $table->string('matricula')->unique();
        $table->string('nombre');
        $table->string('apellido_paterno');
        $table->string('apellido_materno');
        $table->string('carrera');
        $table->integer('semestre');
        
        // Control de créditos para las actividades (RF05)
        $table->integer('creditos_acumulados')->default(0);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumnos');
    }
};
