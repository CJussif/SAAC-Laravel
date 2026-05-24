<?php

namespace Tests\Feature;

use App\Models\Actividad;
use App\Models\Alumno;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class AlumnoActividadesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that guest users are redirected to login.
     */
    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/actividades');
        $response->assertRedirect('/login');
    }

    /**
     * Test that non-alumno users are redirected to dashboard.
     */
    public function test_non_alumno_is_redirected_to_dashboard(): void
    {
        $user = User::factory()->create(['rol' => 'docente']);

        $response = $this->actingAs($user)->get('/actividades');
        $response->assertRedirect('/dashboard');
    }

    /**
     * Test that alumno user without an associated Alumno profile is redirected to dashboard.
     */
    public function test_alumno_without_profile_is_redirected_to_dashboard(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);

        $response = $this->actingAs($user)->get('/actividades');
        $response->assertRedirect('/dashboard');
    }

    /**
     * Test that authorized alumno with profile can access activities page and sees formatted data.
     */
    public function test_authorized_alumno_can_access_and_sees_formatted_activities(): void
    {
        // Create student user and profile
        $user = User::factory()->create(['rol' => 'alumno']);
        $alumno = Alumno::create([
            'user_id' => $user->id,
            'matricula' => '210045',
            'nombre' => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Ramírez',
            'carrera' => 'Sistemas',
            'semestre' => 4,
            'creditos_acumulados' => 3,
        ]);

        // Create docente
        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC123',
            'nombre' => 'Roberto',
            'apellido_paterno' => 'Méndez',
            'apellido_materno' => 'Martínez',
        ]);

        // Create activities (one of each category to test matching)
        $act1 = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Selección de Basquetbol Femenil',
            'descripcion' => 'Deporte en equipo',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $act2 = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Taller de Danza Folklórica',
            'descripcion' => 'Baile regional',
            'creditos' => 1,
            'cupo_maximo' => 30,
            'horario' => 'Lun, Mié y Vie, 09:00 – 11:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $act3 = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Programación Competitiva Avanzada',
            'descripcion' => 'Algoritmos y estructuras',
            'creditos' => 2,
            'cupo_maximo' => 15,
            'horario' => 'Vie, 10:00 – 14:00 hrs',
            'tipo_periodo' => 'intersemestral',
        ]);

        // Create some enrollments to test count (inscritos), ya_inscrito, and active enrollments
        // Enroll another student in act1
        $otherUser = User::factory()->create(['rol' => 'alumno']);
        $otherAlumno = Alumno::create([
            'user_id' => $otherUser->id,
            'matricula' => '210046',
            'nombre' => 'Ana',
            'apellido_paterno' => 'Gómez',
            'apellido_materno' => 'López',
            'carrera' => 'Sistemas',
            'semestre' => 4,
            'creditos_acumulados' => 0,
        ]);
        Inscripcion::create([
            'alumno_id' => $otherAlumno->id,
            'actividad_id' => $act1->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Enroll current student in act2 (with status en_curso)
        Inscripcion::create([
            'alumno_id' => $alumno->id,
            'actividad_id' => $act2->id,
            'horas_acumuladas' => 0,
            'estatus' => 'en_curso',
        ]);

        $response = $this->actingAs($user)->get('/actividades');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Alumno/Actividades')
            ->has('actividades', 3)
            ->has('inscripcionesActivas', 1)
            ->has('alumno', fn (Assert $a) => $a
                ->where('creditos_acumulados', 3)
                ->where('nombre', 'Juan Pérez')
            )
        );

        $actividades = $response->original->getData()['page']['props']['actividades'];

        // Find formatted activity 1
        $fAct1 = collect($actividades)->firstWhere('id', $act1->id);
        $this->assertEquals('deportiva', $fAct1['tipo']);
        $this->assertEquals('DEP-' . sprintf('%02d', $act1->id), $fAct1['clave']);
        $this->assertEquals('from-blue-500 to-blue-700', $fAct1['color']);
        $this->assertEquals(1, $fAct1['inscritos']);
        $this->assertFalse($fAct1['ya_inscrito']);
        $this->assertEquals('Inst. Roberto Méndez', $fAct1['instructor']);

        // Find formatted activity 2
        $fAct2 = collect($actividades)->firstWhere('id', $act2->id);
        $this->assertEquals('cultural', $fAct2['tipo']);
        $this->assertEquals('CUL-' . sprintf('%02d', $act2->id), $fAct2['clave']);
        $this->assertEquals('from-amber-500 to-amber-700', $fAct2['color']);
        $this->assertEquals(1, $fAct2['inscritos']);
        $this->assertTrue($fAct2['ya_inscrito']);
        $this->assertEquals('Inst. Roberto Méndez', $fAct2['instructor']);

        // Find formatted activity 3
        $fAct3 = collect($actividades)->firstWhere('id', $act3->id);
        $this->assertEquals('academica', $fAct3['tipo']);
        $this->assertEquals('ACA-' . sprintf('%02d', $act3->id), $fAct3['clave']);
        $this->assertEquals('from-teal-500 to-teal-700', $fAct3['color']);
        $this->assertEquals(0, $fAct3['inscritos']);
        $this->assertFalse($fAct3['ya_inscrito']);
        $this->assertEquals('Inst. Roberto Méndez', $fAct3['instructor']);

        // Verify active enrollments list
        $inscActive = $response->original->getData()['page']['props']['inscripcionesActivas'];
        $this->assertCount(1, $inscActive);
        $this->assertEquals($act2->id, $inscActive[0]['actividad_id']);
        $this->assertEquals('en_curso', $inscActive[0]['estatus']);
    }

    /**
     * Test that student can view their history page.
     */
    public function test_student_can_view_their_historial(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $alumno = Alumno::create([
            'user_id' => $user->id,
            'matricula' => '210045',
            'nombre' => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Ramírez',
            'carrera' => 'Sistemas',
            'semestre' => 4,
            'creditos_acumulados' => 3,
        ]);

        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC123',
            'nombre' => 'Roberto',
            'apellido_paterno' => 'Méndez',
            'apellido_materno' => 'Martínez',
        ]);

        $act1 = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Taller de Ajedrez Básico',
            'descripcion' => 'Ajedrez',
            'creditos' => 1,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $insc = Inscripcion::create([
            'alumno_id' => $alumno->id,
            'actividad_id' => $act1->id,
            'horas_acumuladas' => 0,
            'estatus' => 'acreditado',
        ]);

        $response = $this->actingAs($user)->get('/historial');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Alumno/Historial')
            ->has('historial', 1)
            ->has('alumno', fn (Assert $a) => $a
                ->where('creditos_acumulados', 3)
                ->where('nombre', 'Juan Pérez')
            )
        );

        $historial = $response->original->getData()['page']['props']['historial'];
        $this->assertEquals('deportiva', $historial[0]['tipo']);
        $this->assertEquals('acreditado', $historial[0]['estatus']);
        $this->assertNotNull($historial[0]['folio']);
    }

    /**
     * Test that student can view their certificates page.
     */
    public function test_student_can_view_their_constancias(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $alumno = Alumno::create([
            'user_id' => $user->id,
            'matricula' => '210045',
            'nombre' => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Ramírez',
            'carrera' => 'Sistemas',
            'semestre' => 4,
            'creditos_acumulados' => 1,
        ]);

        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC123',
            'nombre' => 'Roberto',
            'apellido_paterno' => 'Méndez',
            'apellido_materno' => 'Martínez',
        ]);

        $act1 = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Taller de Danza Folklórica',
            'descripcion' => 'Danza',
            'creditos' => 1,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $insc = Inscripcion::create([
            'alumno_id' => $alumno->id,
            'actividad_id' => $act1->id,
            'horas_acumuladas' => 0,
            'estatus' => 'acreditado',
        ]);

        $response = $this->actingAs($user)->get('/constancias');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Alumno/Constancias')
            ->has('constancias', 1)
        );

        $constancias = $response->original->getData()['page']['props']['constancias'];
        $this->assertEquals('cultural', $constancias[0]['tipo']);
        $this->assertEquals(1, $constancias[0]['creditos']);
        $this->assertNotNull($constancias[0]['folio']);
    }
}
