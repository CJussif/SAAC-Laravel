<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\Solicitud;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class EvidenciaTest extends TestCase
{
    use RefreshDatabase;

    protected User $studentUser;
    protected Alumno $alumno;
    protected User $adminUser;

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

        // 2. Create an admin user
        $this->adminUser = User::factory()->create(['rol' => 'administrador']);
    }

    /**
     * Test that student can upload evidence successfully.
     */
    public function test_student_can_upload_evidence_successfully(): void
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('constancia.pdf', 2048, 'application/pdf');

        $response = $this->actingAs($this->studentUser)
            ->post('/subir-evidencia', [
                'tipo_actividad' => 'deportiva',
                'nombre_actividad' => 'Torneo de Fútbol Externo',
                'institucion' => 'Deportivo Toluca FC',
                'fecha_inicio' => '2026-05-01',
                'fecha_fin' => '2026-05-15',
                'horas' => 20,
                'descripcion' => 'Participación en torneo intermunicipal',
                'archivo' => $file,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', '¡Solicitud enviada! Tu evidencia está en revisión por el área SAAC.');

        $solicitud = Solicitud::first();
        $this->assertNotNull($solicitud);
        $this->assertEquals($this->alumno->id, $solicitud->alumno_id);
        $this->assertEquals('Torneo de Fútbol Externo', $solicitud->nombre_actividad);
        $this->assertEquals('deportiva', $solicitud->tipo_actividad);
        $this->assertEquals('pendiente', $solicitud->estatus);

        Storage::disk('local')->assertExists($solicitud->ruta_archivo);
    }

    /**
     * Test that student cannot upload evidence with invalid file type.
     */
    public function test_student_cannot_upload_invalid_file_type(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('constancia.zip', 1024, 'application/zip');

        $response = $this->actingAs($this->studentUser)
            ->post('/subir-evidencia', [
                'tipo_actividad' => 'deportiva',
                'nombre_actividad' => 'Torneo de Fútbol Externo',
                'institucion' => 'Deportivo Toluca FC',
                'fecha_inicio' => '2026-05-01',
                'fecha_fin' => '2026-05-15',
                'horas' => 20,
                'descripcion' => 'Participación en torneo intermunicipal',
                'archivo' => $file,
            ]);

        $response->assertSessionHasErrors(['archivo']);
        $this->assertEquals(0, Solicitud::count());
    }

    /**
     * Test that student cannot upload evidence with file larger than 5MB.
     */
    public function test_student_cannot_upload_file_larger_than_5mb(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('constancia.pdf', 6000, 'application/pdf'); // ~5.8 MB

        $response = $this->actingAs($this->studentUser)
            ->post('/subir-evidencia', [
                'tipo_actividad' => 'deportiva',
                'nombre_actividad' => 'Torneo de Fútbol Externo',
                'institucion' => 'Deportivo Toluca FC',
                'fecha_inicio' => '2026-05-01',
                'fecha_fin' => '2026-05-15',
                'horas' => 20,
                'descripcion' => 'Participación en torneo intermunicipal',
                'archivo' => $file,
            ]);

        $response->assertSessionHasErrors(['archivo']);
        $this->assertEquals(0, Solicitud::count());
    }

    /**
     * Test validation rules on missing fields for evidence upload.
     */
    public function test_student_cannot_upload_with_missing_fields(): void
    {
        $response = $this->actingAs($this->studentUser)
            ->post('/subir-evidencia', []);

        $response->assertSessionHasErrors([
            'tipo_actividad',
            'nombre_actividad',
            'institucion',
            'fecha_inicio',
            'fecha_fin',
            'archivo',
        ]);
        $this->assertEquals(0, Solicitud::count());
    }

    /**
     * Test validation when end date is before start date.
     */
    public function test_student_cannot_upload_if_end_date_before_start_date(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('constancia.pdf', 1024, 'application/pdf');

        $response = $this->actingAs($this->studentUser)
            ->post('/subir-evidencia', [
                'tipo_actividad' => 'deportiva',
                'nombre_actividad' => 'Torneo de Fútbol Externo',
                'institucion' => 'Deportivo Toluca FC',
                'fecha_inicio' => '2026-05-15',
                'fecha_fin' => '2026-05-01',
                'horas' => 20,
                'descripcion' => 'Participación en torneo intermunicipal',
                'archivo' => $file,
            ]);

        $response->assertSessionHasErrors(['fecha_fin']);
        $this->assertEquals(0, Solicitud::count());
    }

    /**
     * Test admin can view the list of evidences.
     */
    public function test_admin_can_view_evidence_list(): void
    {
        Solicitud::create([
            'alumno_id' => $this->alumno->id,
            'nombre_actividad' => 'Curso de Java',
            'tipo_actividad' => 'academica',
            'institucion' => 'Oracle Academy',
            'fecha_inicio' => '2026-04-01',
            'fecha_fin' => '2026-04-10',
            'horas' => 40,
            'descripcion' => 'Curso completo de Java SE',
            'ruta_archivo' => 'evidencias/test.pdf',
            'estatus' => 'pendiente',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->get('/admin/evidencias');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Evidencias')
            ->has('solicitudes', 1)
            ->has('solicitudes.0', fn (Assert $solicitud) => $solicitud
                ->where('actividad', 'Curso de Java')
                ->where('tipo_actividad', 'academica')
                ->where('estatus', 'pendiente')
                ->etc()
            )
        );
    }

    /**
     * Test admin can approve an evidence request and student accumulates credits.
     */
    public function test_admin_can_approve_evidence_request(): void
    {
        $solicitud = Solicitud::create([
            'alumno_id' => $this->alumno->id,
            'nombre_actividad' => 'Curso de Java',
            'tipo_actividad' => 'academica',
            'institucion' => 'Oracle Academy',
            'fecha_inicio' => '2026-04-01',
            'fecha_fin' => '2026-04-10',
            'horas' => 40,
            'descripcion' => 'Curso completo de Java SE',
            'ruta_archivo' => 'evidencias/test.pdf',
            'estatus' => 'pendiente',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->post("/admin/evidencias/{$solicitud->id}/validar", [
                'estatus' => 'aprobada',
                'creditos' => 2,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'La evidencia ha sido aprobada e incorporada al historial del alumno.');

        $solicitud->refresh();
        $this->assertEquals('aprobada', $solicitud->estatus);
        $this->assertEquals(2, $solicitud->creditos_otorgados);

        $this->alumno->refresh();
        $this->assertEquals(5, $this->alumno->creditos_acumulados); // 3 original + 2 granted
    }

    /**
     * Test admin can reject an evidence request and reason is tracked.
     */
    public function test_admin_can_reject_evidence_request(): void
    {
        $solicitud = Solicitud::create([
            'alumno_id' => $this->alumno->id,
            'nombre_actividad' => 'Curso de Java',
            'tipo_actividad' => 'academica',
            'institucion' => 'Oracle Academy',
            'fecha_inicio' => '2026-04-01',
            'fecha_fin' => '2026-04-10',
            'horas' => 40,
            'descripcion' => 'Curso completo de Java SE',
            'ruta_archivo' => 'evidencias/test.pdf',
            'estatus' => 'pendiente',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->post("/admin/evidencias/{$solicitud->id}/validar", [
                'estatus' => 'rechazada',
                'motivo_rechazo' => 'El comprobante no tiene sello institucional.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'La evidencia ha sido rechazada.');

        $solicitud->refresh();
        $this->assertEquals('rechazada', $solicitud->estatus);
        $this->assertEquals('El comprobante no tiene sello institucional.', $solicitud->motivo_rechazo);
        $this->assertEquals(0, $solicitud->creditos_otorgados);

        $this->alumno->refresh();
        $this->assertEquals(3, $this->alumno->creditos_acumulados); // unchanged
    }

    /**
     * Test admin cannot reject an evidence request without providing a reason.
     */
    public function test_admin_cannot_reject_without_reason(): void
    {
        $solicitud = Solicitud::create([
            'alumno_id' => $this->alumno->id,
            'nombre_actividad' => 'Curso de Java',
            'tipo_actividad' => 'academica',
            'institucion' => 'Oracle Academy',
            'fecha_inicio' => '2026-04-01',
            'fecha_fin' => '2026-04-10',
            'horas' => 40,
            'descripcion' => 'Curso completo de Java SE',
            'ruta_archivo' => 'evidencias/test.pdf',
            'estatus' => 'pendiente',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->post("/admin/evidencias/{$solicitud->id}/validar", [
                'estatus' => 'rechazada',
                'motivo_rechazo' => '',
            ]);

        $response->assertSessionHasErrors(['motivo_rechazo']);

        $solicitud->refresh();
        $this->assertEquals('pendiente', $solicitud->estatus);
    }
}
