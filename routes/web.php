<?php

use Illuminate\Support\Facades\Route;

// Cuando alguien entre a la raíz del sitio (/), muéstrale la vista 'inicio'
Route::get('/', function () {
    return view('inicio');
});