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
     *
     * Validaciones estrictas:
     * - Todos los campos de texto son requeridos.
     * - fecha_fin debe ser estrictamente posterior a fecha_inicio.
     * - archivo: solo pdf, jpg, jpeg, png y máximo 5 MB (5120 KB).
     * - El archivo se guarda en el disco 'local' (storage privado).
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'alumno' || !$user->alumno) {
            return redirect()->route('dashboard');
        }

        $alumno = $user->alumno;

        $validated = $request->validate([
            'tipo_actividad'   => 'required|string|in:deportiva,cultural,academica',
            'nombre_actividad' => 'required|string|max:255',
            'institucion'      => 'required|string|max:255',
            'fecha_inicio'     => 'required|date',
            'fecha_fin'        => 'required|date|after:fecha_inicio',
            'horas'            => 'required|integer|min:1|max:999',
            'descripcion'      => 'nullable|string|max:1000',
            'archivo'          => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ], [
            'tipo_actividad.required'   => 'Debes seleccionar el tipo de actividad.',
            'tipo_actividad.in'         => 'El tipo de actividad no es válido.',
            'nombre_actividad.required' => 'El nombre de la actividad es obligatorio.',
            'nombre_actividad.max'      => 'El nombre no puede superar los 255 caracteres.',
            'institucion.required'      => 'La institución organizadora es obligatoria.',
            'institucion.max'           => 'La institución no puede superar los 255 caracteres.',
            'fecha_inicio.required'     => 'La fecha de inicio es obligatoria.',
            'fecha_inicio.date'         => 'La fecha de inicio no tiene un formato válido.',
            'fecha_fin.required'        => 'La fecha de término es obligatoria.',
            'fecha_fin.date'            => 'La fecha de término no tiene un formato válido.',
            'fecha_fin.after'           => 'La fecha de término debe ser posterior a la fecha de inicio.',
            'horas.required'            => 'El número de horas es obligatorio.',
            'horas.integer'             => 'Las horas deben ser un número entero.',
            'horas.min'                 => 'Las horas deben ser al menos 1.',
            'horas.max'                 => 'Las horas no pueden superar 999.',
            'archivo.required'          => 'Debes adjuntar el documento comprobante.',
            'archivo.file'              => 'El archivo no es válido.',
            'archivo.mimes'             => 'Solo se aceptan archivos PDF, JPG o PNG.',
            'archivo.max'               => 'El archivo no puede superar los 5 MB.',
        ]);

        // Guardar el archivo en el disco local (storage privado, fuera de public/)
        $path = $request->file('archivo')->store('evidencias', 'local');

        Solicitud::create([
            'alumno_id'        => $alumno->id,
            'nombre_actividad' => $validated['nombre_actividad'],
            'tipo_actividad'   => $validated['tipo_actividad'],
            'institucion'      => $validated['institucion'],
            'fecha_inicio'     => $validated['fecha_inicio'],
            'fecha_fin'        => $validated['fecha_fin'],
            'horas'            => $validated['horas'],
            'descripcion'      => $validated['descripcion'] ?? null,
            'ruta_archivo'     => $path,
            'estatus'          => 'pendiente',
        ]);

        return redirect()->back()->with('success', '¡Solicitud enviada! Tu evidencia está en revisión por el área SAAC.');
    }
}
