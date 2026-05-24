<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScheduleParser
{
    public static function parse($scheduleStr)
    {
        $scheduleStr = strtolower($scheduleStr);
        $scheduleStr = str_replace(['á', 'é', 'í', 'ó', 'ú'], ['a', 'e', 'i', 'o', 'u'], $scheduleStr);
        
        $daysMap = [
            'lunes' => 1, 'lun' => 1,
            'martes' => 2, 'mar' => 2,
            'miercoles' => 3, 'mie' => 3,
            'jueves' => 4, 'jue' => 4,
            'viernes' => 5, 'vie' => 5,
            'sabado' => 6, 'sab' => 6,
            'domingo' => 7, 'dom' => 7
        ];
        
        $detectedDays = [];
        foreach ($daysMap as $word => $dayNum) {
            if (strpos($scheduleStr, $word) !== false) {
                $detectedDays[] = $dayNum;
            }
        }
        $detectedDays = array_unique($detectedDays);
        
        $timePattern = '/(\d{1,2}:\d{2})\s*(?:-|–|a)\s*(\d{1,2}:\d{2})/';
        $startMinutes = null;
        $endMinutes = null;
        
        if (preg_match($timePattern, $scheduleStr, $matches)) {
            $startMinutes = self::timeToMinutes($matches[1]);
            $endMinutes = self::timeToMinutes($matches[2]);
        }
        
        return [
            'days' => $detectedDays,
            'start' => $startMinutes,
            'end' => $endMinutes,
        ];
    }
    
    private static function timeToMinutes($timeStr)
    {
        $parts = explode(':', $timeStr);
        return ((int)$parts[0]) * 60 + (int)$parts[1];
    }
    
    public static function conflicts($schedule1, $schedule2)
    {
        $p1 = self::parse($schedule1);
        $p2 = self::parse($schedule2);
        
        if (empty($p1['days']) || empty($p2['days']) || $p1['start'] === null || $p2['start'] === null) {
            return false;
        }
        
        $commonDays = array_intersect($p1['days'], $p2['days']);
        if (empty($commonDays)) {
            return false;
        }
        
        $maxStart = max($p1['start'], $p2['start']);
        $minEnd = min($p1['end'], $p2['end']);
        
        return $maxStart < $minEnd;
    }
}

class InscripcionController extends Controller
{
    /**
     * Inscribir al estudiante a la actividad.
     */
    public function store(Request $request)
    {
        $request->validate([
            'actividad_id' => 'required|exists:actividades,id',
        ]);

        $user = $request->user();
        if ($user->rol !== 'alumno' || !$user->alumno) {
            return back()->with('error', 'Solo los estudiantes pueden inscribirse a las actividades.');
        }

        $alumno = $user->alumno;
        $actividad = Actividad::findOrFail($request->actividad_id);

        // Iniciar transacción de base de datos para asegurar atomicidad (RNF06)
        return DB::transaction(function () use ($alumno, $actividad) {
            // 1. Validar que no esté ya inscrito
            $yaInscrito = Inscripcion::where('alumno_id', $alumno->id)
                ->where('actividad_id', $actividad->id)
                ->exists();

            if ($yaInscrito) {
                return back()->withErrors(['actividad_id' => 'Ya estás inscrito en esta actividad.']);
            }

            // 2. Validar el cupo disponible (RF02)
            $inscritosActuales = Inscripcion::where('actividad_id', $actividad->id)
                ->whereIn('estatus', ['inscrito', 'en_curso', 'acreditado'])
                ->count();

            if ($inscritosActuales >= $actividad->cupo_maximo) {
                return back()->withErrors(['actividad_id' => 'Lo sentimos, el cupo para esta actividad está lleno.']);
            }

            // 3. Validar límite máximo de 2 actividades simultáneas
            $inscripcionesActivas = Inscripcion::where('alumno_id', $alumno->id)
                ->whereIn('estatus', ['inscrito', 'en_curso'])
                ->count();

            if ($inscripcionesActivas >= 2) {
                return back()->withErrors(['actividad_id' => 'Solo puedes estar inscrito en un máximo de 2 actividades simultáneamente.']);
            }

            // 4. Validar cruce de horarios (RF02)
            $actividadesInscritas = $alumno->actividades()
                ->wherePivotIn('estatus', ['inscrito', 'en_curso'])
                ->get();

            foreach ($actividadesInscritas as $inscrita) {
                if (ScheduleParser::conflicts($actividad->horario, $inscrita->horario)) {
                    return back()->withErrors([
                        'actividad_id' => "Conflicto de horario con la actividad: {$inscrita->nombre} ({$inscrita->horario})."
                    ]);
                }
            }

            // Registrar la inscripción
            Inscripcion::create([
                'alumno_id' => $alumno->id,
                'actividad_id' => $actividad->id,
                'horas_acumuladas' => 0,
                'estatus' => 'inscrito',
            ]);

            return back()->with('success', 'Te has inscrito exitosamente a la actividad.');
        });
    }
}
