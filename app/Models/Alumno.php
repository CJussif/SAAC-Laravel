<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alumno extends Model
{
    use HasFactory;

    // 1. MEDIDA DE SEGURIDAD: ¿Qué campos se pueden llenar desde un formulario?
    protected $fillable = [
        'user_id', 
        'matricula', 
        'nombre', 
        'apellido_paterno', 
        'apellido_materno', 
        'carrera', 
        'semestre', 
        'creditos_acumulados'
    ];

    // 2. RELACIONES: Le enseñamos quién es su "Dueño" en el sistema de login (RNF02)
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Le enseñamos a buscar sus actividades inscritas
    public function actividades()
    {
        // Un alumno pertenece a muchas actividades, a través de la tabla 'inscripciones'
        return $this->belongsToMany(Actividad::class, 'inscripciones')
                    ->withPivot('horas_acumuladas', 'estatus', 'ruta_constancia')
                    ->withTimestamps();
    }
}