<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAlumnosTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['rol' => 'administrador']);
    }

    private function alumno(array $attrs = []): Alumno
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        return Alumno::create(array_merge([
            'user_id'             => $user->id,
            'matricula'           => '210' . rand(100, 999),
            'nombre'              => 'Test',
            'apellido_paterno'    => 'Apellido',
            'apellido_materno'    => 'Materno',
            'carrera'             => 'ISC',
            'semestre'            => 4,
            'creditos_acumulados' => 0,
        ], $attrs));
    }

    public function test_admin_puede_ver_lista_de_alumnos(): void
    {
        $admin = $this->admin();
        $this->alumno(['creditos_acumulados' => 5]);
        $this->alumno(['creditos_acumulados' => 3]);

        $response = $this->actingAs($admin)->get('/admin/alumnos');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Alumnos')
            ->has('alumnos.data', 2)
            ->where('kpis.total', 2)
            ->where('kpis.acreditados', 1)
        );
    }

    public function test_admin_puede_filtrar_por_carrera(): void
    {
        $admin = $this->admin();
        $this->alumno(['carrera' => 'ISC']);
        $this->alumno(['carrera' => 'IGE']);

        $response = $this->actingAs($admin)->get('/admin/alumnos?carrera=ISC');

        $response->assertInertia(fn ($page) => $page->has('alumnos.data', 1));
    }

    public function test_admin_puede_filtrar_por_estatus_acreditado(): void
    {
        $admin = $this->admin();
        $this->alumno(['creditos_acumulados' => 5]);
        $this->alumno(['creditos_acumulados' => 2]);

        $response = $this->actingAs($admin)->get('/admin/alumnos?estatus=Acreditado');

        $response->assertInertia(fn ($page) => $page->has('alumnos.data', 1));
    }

    public function test_admin_puede_actualizar_creditos(): void
    {
        $admin = $this->admin();
        $alumno = $this->alumno(['creditos_acumulados' => 2]);

        $response = $this->actingAs($admin)->patch("/admin/alumnos/{$alumno->id}", [
            'creditos_acumulados' => 4,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('alumnos', ['id' => $alumno->id, 'creditos_acumulados' => 4]);
    }

    public function test_creditos_mayores_a_10_son_rechazados(): void
    {
        $admin  = $this->admin();
        $alumno = $this->alumno();

        $this->actingAs($admin)->patch("/admin/alumnos/{$alumno->id}", [
            'creditos_acumulados' => 15,
        ])->assertSessionHasErrors('creditos_acumulados');
    }

    public function test_no_admin_es_redirigido(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $this->actingAs($user)->get('/admin/alumnos')->assertRedirect(route('dashboard'));
    }
}
