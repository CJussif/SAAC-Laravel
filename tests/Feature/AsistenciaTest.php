<?php

namespace Tests\Feature;

use App\Models\Actividad;
use App\Models\Alumno;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\Asistencia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class AsistenciaTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacherUser;
    protected Docente $docente;
    protected User $studentUser;
    protected Alumno $alumno;
    protected Actividad $actividad;

    protected function setUp(): void
    {
        parent::setUp();

        // Create teacher
        $this->teacherUser = User::factory()->create(['rol' => 'docente']);
        $this->docente = Docente::create([
            'user_id' => $this->teacherUser->id,
            'numero_empleado' => 'DOC456',
            'nombre' => 'María',
            'apellido_paterno' => 'Gómez',
            'apellido_materno' => 'Sánchez',
        ]);

        // Create student
        $this->studentUser = User::factory()->create(['rol' => 'alumno']);
        $this->alumno = Alumno::create([
            'user_id' => $this->studentUser->id,
            'matricula' => '210099',
            'nombre' => 'Carlos',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Rodríguez',
            'carrera' => 'Sistemas',
            'semestre' => 4,
            'creditos_acumulados' => 0,
        ]);

        // Create activity
        $this->actividad = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Taller de Yoga y Meditación',
            'descripcion' => 'Actividad física y mental',
            'creditos' => 3,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 08:00 – 10:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);
    }

    public function test_access_restricted_to_docente(): void
    {
        // Unauthenticated redirect
        $this->get('/asistencia')->assertRedirect('/login');

        // Student redirect to dashboard
        $this->actingAs($this->studentUser)
            ->get('/asistencia')
            ->assertRedirect(route('dashboard'));
    }

    public function test_asistencia_index_returns_inertia_view(): void
    {
        // Enroll student
        $inscripcion = Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $this->actividad->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Create some attendance
        Asistencia::create([
            'inscripcion_id' => $inscripcion->id,
            'fecha' => '2026-02-02',
            'asistio' => true,
        ]);

        $response = $this->actingAs($this->teacherUser)
            ->get('/asistencia?semana=1');

        $response->assertOk();

        // Check props returned
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Docente/Asistencia')
            ->has('grupos')
            ->has('alumnos')
            ->has('selectedGrupoId')
            ->has('semana')
            ->has('weekRange')
            ->has('weekDates')
        );

        $data = $response->original->getData();
        $this->assertCount(1, $data['page']['props']['grupos']);
        $this->assertEquals('DEPORTIVA', $data['page']['props']['grupos'][0]['tipo']); // because it contains 'yoga'
        $this->assertCount(1, $data['page']['props']['alumnos']);
        $this->assertEquals($inscripcion->id, $data['page']['props']['alumnos'][0]['inscripcion_id']);
        $this->assertTrue($data['page']['props']['alumnos'][0]['asistencia'][0]); // Monday Feb 2, 2026 is true
        $this->assertNull($data['page']['props']['alumnos'][0]['asistencia'][1]); // Tuesday Feb 3, 2026 is null
    }

    public function test_asistencia_store_saves_bulk_attendance(): void
    {
        $inscripcion = Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $this->actividad->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        $response = $this->actingAs($this->teacherUser)
            ->post('/asistencia', [
                'asistencias' => [
                    [
                        'inscripcion_id' => $inscripcion->id,
                        'fecha' => '2026-02-02',
                        'asistio' => true,
                    ],
                    [
                        'inscripcion_id' => $inscripcion->id,
                        'fecha' => '2026-02-03',
                        'asistio' => false,
                    ]
                ]
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Query the models directly to avoid SQLite date-time format assertion issues
        $asist1 = Asistencia::where('inscripcion_id', $inscripcion->id)
            ->whereDate('fecha', '2026-02-02')
            ->first();
        $this->assertNotNull($asist1);
        $this->assertTrue($asist1->asistio);

        $asist2 = Asistencia::where('inscripcion_id', $inscripcion->id)
            ->whereDate('fecha', '2026-02-03')
            ->first();
        $this->assertNotNull($asist2);
        $this->assertFalse($asist2->asistio);
    }

    public function test_asistencia_acreditar_finalizes_grades_correctly(): void
    {
        $inscripcion = Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $this->actividad->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Create attendance: 3 asistencias, 2 true, 1 false = 67% (>= 60%)
        Asistencia::create([
            'inscripcion_id' => $inscripcion->id,
            'fecha' => '2026-02-02',
            'asistio' => true,
        ]);
        Asistencia::create([
            'inscripcion_id' => $inscripcion->id,
            'fecha' => '2026-02-03',
            'asistio' => true,
        ]);
        Asistencia::create([
            'inscripcion_id' => $inscripcion->id,
            'fecha' => '2026-02-04',
            'asistio' => false,
        ]);

        // Prior credits
        $this->assertEquals(0, $this->alumno->fresh()->creditos_acumulados);

        $response = $this->actingAs($this->teacherUser)
            ->post('/asistencia/acreditar', [
                'grupo_id' => $this->actividad->id,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check inscription status is 'acreditado'
        $this->assertEquals('acreditado', $inscripcion->fresh()->estatus);

        // Check student creditos_acumulados incremented by activity's credits (3)
        $this->assertEquals(3, $this->alumno->fresh()->creditos_acumulados);
    }

    public function test_asistencia_acreditar_reprobar_if_attendance_below_60(): void
    {
        $inscripcion = Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $this->actividad->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Create attendance: 2 asistencias, 1 true, 1 false = 50% (< 60%)
        Asistencia::create([
            'inscripcion_id' => $inscripcion->id,
            'fecha' => '2026-02-02',
            'asistio' => true,
        ]);
        Asistencia::create([
            'inscripcion_id' => $inscripcion->id,
            'fecha' => '2026-02-03',
            'asistio' => false,
        ]);

        $response = $this->actingAs($this->teacherUser)
            ->post('/asistencia/acreditar', [
                'grupo_id' => $this->actividad->id,
            ]);

        $response->assertRedirect();

        // Check inscription status is 'reprobado'
        $this->assertEquals('reprobado', $inscripcion->fresh()->estatus);

        // Check student creditos_acumulados remains 0
        $this->assertEquals(0, $this->alumno->fresh()->creditos_acumulados);
    }
}
