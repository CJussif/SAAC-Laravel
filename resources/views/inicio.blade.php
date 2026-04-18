@extends('layouts.app')

@section('contenido')
<div class="row justify-content-center">
    <div class="col-md-8 text-center mt-5">
        <h1 class="display-4 text-success">Bienvenido al SAAC</h1>
        <p class="lead mt-3">Sistema de Administración de Actividades Complementarias</p>
        <hr>
        <p>Por favor, inicia sesión para gestionar tus actividades, consultar horarios y descargar tus constancias.</p>
        
        <div class="mt-4">
            <button class="btn btn-primary btn-lg mx-2">Iniciar Sesión</button>
            <button class="btn btn-outline-success btn-lg mx-2">Registrarse</button>
        </div>
    </div>
</div>
@endsection