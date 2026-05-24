<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Solicitud extends Model
{
    use HasFactory;

    protected $table = 'solicitudes';

    protected $fillable = [
        'alumno_id',
        'nombre_actividad',
        'tipo_actividad',
        'institucion',
        'fecha_inicio',
        'fecha_fin',
        'horas',
        'descripcion',
        'ruta_archivo',
        'estatus',
        'motivo_rechazo',
        'creditos_otorgados',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date:Y-m-d',
            'fecha_fin' => 'date:Y-m-d',
            'horas' => 'integer',
            'creditos_otorgados' => 'integer',
        ];
    }

    public function alumno(): BelongsTo
    {
        return $this->belongsTo(Alumno::class, 'alumno_id');
    }
}
