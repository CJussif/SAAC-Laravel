<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AlumnoActividadesController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\AsistenciaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Alumno
    Route::get('/actividades', [AlumnoActividadesController::class, 'index'])->name('actividades.index');
    Route::post('/inscripciones', [InscripcionController::class, 'store'])->name('inscripciones.store');
    Route::get('/constancias',       fn () => Inertia::render('Alumno/Constancias'))->name('constancias.index');
    Route::get('/historial',         fn () => Inertia::render('Alumno/Historial'))->name('historial.index');
    Route::get('/subir-evidencia',   fn () => Inertia::render('Alumno/CargaEvidencias'))->name('evidencias.create');

    // Docente
    Route::get('/asistencia', [AsistenciaController::class, 'index'])->name('asistencia.index');
    Route::post('/asistencia', [AsistenciaController::class, 'store'])->name('asistencia.store');
    Route::post('/asistencia/acreditar', [AsistenciaController::class, 'acreditar'])->name('asistencia.acreditar');
    Route::get('/grupos',       fn () => Inertia::render('Docente/Grupos'))->name('grupos.index');
    Route::get('/expedientes',  fn () => Inertia::render('Docente/Expedientes'))->name('expedientes.index');

    // Admin
    Route::get('/admin/catalogo',    fn () => Inertia::render('Admin/Catalogo'))->name('admin.catalogo');
    Route::get('/admin/evidencias',  fn () => Inertia::render('Admin/Evidencias'))->name('admin.evidencias');
    Route::get('/admin/alumnos',     fn () => Inertia::render('Admin/Alumnos'))->name('admin.alumnos');
    Route::get('/admin/constancias', fn () => Inertia::render('Admin/Constancias'))->name('admin.constancias');
});

require __DIR__.'/auth.php';
