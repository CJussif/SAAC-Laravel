<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $usuarios = [
            [
                'name'  => 'Ana García López',
                'email' => 'alumno@tescha.edu.mx',
                'rol'   => 'alumno',
            ],
            [
                'name'  => 'Prof. Roberto Méndez',
                'email' => 'docente@tescha.edu.mx',
                'rol'   => 'docente',
            ],
            [
                'name'  => 'Administrador SAAC',
                'email' => 'admin@tescha.edu.mx',
                'rol'   => 'administrador',
            ],
        ];

        foreach ($usuarios as $datos) {
            User::factory()->create([
                'name'     => $datos['name'],
                'email'    => $datos['email'],
                'password' => bcrypt('saac1234'),
                'rol'      => $datos['rol'],
            ]);
        }
    }
}
