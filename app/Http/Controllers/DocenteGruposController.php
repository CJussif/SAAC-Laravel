<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocenteGruposController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'docente' || !$user->docente) {
            return redirect()->route('dashboard');
        }

        $actividades = Actividad::with(['alumnos'])
            ->where('docente_id', $user->docente->id)
            ->get();

        $actividadIds = $actividades->pluck('id');

        // Load inscripciones with asistencias for all actividades at once
        $inscripciones = Inscripcion::with('asistencias')
            ->whereIn('actividad_id', $actividadIds)
            ->get()
            ->groupBy('actividad_id');

        $grupos = $actividades->map(fn ($act) => [
            'id'          => $act->id,
            'nombre'      => $act->nombre,
            'tipo'        => $this->resolverTipo($act->nombre),
            'horario'     => $act->horario,
            'creditos'    => $act->creditos,
            'cupo_maximo' => $act->cupo_maximo,
            'inscritos'   => $act->alumnos->filter(
                fn ($al) => in_array($al->pivot->estatus, ['inscrito', 'en_curso', 'acreditado'])
            )->count(),
            'activo'      => $act->alumnos->contains(
                fn ($al) => $al->pivot->estatus === 'en_curso'
            ),
        ])->values()->toArray();

        $alumnosPorGrupo = [];
        foreach ($actividades as $actividad) {
            $inscripcionesDeActividad = $inscripciones->get($actividad->id, collect());

            $alumnosPorGrupo[$actividad->id] = $actividad->alumnos
                ->filter(fn ($al) => in_array($al->pivot->estatus, ['inscrito', 'en_curso', 'acreditado']))
                ->map(function ($alumno) use ($inscripcionesDeActividad) {
                    $inscripcion = $inscripcionesDeActividad->firstWhere('alumno_id', $alumno->id);
                    $asistencias = $inscripcion?->asistencias ?? collect();
                    $total       = $asistencias->count();
                    $asistidas   = $asistencias->where('asistio', true)->count();

                    return [
                        'matricula'             => $alumno->matricula,
                        'nombre'                => "{$alumno->nombre} {$alumno->apellido_paterno} {$alumno->apellido_materno}",
                        'carrera'               => $alumno->carrera,
                        'semestre'              => $alumno->semestre,
                        'porcentaje_asistencia' => $total > 0 ? (int) round($asistidas / $total * 100) : 0,
                        'estatus'               => $alumno->pivot->estatus,
                    ];
                })->values()->toArray();
        }

        return Inertia::render('Docente/Grupos', [
            'grupos'          => $grupos,
            'alumnosPorGrupo' => $alumnosPorGrupo,
        ]);
    }

    private function resolverTipo(string $nombre): string
    {
        $lower = mb_strtolower($nombre, 'UTF-8');
        return (str_contains($lower, 'yoga') || str_contains($lower, 'basquet') || str_contains($lower, 'deport'))
            ? 'deportiva'
            : 'cultural';
    }
}
