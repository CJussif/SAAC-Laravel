<?php

namespace Tests\Feature;

use App\Models\Actividad;
use App\Models\Alumno;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InscripcionTest extends TestCase
{
    use RefreshDatabase;

    protected User $studentUser;
    protected Alumno $alumno;
    protected User $teacherUser;
    protected Docente $docente;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create a student user and associated Alumno profile
        $this->studentUser = User::factory()->create(['rol' => 'alumno']);
        $this->alumno = Alumno::create([
            'user_id' => $this->studentUser->id,
            'matricula' => '210045',
            'nombre' => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Ramírez',
            'carrera' => 'Sistemas',
            'semestre' => 4,
            'creditos_acumulados' => 3,
        ]);

        // 2. Create a teacher user and associated Docente profile
        $this->teacherUser = User::factory()->create(['rol' => 'docente']);
        $this->docente = Docente::create([
            'user_id' => $this->teacherUser->id,
            'numero_empleado' => 'DOC123',
            'nombre' => 'Roberto',
            'apellido_paterno' => 'Méndez',
            'apellido_materno' => 'Martínez',
        ]);
    }

    /**
     * Verify a student can enroll in a valid activity, check redirect, and check database record has status 'inscrito'.
     */
    public function test_student_can_enroll_successfully(): void
    {
        $actividad = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Selección de Basquetbol Femenil',
            'descripcion' => 'Deporte en equipo',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $response = $this->actingAs($this->studentUser)
            ->post('/inscripciones', [
                'actividad_id' => $actividad->id,
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('inscripciones', [
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $actividad->id,
            'estatus' => 'inscrito',
        ]);
    }

    /**
     * Verify a student cannot enroll if already enrolled, assert session has errors for 'actividad_id', and check DB count.
     */
    public function test_student_cannot_enroll_twice_in_same_activity(): void
    {
        $actividad = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Selección de Basquetbol Femenil',
            'descripcion' => 'Deporte en equipo',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        // First enrollment
        Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $actividad->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Try second enrollment
        $response = $this->actingAs($this->studentUser)
            ->post('/inscripciones', [
                'actividad_id' => $actividad->id,
            ]);

        $response->assertSessionHasErrors(['actividad_id']);
        
        $this->assertEquals(1, Inscripcion::where('alumno_id', $this->alumno->id)
            ->where('actividad_id', $actividad->id)
            ->count());
    }

    /**
     * Create activity with cupo_maximo = 1, enroll another student to fill it, try to enroll current student, assert session has errors for 'actividad_id'.
     */
    public function test_student_cannot_enroll_if_capacity_is_full(): void
    {
        $actividad = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Selección de Basquetbol Femenil',
            'descripcion' => 'Deporte en equipo',
            'creditos' => 2,
            'cupo_maximo' => 1,
            'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        // Enroll another student to fill the only spot
        $otherStudent = User::factory()->create(['rol' => 'alumno']);
        $otherAlumno = Alumno::create([
            'user_id' => $otherStudent->id,
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
            'actividad_id' => $actividad->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Try to enroll current student
        $response = $this->actingAs($this->studentUser)
            ->post('/inscripciones', [
                'actividad_id' => $actividad->id,
            ]);

        $response->assertSessionHasErrors(['actividad_id']);
    }

    /**
     * E.g., student is enrolled in 2 active activities (status 'inscrito' or 'en_curso'). Try to enroll in a 3rd one, assert session has errors.
     */
    public function test_student_cannot_enroll_more_than_two_active_activities(): void
    {
        $actividad1 = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Actividad 1',
            'descripcion' => 'Deporte 1',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 10:00 – 12:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $actividad2 = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Actividad 2',
            'descripcion' => 'Deporte 2',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 12:00 – 14:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $actividad3 = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Actividad 3',
            'descripcion' => 'Deporte 3',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Mar y Jue, 14:00 – 16:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        // Enroll in 1st active activity
        Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $actividad1->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Enroll in 2nd active activity
        Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $actividad2->id,
            'horas_acumuladas' => 0,
            'estatus' => 'en_curso',
        ]);

        // Try to enroll in 3rd active activity
        $response = $this->actingAs($this->studentUser)
            ->post('/inscripciones', [
                'actividad_id' => $actividad3->id,
            ]);

        $response->assertSessionHasErrors(['actividad_id']);
    }

    /**
     * Create activity 1 on 'Lun y Mié, 10:00 – 12:00 hrs', enroll student. Create activity 2 on 'Lun y Mié, 11:00 – 13:00 hrs', try to enroll student in activity 2, assert session has errors.
     */
    public function test_student_cannot_enroll_with_schedule_overlap(): void
    {
        $actividad1 = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Actividad 1',
            'descripcion' => 'Deporte 1',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Lun y Mié, 10:00 – 12:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        $actividad2 = Actividad::create([
            'docente_id' => $this->docente->id,
            'nombre' => 'Actividad 2',
            'descripcion' => 'Deporte 2',
            'creditos' => 2,
            'cupo_maximo' => 20,
            'horario' => 'Lun y Mié, 11:00 – 13:00 hrs',
            'tipo_periodo' => 'semestral',
        ]);

        // Enroll student in activity 1
        Inscripcion::create([
            'alumno_id' => $this->alumno->id,
            'actividad_id' => $actividad1->id,
            'horas_acumuladas' => 0,
            'estatus' => 'inscrito',
        ]);

        // Try to enroll student in activity 2
        $response = $this->actingAs($this->studentUser)
            ->post('/inscripciones', [
                'actividad_id' => $actividad2->id,
            ]);

        $response->assertSessionHasErrors(['actividad_id']);
    }
}
