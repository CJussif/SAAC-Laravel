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
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_id')->constrained('alumnos')->onDelete('cascade');
            $table->string('nombre_actividad');
            $table->string('tipo_actividad'); // 'deportiva', 'cultural', 'academica'
            $table->string('institucion');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->integer('horas')->nullable();
            $table->text('descripcion')->nullable();
            $table->string('ruta_archivo');
            $table->string('estatus')->default('pendiente'); // 'pendiente', 'aprobada', 'rechazada'
            $table->text('motivo_rechazo')->nullable();
            $table->integer('creditos_otorgados')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
