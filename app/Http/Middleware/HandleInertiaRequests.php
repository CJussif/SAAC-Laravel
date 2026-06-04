<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            if ($user->rol === 'alumno') {
                $user->load(['alumno.actividades' => function ($query) {
                    $query->withPivot('horas_acumuladas', 'estatus', 'ruta_constancia');
                }]);
            } elseif ($user->rol === 'docente') {
                $user->load('docente.actividades.alumnos');
            }
        }

        // ── Dummy notifications (reemplazar con consulta real cuando esté listo) ──
        $dummyNotifications = $user ? [
            [
                'id'         => 'dummy-1',
                'type'       => 'App\\Notifications\\BienvenidaNotification',
                'data'       => [
                    'message' => 'Bienvenido al SAAC. ¡Consulta el catálogo de actividades disponibles!',
                    'icon'    => 'info',
                ],
                'read_at'    => null,
                'created_at' => now()->subHours(2)->toISOString(),
            ],
            [
                'id'         => 'dummy-2',
                'type'       => 'App\\Notifications\\EvidenciaRevisadaNotification',
                'data'       => [
                    'message' => 'Tu evidencia externa está en revisión por el administrador.',
                    'icon'    => 'warning',
                ],
                'read_at'    => null,
                'created_at' => now()->subDay()->toISOString(),
            ],
        ] : [];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'notifications' => $dummyNotifications,
                'adminStats' => $user && $user->rol === 'administrador' ? [
                    'totalAlumnos' => \App\Models\Alumno::count(),
                    'totalActividades' => \App\Models\Actividad::count(),
                    'totalInscripciones' => \App\Models\Inscripcion::count(),
                    'cuposTotales' => \App\Models\Actividad::sum('cupo_maximo'),
                    'cuposInscritos' => \App\Models\Inscripcion::whereIn('estatus', ['inscrito', 'en_curso'])->count(),
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'status' => $request->session()->get('status'),
            ],
            'current_semester' => 'Semestre 2026-1',
        ];
    }
}
