<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function marcarLeida(Request $request, $id)
    {
        $notificacion = $request->user()->notifications()->where('id', $id)->first();
        
        if ($notificacion) {
            $notificacion->markAsRead();
        }

        return redirect()->back();
    }
}