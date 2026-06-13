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

class DocenteGruposTest extends TestCase
{
    use RefreshDatabase;

    private function crearDocente(): array
    {
        $user = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id'          => $user->id,
            'numero_empleado'  => 'DOC99001',
            'nombre'           => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'García',
        ]);
        return [$user, $docente];
    }

    private function crearAlumnoInscrito(int $actividadId): array
    {
        $userAlumno = User::factory()->create(['rol' => 'alumno']);
        $alumno = Alumno::create([
            'user_id'             => $userAlumno->id,
            'matricula'           => '210' . rand(100, 999),
            'nombre'              => 'Ana',
            'apellido_paterno'    => 'García',
            'apellido_materno'    => 'López',
            'carrera'             => 'ISC',
            'semestre'            => 4,
            'creditos_acumulados' => 0,
        ]);
        $inscripcion = Inscripcion::create([
            'alumno_id'        => $alumno->id,
            'actividad_id'     => $actividadId,
            'horas_acumuladas' => 0,
            'estatus'          => 'en_curso',
        ]);
        return [$alumno, $inscripcion];
    }

    public function test_docente_puede_ver_sus_grupos(): void
    {
        [$user, $docente] = $this->crearDocente();
        Actividad::create([
            'docente_id'   => $docente->id,
            'nombre'       => 'Taller de Yoga',
            'descripcion'  => 'Yoga básico',
            'creditos'     => 1,
            'cupo_maximo'  => 30,
            'horario'      => 'Lun 10:00',
            'tipo_periodo' => 'semestral',
        ]);

        $response = $this->actingAs($user)->get('/grupos');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Docente/Grupos')
            ->has('grupos', 1)
            ->where('grupos.0.nombre', 'Taller de Yoga')
        );
    }

    public function test_grupos_incluyen_alumnos_con_porcentaje_asistencia(): void
    {
        [$user, $docente] = $this->crearDocente();
        $actividad = Actividad::create([
            'docente_id'   => $docente->id,
            'nombre'       => 'Taller de Danza',
            'descripcion'  => 'Danza folklórica',
            'creditos'     => 1,
            'cupo_maximo'  => 30,
            'horario'      => 'Lun 10:00',
            'tipo_periodo' => 'semestral',
        ]);
        [, $inscripcion] = $this->crearAlumnoInscrito($actividad->id);

        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-01', 'asistio' => true]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-02', 'asistio' => false]);

        $response = $this->actingAs($user)->get('/grupos');

        $response->assertInertia(fn ($page) => $page
            ->where('alumnosPorGrupo.' . $actividad->id . '.0.porcentaje_asistencia', 50)
        );
    }

    public function test_no_docente_es_redirigido_al_dashboard(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);

        $this->actingAs($user)->get('/grupos')
            ->assertRedirect(route('dashboard'));
    }
}
