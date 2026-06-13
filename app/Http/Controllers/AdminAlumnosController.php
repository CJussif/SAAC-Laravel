<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAlumnosController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $todos = Alumno::all();
        $kpis = [
            'total'       => $todos->count(),
            'acreditados' => $todos->where('creditos_acumulados', '>=', 5)->count(),
            'en_progreso' => $todos->whereBetween('creditos_acumulados', [1, 4])->count(),
        ];

        $query = Alumno::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('apellido_paterno', 'like', "%{$search}%")
                  ->orWhere('matricula', 'like', "%{$search}%");
            });
        }

        if ($carrera = $request->input('carrera')) {
            $query->where('carrera', $carrera);
        }

        if ($estatus = $request->input('estatus')) {
            match ($estatus) {
                'Acreditado'  => $query->where('creditos_acumulados', '>=', 5),
                'En Progreso' => $query->whereBetween('creditos_acumulados', [1, 4]),
                'Sin Iniciar' => $query->where('creditos_acumulados', 0),
                default       => null,
            };
        }

        $alumnos = $query->paginate(20)->through(fn ($al) => [
            'id'                  => $al->id,
            'matricula'           => $al->matricula,
            'nombre'              => "{$al->nombre} {$al->apellido_paterno} {$al->apellido_materno}",
            'carrera'             => $al->carrera,
            'semestre'            => $al->semestre,
            'creditos_acumulados' => $al->creditos_acumulados,
            'meta'                => 5,
            'estatus'             => match (true) {
                $al->creditos_acumulados >= 5 => 'Acreditado',
                $al->creditos_acumulados > 0  => 'En Progreso',
                default                       => 'Sin Iniciar',
            },
        ]);

        return Inertia::render('Admin/Alumnos', [
            'alumnos' => $alumnos,
            'kpis'    => $kpis,
            'filters' => $request->only(['search', 'carrera', 'estatus']),
        ]);
    }

    public function updateCreditos(Request $request, Alumno $alumno)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'creditos_acumulados' => ['required', 'integer', 'min:0', 'max:10'],
        ]);

        $alumno->update($validated);

        return redirect()->back()->with('success', 'Créditos actualizados correctamente.');
    }
}
