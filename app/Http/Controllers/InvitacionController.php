<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use App\Models\Invitacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InvitacionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $invitaciones = Invitacion::orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($inv) => [
                'id'        => $inv->id,
                'email'     => $inv->email,
                'estado'    => $inv->esPendiente() ? 'Pendiente' : 'Activada',
                'creada_en' => $inv->created_at->format('d M Y'),
                'usado_en'  => $inv->usado_en?->format('d M Y'),
            ])
            ->toArray();

        return Inertia::render('Admin/Invitaciones', [
            'invitaciones'   => $invitaciones,
            'invitacion_url' => session('invitacion_url'),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'email' => [
                'required',
                'email',
                function ($attribute, $value, $fail) {
                    if (User::where('email', $value)->exists()) {
                        $fail('Este correo ya tiene una cuenta registrada.');
                    }
                    if (Invitacion::where('email', $value)->whereNull('usado_en')->exists()) {
                        $fail('Ya existe una invitación pendiente para este correo.');
                    }
                },
            ],
        ]);

        $token = (string) Str::uuid();
        Invitacion::create(['email' => $request->email, 'token' => $token]);

        return redirect()->route('admin.invitaciones')
            ->with('invitacion_url', url("/activar/{$token}"));
    }

    public function destroy(Request $request, Invitacion $invitacion)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        if (!$invitacion->esPendiente()) {
            return redirect()->back()->with('error', 'No se puede revocar una invitación ya utilizada.');
        }

        $invitacion->delete();

        return redirect()->back()->with('success', 'Invitación revocada.');
    }

    public function show(string $token)
    {
        $invitacion = Invitacion::where('token', $token)->first();

        if (!$invitacion || !$invitacion->esPendiente()) {
            return Inertia::render('Auth/ActivarCuenta', [
                'email'         => null,
                'token'         => $token,
                'tokenInvalido' => true,
            ]);
        }

        return Inertia::render('Auth/ActivarCuenta', [
            'email'         => $invitacion->email,
            'token'         => $token,
            'tokenInvalido' => false,
        ]);
    }

    public function activar(Request $request, string $token)
    {
        $invitacion = Invitacion::where('token', $token)->whereNull('usado_en')->first();

        if (!$invitacion) {
            return redirect("/activar/{$token}")
                ->with('error', 'Este enlace ya fue utilizado o no es válido.');
        }

        $validated = $request->validate([
            'nombre'           => ['required', 'string', 'max:100'],
            'apellido_paterno' => ['required', 'string', 'max:100'],
            'apellido_materno' => ['required', 'string', 'max:100'],
            'matricula'        => ['required', 'string', 'max:20', 'unique:alumnos,matricula'],
            'carrera'          => ['required', 'in:ISC,IGE,IDS'],
            'semestre'         => ['required', 'integer', 'between:1,9'],
            'password'         => ['required', 'confirmed', 'min:8'],
        ]);

        DB::transaction(function () use ($validated, $invitacion) {
            $user = User::create([
                'name'     => "{$validated['nombre']} {$validated['apellido_paterno']}",
                'email'    => $invitacion->email,
                'password' => $validated['password'],
                'rol'      => 'alumno',
            ]);

            Alumno::create([
                'user_id'             => $user->id,
                'matricula'           => $validated['matricula'],
                'nombre'              => $validated['nombre'],
                'apellido_paterno'    => $validated['apellido_paterno'],
                'apellido_materno'    => $validated['apellido_materno'],
                'carrera'             => $validated['carrera'],
                'semestre'            => $validated['semestre'],
                'creditos_acumulados' => 0,
            ]);

            $invitacion->update(['usado_en' => now()]);

            Auth::login($user);
        });

        return redirect()->route('dashboard');
    }
}
