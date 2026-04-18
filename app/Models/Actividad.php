<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Actividad extends Model
{
    use HasFactory;

    // Le decimos exactamente cómo se llama el archivero en MySQL
    protected $table = 'actividades';

    protected $fillable = [
        'docente_id', 
        'nombre', 
        'descripcion', 
        'creditos', 
        'cupo_maximo', 
        'horario', 
        'tipo_periodo'
    ];

    // Una actividad es impartida por UN docente
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }

    // Una actividad tiene MUCHOS alumnos inscritos
    public function alumnos()
    {
        return $this->belongsToMany(Alumno::class, 'inscripciones')
                    ->withPivot('horas_acumuladas', 'estatus', 'ruta_constancia')
                    ->withTimestamps();
    }
}