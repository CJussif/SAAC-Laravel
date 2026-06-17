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
        // 3. ALUMNOS (15)
        // ──────────────────────────────────────────
        $alumnosData = [
            // email, name, nombre, ap, am, matricula, carrera, semestre, creditos
            ['alumno@tescha.edu.mx',           'Ana García López',           'Ana',        'García',    'López',      '20240001', 'ISC', 4, 1],
            ['luis.ramirez@tescha.edu.mx',     'Luis Ramírez Vega',          'Luis',       'Ramírez',   'Vega',       '20220087', 'IGE', 6, 4],
            ['maria.torres@tescha.edu.mx',     'María Torres Hernández',     'María',      'Torres',    'Hernández',  '20231045', 'IDS', 2, 0],
            ['carlos.vega@tescha.edu.mx',      'Carlos Vega Morales',        'Carlos',     'Vega',      'Morales',    '20200312', 'ISC', 8, 4],
            ['sofia.luna@tescha.edu.mx',       'Sofía Luna Pérez',           'Sofía',      'Luna',      'Pérez',      '20241102', 'ISC', 2, 0],
            ['diego.reyes@tescha.edu.mx',      'Diego Reyes Castillo',       'Diego',      'Reyes',     'Castillo',   '20230456', 'IGE', 4, 2],
            ['valeria.ibarra@tescha.edu.mx',   'Valeria Ibarra Noriega',     'Valeria',    'Ibarra',    'Noriega',    '20220198', 'IDS', 6, 3],
            ['jorge.mendoza@tescha.edu.mx',    'Jorge Mendoza Ruiz',         'Jorge',      'Mendoza',   'Ruiz',       '20211234', 'ISC', 8, 5],
            ['daniela.soto@tescha.edu.mx',     'Daniela Soto Vargas',        'Daniela',    'Soto',      'Vargas',     '20240789', 'IGE', 2, 0],
            ['miguel.flores@tescha.edu.mx',    'Miguel Flores Aranda',       'Miguel',     'Flores',    'Aranda',     '20230321', 'ISC', 4, 1],
            ['paola.guerrero@tescha.edu.mx',   'Paola Guerrero Estrada',     'Paola',      'Guerrero',  'Estrada',    '20221567', 'IDS', 5, 2],
            ['ivan.corona@tescha.edu.mx',      'Iván Corona Delgado',        'Iván',       'Corona',    'Delgado',    '20200876', 'ISC', 9, 6],
            ['adriana.leon@tescha.edu.mx',     'Adriana León Moreno',        'Adriana',    'León',      'Moreno',     '20241890', 'IGE', 1, 0],
            ['roberto.silva@tescha.edu.mx',    'Roberto Silva Gutiérrez',    'Roberto',    'Silva',     'Gutiérrez',  '20231678', 'IDS', 3, 1],
            ['fernanda.ochoa@tescha.edu.mx',   'Fernanda Ochoa Martínez',    'Fernanda',   'Ochoa',     'Martínez',   '20220943', 'ISC', 7, 3],
        ];

        $alumnos = [];
        foreach ($alumnosData as [$email, $name, $nom, $ap, $am, $mat, $car, $sem, $cred]) {
            $user = User::create([
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make('saac1234'),
                'rol'      => 'alumno',
            ]);
            $alumnos[$email] = Alumno::create([
                'user_id'             => $user->id,
                'matricula'           => $mat,
                'nombre'              => $nom,
                'apellido_paterno'    => $ap,
                'apellido_materno'    => $am,
                'carrera'             => $car,
                'semestre'            => $sem,
                'creditos_acumulados' => $cred,
            ]);
        }

        // Alias cortos para los alumnos usados en inscripciones
        $ana      = $alumnos['alumno@tescha.edu.mx'];
        $luis     = $alumnos['luis.ramirez@tescha.edu.mx'];
        $maria    = $alumnos['maria.torres@tescha.edu.mx'];
        $carlos   = $alumnos['carlos.vega@tescha.edu.mx'];
        $sofia    = $alumnos['sofia.luna@tescha.edu.mx'];
        $diego    = $alumnos['diego.reyes@tescha.edu.mx'];
        $valeria  = $alumnos['valeria.ibarra@tescha.edu.mx'];
        $jorge    = $alumnos['jorge.mendoza@tescha.edu.mx'];
        $daniela  = $alumnos['daniela.soto@tescha.edu.mx'];
        $miguel   = $alumnos['miguel.flores@tescha.edu.mx'];
        $paola    = $alumnos['paola.guerrero@tescha.edu.mx'];
        $ivan     = $alumnos['ivan.corona@tescha.edu.mx'];
        $adriana  = $alumnos['adriana.leon@tescha.edu.mx'];
        $roberto  = $alumnos['roberto.silva@tescha.edu.mx'];
        $fernanda = $alumnos['fernanda.ochoa@tescha.edu.mx'];

        // ──────────────────────────────────────────
        // 4. ACTIVIDADES (16 en total)
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
            'descripcion'  => 'Resolución de problemas algorítmicos para olimpiadas y competencias nacionales.',
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
            'descripcion'  => 'Fundamentos del ajedrez y estrategias tácticas para principiantes.',
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

        // ── Nuevas 8 actividades ────────────────
        $pintura = Actividad::create([
            'docente_id'   => $docenteRojas->id,
            'nombre'       => 'Taller de Pintura y Artes Plásticas',
            'descripcion'  => 'Técnicas de pintura al óleo, acrílico y acuarela con enfoque en expresión artística.',
            'creditos'     => 1,
            'cupo_maximo'  => 25,
            'horario'      => 'Mié · 15:00 – 18:00',
            'tipo_periodo' => 'semestral',
        ]);

        $fotografia = Actividad::create([
            'docente_id'   => $docenteFuentes->id,
            'nombre'       => 'Club de Fotografía Digital',
            'descripcion'  => 'Técnica fotográfica, composición y edición con software profesional.',
            'creditos'     => 1,
            'cupo_maximo'  => 20,
            'horario'      => 'Sáb · 10:00 – 13:00',
            'tipo_periodo' => 'semestral',
        ]);

        $guitarra = Actividad::create([
            'docente_id'   => $docenteMendez->id,
            'nombre'       => 'Taller de Guitarra Clásica',
            'descripcion'  => 'Iniciación a la guitarra clásica y lectura de partituras básicas.',
            'creditos'     => 1,
            'cupo_maximo'  => 20,
            'horario'      => 'Jue · 15:00 – 17:00',
            'tipo_periodo' => 'semestral',
        ]);

        $atletismo = Actividad::create([
            'docente_id'   => $docenteRojas->id,
            'nombre'       => 'Atletismo y Acondicionamiento Físico',
            'descripcion'  => 'Entrenamiento físico integral: velocidad, resistencia y fuerza.',
            'creditos'     => 2,
            'cupo_maximo'  => 40,
            'horario'      => 'Lun, Mié y Vie · 07:00 – 08:30',
            'tipo_periodo' => 'semestral',
        ]);

        $teatro = Actividad::create([
            'docente_id'   => $docenteFuentes->id,
            'nombre'       => 'Teatro y Expresión Corporal',
            'descripcion'  => 'Técnicas teatrales, improvisación y montaje de obras breves.',
            'creditos'     => 2,
            'cupo_maximo'  => 30,
            'horario'      => 'Mar y Jue · 17:00 – 19:00',
            'tipo_periodo' => 'semestral',
        ]);

        $natacion = Actividad::create([
            'docente_id'   => $docenteRojas->id,
            'nombre'       => 'Taller de Natación',
            'descripcion'  => 'Aprendizaje y perfeccionamiento de los cuatro estilos de natación.',
            'creditos'     => 2,
            'cupo_maximo'  => 20,
            'horario'      => 'Lun y Mié · 07:00 – 09:00',
            'tipo_periodo' => 'semestral',
        ]);

        $debate = Actividad::create([
            'docente_id'   => $docenteMendez->id,
            'nombre'       => 'Debate y Oratoria',
            'descripcion'  => 'Técnicas de argumentación, debate estructurado y expresión oral en público.',
            'creditos'     => 1,
            'cupo_maximo'  => 30,
            'horario'      => 'Mar · 16:00 – 18:00',
            'tipo_periodo' => 'semestral',
        ]);

        $futbol = Actividad::create([
            'docente_id'   => $docenteFuentes->id,
            'nombre'       => 'Fútbol Varonil',
            'descripcion'  => 'Entrenamiento técnico y táctico para la selección de fútbol del plantel.',
            'creditos'     => 2,
            'cupo_maximo'  => 22,
            'horario'      => 'Mar y Jue · 15:00 – 17:00',
            'tipo_periodo' => 'semestral',
        ]);

        // ──────────────────────────────────────────
        // 5. INSCRIPCIONES + ASISTENCIAS
        // ──────────────────────────────────────────

        // ── Ana García (alumno demo principal) ──
        $this->inscribir($ana->id, $ajedrez->id,   'acreditado', 32, 16, 16);
        $this->inscribir($ana->id, $liderazgo->id, 'en_curso',   18, 12, 8);

        // ── Luis Ramírez (2 acreditadas + evidencia aprobada) ──
        $this->inscribir($luis->id, $yoga->id,     'acreditado', 30, 15, 15);
        $this->inscribir($luis->id, $locucion->id, 'acreditado', 28, 14, 13);
        $this->inscribir($luis->id, $robotica->id, 'en_curso',   20, 10, 8);

        // ── María Torres (asistencia baja — alerta de riesgo) ──
        $this->inscribir($maria->id, $danza->id,    'en_curso', 8, 9, 4);  // 44%
        $this->inscribir($maria->id, $pintura->id,  'inscrito', 0, 0, 0);

        // ── Carlos Vega (2 acreditadas + evidencia rechazada) ──
        $this->inscribir($carlos->id, $programacion->id, 'acreditado', 40, 20, 20);
        $this->inscribir($carlos->id, $basquet->id,      'acreditado', 36, 18, 17);
        $this->inscribir($carlos->id, $liderazgo->id,    'en_curso',   27, 10, 9);

        // ── Sofía Luna (nueva, solo inscrita) ──
        $this->inscribir($sofia->id, $danza->id,    'inscrito', 0, 0, 0);
        $this->inscribir($sofia->id, $guitarra->id, 'inscrito', 0, 0, 0);

        // ── Diego Reyes (1 acreditada, 1 en curso) ──
        $this->inscribir($diego->id, $ajedrez->id,   'acreditado', 32, 16, 15);
        $this->inscribir($diego->id, $atletismo->id, 'en_curso',   24, 12, 11); // 92%

        // ── Valeria Ibarra (2 acreditadas) ──
        $this->inscribir($valeria->id, $danza->id,    'acreditado', 30, 15, 14);
        $this->inscribir($valeria->id, $fotografia->id,'acreditado', 24, 12, 12);
        $this->inscribir($valeria->id, $teatro->id,   'en_curso',   14, 7,  6);

        // ── Jorge Mendoza (alumno avanzado, 3 acreditadas) ──
        $this->inscribir($jorge->id, $programacion->id, 'acreditado', 40, 20, 20);
        $this->inscribir($jorge->id, $debate->id,       'acreditado', 28, 14, 13);
        $this->inscribir($jorge->id, $robotica->id,     'acreditado', 40, 20, 20);
        $this->inscribir($jorge->id, $liderazgo->id,    'en_curso',   18, 8,  7);

        // ── Daniela Soto (primer semestre, solo inscrita) ──
        $this->inscribir($daniela->id, $danza->id,    'inscrito', 0, 0, 0);
        $this->inscribir($daniela->id, $pintura->id,  'en_curso', 8, 4, 4); // 100%

        // ── Miguel Flores (1 acreditada) ──
        $this->inscribir($miguel->id, $ajedrez->id,  'acreditado', 32, 16, 14);
        $this->inscribir($miguel->id, $futbol->id,   'en_curso',   20, 10, 8);

        // ── Paola Guerrero (2 actividades en curso) ──
        $this->inscribir($paola->id, $yoga->id,      'acreditado', 30, 15, 13);
        $this->inscribir($paola->id, $natacion->id,  'en_curso',   20, 10, 7); // 70%

        // ── Iván Corona (alumno de 9no, múltiples acreditadas) ──
        $this->inscribir($ivan->id, $programacion->id, 'acreditado', 40, 20, 20);
        $this->inscribir($ivan->id, $liderazgo->id,    'acreditado', 36, 18, 17);
        $this->inscribir($ivan->id, $robotica->id,     'acreditado', 40, 20, 19);
        $this->inscribir($ivan->id, $debate->id,       'en_curso',   12, 6,  6);

        // ── Adriana León (1er semestre, en curso) ──
        $this->inscribir($adriana->id, $danza->id,    'en_curso', 12, 6, 5);
        $this->inscribir($adriana->id, $guitarra->id, 'inscrito', 0, 0, 0);

        // ── Roberto Silva (1 acreditada, riesgo en otra) ──
        $this->inscribir($roberto->id, $ajedrez->id,  'acreditado', 32, 16, 16);
        $this->inscribir($roberto->id, $atletismo->id,'en_curso',   10, 8,  3); // 37.5% — riesgo

        // ── Fernanda Ochoa (3 acreditadas — casi llena créditos) ──
        $this->inscribir($fernanda->id, $locucion->id,    'acreditado', 28, 14, 14);
        $this->inscribir($fernanda->id, $yoga->id,        'acreditado', 30, 15, 15);
        $this->inscribir($fernanda->id, $fotografia->id,  'acreditado', 24, 12, 11);
        $this->inscribir($fernanda->id, $teatro->id,      'en_curso',   10, 5,  4);

        // ──────────────────────────────────────────
        // 6. SOLICITUDES (EVIDENCIAS EXTERNAS)
        // ──────────────────────────────────────────

        $solLuisAprobada = Solicitud::create([
            'alumno_id'          => $luis->id,
            'nombre_actividad'   => 'Maratón de Running 5K — TESCHa',
            'tipo_actividad'     => 'deportiva',
            'institucion'        => 'Tecnológico de Estudios Superiores de Chalco',
            'fecha_inicio'       => Carbon::now()->subMonths(2)->toDateString(),
            'fecha_fin'          => Carbon::now()->subMonths(2)->toDateString(),
            'horas'              => 4,
            'descripcion'        => 'Participación en el maratón institucional como corredor oficial.',
            'ruta_archivo'       => 'evidencias/muestra-maraton.pdf',
            'estatus'            => 'aprobada',
            'creditos_otorgados' => 1,
        ]);

        Solicitud::create([
            'alumno_id'        => $maria->id,
            'nombre_actividad' => 'Taller de Fotografía Digital',
            'tipo_actividad'   => 'cultural',
            'institucion'      => 'Casa de Cultura de Chalco',
            'fecha_inicio'     => Carbon::now()->subWeeks(3)->toDateString(),
            'fecha_fin'        => Carbon::now()->subWeeks(1)->toDateString(),
            'horas'            => 16,
            'descripcion'      => 'Taller intensivo de fotografía y edición con software libre.',
            'ruta_archivo'     => 'evidencias/muestra-fotografia.pdf',
            'estatus'          => 'pendiente',
        ]);

        $solCarlosRechazada = Solicitud::create([
            'alumno_id'          => $carlos->id,
            'nombre_actividad'   => 'Curso de Python en Coursera',
            'tipo_actividad'     => 'cultural',
            'institucion'        => 'Coursera / Google',
            'fecha_inicio'       => Carbon::now()->subMonths(1)->subDays(5)->toDateString(),
            'fecha_fin'          => Carbon::now()->subMonths(1)->toDateString(),
            'horas'              => 3,
            'descripcion'        => 'Introducción a Python para ciencia de datos.',
            'ruta_archivo'       => 'evidencias/muestra-python.pdf',
            'estatus'            => 'rechazada',
            'motivo_rechazo'     => 'El certificado no cumple la duración mínima de 10 horas requerida por el reglamento S.A.A.C.',
            'creditos_otorgados' => 0,
        ]);

        Solicitud::create([
            'alumno_id'        => $sofia->id,
            'nombre_actividad' => 'Concurso de Canto Institucional',
            'tipo_actividad'   => 'cultural',
            'institucion'      => 'TESCHa',
            'fecha_inicio'     => Carbon::now()->subWeeks(2)->toDateString(),
            'fecha_fin'        => Carbon::now()->subWeeks(2)->toDateString(),
            'horas'            => 5,
            'descripcion'      => 'Primer lugar en el concurso de canto del ciclo escolar 2026-1.',
            'ruta_archivo'     => 'evidencias/muestra-canto.pdf',
            'estatus'          => 'pendiente',
        ]);

        Solicitud::create([
            'alumno_id'        => $roberto->id,
            'nombre_actividad' => 'Torneo de Fútbol Inter-Tecnológicos',
            'tipo_actividad'   => 'deportiva',
            'institucion'      => 'TecNM',
            'fecha_inicio'     => Carbon::now()->subMonths(1)->toDateString(),
            'fecha_fin'        => Carbon::now()->subMonths(1)->addDays(2)->toDateString(),
            'horas'            => 12,
            'descripcion'      => 'Participación representando a TESCHa en el torneo regional inter-tecnológicos.',
            'ruta_archivo'     => 'evidencias/muestra-futbol.pdf',
            'estatus'          => 'pendiente',
        ]);

        // ──────────────────────────────────────────
        // 7. NOTIFICACIONES
        // ──────────────────────────────────────────
        $luisUser  = User::where('email', 'luis.ramirez@tescha.edu.mx')->first();
        $carlosUser = User::where('email', 'carlos.vega@tescha.edu.mx')->first();

        $luisUser->notify(new EvidenciaEvaluada($solLuisAprobada));
        $carlosUser->notify(new EvidenciaEvaluada($solCarlosRechazada));

        // ──────────────────────────────────────────
        // 8. INVITACIONES DE DEMO
        // ──────────────────────────────────────────
        Invitacion::create(['email' => 'nuevo.alumno@tescha.edu.mx', 'token' => Str::uuid()]);
        Invitacion::create(['email' => 'nuevo.docente@tescha.edu.mx', 'token' => Str::uuid()]);
    }

    /**
     * Crea una inscripción y sus asistencias de forma compacta.
     */
    private function inscribir(
        int $alumnoId,
        int $actividadId,
        string $estatus,
        int $horasAcumuladas,
        int $totalSesiones,
        int $sesionesPresente
    ): void {
        $ins = Inscripcion::create([
            'alumno_id'        => $alumnoId,
            'actividad_id'     => $actividadId,
            'horas_acumuladas' => $horasAcumuladas,
            'estatus'          => $estatus,
        ]);

        if ($totalSesiones > 0) {
            $this->crearAsistencias($ins->id, $totalSesiones, $sesionesPresente);
        }
    }

    /**
     * Genera asistencias distribuidas en semanas anteriores (2 sesiones/semana).
     */
    private function crearAsistencias(int $inscripcionId, int $total, int $presentes): void
    {
        $base = Carbon::now()->startOfWeek()->subDays(4);

        for ($i = 0; $i < $total; $i++) {
            $semana = intdiv($i, 2);
            $offset = ($i % 2 === 0) ? 2 : 0;
            $fecha  = $base->copy()->subWeeks($semana)->subDays($offset)->toDateString();

            Asistencia::create([
                'inscripcion_id' => $inscripcionId,
                'fecha'          => $fecha,
                'asistio'        => $i < $presentes,
            ]);
        }
    }
}
