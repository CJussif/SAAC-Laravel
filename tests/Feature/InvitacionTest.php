<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\Invitacion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvitacionTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['rol' => 'administrador']);
    }

    // ── Panel admin ──────────────────────────────────────────────────────────

    public function test_admin_puede_ver_lista_de_invitaciones(): void
    {
        $admin = $this->admin();
        Invitacion::create(['email' => 'test@tescha.edu.mx', 'token' => 'abc-123']);

        $this->actingAs($admin)->get('/admin/invitaciones')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Invitaciones')
                ->has('invitaciones', 1)
            );
    }

    public function test_admin_puede_crear_invitacion(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/invitaciones', [
            'email' => 'nuevo@tescha.edu.mx',
        ])->assertRedirect();

        $this->assertDatabaseHas('invitaciones', ['email' => 'nuevo@tescha.edu.mx']);
        $this->assertNotEmpty(Invitacion::first()->token);
    }

    public function test_no_puede_invitar_email_ya_registrado(): void
    {
        $admin = $this->admin();
        User::factory()->create(['email' => 'existente@tescha.edu.mx']);

        $this->actingAs($admin)->post('/admin/invitaciones', [
            'email' => 'existente@tescha.edu.mx',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseMissing('invitaciones', ['email' => 'existente@tescha.edu.mx']);
    }

    public function test_no_puede_invitar_email_con_invitacion_pendiente(): void
    {
        $admin = $this->admin();
        Invitacion::create(['email' => 'pendiente@tescha.edu.mx', 'token' => 'tok-001']);

        $this->actingAs($admin)->post('/admin/invitaciones', [
            'email' => 'pendiente@tescha.edu.mx',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('invitaciones', 1);
    }

    public function test_admin_puede_revocar_invitacion_pendiente(): void
    {
        $admin = $this->admin();
        $inv = Invitacion::create(['email' => 'revocar@tescha.edu.mx', 'token' => 'tok-002']);

        $this->actingAs($admin)->delete("/admin/invitaciones/{$inv->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('invitaciones', ['id' => $inv->id]);
    }

    public function test_no_puede_revocar_invitacion_ya_usada(): void
    {
        $admin = $this->admin();
        $inv = Invitacion::create([
            'email' => 'usada@tescha.edu.mx', 'token' => 'tok-003', 'usado_en' => now(),
        ]);

        $this->actingAs($admin)->delete("/admin/invitaciones/{$inv->id}")
            ->assertRedirect();

        $this->assertDatabaseHas('invitaciones', ['id' => $inv->id]);
    }

    // ── Activación pública ───────────────────────────────────────────────────

    public function test_token_valido_muestra_formulario(): void
    {
        Invitacion::create(['email' => 'alumno@tescha.edu.mx', 'token' => 'valid-token']);

        $this->get('/activar/valid-token')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Auth/ActivarCuenta')
                ->where('email', 'alumno@tescha.edu.mx')
                ->where('tokenInvalido', false)
            );
    }

    public function test_token_inexistente_muestra_error(): void
    {
        $this->get('/activar/token-no-existe')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Auth/ActivarCuenta')
                ->where('tokenInvalido', true)
            );
    }

    public function test_activacion_crea_usuario_y_alumno(): void
    {
        Invitacion::create(['email' => 'nuevo@tescha.edu.mx', 'token' => 'register-token']);

        $this->post('/activar/register-token', [
            'nombre'                => 'María',
            'apellido_paterno'      => 'Soto',
            'apellido_materno'      => 'Vega',
            'matricula'             => '210999',
            'carrera'               => 'ISC',
            'semestre'              => 3,
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('users',   ['email' => 'nuevo@tescha.edu.mx', 'rol' => 'alumno']);
        $this->assertDatabaseHas('alumnos', ['matricula' => '210999']);
        $this->assertNotNull(Invitacion::first()->usado_en);
    }

    public function test_token_ya_usado_rechaza_activacion(): void
    {
        Invitacion::create([
            'email' => 'usado@tescha.edu.mx', 'token' => 'used-token', 'usado_en' => now(),
        ]);

        $this->post('/activar/used-token', [
            'nombre'                => 'Test',
            'apellido_paterno'      => 'Test',
            'apellido_materno'      => 'Test',
            'matricula'             => '211000',
            'carrera'               => 'ISC',
            'semestre'              => 1,
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertRedirect('/activar/used-token');

        $this->assertDatabaseMissing('users', ['email' => 'usado@tescha.edu.mx', 'rol' => 'alumno']);
    }
}
