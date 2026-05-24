<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Inscripcion;
use App\Models\Asistencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AsistenciaController extends Controller
{
    /**
     * Display a listing of the attendance.
     */
    public function index(Request $request)
    {
        // Restrict access to authenticated users with rol === 'docente' and associated Docente profile, redirecting others to 'dashboard'.
        $user = $request->user();
        if (!$user || $user->rol !== 'docente' || !$user->docente) {
            return redirect()->route('dashboard');
        }

        $docente = $user->docente;

        // Fetch activities taught by this teacher (using 'docente_id')
        $actividadesCollection = Actividad::with(['alumnos'])->where('docente_id', $docente->id)->get();

        // Format each activity
        $grupos = $actividadesCollection->map(function ($actividad) {
            // calculate 'inscritos' (count of enrolled students with estatus in ['inscrito', 'en_curso', 'acreditado'])
            $inscritos = $actividad->alumnos->filter(function ($al) {
                return in_array($al->pivot->estatus, ['inscrito', 'en_curso', 'acreditado']);
            })->count();

            // Set a dynamic 'tipo' category: if activity name contains 'yoga' or 'basquet', set it to 'DEPORTIVA', otherwise 'CULTURAL'
            $nombreLower = mb_strtolower($actividad->nombre, 'UTF-8');
            $tipo = (str_contains($nombreLower, 'yoga') || str_contains($nombreLower, 'basquet')) ? 'DEPORTIVA' : 'CULTURAL';

            return [
                'id' => $actividad->id,
                'nombre' => $actividad->nombre,
                'tipo' => $tipo,
                'inscritos' => $inscritos,
                'horario' => $actividad->horario,
                'creditos' => $actividad->creditos,
            ];
        })->toArray();

        // If teacher has no groups, return Inertia::render('Docente/Asistencia', ['grupos' => [], 'alumnos' => [], 'selectedGrupoId' => null])
        if (empty($grupos)) {
            return Inertia::render('Docente/Asistencia', [
                'grupos' => [],
                'alumnos' => [],
                'selectedGrupoId' => null,
            ]);
        }

        // Get 'grupo_id' from request, defaulting to the first group id.
        $selectedGrupoId = $request->input('grupo_id') ? (int) $request->input('grupo_id') : $grupos[0]['id'];

        // Make sure the selectedGrupoId belongs to the teacher, otherwise fallback to the first group id.
        $grupoExists = collect($grupos)->contains('id', $selectedGrupoId);
        if (!$grupoExists) {
            $selectedGrupoId = $grupos[0]['id'];
        }

        // Calculate dates of the selected week:
        // Default start date: Monday Feb 2, 2026.
        // Calculate current week count of the year/semester dynamically: max(1, min(16, Carbon::parse('2026-02-02')->diffInWeeks(Carbon::now()) + 1)).
        $currentWeek = max(1, min(16, (int) Carbon::parse('2026-02-02')->diffInWeeks(Carbon::now()) + 1));
        
        // Let request specify 'semana', default to this current week.
        $semana = $request->input('semana') ? (int) $request->input('semana') : $currentWeek;

        // Generate Monday date for this week and compile an array of 5 'weekDates' (Y-m-d) representing Monday to Friday of that week.
        $startSemester = Carbon::parse('2026-02-02');
        $monday = $startSemester->copy()->addWeeks($semana - 1);
        $weekDates = [];
        for ($i = 0; $i < 5; $i++) {
            $weekDates[] = $monday->copy()->addDays($i)->format('Y-m-d');
        }

        // Format 'weekRange' as e.g. "Semana 12 (18 Ene – 22 Ene)" using Spanish localized month translations.
        $mondayMonth = $this->getSpanishShortMonth($monday->month);
        $friday = $monday->copy()->addDays(4);
        $fridayMonth = $this->getSpanishShortMonth($friday->month);
        $weekRange = "Semana {$semana} ({$monday->day} {$mondayMonth} – {$friday->day} {$fridayMonth})";

        // Fetch students registered in this group (inscripciones) where estatus is in ['inscrito', 'en_curso'].
        $inscripciones = Inscripcion::with(['alumno', 'asistencias'])
            ->where('actividad_id', $selectedGrupoId)
            ->whereIn('estatus', ['inscrito', 'en_curso'])
            ->get();

        // Format the students list.
        $alumnos = $inscripciones->map(function ($inscripcion) use ($weekDates) {
            $alumno = $inscripcion->alumno;
            $nombre = "{$alumno->apellido_paterno} {$alumno->apellido_materno}, {$alumno->nombre}";

            // 'asistencia': array of 5 boolean/null values representing attendance for each date in 'weekDates'.
            $asistenciasMap = [];
            foreach ($inscripcion->asistencias as $asistencia) {
                $fechaStr = null;
                if ($asistencia->fecha instanceof \Carbon\Carbon) {
                    $fechaStr = $asistencia->fecha->format('Y-m-d');
                } elseif (is_string($asistencia->fecha)) {
                    $fechaStr = Carbon::parse($asistencia->fecha)->format('Y-m-d');
                } elseif ($asistencia->fecha) {
                    $fechaStr = Carbon::instance($asistencia->fecha)->format('Y-m-d');
                }
                
                if ($fechaStr) {
                    $asistenciasMap[$fechaStr] = (bool) $asistencia->asistio;
                }
            }

            $asistenciaArray = [];
            foreach ($weekDates as $date) {
                $asistenciaArray[] = $asistenciasMap[$date] ?? null;
            }

            // 'pct': computed overall attendance percentage (round(asistioCount / totalClases * 100)) of ALL asistencias registered in the DB for this inscription (if no classes registered, default to 0).
            $totalClases = $inscripcion->asistencias->count();
            if ($totalClases > 0) {
                $asistioCount = $inscripcion->asistencias->where('asistio', true)->count();
                $pct = (int) round(($asistioCount / $totalClases) * 100);
            } else {
                $pct = 0;
            }

            return [
                'inscripcion_id' => $inscripcion->id,
                'matricula' => $alumno->matricula,
                'nombre' => $nombre,
                'asistencia' => $asistenciaArray,
                'pct' => $pct,
                'estatus' => $inscripcion->estatus,
            ];
        })->sortBy('nombre', SORT_NATURAL | SORT_FLAG_CASE)->values()->toArray();

        $actividadSeleccionada = $actividadesCollection->firstWhere('id', $selectedGrupoId);
        $diasClase = $actividadSeleccionada ? $this->parseDaysFromHorario($actividadSeleccionada->horario) : [0, 1, 2, 3, 4];

        // Render Inertia view 'Docente/Asistencia'
        return Inertia::render('Docente/Asistencia', [
            'grupos' => $grupos,
            'alumnos' => $alumnos,
            'selectedGrupoId' => $selectedGrupoId,
            'semana' => $semana,
            'weekRange' => $weekRange,
            'weekDates' => $weekDates,
            'diasClase' => $diasClase,
        ]);
    }

    /**
     * Save bulk attendance.
     */
    public function store(Request $request)
    {
        // Restrict access
        $user = $request->user();
        if (!$user || $user->rol !== 'docente' || !$user->docente) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'asistencias' => 'required|array',
            'asistencias.*.inscripcion_id' => 'required|exists:inscripciones,id',
            'asistencias.*.fecha' => 'required|date_format:Y-m-d',
            'asistencias.*.asistio' => 'required|boolean',
        ]);

        $docente = $user->docente;
        
        // Fetch active activities of the teacher to validate ownership
        $actividadesIds = Actividad::where('docente_id', $docente->id)->pluck('id')->toArray();

        DB::transaction(function () use ($request, $actividadesIds) {
            foreach ($request->input('asistencias') as $entry) {
                // Ensure the inscription belongs to this teacher's activities
                $inscripcion = Inscripcion::findOrFail($entry['inscripcion_id']);
                if (in_array($inscripcion->actividad_id, $actividadesIds)) {
                    Asistencia::updateOrCreate(
                        [
                            'inscripcion_id' => $entry['inscripcion_id'],
                            'fecha' => $entry['fecha'],
                        ],
                        [
                            'asistio' => $entry['asistio'],
                        ]
                    );
                }
            }
        });

        return back()->with('success', 'Asistencias guardadas correctamente.');
    }

    /**
     * Finalize student grades (Acreditación).
     */
    public function acreditar(Request $request)
    {
        // Restrict access
        $user = $request->user();
        if (!$user || $user->rol !== 'docente' || !$user->docente) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'grupo_id' => 'required|exists:actividades,id',
        ]);

        $docente = $user->docente;
        $grupoId = $request->input('grupo_id');

        // Verify that the activity belongs to the logged-in teacher
        $actividad = Actividad::where('id', $grupoId)->where('docente_id', $docente->id)->firstOrFail();

        DB::transaction(function () use ($grupoId, $actividad) {
            // Fetch all active inscriptions for the group (status 'inscrito' or 'en_curso')
            $inscriptions = Inscripcion::where('actividad_id', $grupoId)
                ->whereIn('estatus', ['inscrito', 'en_curso'])
                ->get();

            foreach ($inscriptions as $inscripcion) {
                // Calculate total overall attendance percentage
                $totalClases = $inscripcion->asistencias()->count();
                if ($totalClases > 0) {
                    $asistioCount = $inscripcion->asistencias()->where('asistio', true)->count();
                    $pct = (int) round(($asistioCount / $totalClases) * 100);
                } else {
                    $pct = 0;
                }

                // If pct >= 60, update inscription estatus to 'acreditado' and increment student's creditos_acumulados by activity's credits
                if ($pct >= 60) {
                    $inscripcion->update(['estatus' => 'acreditado']);
                    $alumno = $inscripcion->alumno;
                    $alumno->increment('creditos_acumulados', $actividad->creditos);
                } else {
                    // Otherwise, update inscription estatus to 'reprobado'
                    $inscripcion->update(['estatus' => 'reprobado']);
                }
            }
        });

        return back()->with('success', 'Acreditación finalizada exitosamente.');
    }

    /**
     * Get Spanish short abbreviation of the month.
     */
    private function getSpanishShortMonth(int $monthNum): string
    {
        $months = [
            1 => 'Ene',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Abr',
            5 => 'May',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Ago',
            9 => 'Sep',
            10 => 'Oct',
            11 => 'Nov',
            12 => 'Dic',
        ];
        return $months[$monthNum] ?? '';
    }

    /**
     * Parse class days from schedule string.
     */
    private function parseDaysFromHorario(string $horario): array
    {
        $horarioLower = mb_strtolower($horario, 'UTF-8');
        $horarioLower = str_replace(['á', 'é', 'í', 'ó', 'ú'], ['a', 'e', 'i', 'o', 'u'], $horarioLower);

        $daysMap = [
            'lun' => 0,
            'mar' => 1,
            'mie' => 2,
            'jue' => 3,
            'vie' => 4,
        ];

        $diasClase = [];
        foreach ($daysMap as $key => $index) {
            if (str_contains($horarioLower, $key)) {
                $diasClase[] = $index;
            }
        }

        if (empty($diasClase)) {
            return [0, 1, 2, 3, 4];
        }

        sort($diasClase);
        return $diasClase;
    }
}
