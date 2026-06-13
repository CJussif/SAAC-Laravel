<?php

namespace Tests\Feature;

use App\Models\Actividad;
use App\Models\Alumno;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminConstanciasTest extends TestCase
{
    use RefreshDatabase;

    private function setup_actividad(): array
    {
        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id, 'numero_empleado' => 'DOC00001',
            'nombre' => 'Prof', 'apellido_paterno' => 'Test', 'apellido_materno' => 'Test',
        ]);
        $actividad = Actividad::create([
            'docente_id' => $docente->id, 'nombre' => 'Danza Folklórica',
            'descripcion' => 'desc', 'creditos' => 1, 'cupo_maximo' => 10,
            'horario' => 'Lun', 'tipo_periodo' => 'semestral',
        ]);
        return [$docente, $actividad];
    }

    private function setup_alumno(): Alumno
    {
        $userAlumno = User::factory()->create(['rol' => 'alumno']);
        return Alumno::create([
            'user_id' => $userAlumno->id, 'matricula' => '210001',
            'nombre' => 'Ana', 'apellido_paterno' => 'García', 'apellido_materno' => 'López',
            'carrera' => 'ISC', 'semestre' => 4, 'creditos_acumulados' => 1,
        ]);
    }

    public function test_no_muestra_inscripciones_sin_constancia(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        [, $actividad] = $this->setup_actividad();
        $alumno = $this->setup_alumno();
        Inscripcion::create([
            'alumno_id' => $alumno->id, 'actividad_id' => $actividad->id,
            'horas_acumuladas' => 20, 'estatus' => 'en_curso', 'ruta_constancia' => null,
        ]);

        $response = $this->actingAs($admin)->get('/admin/constancias');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Constancias')
            ->has('constancias', 0)
        );
    }

    public function test_muestra_inscripciones_con_constancia(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        [, $actividad] = $this->setup_actividad();
        $alumno = $this->setup_alumno();
        Inscripcion::create([
            'alumno_id' => $alumno->id, 'actividad_id' => $actividad->id,
            'horas_acumuladas' => 24, 'estatus' => 'acreditado',
            'ruta_constancia' => 'constancias/abc123.pdf',
        ]);

        $response = $this->actingAs($admin)->get('/admin/constancias');

        $response->assertInertia(fn ($page) => $page
            ->has('constancias', 1)
            ->where('constancias.0.matricula', '210001')
            ->where('kpis.total', 1)
            ->where('kpis.alumnos_cubiertos', 1)
        );
    }

    public function test_no_admin_es_redirigido(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $this->actingAs($user)->get('/admin/constancias')->assertRedirect(route('dashboard'));
    }
}
