<?php

namespace App\Notifications;

use App\Models\Solicitud;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class EvidenciaEvaluada extends Notification
{
    use Queueable;

    public function __construct(public readonly Solicitud $solicitud) {}

    /**
     * Persist the notification in the database only.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Data stored in the notifications table.
     */
    public function toDatabase(object $notifiable): array
    {
        $estatus  = $this->solicitud->estatus; // 'aprobada' | 'rechazada'
        $actividad = $this->solicitud->nombre_actividad;

        return [
            'solicitud_id'    => $this->solicitud->id,
            'nombre_actividad'=> $actividad,
            'estatus'         => $estatus,
            'creditos'        => $this->solicitud->creditos_otorgados,
            'motivo_rechazo'  => $this->solicitud->motivo_rechazo,
            'mensaje'         => $estatus === 'aprobada'
                ? "Tu evidencia \"{$actividad}\" fue aprobada. Se te otorgaron {$this->solicitud->creditos_otorgados} crédito(s)."
                : "Tu evidencia \"{$actividad}\" fue rechazada. Motivo: {$this->solicitud->motivo_rechazo}",
        ];
    }
}
