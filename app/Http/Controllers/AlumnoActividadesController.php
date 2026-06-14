<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AlumnoActividadesController extends Controller
{
    /**
     * Display the student's active complementary activities catalog.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'alumno' || !$user->alumno) {
            return redirect()->route('dashboard');
        }

        $alumno = $user->alumno;

        // Fetch all activities eager-loading 'docente' and 'alumnos'
        $actividadesCollection = Actividad::with(['docente', 'alumnos'])->get();

        // Format each activity with dynamic attributes
        $actividades = $actividadesCollection->map(function ($actividad) use ($alumno) {
            $tipo = $this->getTipoByNombre($actividad->nombre);
            $clave = $this->getClave($tipo, $actividad->id);
            $color = $this->getColorByTipo($tipo);

            // Calculate active enrollments count 'inscritos':
            // count of enrolled students whose pivot 'estatus' is in ['inscrito', 'en_curso', 'acreditado']
            $inscritos = $actividad->alumnos->filter(function ($al) {
                return in_array($al->pivot->estatus, ['inscrito', 'en_curso', 'acreditado']);
            })->count();

            // Determine 'ya_inscrito' boolean:
            // if the current student is already enrolled in this activity in status 'inscrito' or 'en_curso'
            $ya_inscrito = $actividad->alumnos->contains(function ($al) use ($alumno) {
                return $al->id === $alumno->id && in_array($al->pivot->estatus, ['inscrito', 'en_curso']);
            });

            // Format 'instructor' as "Inst. [Name] [LastName]" or "Sin docente asignado"
            $instructor = $actividad->docente
                ? "Inst. " . $actividad->docente->nombre . " " . $actividad->docente->apellido_paterno
                : "Sin docente asignado";

            // Also calculate status based on limit
            $estatus = $inscritos >= $actividad->cupo_maximo ? 'agotado' : 'disponible';

            return [
                'id' => $actividad->id,
                'nombre' => $actividad->nombre,
                'descripcion' => $actividad->descripcion,
                'creditos' => $actividad->creditos,
                'cupo_maximo' => $actividad->cupo_maximo,
                'cupo' => $actividad->cupo_maximo,
                'horario' => $actividad->horario,
                'tipo_periodo' => $actividad->tipo_periodo,
                'tipo' => $tipo,
                'clave' => $clave,
                'color' => $color,
                'inscritos' => $inscritos,
                'ya_inscrito' => $ya_inscrito,
                'instructor' => $instructor,
                'estatus' => $estatus,
                'created_at' => $actividad->created_at,
                'updated_at' => $actividad->updated_at,
            ];
        })->toArray();

        // Fetch current student's active enrollments ('inscripcionesActivas') to show in sidebar
        $inscripcionesActivas = Inscripcion::with('actividad')
            ->where('alumno_id', $alumno->id)
            ->whereIn('estatus', ['inscrito', 'en_curso'])
            ->get()
            ->toArray();

        return Inertia::render('Alumno/Actividades', [
            'actividades' => $actividades,
            'inscripcionesActivas' => $inscripcionesActivas,
            'alumno' => [
                'creditos_acumulados' => $alumno->creditos_acumulados,
                'nombre' => $alumno->nombre . ' ' . $alumno->apellido_paterno,
            ],
        ]);
    }

    /**
     * Determine category 'tipo' using name matching.
     */
    private function getTipoByNombre(string $nombre): string
    {
        $nombreLower = mb_strtolower($nombre, 'UTF-8');

        // Keywords for deportiva
        $deportivas = ['deport', 'fut', 'basquet', 'volei', 'atlet', 'fisic', 'físic', 'yoga', 'meditac', 'ajedrez'];
        foreach ($deportivas as $kw) {
            if (mb_strpos($nombreLower, $kw) !== false) {
                return 'deportiva';
            }
        }

        // Keywords for cultural
        $culturales = ['danza', 'bail', 'teatro', 'music', 'músic', 'cant', 'guitar', 'radio', 'locuc', 'dibuj', 'pintur', 'cine', 'fotograf', 'art', 'cultur'];
        foreach ($culturales as $kw) {
            if (mb_strpos($nombreLower, $kw) !== false) {
                return 'cultural';
            }
        }

        // Default to academica
        return 'academica';
    }

    /**
     * Build dynamic code 'clave': prefix followed by zero-padded ID.
     */
    private function getClave(string $tipo, int $id): string
    {
        $prefix = 'ACA-';
        if ($tipo === 'deportiva') {
            $prefix = 'DEP-';
        } elseif ($tipo === 'cultural') {
            $prefix = 'CUL-';
        }
        return $prefix . sprintf('%02d', $id);
    }

    /**
     * Assign gradient 'color' based on category.
     */
    private function getColorByTipo(string $tipo): string
    {
        switch ($tipo) {
            case 'deportiva':
                return 'from-blue-500 to-blue-700';
            case 'cultural':
                return 'from-amber-500 to-amber-700';
            case 'academica':
            default:
                return 'from-teal-500 to-teal-700';
        }
    }

    /**
     * Display the student's enrollment history.
     */
    public function historial(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'alumno' || !$user->alumno) {
            return redirect()->route('dashboard');
        }

        $alumno = $user->alumno;

        // Fetch all registrations belonging to the student
        $inscripciones = Inscripcion::with(['actividad.docente', 'asistencias'])
            ->where('alumno_id', $alumno->id)
            ->get();

        $historial = $inscripciones->map(function ($inscripcion) {
            $actividad = $inscripcion->actividad;
            $tipo = $this->getTipoByNombre($actividad->nombre);
            $clave = $this->getClave($tipo, $actividad->id);

            // Semestre formatting e.g. "2026 / Primavera" or "2026 / Intersemestral"
            $year = Carbon::parse($inscripcion->created_at)->format('Y');
            $periodoStr = $actividad->tipo_periodo === 'semestral' ? 'Semestral' : 'Intersemestral';
            $semestre = "{$year} / {$periodoStr}";

            // Calculate attendance percentage
            $totalClases = $inscripcion->asistencias->count();
            if ($totalClases > 0) {
                $asistioCount = $inscripcion->asistencias->where('asistio', true)->count();
                $asistencia = (int) round(($asistioCount / $totalClases) * 100);
            } else {
                $asistencia = 0;
            }

            // Instructor name
            $instructor = $actividad->docente
                ? $actividad->docente->nombre . " " . $actividad->docente->apellido_paterno
                : "Sin docente asignado";

            // Folio (optional, e.g. CON-2026-0001)
            $folio = null;
            if ($inscripcion->estatus === 'acreditado') {
                $folio = "CON-" . Carbon::parse($inscripcion->updated_at)->format('Y') . "-" . sprintf('%04d', $inscripcion->id);
            }

            return [
                'id' => $inscripcion->id,
                'clave' => $clave,
                'tipo' => $tipo,
                'nombre' => $actividad->nombre,
                'instructor' => $instructor,
                'semestre' => $semestre,
                'creditos' => $actividad->creditos,
                'asistencia' => $asistencia,
                'estatus' => $inscripcion->estatus,
                'folio' => $folio,
            ];
        })->toArray();

        return Inertia::render('Alumno/Historial', [
            'historial' => $historial,
            'alumno' => [
                'creditos_acumulados' => $alumno->creditos_acumulados,
                'nombre' => $alumno->nombre . ' ' . $alumno->apellido_paterno,
            ]
        ]);
    }

    /**
     * Display the student's accredited complementary activity certificates.
     */
    public function constancias(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'alumno' || !$user->alumno) {
            return redirect()->route('dashboard');
        }

        $alumno = $user->alumno;

        // Fetch accredited enrollments
        $inscripciones = Inscripcion::with(['actividad'])
            ->where('alumno_id', $alumno->id)
            ->where('estatus', 'acreditado')
            ->get();

        $constancias = $inscripciones->map(function ($inscripcion) {
            $actividad = $inscripcion->actividad;
            $tipo = $this->getTipoByNombre($actividad->nombre);

            $folio = "CON-" . Carbon::parse($inscripcion->updated_at)->format('Y') . "-" . sprintf('%04d', $inscripcion->id);
            $completado = Carbon::parse($inscripcion->updated_at)->translatedFormat('d M Y');

            return [
                'id'              => $inscripcion->id,
                'folio'           => $folio,
                'nombre'          => $actividad->nombre,
                'completado'      => $completado,
                'creditos'        => $actividad->creditos,
                'tipo'            => $tipo,
                'ruta_constancia' => $inscripcion->ruta_constancia,
            ];
        })->toArray();

        return Inertia::render('Alumno/Constancias', [
            'constancias' => $constancias,
        ]);
    }
}
