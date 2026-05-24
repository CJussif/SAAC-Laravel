<?php

namespace Tests\Feature;

use App\Models\Actividad;
use App\Models\Docente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class AdminActividadTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that guests cannot access the admin catalog.
     */
    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/admin/catalogo');
        $response->assertRedirect('/login');
    }

    /**
     * Test that non-admin users (e.g. students/docentes) are redirected to dashboard.
     */
    public function test_non_admin_is_redirected_to_dashboard(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);

        $response = $this->actingAs($user)->get('/admin/catalogo');
        $response->assertRedirect('/dashboard');
    }

    /**
     * Test that administrators can access the catalog and see correct lists.
     */
    public function test_admin_can_access_catalog(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        
        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC001',
            'nombre' => 'María',
            'apellido_paterno' => 'González',
            'apellido_materno' => 'Pérez',
        ]);

        $actividad = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Fútbol',
            'descripcion' => 'Deporte',
            'creditos' => 2,
            'cupo_maximo' => 25,
            'horario' => 'Lunes 10-12',
            'tipo_periodo' => 'semestral',
        ]);

        $response = $this->actingAs($admin)->get('/admin/catalogo');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Catalogo')
            ->has('actividades', 1)
            ->has('docentes', 1)
            ->has('docentes.0', fn (Assert $docenteAssert) => $docenteAssert
                ->where('id', $docente->id)
                ->where('nombre_completo', 'María González Pérez')
            )
        );
    }

    /**
     * Test admin can create a new activity.
     */
    public function test_admin_can_create_actividad(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        
        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC001',
            'nombre' => 'María',
            'apellido_paterno' => 'González',
            'apellido_materno' => 'Pérez',
        ]);

        $data = [
            'nombre' => 'Ajedrez',
            'descripcion' => 'Estrategia',
            'creditos' => 1,
            'cupo_maximo' => 15,
            'horario' => 'Martes 14-16',
            'docente_id' => $docente->id,
            'tipo_periodo' => 'semestral',
        ];

        $response = $this->actingAs($admin)->post('/admin/catalogo', $data);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Actividad complementaria creada correctamente.');
        $this->assertDatabaseHas('actividades', [
            'nombre' => 'Ajedrez',
            'creditos' => 1,
            'cupo_maximo' => 15,
            'tipo_periodo' => 'semestral',
        ]);
    }

    /**
     * Test validation rules for store.
     */
    public function test_admin_create_actividad_validation(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);

        $response = $this->actingAs($admin)->post('/admin/catalogo', []);

        $response->assertSessionHasErrors([
            'nombre',
            'creditos',
            'cupo_maximo',
            'horario',
            'docente_id',
            'tipo_periodo',
        ]);
    }

    /**
     * Test admin can update an existing activity.
     */
    public function test_admin_can_update_actividad(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        
        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC001',
            'nombre' => 'María',
            'apellido_paterno' => 'González',
            'apellido_materno' => 'Pérez',
        ]);

        $actividad = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Fútbol',
            'descripcion' => 'Deporte',
            'creditos' => 2,
            'cupo_maximo' => 25,
            'horario' => 'Lunes 10-12',
            'tipo_periodo' => 'semestral',
        ]);

        $data = [
            'nombre' => 'Fútbol Rápido',
            'descripcion' => 'Nuevo Deporte',
            'creditos' => 3,
            'cupo_maximo' => 30,
            'horario' => 'Miércoles 12-14',
            'docente_id' => $docente->id,
            'tipo_periodo' => 'intersemestral',
        ];

        $response = $this->actingAs($admin)->put("/admin/catalogo/{$actividad->id}", $data);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Actividad complementaria actualizada correctamente.');
        $this->assertDatabaseHas('actividades', [
            'id' => $actividad->id,
            'nombre' => 'Fútbol Rápido',
            'creditos' => 3,
            'cupo_maximo' => 30,
            'tipo_periodo' => 'intersemestral',
        ]);
    }

    /**
     * Test admin can delete an activity.
     */
    public function test_admin_can_delete_actividad(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        
        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC001',
            'nombre' => 'María',
            'apellido_paterno' => 'González',
            'apellido_materno' => 'Pérez',
        ]);

        $actividad = Actividad::create([
            'docente_id' => $docente->id,
            'nombre' => 'Fútbol',
            'descripcion' => 'Deporte',
            'creditos' => 2,
            'cupo_maximo' => 25,
            'horario' => 'Lunes 10-12',
            'tipo_periodo' => 'semestral',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/catalogo/{$actividad->id}");

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Actividad complementaria eliminada correctamente.');
        $this->assertDatabaseMissing('actividades', [
            'id' => $actividad->id,
        ]);
    }
}
