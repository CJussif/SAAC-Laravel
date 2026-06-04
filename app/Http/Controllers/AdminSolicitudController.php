<?php

namespace App\Http\Controllers;

use App\Models\Solicitud;
use App\Notifications\EvidenciaEvaluada;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminSolicitudController extends Controller
{
    /**
     * Verificación de rol administrador.
     */
    private function requireAdmin(Request $request): void
    {
        $user = $request->user();
        if (! $user || $user->rol !== 'administrador') {
            abort(403, 'Acceso restringido a administradores.');
        }
    }

    /**
     * GET /admin/solicitudes
     * Lista paginada de solicitudes con datos del alumno (Eager Loading).
     */
    public function index(Request $request)
    {
        $this->requireAdmin($request);

        $solicitudes = Solicitud::with('alumno')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->through(function ($solicitud) {
                $alumno   = $solicitud->alumno;
                $initials = strtoupper(
                    substr($alumno->nombre ?? '', 0, 1) .
                    substr($alumno->apellido_paterno ?? '', 0, 1)
                );

                return [
                    'id'                 => $solicitud->id,
                    'initials'           => $initials,
                    'nombre'             => trim("{$alumno->nombre} {$alumno->apellido_paterno} {$alumno->apellido_materno}"),
                    'matricula'          => $alumno->matricula,
                    'actividad'          => $solicitud->nombre_actividad,
                    'tipo_actividad'     => $solicitud->tipo_actividad,
                    'institucion'        => $solicitud->institucion,
                    'fecha'              => $solicitud->created_at?->format('d M Y') ?? '',
                    'fecha_inicio'       => $solicitud->fecha_inicio?->format('Y-m-d'),
                    'fecha_fin'          => $solicitud->fecha_fin?->format('Y-m-d'),
                    'horas'              => $solicitud->horas,
                    'descripcion'        => $solicitud->descripcion,
                    'ruta_archivo'       => $solicitud->ruta_archivo,
                    'estatus'            => $solicitud->estatus,
                    'motivo_rechazo'     => $solicitud->motivo_rechazo,
                    'creditos_otorgados' => $solicitud->creditos_otorgados,
                ];
            });

        return Inertia::render('Admin/Evidencias', [
            'solicitudes' => $solicitudes,
        ]);
    }

    /**
     * PUT /admin/solicitudes/{id}
     * Aprueba o rechaza una solicitud y notifica al alumno via base de datos.
     */
    public function update(Request $request, $id)
    {
        $this->requireAdmin($request);

        $request->validate([
            'estatus'        => 'required|string|in:Aprobada,Rechazada',
            'creditos'       => 'nullable|integer|min:1|max:10',
            'motivo_rechazo' => 'required_if:estatus,Rechazada|nullable|string|max:1000',
        ]);

        $solicitud = Solicitud::with('alumno.usuario')->findOrFail($id);

        if ($solicitud->estatus !== 'pendiente') {
            return back()->with('error', 'Esta solicitud ya fue evaluada anteriormente.');
        }

        DB::transaction(function () use ($solicitud, $request) {
            $estatus = strtolower($request->input('estatus')); // 'aprobada' | 'rechazada'

            if ($estatus === 'aprobada') {
                $creditos = (int) $request->input('creditos', 1);
                $solicitud->update([
                    'estatus'            => 'aprobada',
                    'creditos_otorgados' => $creditos,
                    'motivo_rechazo'     => null,
                ]);
                $solicitud->alumno->increment('creditos_acumulados', $creditos);
            } else {
                $solicitud->update([
                    'estatus'            => 'rechazada',
                    'motivo_rechazo'     => $request->input('motivo_rechazo'),
                    'creditos_otorgados' => 0,
                ]);
            }
        });

        // Recargar modelo con datos actualizados
        $solicitud->refresh();

        // Notificar al User asociado al alumno (guardado en la tabla notifications)
        $alumnoUser = optional($solicitud->alumno)->usuario;
        if ($alumnoUser) {
            $alumnoUser->notify(new EvidenciaEvaluada($solicitud));
        }

        $msg = $solicitud->estatus === 'aprobada'
            ? 'Evidencia aprobada. El alumno ha sido notificado.'
            : 'Evidencia rechazada. El alumno ha sido notificado.';

        return back()->with('success', $msg);
    }
}
