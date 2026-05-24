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

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'adminStats' => $user && $user->rol === 'administrador' ? [
                    'totalAlumnos' => \App\Models\Alumno::count(),
                    'totalActividades' => \App\Models\Actividad::count(),
                    'totalInscripciones' => \App\Models\Inscripcion::count(),
                    'cuposTotales' => \App\Models\Actividad::sum('cupo_maximo'),
                    'cuposInscritos' => \App\Models\Inscripcion::whereIn('estatus', ['inscrito', 'en_curso'])->count(),
                ] : null,
            ],
        ];
    }
}
