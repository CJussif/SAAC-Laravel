<?php

namespace App\Http\Controllers;

use App\Models\Solicitud;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AlumnoEvidenciaController extends Controller
{
    /**
     * Show the upload form and history of requests.
     */
    public function create(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'alumno' || !$user->alumno) {
            return redirect()->route('dashboard');
        }

        $alumno = $user->alumno;

        $solicitudes = Solicitud::where('alumno_id', $alumno->id)
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($solicitud) {
                return [
                    'id' => $solicitud->id,
                    'nombre_actividad' => $solicitud->nombre_actividad,
                    'tipo_actividad' => $solicitud->tipo_actividad,
                    'institucion' => $solicitud->institucion,
                    'fecha_inicio' => $solicitud->fecha_inicio ? $solicitud->fecha_inicio->format('Y-m-d') : null,
                    'fecha_fin' => $solicitud->fecha_fin ? $solicitud->fecha_fin->format('Y-m-d') : null,
                    'horas' => $solicitud->horas,
                    'descripcion' => $solicitud->descripcion,
                    'ruta_archivo' => $solicitud->ruta_archivo,
                    'estatus' => $solicitud->estatus,
                    'motivo_rechazo' => $solicitud->motivo_rechazo,
                    'created_at' => $solicitud->created_at ? $solicitud->created_at->format('Y-m-d H:i:s') : null,
                ];
            })
            ->toArray();

        return Inertia::render('Alumno/CargaEvidencias', [
            'solicitudes' => $solicitudes,
        ]);
    }

    /**
     * Store a newly created request in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'alumno' || !$user->alumno) {
            return redirect()->route('dashboard');
        }

        $alumno = $user->alumno;

        $request->validate([
            'tipo_actividad' => 'required|string|in:deportiva,cultural,academica',
            'nombre_actividad' => 'required|string|max:255',
            'institucion' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'horas' => 'nullable|integer|min:1',
            'descripcion' => 'nullable|string',
            'archivo' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($request->hasFile('archivo')) {
            $path = $request->file('archivo')->store('evidencias', 'public');

            Solicitud::create([
                'alumno_id' => $alumno->id,
                'nombre_actividad' => $request->input('nombre_actividad'),
                'tipo_actividad' => $request->input('tipo_actividad'),
                'institucion' => $request->input('institucion'),
                'fecha_inicio' => $request->input('fecha_inicio'),
                'fecha_fin' => $request->input('fecha_fin'),
                'horas' => $request->input('horas'),
                'descripcion' => $request->input('descripcion'),
                'ruta_archivo' => $path,
                'estatus' => 'pendiente',
            ]);

            return redirect()->back()->with('success', 'Tu solicitud ha sido enviada y está en revisión.');
        }

        return redirect()->back()->withErrors(['archivo' => 'No se pudo cargar el archivo comprobante.']);
    }
}
