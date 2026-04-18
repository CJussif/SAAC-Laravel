<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Docente extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'numero_empleado', 
        'nombre', 
        'apellido_paterno', 
        'apellido_materno'
    ];

    // Conexión con el sistema de acceso (RNF02)
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Un docente imparte MUCHAS actividades
    public function actividades()
    {
        return $this->hasMany(Actividad::class, 'docente_id');
    }
}