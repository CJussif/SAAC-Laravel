<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Traits\ResuelveActividad;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocenteExpedientesController extends Controller
{
    use ResuelveActividad;
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

        // Load inscripciones with asistencias directly (Alumno has no inscripciones() relationship)
        $inscripciones = Inscripcion::with('asistencias')
            ->whereIn('actividad_id', $actividadIds)
            ->get()
            ->groupBy('actividad_id');

        $expedientes = [];
        foreach ($actividades as $actividad) {
            $inscripcionesDeActividad = $inscripciones->get($actividad->id, collect());

            foreach ($actividad->alumnos as $alumno) {
                $inscripcion = $inscripcionesDeActividad->firstWhere('alumno_id', $alumno->id);
                if (!$inscripcion) continue;

                $asistencias = $inscripcion->asistencias;
                $total    = $asistencias->count();
                $cursadas = $asistencias->where('asistio', true)->count();

                $expedientes[] = [
                    'matricula'             => $alumno->matricula,
                    'nombre'                => "{$alumno->nombre} {$alumno->apellido_paterno} {$alumno->apellido_materno}",
                    'carrera'               => $alumno->carrera,
                    'semestre'              => $alumno->semestre,
                    'nombre_actividad'      => $actividad->nombre,
                    'tipo'                  => $this->resolverTipo($actividad->nombre),
                    'sesiones'              => ['total' => $total, 'cursadas' => $cursadas],
                    'porcentaje_asistencia' => $total > 0 ? (int) round($cursadas / $total * 100) : 0,
                    'estatus'               => $alumno->pivot->estatus,
                    'creditos'              => $actividad->creditos,
                ];
            }
        }

        return Inertia::render('Docente/Expedientes', [
            'expedientes' => $expedientes,
            'actividades' => $actividades->pluck('nombre')->values()->toArray(),
        ]);
    }
}
