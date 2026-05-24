<?php

namespace App\Http\Controllers;

use App\Models\Solicitud;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminEvidenciaController extends Controller
{
    /**
     * Display a listing of all uploaded evidence requests.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $solicitudes = Solicitud::with('alumno')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($solicitud) {
                $alumno = $solicitud->alumno;
                $initials = strtoupper(substr($alumno->nombre, 0, 1) . substr($alumno->apellido_paterno, 0, 1));
                return [
                    'id' => $solicitud->id,
                    'initials' => $initials,
                    'nombre' => "{$alumno->nombre} {$alumno->apellido_paterno} {$alumno->apellido_materno}",
                    'matricula' => $alumno->matricula,
                    'actividad' => $solicitud->nombre_actividad,
                    'tipo_actividad' => $solicitud->tipo_actividad,
                    'institucion' => $solicitud->institucion,
                    'fecha' => $solicitud->created_at ? $solicitud->created_at->format('d M Y') : '',
                    'fecha_inicio' => $solicitud->fecha_inicio ? $solicitud->fecha_inicio->format('Y-m-d') : null,
                    'fecha_fin' => $solicitud->fecha_fin ? $solicitud->fecha_fin->format('Y-m-d') : null,
                    'horas' => $solicitud->horas,
                    'descripcion' => $solicitud->descripcion,
                    'ruta_archivo' => $solicitud->ruta_archivo,
                    'estatus' => $solicitud->estatus,
                    'motivo_rechazo' => $solicitud->motivo_rechazo,
                    'creditos_otorgados' => $solicitud->creditos_otorgados,
                ];
            })
            ->toArray();

        return Inertia::render('Admin/Evidencias', [
            'solicitudes' => $solicitudes,
        ]);
    }

    /**
     * Validate (approve or reject) an evidence request.
     */
    public function validar(Request $request, Solicitud $solicitud)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'estatus' => 'required|string|in:aprobada,rechazada',
            'creditos' => 'nullable|integer|min:1',
            'motivo_rechazo' => 'required_if:estatus,rechazada|nullable|string|max:1000',
        ]);

        $estatus = $request->input('estatus');
        $creditos = (int) $request->input('creditos', 1);
        $motivo = $request->input('motivo_rechazo');

        DB::transaction(function () use ($solicitud, $estatus, $creditos, $motivo) {
            // Prevent modifying already approved/rejected requests (optional, but good practice)
            if ($solicitud->estatus !== 'pendiente') {
                return;
            }

            if ($estatus === 'aprobada') {
                $solicitud->update([
                    'estatus' => 'aprobada',
                    'creditos_otorgados' => $creditos,
                ]);

                // Add credits to student
                $alumno = $solicitud->alumno;
                $alumno->increment('creditos_acumulados', $creditos);
            } else {
                $solicitud->update([
                    'estatus' => 'rechazada',
                    'motivo_rechazo' => $motivo,
                    'creditos_otorgados' => 0,
                ]);
            }
        });

        $msg = $estatus === 'aprobada' 
            ? 'La evidencia ha sido aprobada e incorporada al historial del alumno.' 
            : 'La evidencia ha sido rechazada.';

        return redirect()->back()->with('success', $msg);
    }
}
