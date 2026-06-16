<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Traits\ResuelveActividad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminConstanciasController extends Controller
{
    use ResuelveActividad;
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $query = Inscripcion::with(['alumno', 'actividad'])
            ->whereNotNull('ruta_constancia');

        if ($search = $request->input('search')) {
            $query->whereHas('alumno', fn ($q) => $q
                ->where('nombre', 'like', "%{$search}%")
                ->orWhere('apellido_paterno', 'like', "%{$search}%")
                ->orWhere('matricula', 'like', "%{$search}%")
            );
        }

        if ($tipo = $request->input('tipo')) {
            $query->whereHas('actividad', fn ($q) => $q->where('nombre', 'like', "%{$tipo}%"));
        }

        $inscripciones = $query->orderBy('updated_at', 'desc')->get();

        $constancias = $inscripciones->map(fn ($ins) => [
            'folio'           => 'CON-' . $ins->updated_at->year . '-' . str_pad($ins->id, 4, '0', STR_PAD_LEFT),
            'nombre'          => "{$ins->alumno->nombre} {$ins->alumno->apellido_paterno} {$ins->alumno->apellido_materno}",
            'matricula'       => $ins->alumno->matricula,
            'carrera'         => $ins->alumno->carrera,
            'actividad'       => $ins->actividad->nombre,
            'tipo'            => $this->resolverTipo($ins->actividad->nombre),
            'creditos'        => $ins->actividad->creditos,
            'fecha'           => $ins->updated_at->format('Y-m-d'),
            'estatus'         => 'emitida',
            'ruta_constancia' => $ins->ruta_constancia,
        ])->values()->toArray();

        $kpis = [
            'total'             => $inscripciones->count(),
            'alumnos_cubiertos' => $inscripciones->pluck('alumno_id')->unique()->count(),
        ];

        return Inertia::render('Admin/Constancias', [
            'constancias' => $constancias,
            'kpis'        => $kpis,
            'filters'     => $request->only(['search', 'tipo']),
        ]);
    }

    public function exportarCsv(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $query = Inscripcion::with(['alumno', 'actividad'])
            ->whereNotNull('ruta_constancia');

        if ($search = $request->input('search')) {
            $query->whereHas('alumno', fn ($q) => $q
                ->where('nombre', 'like', "%{$search}%")
                ->orWhere('apellido_paterno', 'like', "%{$search}%")
                ->orWhere('matricula', 'like', "%{$search}%")
            );
        }

        if ($tipo = $request->input('tipo')) {
            $query->whereHas('actividad', fn ($q) => $q->where('nombre', 'like', "%{$tipo}%"));
        }

        $rows = $query->orderBy('updated_at', 'desc')->get();

        $csv  = "Folio,Alumno,Matrícula,Carrera,Actividad,Tipo,Créditos,Fecha,Estatus\n";
        foreach ($rows as $ins) {
            $folio  = 'CON-' . $ins->updated_at->year . '-' . str_pad($ins->id, 4, '0', STR_PAD_LEFT);
            $nombre = "{$ins->alumno->nombre} {$ins->alumno->apellido_paterno} {$ins->alumno->apellido_materno}";
            $tipo   = $this->resolverTipo($ins->actividad->nombre);
            $csv   .= implode(',', [
                $folio,
                '"' . str_replace('"', '""', $nombre) . '"',
                $ins->alumno->matricula,
                '"' . str_replace('"', '""', $ins->alumno->carrera) . '"',
                '"' . str_replace('"', '""', $ins->actividad->nombre) . '"',
                $tipo,
                $ins->actividad->creditos,
                $ins->updated_at->format('Y-m-d'),
                'emitida',
            ]) . "\n";
        }

        $filename = 'constancias-' . now()->format('Y-m-d') . '.csv';

        return response($csv, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
