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
    Schema::create('inscripciones', function (Blueprint $table) {
        $table->id();
        
        // Relaciones clave
        $table->foreignId('alumno_id')->constrained('alumnos')->onDelete('cascade');
        $table->foreignId('actividad_id')->constrained('actividades')->onDelete('cascade');
        
        // Control del proceso (RF05 y RF06)
        $table->integer('horas_acumuladas')->default(0);
        $table->enum('estatus', ['inscrito', 'en_curso', 'acreditado', 'reprobado'])->default('inscrito');
        
        // Ruta para el documento final (RNF06 y RF06)
        $table->string('ruta_constancia')->nullable(); // Guardará la ubicación del PDF generado
        
        $table->timestamps();
        
        // Regla de negocio: Un alumno no puede inscribirse dos veces a la misma actividad
        $table->unique(['alumno_id', 'actividad_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripciones');
    }
};
