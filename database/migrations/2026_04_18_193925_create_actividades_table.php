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
    Schema::create('actividades', function (Blueprint $table) {
        $table->id();
        
        // Relación: ¿Qué docente imparte esta actividad?
        $table->foreignId('docente_id')->constrained('docentes')->onDelete('cascade');
        
        // Datos de la actividad requeridos en tu documento
        $table->string('nombre');
        $table->text('descripcion')->nullable();
        $table->integer('creditos'); // Valor en créditos (RF01)
        $table->integer('cupo_maximo'); // Límite de alumnos (RF01)
        $table->string('horario')->nullable(); // Días y horas (Objetivo 5)
        
        // Filtro de periodo (Objetivo 6)
        $table->enum('tipo_periodo', ['semestral', 'intersemestral']); 
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actividades');
    }
};
