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
        // 1. Crear el usuario Alumno y su perfil correspondientes
        $alumnoUser = User::factory()->create([
            'name'     => 'Ana García López',
            'email'    => 'alumno@tescha.edu.mx',
            'password' => bcrypt('saac1234'),
            'rol'      => 'alumno',
        ]);

        $alumno = \App\Models\Alumno::create([
            'user_id' => $alumnoUser->id,
            'matricula' => '20240001',
            'nombre' => 'Ana',
            'apellido_paterno' => 'García',
            'apellido_materno' => 'López',
            'carrera' => 'Ingeniería en Sistemas Computacionales',
            'semestre' => 4,
            'creditos_acumulados' => 3,
        ]);

        // 2. Crear los usuarios Docente y sus perfiles
        $docenteUser = User::factory()->create([
            'name'     => 'Prof. Roberto Méndez',
            'email'    => 'docente@tescha.edu.mx',
            'password' => bcrypt('saac1234'),
            'rol'      => 'docente',
        ]);

        $docenteMendez = \App\Models\Docente::create([
            'user_id' => $docenteUser->id,
            'numero_empleado' => 'DOC12345',
            'nombre' => 'Roberto',
            'apellido_paterno' => 'Méndez',
            'apellido_materno' => 'Gómez',
        ]);

        $docenteRojasUser = User::factory()->create([
            'name'     => 'Inst. María Elena Rojas',
            'email'    => 'maria.rojas@tescha.edu.mx',
            'password' => bcrypt('saac1234'),
            'rol'      => 'docente',
        ]);

        $docenteRojas = \App\Models\Docente::create([
            'user_id' => $docenteRojasUser->id,
            'numero_empleado' => 'DOC12346',
            'nombre' => 'María Elena',
            'apellido_paterno' => 'Rojas',
            'apellido_materno' => 'Sánchez',
        ]);

        $docenteFuentesUser = User::factory()->create([
            'name'     => 'Inst. Carlos Fuentes',
            'email'    => 'carlos.fuentes@tescha.edu.mx',
            'password' => bcrypt('saac1234'),
            'rol'      => 'docente',
        ]);

        $docenteFuentes = \App\Models\Docente::create([
            'user_id' => $docenteFuentesUser->id,
            'numero_empleado' => 'DOC12347',
            'nombre' => 'Carlos',
            'apellido_paterno' => 'Fuentes',
            'apellido_materno' => 'Hernández',
        ]);

        // 3. Crear el administrador
        $adminUser = User::factory()->create([
            'name'     => 'Administrador SAAC',
            'email'    => 'admin@tescha.edu.mx',
            'password' => bcrypt('saac1234'),
            'rol'      => 'administrador',
        ]);

        // 4. Crear las Actividades
        $actividadesData = [
            [
                'docente_id' => $docenteRojas->id,
                'nombre' => 'Taller de Yoga y Meditación',
                'descripcion' => 'Taller para el desarrollo físico y mental a través del yoga y la meditación.',
                'creditos' => 1,
                'cupo_maximo' => 36,
                'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
                'tipo_periodo' => 'semestral',
            ],
            [
                'docente_id' => $docenteFuentes->id,
                'nombre' => 'Locución y Radio Universitaria',
                'descripcion' => 'Desarrollo de habilidades de comunicación y producción de radio.',
                'creditos' => 2,
                'cupo_maximo' => 25,
                'horario' => 'Lun y Mié, 14:00 – 16:00 hrs',
                'tipo_periodo' => 'semestral',
            ],
            [
                'docente_id' => $docenteMendez->id,
                'nombre' => 'Programación Competitiva Avanzada',
                'descripcion' => 'Resolución de problemas algorítmicos complejos para olimpiadas de programación.',
                'creditos' => 2,
                'cupo_maximo' => 20,
                'horario' => 'Vie, 10:00 – 14:00 hrs',
                'tipo_periodo' => 'semestral',
            ],
            [
                'docente_id' => $docenteMendez->id,
                'nombre' => 'Taller de Danza Folklórica',
                'descripcion' => 'Apreciación y práctica de bailes folklóricos tradicionales de México.',
                'creditos' => 1,
                'cupo_maximo' => 50,
                'horario' => 'Lun, Mié y Vie, 09:00 – 11:00 hrs',
                'tipo_periodo' => 'semestral',
            ],
            [
                'docente_id' => $docenteRojas->id,
                'nombre' => 'Selección de Basquetbol Femenil',
                'descripcion' => 'Entrenamiento deportivo y competición en la disciplina de basquetbol femenil.',
                'creditos' => 2,
                'cupo_maximo' => 20,
                'horario' => 'Mar y Jue, 16:00 – 18:00 hrs',
                'tipo_periodo' => 'semestral',
            ],
            [
                'docente_id' => $docenteFuentes->id,
                'nombre' => 'Club de Robótica Avanzada',
                'descripcion' => 'Diseño y programación de sistemas robóticos competitivos.',
                'creditos' => 3,
                'cupo_maximo' => 15,
                'horario' => 'Sáb, 09:00 – 13:00 hrs',
                'tipo_periodo' => 'semestral',
            ],
            [
                'docente_id' => $docenteMendez->id,
                'nombre' => 'Taller de Ajedrez Básico',
                'descripcion' => 'Fundamentos del ajedrez y estrategias para principiantes.',
                'creditos' => 1,
                'cupo_maximo' => 30,
                'horario' => 'Lun, Mié · 14:00 – 16:00',
                'tipo_periodo' => 'semestral',
            ],
            [
                'docente_id' => $docenteMendez->id,
                'nombre' => 'Seminario de Liderazgo',
                'descripcion' => 'Desarrollo de habilidades blandas y liderazgo transformacional.',
                'creditos' => 2,
                'cupo_maximo' => 25,
                'horario' => 'Vie · 10:00 – 13:00',
                'tipo_periodo' => 'semestral',
            ],
        ];

        $actividades = [];
        foreach ($actividadesData as $actData) {
            $actividades[] = \App\Models\Actividad::create($actData);
        }

        // 5. Crear Inscripciones para el alumno de prueba
        // Se inscribe en "Taller de Ajedrez Básico" y "Seminario de Liderazgo" para reflejar el dashboard
        $ajedrez = collect($actividades)->firstWhere('nombre', 'Taller de Ajedrez Básico');
        $liderazgo = collect($actividades)->firstWhere('nombre', 'Seminario de Liderazgo');

        if ($ajedrez) {
            \App\Models\Inscripcion::create([
                'alumno_id' => $alumno->id,
                'actividad_id' => $ajedrez->id,
                'horas_acumuladas' => 16,
                'estatus' => 'en_curso',
            ]);
        }

        if ($liderazgo) {
            \App\Models\Inscripcion::create([
                'alumno_id' => $alumno->id,
                'actividad_id' => $liderazgo->id,
                'horas_acumuladas' => 20,
                'estatus' => 'en_curso',
            ]);
        }
    }
}
