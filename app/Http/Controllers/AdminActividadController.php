<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Docente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminActividadController extends Controller
{
    /**
     * Display a listing of activities and teachers.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $actividades = Actividad::with(['docente', 'alumnos'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($actividad) {
                $actividad->inscritos = $actividad->alumnos->filter(function ($alumno) {
                    return in_array($alumno->pivot->estatus, ['inscrito', 'en_curso', 'acreditado']);
                })->count();
                return $actividad;
            });

        $docentes = Docente::all()->map(function ($docente) {
            return [
                'id' => $docente->id,
                'nombre_completo' => "{$docente->nombre} {$docente->apellido_paterno} {$docente->apellido_materno}",
            ];
        })->toArray();

        return Inertia::render('Admin/Catalogo', [
            'actividades' => $actividades,
            'docentes' => $docentes,
        ]);
    }

    /**
     * Store a newly created activity in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'creditos' => 'required|integer|min:1',
            'cupo_maximo' => 'required|integer|min:1',
            'horario' => 'required|string|max:255',
            'docente_id' => 'required|exists:docentes,id',
            'tipo_periodo' => 'required|in:semestral,intersemestral',
        ]);

        Actividad::create($validated);

        return redirect()->back()->with('success', 'Actividad complementaria creada correctamente.');
    }

    /**
     * Update the specified activity in storage.
     */
    public function update(Request $request, Actividad $actividad)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'creditos' => 'required|integer|min:1',
            'cupo_maximo' => 'required|integer|min:1',
            'horario' => 'required|string|max:255',
            'docente_id' => 'required|exists:docentes,id',
            'tipo_periodo' => 'required|in:semestral,intersemestral',
        ]);

        $actividad->update($validated);

        return redirect()->back()->with('success', 'Actividad complementaria actualizada correctamente.');
    }

    /**
     * Remove the specified activity from storage.
     */
    public function destroy(Request $request, Actividad $actividad)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $actividad->delete();

        return redirect()->back()->with('success', 'Actividad complementaria eliminada correctamente.');
    }
}
