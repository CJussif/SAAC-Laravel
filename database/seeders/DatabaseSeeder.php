<?php

namespace Database\Seeders;

use App\Models\Actividad;
use App\Models\Alumno;
use App\Models\Asistencia;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\Invitacion;
use App\Models\Solicitud;
use App\Models\User;
use App\Notifications\EvidenciaEvaluada;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ──────────────────────────────────────────
        // 1. DOCENTES
        // ──────────────────────────────────────────
        $docenteRojasUser = User::create([
            'name'     => 'Inst. María Elena Rojas',
            'email'    => 'maria.rojas@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'docente',
        ]);
        $docenteRojas = Docente::create([
            'user_id'          => $docenteRojasUser->id,
            'numero_empleado'  => 'DOC12346',
            'nombre'           => 'María Elena',
            'apellido_paterno' => 'Rojas',
            'apellido_materno' => 'Sánchez',
        ]);

        $docenteFuentesUser = User::create([
            'name'     => 'Inst. Carlos Fuentes',
            'email'    => 'carlos.fuentes@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'docente',
        ]);
        $docenteFuentes = Docente::create([
            'user_id'          => $docenteFuentesUser->id,
            'numero_empleado'  => 'DOC12347',
            'nombre'           => 'Carlos',
            'apellido_paterno' => 'Fuentes',
            'apellido_materno' => 'Hernández',
        ]);

        $docenteMendezUser = User::create([
            'name'     => 'Prof. Roberto Méndez',
            'email'    => 'docente@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'docente',
        ]);
        $docenteMendez = Docente::create([
            'user_id'          => $docenteMendezUser->id,
            'numero_empleado'  => 'DOC12345',
            'nombre'           => 'Roberto',
            'apellido_paterno' => 'Méndez',
            'apellido_materno' => 'Gómez',
        ]);

        // ──────────────────────────────────────────
        // 2. ADMINISTRADOR
        // ──────────────────────────────────────────
        User::create([
            'name'     => 'Administrador SAAC',
            'email'    => 'admin@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'administrador',
        ]);

        // ──────────────────────────────────────────
        // 3. ALUMNOS
        // ──────────────────────────────────────────

        // Alumno 1: Ana García — tiene 1 constancia descargable + 1 actividad en curso
        $anaUser = User::create([
            'name'     => 'Ana García López',
            'email'    => 'alumno@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'alumno',
        ]);
        $ana = Alumno::create([
            'user_id'              => $anaUser->id,
            'matricula'            => '20240001',
            'nombre'               => 'Ana',
            'apellido_paterno'     => 'García',
            'apellido_materno'     => 'López',
            'carrera'              => 'ISC',
            'semestre'             => 4,
            'creditos_acumulados'  => 1,
        ]);

        // Alumno 2: Luis Ramírez — 2 actividades acreditadas, evidencia aprobada, notificación
        $luisUser = User::create([
            'name'     => 'Luis Ramírez Vega',
            'email'    => 'luis.ramirez@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'alumno',
        ]);
        $luis = Alumno::create([
            'user_id'              => $luisUser->id,
            'matricula'            => '20220087',
            'nombre'               => 'Luis',
            'apellido_paterno'     => 'Ramírez',
            'apellido_materno'     => 'Vega',
            'carrera'              => 'IGE',
            'semestre'             => 6,
            'creditos_acumulados'  => 4,
        ]);

        // Alumno 3: María Torres — asistencia baja (activa alerta de riesgo en panel docente)
        $mariaUser = User::create([
            'name'     => 'María Torres Hernández',
            'email'    => 'maria.torres@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'alumno',
        ]);
        $maria = Alumno::create([
            'user_id'              => $mariaUser->id,
            'matricula'            => '20231045',
            'nombre'               => 'María',
            'apellido_paterno'     => 'Torres',
            'apellido_materno'     => 'Hernández',
            'carrera'              => 'IDS',
            'semestre'             => 2,
            'creditos_acumulados'  => 0,
        ]);

        // Alumno 4: Carlos Vega — alumno avanzado, 4 créditos, evidencia rechazada + notificación
        $carlosUser = User::create([
            'name'     => 'Carlos Vega Morales',
            'email'    => 'carlos.vega@tescha.edu.mx',
            'password' => Hash::make('saac1234'),
            'rol'      => 'alumno',
        ]);
        $carlos = Alumno::create([
            'user_id'              => $carlosUser->id,
            'matricula'            => '20200312',
            'nombre'               => 'Carlos',
            'apellido_paterno'     => 'Vega',
            'apellido_materno'     => 'Morales',
            'carrera'              => 'ISC',
            'semestre'             => 8,
            'creditos_acumulados'  => 4,
        ]);

        // ──────────────────────────────────────────
        // 4. ACTIVIDADES
        // ──────────────────────────────────────────
        $yoga = Actividad::create([
            'docente_id'   => $docenteRojas->id,
            'nombre'       => 'Taller de Yoga y Meditación',
            'descripcion'  => 'Desarrollo físico y mental a través de prácticas de yoga y meditación guiada.',
            'creditos'     => 1,
            'cupo_maximo'  => 36,
            'horario'      => 'Mar y Jue · 16:00 – 18:00',
            'tipo_periodo' => 'semestral',
        ]);

        $locucion = Actividad::create([
            'docente_id'   => $docenteFuentes->id,
            'nombre'       => 'Locución y Radio Universitaria',
            'descripcion'  => 'Habilidades de comunicación oral y producción de radio para la emisora institucional.',
            'creditos'     => 2,
            'cupo_maximo'  => 25,
            'horario'      => 'Lun y Mié · 14:00 – 16:00',
            'tipo_periodo' => 'semestral',
        ]);

        $programacion = Actividad::create([
            'docente_id'   => $docenteMendez->id,
            'nombre'       => 'Programación Competitiva Avanzada',
            'descripcion'  => 'Resolución de problemas algorítmicos complejos para olimpiadas de programación.',
            'creditos'     => 2,
            'cupo_maximo'  => 20,
            'horario'      => 'Vie · 10:00 – 14:00',
            'tipo_periodo' => 'semestral',
        ]);

        $danza = Actividad::create([
            'docente_id'   => $docenteRojas->id,
            'nombre'       => 'Taller de Danza Folklórica',
            'descripcion'  => 'Apreciación y práctica de bailes folklóricos tradicionales de México.',
            'creditos'     => 1,
            'cupo_maximo'  => 50,
            'horario'      => 'Lun, Mié y Vie · 09:00 – 11:00',
            'tipo_periodo' => 'semestral',
        ]);

        $basquet = Actividad::create([
            'docente_id'   => $docenteRojas->id,
            'nombre'       => 'Selección de Basquetbol Femenil',
            'descripcion'  => 'Entrenamiento deportivo y competición en la disciplina de basquetbol femenil.',
            'creditos'     => 2,
            'cupo_maximo'  => 20,
            'horario'      => 'Mar y Jue · 16:00 – 18:00',
            'tipo_periodo' => 'semestral',
        ]);

        $robotica = Actividad::create([
            'docente_id'   => $docenteFuentes->id,
            'nombre'       => 'Club de Robótica Avanzada',
            'descripcion'  => 'Diseño y programación de sistemas robóticos competitivos.',
            'creditos'     => 3,
            'cupo_maximo'  => 15,
            'horario'      => 'Sáb · 09:00 – 13:00',
            'tipo_periodo' => 'semestral',
        ]);

        $ajedrez = Actividad::create([
            'docente_id'   => $docenteMendez->id,
            'nombre'       => 'Taller de Ajedrez Básico',
            'descripcion'  => 'Fundamentos del ajedrez y estrategias para principiantes.',
            'creditos'     => 1,
            'cupo_maximo'  => 30,
            'horario'      => 'Lun y Mié · 14:00 – 16:00',
            'tipo_periodo' => 'semestral',
        ]);

        $liderazgo = Actividad::create([
            'docente_id'   => $docenteMendez->id,
            'nombre'       => 'Seminario de Liderazgo',
            'descripcion'  => 'Desarrollo de habilidades blandas y liderazgo transformacional.',
            'creditos'     => 2,
            'cupo_maximo'  => 25,
            'horario'      => 'Vie · 10:00 – 13:00',
            'tipo_periodo' => 'semestral',
        ]);

        // ──────────────────────────────────────────
        // 5. INSCRIPCIONES + ASISTENCIAS
        // ──────────────────────────────────────────

        // ── Ana García ──────────────────────────
        // Ajedrez: ACREDITADO — constancia disponible para demo
        $anaAjedrez = Inscripcion::create([
            'alumno_id'        => $ana->id,
            'actividad_id'     => $ajedrez->id,
            'horas_acumuladas' => 32,
            'estatus'          => 'acreditado',
        ]);
        $this->crearAsistencias($anaAjedrez->id, 16, 16, 16); // 16/16 sesiones

        // Liderazgo: EN CURSO — 67% asistencia (dentro del rango aceptable)
        $anaLiderazgo = Inscripcion::create([
            'alumno_id'        => $ana->id,
            'actividad_id'     => $liderazgo->id,
            'horas_acumuladas' => 18,
            'estatus'          => 'en_curso',
        ]);
        $this->crearAsistencias($anaLiderazgo->id, 12, 8, 12); // 8/12 sesiones (67%)

        // ── Luis Ramírez ─────────────────────────
        // Yoga: ACREDITADO
        $luisYoga = Inscripcion::create([
            'alumno_id'        => $luis->id,
            'actividad_id'     => $yoga->id,
            'horas_acumuladas' => 30,
            'estatus'          => 'acreditado',
        ]);
        $this->crearAsistencias($luisYoga->id, 15, 15, 15);

        // Locución: ACREDITADO
        $luisLocucion = Inscripcion::create([
            'alumno_id'        => $luis->id,
            'actividad_id'     => $locucion->id,
            'horas_acumuladas' => 28,
            'estatus'          => 'acreditado',
        ]);
        $this->crearAsistencias($luisLocucion->id, 14, 13, 14);

        // Robótica: EN CURSO — 83% asistencia
        $luisRobotica = Inscripcion::create([
            'alumno_id'        => $luis->id,
            'actividad_id'     => $robotica->id,
            'horas_acumuladas' => 20,
            'estatus'          => 'en_curso',
        ]);
        $this->crearAsistencias($luisRobotica->id, 12, 10, 12);

        // ── María Torres ─────────────────────────
        // Danza: EN CURSO — 44% asistencia (activa alerta de riesgo)
        $mariaDanza = Inscripcion::create([
            'alumno_id'        => $maria->id,
            'actividad_id'     => $danza->id,
            'horas_acumuladas' => 8,
            'estatus'          => 'en_curso',
        ]);
        $this->crearAsistencias($mariaDanza->id, 9, 4, 9); // 4/9 = 44%

        // Yoga: INSCRITO (solo se apuntó, sin sesiones aún)
        Inscripcion::create([
            'alumno_id'    => $maria->id,
            'actividad_id' => $yoga->id,
            'estatus'      => 'inscrito',
        ]);

        // ── Carlos Vega ──────────────────────────
        // Programación: ACREDITADO
        $carlosProg = Inscripcion::create([
            'alumno_id'        => $carlos->id,
            'actividad_id'     => $programacion->id,
            'horas_acumuladas' => 40,
            'estatus'          => 'acreditado',
        ]);
        $this->crearAsistencias($carlosProg->id, 20, 20, 20);

        // Basquetbol: ACREDITADO
        $carlosBasquet = Inscripcion::create([
            'alumno_id'        => $carlos->id,
            'actividad_id'     => $basquet->id,
            'horas_acumuladas' => 36,
            'estatus'          => 'acreditado',
        ]);
        $this->crearAsistencias($carlosBasquet->id, 18, 17, 18);

        // Liderazgo: EN CURSO — 90% asistencia
        $carlosLiderazgo = Inscripcion::create([
            'alumno_id'        => $carlos->id,
            'actividad_id'     => $liderazgo->id,
            'horas_acumuladas' => 27,
            'estatus'          => 'en_curso',
        ]);
        $this->crearAsistencias($carlosLiderazgo->id, 10, 9, 10);

        // ──────────────────────────────────────────
        // 6. SOLICITUDES (EVIDENCIAS EXTERNAS)
        // ──────────────────────────────────────────

        // Luis — APROBADA: Maratón de Running (1 crédito ya sumado arriba)
        $solLuisAprobada = Solicitud::create([
            'alumno_id'          => $luis->id,
            'nombre_actividad'   => 'Maratón de Running 5K — TESCHa',
            'tipo_actividad'     => 'deportiva',
            'institucion'        => 'Tecnológico de Estudios Superiores de Chalco',
            'fecha_inicio'       => Carbon::now()->subMonths(2)->toDateString(),
            'fecha_fin'          => Carbon::now()->subMonths(2)->toDateString(),
            'horas'              => 4,
            'descripcion'        => 'Participación en el maratón institucional como corredor oficial de la carrera de ISC.',
            'ruta_archivo'       => 'evidencias/muestra-constancia-maraton.pdf',
            'estatus'            => 'aprobada',
            'creditos_otorgados' => 1,
        ]);

        // María — PENDIENTE: Taller de Fotografía
        Solicitud::create([
            'alumno_id'        => $maria->id,
            'nombre_actividad' => 'Taller de Fotografía Digital',
            'tipo_actividad'   => 'cultural',
            'institucion'      => 'Casa de Cultura de Chalco',
            'fecha_inicio'     => Carbon::now()->subWeeks(3)->toDateString(),
            'fecha_fin'        => Carbon::now()->subWeeks(1)->toDateString(),
            'horas'            => 16,
            'descripcion'      => 'Taller intensivo de fotografía digital y edición con software libre.',
            'ruta_archivo'     => 'evidencias/muestra-constancia-fotografia.pdf',
            'estatus'          => 'pendiente',
        ]);

        // Carlos — RECHAZADA: Curso online (muy corto)
        $solCarlosRechazada = Solicitud::create([
            'alumno_id'         => $carlos->id,
            'nombre_actividad'  => 'Curso de Python en Coursera',
            'tipo_actividad'    => 'cultural',
            'institucion'       => 'Coursera / Google',
            'fecha_inicio'      => Carbon::now()->subMonths(1)->subDays(5)->toDateString(),
            'fecha_fin'         => Carbon::now()->subMonths(1)->toDateString(),
            'horas'             => 3,
            'descripcion'       => 'Introducción a Python para ciencia de datos.',
            'ruta_archivo'      => 'evidencias/muestra-certificado-python.pdf',
            'estatus'           => 'rechazada',
            'motivo_rechazo'    => 'El certificado no cumple la duración mínima de 10 horas requerida por el reglamento S.A.A.C.',
            'creditos_otorgados'=> 0,
        ]);

        // ──────────────────────────────────────────
        // 7. NOTIFICACIONES
        // ──────────────────────────────────────────
        $luisUser->notify(new EvidenciaEvaluada($solLuisAprobada));
        $carlosUser->notify(new EvidenciaEvaluada($solCarlosRechazada));

        // ──────────────────────────────────────────
        // 8. INVITACIÓN DE DEMOSTRACIÓN
        // ──────────────────────────────────────────
        Invitacion::create([
            'email' => 'nuevo.alumno@tescha.edu.mx',
            'token' => Str::uuid(),
        ]);
    }

    /**
     * Crea asistencias distribuidas realistamente en semanas anteriores.
     *
     * @param int $inscripcionId
     * @param int $totalSesiones   Número total de sesiones del curso
     * @param int $sesionesPresente Cuántas de esas sesiones asistió
     * @param int $totalDias       Total de días distintos a registrar
     */
    private function crearAsistencias(int $inscripcionId, int $totalSesiones, int $sesionesPresente, int $totalDias): void
    {
        // Genera fechas hacia atrás: 2 sesiones por semana
        $fechas = [];
        $base   = Carbon::now()->startOfWeek()->subDays(4); // inicia hace ~4 días

        for ($i = 0; $i < $totalDias; $i++) {
            // Alterna martes y jueves retrocediendo semanas
            $semana     = intdiv($i, 2);
            $esMiercoles = ($i % 2 === 0);
            $fecha      = $base->copy()->subWeeks($semana)->subDays($esMiercoles ? 2 : 0);
            $fechas[]   = $fecha->toDateString();
        }

        // Marca las primeras $sesionesPresente como presentes, el resto ausentes
        foreach ($fechas as $idx => $fecha) {
            Asistencia::create([
                'inscripcion_id' => $inscripcionId,
                'fecha'          => $fecha,
                'asistio'        => $idx < $sesionesPresente,
            ]);
        }
    }
}
