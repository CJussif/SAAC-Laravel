<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\Asistencia;
use App\Models\Actividad;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocenteExpedientesTest extends TestCase
{
    use RefreshDatabase;

    public function test_docente_puede_ver_expedientes_de_sus_alumnos(): void
    {
        $user = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id'          => $user->id,
            'numero_empleado'  => 'DOC99002',
            'nombre'           => 'María',
            'apellido_paterno' => 'López',
            'apellido_materno' => 'Soto',
        ]);
        $actividad = Actividad::create([
            'docente_id'   => $docente->id,
            'nombre'       => 'Club de Robótica',
            'descripcion'  => 'Robótica avanzada',
            'creditos'     => 2,
            'cupo_maximo'  => 15,
            'horario'      => 'Sáb 09:00',
            'tipo_periodo' => 'semestral',
        ]);
        $userAlumno = User::factory()->create(['rol' => 'alumno']);
        $alumno = Alumno::create([
            'user_id'             => $userAlumno->id,
            'matricula'           => '210500',
            'nombre'              => 'Pedro',
            'apellido_paterno'    => 'Ruiz',
            'apellido_materno'    => 'Vega',
            'carrera'             => 'IDS',
            'semestre'            => 6,
            'creditos_acumulados' => 0,
        ]);
        $inscripcion = Inscripcion::create([
            'alumno_id'        => $alumno->id,
            'actividad_id'     => $actividad->id,
            'horas_acumuladas' => 0,
            'estatus'          => 'en_curso',
        ]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-01', 'asistio' => true]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-03', 'asistio' => true]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-05', 'asistio' => false]);

        $response = $this->actingAs($user)->get('/expedientes');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Docente/Expedientes')
            ->has('expedientes', 1)
            ->where('expedientes.0.matricula', '210500')
            ->where('expedientes.0.sesiones.total', 3)
            ->where('expedientes.0.sesiones.cursadas', 2)
            ->where('expedientes.0.porcentaje_asistencia', 67)
        );
    }

    public function test_expedientes_devuelve_nombres_de_actividades(): void
    {
        $user = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $user->id, 'numero_empleado' => 'DOC99003',
            'nombre' => 'Test', 'apellido_paterno' => 'Test', 'apellido_materno' => 'Test',
        ]);
        Actividad::create([
            'docente_id' => $docente->id, 'nombre' => 'Taller de Ajedrez',
            'descripcion' => 'Ajedrez', 'creditos' => 1, 'cupo_maximo' => 10,
            'horario' => 'Lun', 'tipo_periodo' => 'semestral',
        ]);

        $response = $this->actingAs($user)->get('/expedientes');

        $response->assertInertia(fn ($page) => $page
            ->where('actividades.0', 'Taller de Ajedrez')
        );
    }

    public function test_no_docente_es_redirigido(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $this->actingAs($user)->get('/expedientes')->assertRedirect(route('dashboard'));
    }
}
