<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AlumnoActividadesController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\AdminActividadController;
use App\Http\Controllers\AlumnoEvidenciaController;
use App\Http\Controllers\AdminEvidenciaController;
use App\Http\Controllers\AdminSolicitudController;
use App\Http\Controllers\DocenteExpedientesController;
use App\Http\Controllers\DocenteGruposController;
use App\Http\Controllers\AdminAlumnosController;
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
    Route::post('/notificaciones/{id}/leer', [\App\Http\Controllers\NotificacionController::class, 'marcarLeida'])->name('notificaciones.leer');
    Route::get('/notificaciones', [\App\Http\Controllers\NotificacionController::class, 'index'])->name('notificaciones.index');

    // Alumno
    Route::get('/actividades', [AlumnoActividadesController::class, 'index'])->name('actividades.index');
    Route::post('/inscripciones', [InscripcionController::class, 'store'])->name('inscripciones.store');
    Route::get('/constancias', [AlumnoActividadesController::class, 'constancias'])->name('constancias.index');
    Route::get('/historial', [AlumnoActividadesController::class, 'historial'])->name('historial.index');
    Route::get('/subir-evidencia', [AlumnoEvidenciaController::class, 'create'])->name('evidencias.create');
    Route::post('/subir-evidencia', [AlumnoEvidenciaController::class, 'store'])->name('evidencias.store');

    // Docente
    Route::get('/asistencia', [AsistenciaController::class, 'index'])->name('asistencia.index');
    Route::post('/asistencia', [AsistenciaController::class, 'store'])->name('asistencia.store');
    Route::post('/asistencia/acreditar', [AsistenciaController::class, 'acreditar'])->name('asistencia.acreditar');
    Route::get('/grupos', [DocenteGruposController::class, 'index'])->name('grupos.index');
    Route::get('/expedientes', [DocenteExpedientesController::class, 'index'])->name('expedientes.index');

    // Admin
    Route::get('/admin/catalogo', [AdminActividadController::class, 'index'])->name('admin.catalogo');
    Route::post('/admin/catalogo', [AdminActividadController::class, 'store'])->name('admin.catalogo.store');
    Route::put('/admin/catalogo/{actividad}', [AdminActividadController::class, 'update'])->name('admin.catalogo.update');
    Route::delete('/admin/catalogo/{actividad}', [AdminActividadController::class, 'destroy'])->name('admin.catalogo.destroy');
    Route::get('/admin/evidencias', [AdminEvidenciaController::class, 'index'])->name('admin.evidencias');
    Route::post('/admin/evidencias/{solicitud}/validar', [AdminEvidenciaController::class, 'validar'])->name('admin.evidencias.validar');
    Route::get('/admin/actividades/create', [AdminActividadController::class, 'create'])->name('admin.actividades.create');

    // Panel de revisión de solicitudes (evidencias externas)
    Route::get('/admin/solicitudes', [AdminSolicitudController::class, 'index'])->name('admin.solicitudes.index');
    Route::put('/admin/solicitudes/{id}', [AdminSolicitudController::class, 'update'])->name('admin.solicitudes.update');
    Route::get('/admin/alumnos', [AdminAlumnosController::class, 'index'])->name('admin.alumnos');
    Route::patch('/admin/alumnos/{alumno}', [AdminAlumnosController::class, 'updateCreditos'])->name('admin.alumnos.update');
    Route::get('/admin/constancias', fn () => Inertia::render('Admin/Constancias'))->name('admin.constancias');
});

require __DIR__.'/auth.php';
