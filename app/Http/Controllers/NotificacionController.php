<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; // ¡Esta es la línea mágica que faltaba!

class NotificacionController extends Controller
{
    public function index(Request $request)
    {
        // Traemos todas las notificaciones del usuario paginadas de 15 en 15
        $notificaciones = $request->user()->notifications()->paginate(15);
        
        return Inertia::render('Notificaciones', [
            'notificaciones' => $notificaciones
        ]);
    }

    public function marcarLeida(Request $request, $id)
    {
        $notificacion = $request->user()->notifications()->where('id', $id)->first();
        
        if ($notificacion) {
            $notificacion->markAsRead();
        }

        return redirect()->back();
    }
}