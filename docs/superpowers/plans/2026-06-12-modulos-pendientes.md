# Módulos Pendientes SAAC — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar los 4 módulos con vistas placeholder a datos reales e implementar el flujo completo de invitación/registro de alumnos por correo institucional.

**Architecture:** Un controlador por vista siguiendo el patrón del proyecto (AdminEvidenciaController, AlumnoEvidenciaController, etc.). Los controladores devuelven `Inertia::render()` con props. Las vistas React reemplazan sus constantes hardcodeadas por props de Inertia. El flujo de invitación usa tabla `invitaciones` con tokens UUID y rutas públicas fuera del grupo de auth.

**Tech Stack:** Laravel 12, PHP 8.4, Inertia.js v2, React 19, SQLite, PHPUnit, Tailwind CSS v4

---

## File Map

**CREATE:**
```
app/Models/Invitacion.php
database/migrations/XXXX_create_invitaciones_table.php
app/Http/Controllers/DocenteGruposController.php
app/Http/Controllers/DocenteExpedientesController.php
app/Http/Controllers/AdminAlumnosController.php
app/Http/Controllers/AdminConstanciasController.php
app/Http/Controllers/InvitacionController.php
resources/js/Pages/Admin/Invitaciones.jsx
resources/js/Pages/Auth/ActivarCuenta.jsx
tests/Feature/DocenteGruposTest.php
tests/Feature/DocenteExpedientesTest.php
tests/Feature/AdminAlumnosTest.php
tests/Feature/AdminConstanciasTest.php
tests/Feature/InvitacionTest.php
```

**MODIFY:**
```
routes/web.php                              — reemplazar 4 lambdas + agregar rutas invitación
resources/js/Pages/Docente/Grupos.jsx       — props de Inertia en lugar de constantes
resources/js/Pages/Docente/Expedientes.jsx  — props + filtros reactivos
resources/js/Pages/Admin/Alumnos.jsx        — props + paginación + modal edición
resources/js/Pages/Admin/Constancias.jsx    — props de Inertia en lugar de constantes
resources/js/Layouts/AuthenticatedLayout.jsx — agregar "Invitaciones" al nav de admin
```

---

### Task 1: Modelo Invitacion y migración

**Files:**
- Create: `database/migrations/XXXX_create_invitaciones_table.php`
- Create: `app/Models/Invitacion.php`

- [ ] **Step 1: Generar la migración**

```bash
php artisan make:migration create_invitaciones_table
```

Editar el archivo generado en `database/migrations/` (el nombre tendrá timestamp real):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitaciones', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('token')->unique();
            $table->timestamp('usado_en')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitaciones');
    }
};
```

- [ ] **Step 2: Crear el modelo**

Crear `app/Models/Invitacion.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitacion extends Model
{
    protected $table = 'invitaciones';

    protected $fillable = ['email', 'token', 'usado_en'];

    protected function casts(): array
    {
        return ['usado_en' => 'datetime'];
    }

    public function esPendiente(): bool
    {
        return $this->usado_en === null;
    }
}
```

- [ ] **Step 3: Correr la migración**

```bash
php artisan migrate
```

Resultado esperado: `create_invitaciones_table ... DONE`

- [ ] **Step 4: Commit**

```bash
git add database/migrations/ app/Models/Invitacion.php
git commit -m "feat: agregar modelo y migración de invitaciones"
```

---

### Task 2: DocenteGruposController + ruta

**Files:**
- Create: `app/Http/Controllers/DocenteGruposController.php`
- Create: `tests/Feature/DocenteGruposTest.php`
- Modify: `routes/web.php`

- [ ] **Step 1: Escribir las pruebas que fallarán**

Crear `tests/Feature/DocenteGruposTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\Asistencia;
use App\Models\Actividad;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocenteGruposTest extends TestCase
{
    use RefreshDatabase;

    private function crearDocente(): array
    {
        $user = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id'          => $user->id,
            'numero_empleado'  => 'DOC99001',
            'nombre'           => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'García',
        ]);
        return [$user, $docente];
    }

    private function crearAlumnoInscrito(int $actividadId): array
    {
        $userAlumno = User::factory()->create(['rol' => 'alumno']);
        $alumno = Alumno::create([
            'user_id'             => $userAlumno->id,
            'matricula'           => '210' . rand(100, 999),
            'nombre'              => 'Ana',
            'apellido_paterno'    => 'García',
            'apellido_materno'    => 'López',
            'carrera'             => 'ISC',
            'semestre'            => 4,
            'creditos_acumulados' => 0,
        ]);
        $inscripcion = Inscripcion::create([
            'alumno_id'        => $alumno->id,
            'actividad_id'     => $actividadId,
            'horas_acumuladas' => 0,
            'estatus'          => 'en_curso',
        ]);
        return [$alumno, $inscripcion];
    }

    public function test_docente_puede_ver_sus_grupos(): void
    {
        [$user, $docente] = $this->crearDocente();
        Actividad::create([
            'docente_id'   => $docente->id,
            'nombre'       => 'Taller de Yoga',
            'descripcion'  => 'Yoga básico',
            'creditos'     => 1,
            'cupo_maximo'  => 30,
            'horario'      => 'Lun 10:00',
            'tipo_periodo' => 'semestral',
        ]);

        $response = $this->actingAs($user)->get('/grupos');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Docente/Grupos')
            ->has('grupos', 1)
            ->where('grupos.0.nombre', 'Taller de Yoga')
        );
    }

    public function test_grupos_incluyen_alumnos_con_porcentaje_asistencia(): void
    {
        [$user, $docente] = $this->crearDocente();
        $actividad = Actividad::create([
            'docente_id'   => $docente->id,
            'nombre'       => 'Taller de Danza',
            'descripcion'  => 'Danza folklórica',
            'creditos'     => 1,
            'cupo_maximo'  => 30,
            'horario'      => 'Lun 10:00',
            'tipo_periodo' => 'semestral',
        ]);
        [, $inscripcion] = $this->crearAlumnoInscrito($actividad->id);

        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-01', 'asistio' => true]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-02', 'asistio' => false]);

        $response = $this->actingAs($user)->get('/grupos');

        $response->assertInertia(fn ($page) => $page
            ->where('alumnosPorGrupo.' . $actividad->id . '.0.porcentaje_asistencia', 50)
        );
    }

    public function test_no_docente_es_redirigido_al_dashboard(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);

        $this->actingAs($user)->get('/grupos')
            ->assertRedirect(route('dashboard'));
    }
}
```

- [ ] **Step 2: Correr pruebas para verificar que fallan**

```bash
php artisan test tests/Feature/DocenteGruposTest.php
```

Resultado esperado: FAIL — controller no existe.

- [ ] **Step 3: Crear el controlador**

Crear `app/Http/Controllers/DocenteGruposController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocenteGruposController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'docente' || !$user->docente) {
            return redirect()->route('dashboard');
        }

        $actividades = Actividad::with(['alumnos', 'alumnos.inscripciones.asistencias'])
            ->where('docente_id', $user->docente->id)
            ->get();

        $grupos = $actividades->map(fn ($act) => [
            'id'         => $act->id,
            'nombre'     => $act->nombre,
            'tipo'       => $this->resolverTipo($act->nombre),
            'horario'    => $act->horario,
            'creditos'   => $act->creditos,
            'cupo_maximo'=> $act->cupo_maximo,
            'inscritos'  => $act->alumnos->filter(
                fn ($al) => in_array($al->pivot->estatus, ['inscrito', 'en_curso', 'acreditado'])
            )->count(),
            'activo'     => $act->alumnos->contains(
                fn ($al) => $al->pivot->estatus === 'en_curso'
            ),
        ])->values()->toArray();

        $alumnosPorGrupo = [];
        foreach ($actividades as $actividad) {
            $alumnosPorGrupo[$actividad->id] = $actividad->alumnos
                ->filter(fn ($al) => in_array($al->pivot->estatus, ['inscrito', 'en_curso', 'acreditado']))
                ->map(function ($alumno) use ($actividad) {
                    $inscripcion = $alumno->inscripciones->firstWhere('actividad_id', $actividad->id);
                    $asistencias = $inscripcion?->asistencias ?? collect();
                    $total    = $asistencias->count();
                    $asistidas = $asistencias->where('asistio', true)->count();
                    return [
                        'matricula'            => $alumno->matricula,
                        'nombre'               => "{$alumno->nombre} {$alumno->apellido_paterno} {$alumno->apellido_materno}",
                        'carrera'              => $alumno->carrera,
                        'semestre'             => $alumno->semestre,
                        'porcentaje_asistencia'=> $total > 0 ? (int) round($asistidas / $total * 100) : 0,
                        'estatus'              => $alumno->pivot->estatus,
                    ];
                })->values()->toArray();
        }

        return Inertia::render('Docente/Grupos', [
            'grupos'          => $grupos,
            'alumnosPorGrupo' => $alumnosPorGrupo,
        ]);
    }

    private function resolverTipo(string $nombre): string
    {
        $lower = mb_strtolower($nombre, 'UTF-8');
        return (str_contains($lower, 'yoga') || str_contains($lower, 'basquet') || str_contains($lower, 'deport'))
            ? 'deportiva'
            : 'cultural';
    }
}
```

- [ ] **Step 4: Actualizar ruta en `routes/web.php`**

Localizar la línea:
```php
Route::get('/grupos',       fn () => Inertia::render('Docente/Grupos'))->name('grupos.index');
```

Reemplazar con:
```php
Route::get('/grupos', [DocenteGruposController::class, 'index'])->name('grupos.index');
```

Agregar el import al bloque de `use` al inicio del archivo:
```php
use App\Http\Controllers\DocenteGruposController;
```

- [ ] **Step 5: Correr pruebas**

```bash
php artisan test tests/Feature/DocenteGruposTest.php
```

Resultado esperado: 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/DocenteGruposController.php tests/Feature/DocenteGruposTest.php routes/web.php
git commit -m "feat: implementar DocenteGruposController con datos reales"
```

---

### Task 3: Conectar Grupos.jsx a props de Inertia

**Files:**
- Modify: `resources/js/Pages/Docente/Grupos.jsx`

- [ ] **Step 1: Reemplazar constantes hardcodeadas por props**

En `resources/js/Pages/Docente/Grupos.jsx`:

1. Eliminar las constantes `GRUPOS` y `ALUMNOS` al inicio del archivo.

2. Cambiar la firma del componente y el estado inicial:

```jsx
export default function Grupos({ grupos, alumnosPorGrupo }) {
    const [grupoActivo, setGrupoActivo] = useState(grupos[0] ?? null);
    const alumnos = grupoActivo ? (alumnosPorGrupo[grupoActivo.id] ?? []) : [];
```

3. Actualizar `ESTATUS_COLOR` y `ESTATUS_LABEL` para usar los valores del backend:

```jsx
const ESTATUS_COLOR = {
    'acreditado': 'bg-green-100 text-green-700',
    'en_curso':   'bg-amber-100 text-amber-700',
    'inscrito':   'bg-blue-100 text-blue-700',
    'reprobado':  'bg-red-100 text-red-600',
};
const ESTATUS_LABEL = {
    'acreditado': 'Acreditado',
    'en_curso':   'En Curso',
    'inscrito':   'Inscrito',
    'reprobado':  'Reprobado',
};
```

4. En el panel izquierdo, `g.cupo` → `g.cupo_maximo`:

```jsx
<span>{g.inscritos}/{g.cupo_maximo} alumnos</span>
```

5. En el tbody de alumnos, `a.asistencia` → `a.porcentaje_asistencia`:

```jsx
<AsistenciaBar pct={a.porcentaje_asistencia} />
```

- [ ] **Step 2: Verificar en navegador**

Con `composer run dev` activo, entrar como `docente@tescha.edu.mx` / `saac1234` y navegar a `/grupos`. Debe mostrar los grupos reales del docente (vacío si aún no tiene inscripciones — es correcto). Si corres `php artisan migrate:fresh --seed` primero, verás datos reales.

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Docente/Grupos.jsx
git commit -m "feat: conectar Docente/Grupos.jsx a props de Inertia"
```

---

### Task 4: DocenteExpedientesController + ruta

**Files:**
- Create: `app/Http/Controllers/DocenteExpedientesController.php`
- Create: `tests/Feature/DocenteExpedientesTest.php`
- Modify: `routes/web.php`

- [ ] **Step 1: Escribir las pruebas que fallarán**

Crear `tests/Feature/DocenteExpedientesTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\Asistencia;
use App\Models\Actividad;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocenteExpedientesTest extends TestCase
{
    use RefreshDatabase;

    public function test_docente_puede_ver_expedientes_de_sus_alumnos(): void
    {
        $user = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id'          => $user->id,
            'numero_empleado'  => 'DOC99002',
            'nombre'           => 'María',
            'apellido_paterno' => 'López',
            'apellido_materno' => 'Soto',
        ]);
        $actividad = Actividad::create([
            'docente_id'   => $docente->id,
            'nombre'       => 'Club de Robótica',
            'descripcion'  => 'Robótica avanzada',
            'creditos'     => 2,
            'cupo_maximo'  => 15,
            'horario'      => 'Sáb 09:00',
            'tipo_periodo' => 'semestral',
        ]);
        $userAlumno = User::factory()->create(['rol' => 'alumno']);
        $alumno = Alumno::create([
            'user_id'             => $userAlumno->id,
            'matricula'           => '210500',
            'nombre'              => 'Pedro',
            'apellido_paterno'    => 'Ruiz',
            'apellido_materno'    => 'Vega',
            'carrera'             => 'IDS',
            'semestre'            => 6,
            'creditos_acumulados' => 0,
        ]);
        $inscripcion = Inscripcion::create([
            'alumno_id'        => $alumno->id,
            'actividad_id'     => $actividad->id,
            'horas_acumuladas' => 0,
            'estatus'          => 'en_curso',
        ]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-01', 'asistio' => true]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-03', 'asistio' => true]);
        Asistencia::create(['inscripcion_id' => $inscripcion->id, 'fecha' => '2026-03-05', 'asistio' => false]);

        $response = $this->actingAs($user)->get('/expedientes');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Docente/Expedientes')
            ->has('expedientes', 1)
            ->where('expedientes.0.matricula', '210500')
            ->where('expedientes.0.sesiones.total', 3)
            ->where('expedientes.0.sesiones.cursadas', 2)
            ->where('expedientes.0.porcentaje_asistencia', 67)
        );
    }

    public function test_expedientes_devuelve_nombres_de_actividades(): void
    {
        $user = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $user->id, 'numero_empleado' => 'DOC99003',
            'nombre' => 'Test', 'apellido_paterno' => 'Test', 'apellido_materno' => 'Test',
        ]);
        Actividad::create([
            'docente_id' => $docente->id, 'nombre' => 'Taller de Ajedrez',
            'descripcion' => 'Ajedrez', 'creditos' => 1, 'cupo_maximo' => 10,
            'horario' => 'Lun', 'tipo_periodo' => 'semestral',
        ]);

        $response = $this->actingAs($user)->get('/expedientes');

        $response->assertInertia(fn ($page) => $page
            ->where('actividades.0', 'Taller de Ajedrez')
        );
    }

    public function test_no_docente_es_redirigido(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $this->actingAs($user)->get('/expedientes')->assertRedirect(route('dashboard'));
    }
}
```

- [ ] **Step 2: Correr pruebas para verificar que fallan**

```bash
php artisan test tests/Feature/DocenteExpedientesTest.php
```

Resultado esperado: FAIL.

- [ ] **Step 3: Crear el controlador**

Crear `app/Http/Controllers/DocenteExpedientesController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocenteExpedientesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'docente' || !$user->docente) {
            return redirect()->route('dashboard');
        }

        $actividades = Actividad::with(['alumnos', 'alumnos.inscripciones.asistencias'])
            ->where('docente_id', $user->docente->id)
            ->get();

        $expedientes = [];
        foreach ($actividades as $actividad) {
            foreach ($actividad->alumnos as $alumno) {
                $inscripcion = $alumno->inscripciones->firstWhere('actividad_id', $actividad->id);
                if (!$inscripcion) continue;
                $asistencias = $inscripcion->asistencias;
                $total    = $asistencias->count();
                $cursadas = $asistencias->where('asistio', true)->count();
                $expedientes[] = [
                    'matricula'             => $alumno->matricula,
                    'nombre'                => "{$alumno->nombre} {$alumno->apellido_paterno} {$alumno->apellido_materno}",
                    'carrera'               => $alumno->carrera,
                    'semestre'              => $alumno->semestre,
                    'nombre_actividad'      => $actividad->nombre,
                    'tipo'                  => $this->resolverTipo($actividad->nombre),
                    'sesiones'              => ['total' => $total, 'cursadas' => $cursadas],
                    'porcentaje_asistencia' => $total > 0 ? (int) round($cursadas / $total * 100) : 0,
                    'estatus'               => $alumno->pivot->estatus,
                    'creditos'              => $actividad->creditos,
                ];
            }
        }

        return Inertia::render('Docente/Expedientes', [
            'expedientes' => $expedientes,
            'actividades' => $actividades->pluck('nombre')->values()->toArray(),
        ]);
    }

    private function resolverTipo(string $nombre): string
    {
        $lower = mb_strtolower($nombre, 'UTF-8');
        return (str_contains($lower, 'yoga') || str_contains($lower, 'basquet') || str_contains($lower, 'deport'))
            ? 'deportiva'
            : 'cultural';
    }
}
```

- [ ] **Step 4: Actualizar ruta en `routes/web.php`**

Localizar:
```php
Route::get('/expedientes',  fn () => Inertia::render('Docente/Expedientes'))->name('expedientes.index');
```

Reemplazar con:
```php
Route::get('/expedientes', [DocenteExpedientesController::class, 'index'])->name('expedientes.index');
```

Agregar import:
```php
use App\Http\Controllers\DocenteExpedientesController;
```

- [ ] **Step 5: Correr pruebas**

```bash
php artisan test tests/Feature/DocenteExpedientesTest.php
```

Resultado esperado: 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/DocenteExpedientesController.php tests/Feature/DocenteExpedientesTest.php routes/web.php
git commit -m "feat: implementar DocenteExpedientesController con datos reales"
```

---

### Task 5: Conectar Expedientes.jsx a props de Inertia

**Files:**
- Modify: `resources/js/Pages/Docente/Expedientes.jsx`

- [ ] **Step 1: Reemplazar constante hardcodeada y activar filtros reactivos**

En `resources/js/Pages/Docente/Expedientes.jsx`:

1. Eliminar la constante `EXPEDIENTES` hardcodeada al inicio.

2. Cambiar imports al inicio del archivo:

```jsx
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';
import { SearchIcon } from '@/Components/Icons';
```

3. Actualizar `ESTATUS_STYLE` y `ESTATUS_LABEL` para usar valores del backend:

```jsx
const ESTATUS_STYLE = {
    'acreditado': 'bg-green-100 text-green-700',
    'en_curso':   'bg-amber-100 text-amber-700',
    'inscrito':   'bg-blue-100 text-blue-700',
    'reprobado':  'bg-red-100 text-red-600',
};
const ESTATUS_LABEL = {
    'acreditado': 'Acreditado',
    'en_curso':   'En Curso',
    'inscrito':   'Inscrito',
    'reprobado':  'Reprobado',
};
```

4. Cambiar la firma del componente y agregar estado de filtros:

```jsx
export default function Expedientes({ expedientes, actividades }) {
    const [search, setSearch] = useState('');
    const [filtroActividad, setFiltroActividad] = useState('');
    const [filtroEstatus, setFiltroEstatus] = useState('');

    const expedientesFiltrados = useMemo(() => {
        return expedientes.filter((exp) => {
            const matchSearch = !search ||
                exp.nombre.toLowerCase().includes(search.toLowerCase()) ||
                exp.matricula.includes(search);
            const matchActividad = !filtroActividad || exp.nombre_actividad === filtroActividad;
            const matchEstatus = !filtroEstatus || ESTATUS_LABEL[exp.estatus] === filtroEstatus;
            return matchSearch && matchActividad && matchEstatus;
        });
    }, [expedientes, search, filtroActividad, filtroEstatus]);
```

5. Conectar el toolbar a los estados (dentro del return, en el input y los selects):

```jsx
<input
    type="search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Buscar alumno o matrícula..."
    className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
/>
<select
    value={filtroActividad}
    onChange={(e) => setFiltroActividad(e.target.value)}
    className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none"
>
    <option value="">Todas las actividades</option>
    {actividades.map((act) => <option key={act}>{act}</option>)}
</select>
<select
    value={filtroEstatus}
    onChange={(e) => setFiltroEstatus(e.target.value)}
    className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none"
>
    <option value="">Todos los estatus</option>
    <option>Acreditado</option>
    <option>En Curso</option>
    <option>Inscrito</option>
    <option>Reprobado</option>
</select>
```

6. Reemplazar `EXPEDIENTES.map(...)` por `expedientesFiltrados.map(...)` en el tbody.

7. En la columna Asistencia, `exp.asistencia` → `exp.porcentaje_asistencia`:

```jsx
<AsistenciaBar pct={exp.porcentaje_asistencia} />
```

8. Actualizar la alerta de riesgo:

```jsx
{expedientes.some((e) => e.porcentaje_asistencia < 60 && e.estatus === 'en_curso') && (
```

9. Actualizar el footer:

```jsx
<p className="text-xs text-gray-400">Mostrando {expedientesFiltrados.length} registros</p>
```

- [ ] **Step 2: Verificar en navegador**

Entrar como docente, navegar a `/expedientes`. Verificar filtros y búsqueda.

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Docente/Expedientes.jsx
git commit -m "feat: conectar Docente/Expedientes.jsx a props de Inertia con filtros"
```

---

### Task 6: AdminAlumnosController + ruta

**Files:**
- Create: `app/Http/Controllers/AdminAlumnosController.php`
- Create: `tests/Feature/AdminAlumnosTest.php`
- Modify: `routes/web.php`

- [ ] **Step 1: Escribir las pruebas que fallarán**

Crear `tests/Feature/AdminAlumnosTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAlumnosTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['rol' => 'administrador']);
    }

    private function alumno(array $attrs = []): Alumno
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        return Alumno::create(array_merge([
            'user_id'             => $user->id,
            'matricula'           => '210' . rand(100, 999),
            'nombre'              => 'Test',
            'apellido_paterno'    => 'Apellido',
            'apellido_materno'    => 'Materno',
            'carrera'             => 'ISC',
            'semestre'            => 4,
            'creditos_acumulados' => 0,
        ], $attrs));
    }

    public function test_admin_puede_ver_lista_de_alumnos(): void
    {
        $admin = $this->admin();
        $this->alumno(['creditos_acumulados' => 5]);
        $this->alumno(['creditos_acumulados' => 3]);

        $response = $this->actingAs($admin)->get('/admin/alumnos');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Alumnos')
            ->has('alumnos.data', 2)
            ->where('kpis.total', 2)
            ->where('kpis.acreditados', 1)
        );
    }

    public function test_admin_puede_filtrar_por_carrera(): void
    {
        $admin = $this->admin();
        $this->alumno(['carrera' => 'ISC']);
        $this->alumno(['carrera' => 'IGE']);

        $response = $this->actingAs($admin)->get('/admin/alumnos?carrera=ISC');

        $response->assertInertia(fn ($page) => $page->has('alumnos.data', 1));
    }

    public function test_admin_puede_filtrar_por_estatus_acreditado(): void
    {
        $admin = $this->admin();
        $this->alumno(['creditos_acumulados' => 5]);
        $this->alumno(['creditos_acumulados' => 2]);

        $response = $this->actingAs($admin)->get('/admin/alumnos?estatus=Acreditado');

        $response->assertInertia(fn ($page) => $page->has('alumnos.data', 1));
    }

    public function test_admin_puede_actualizar_creditos(): void
    {
        $admin = $this->admin();
        $alumno = $this->alumno(['creditos_acumulados' => 2]);

        $response = $this->actingAs($admin)->patch("/admin/alumnos/{$alumno->id}", [
            'creditos_acumulados' => 4,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('alumnos', ['id' => $alumno->id, 'creditos_acumulados' => 4]);
    }

    public function test_creditos_mayores_a_10_son_rechazados(): void
    {
        $admin  = $this->admin();
        $alumno = $this->alumno();

        $this->actingAs($admin)->patch("/admin/alumnos/{$alumno->id}", [
            'creditos_acumulados' => 15,
        ])->assertSessionHasErrors('creditos_acumulados');
    }

    public function test_no_admin_es_redirigido(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $this->actingAs($user)->get('/admin/alumnos')->assertRedirect(route('dashboard'));
    }
}
```

- [ ] **Step 2: Correr pruebas para verificar que fallan**

```bash
php artisan test tests/Feature/AdminAlumnosTest.php
```

Resultado esperado: FAIL.

- [ ] **Step 3: Crear el controlador**

Crear `app/Http/Controllers/AdminAlumnosController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAlumnosController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $todos = Alumno::all();
        $kpis = [
            'total'       => $todos->count(),
            'acreditados' => $todos->where('creditos_acumulados', '>=', 5)->count(),
            'en_progreso' => $todos->whereBetween('creditos_acumulados', [1, 4])->count(),
        ];

        $query = Alumno::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('apellido_paterno', 'like', "%{$search}%")
                  ->orWhere('matricula', 'like', "%{$search}%");
            });
        }

        if ($carrera = $request->input('carrera')) {
            $query->where('carrera', $carrera);
        }

        if ($estatus = $request->input('estatus')) {
            match ($estatus) {
                'Acreditado'  => $query->where('creditos_acumulados', '>=', 5),
                'En Progreso' => $query->whereBetween('creditos_acumulados', [1, 4]),
                'Sin Iniciar' => $query->where('creditos_acumulados', 0),
                default       => null,
            };
        }

        $alumnos = $query->paginate(20)->through(fn ($al) => [
            'id'                  => $al->id,
            'matricula'           => $al->matricula,
            'nombre'              => "{$al->nombre} {$al->apellido_paterno} {$al->apellido_materno}",
            'carrera'             => $al->carrera,
            'semestre'            => $al->semestre,
            'creditos_acumulados' => $al->creditos_acumulados,
            'meta'                => 5,
            'estatus'             => match (true) {
                $al->creditos_acumulados >= 5 => 'Acreditado',
                $al->creditos_acumulados > 0  => 'En Progreso',
                default                       => 'Sin Iniciar',
            },
        ]);

        return Inertia::render('Admin/Alumnos', [
            'alumnos' => $alumnos,
            'kpis'    => $kpis,
            'filters' => $request->only(['search', 'carrera', 'estatus']),
        ]);
    }

    public function updateCreditos(Request $request, Alumno $alumno)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'creditos_acumulados' => ['required', 'integer', 'min:0', 'max:10'],
        ]);

        $alumno->update($validated);

        return redirect()->back()->with('success', 'Créditos actualizados correctamente.');
    }
}
```

- [ ] **Step 4: Actualizar rutas en `routes/web.php`**

Localizar:
```php
Route::get('/admin/alumnos',     fn () => Inertia::render('Admin/Alumnos'))->name('admin.alumnos');
```

Reemplazar con:
```php
Route::get('/admin/alumnos', [AdminAlumnosController::class, 'index'])->name('admin.alumnos');
Route::patch('/admin/alumnos/{alumno}', [AdminAlumnosController::class, 'updateCreditos'])->name('admin.alumnos.update');
```

Agregar import:
```php
use App\Http\Controllers\AdminAlumnosController;
```

- [ ] **Step 5: Correr pruebas**

```bash
php artisan test tests/Feature/AdminAlumnosTest.php
```

Resultado esperado: 6 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/AdminAlumnosController.php tests/Feature/AdminAlumnosTest.php routes/web.php
git commit -m "feat: implementar AdminAlumnosController con filtros y edición de créditos"
```

---

### Task 7: Conectar Admin/Alumnos.jsx con modal de edición

**Files:**
- Modify: `resources/js/Pages/Admin/Alumnos.jsx`

- [ ] **Step 1: Agregar imports y cambiar firma del componente**

En `resources/js/Pages/Admin/Alumnos.jsx`, reemplazar los imports al inicio:

```jsx
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head, useForm, router } from '@inertiajs/react';
import { UsersIcon, CheckCircleIcon, ClipboardIcon, SearchIcon } from '@/Components/Icons';
```

(Nota: eliminar `PlusIcon` — el botón "Agregar Alumno" se elimina en este task.)

Eliminar las constantes `ALUMNOS` y `CARRERAS` hardcodeadas.

Cambiar la firma del componente:

```jsx
export default function Alumnos({ alumnos, kpis, filters }) {
    const [editando, setEditando] = useState(null);
    const [search, setSearch]   = useState(filters?.search ?? '');
    const [carrera, setCarrera] = useState(filters?.carrera ?? '');
    const [estatus, setEstatus] = useState(filters?.estatus ?? '');

    const { data, setData, patch, processing, errors, reset } = useForm({
        creditos_acumulados: '',
    });

    const aplicarFiltro = (nuevosFiltros) => {
        router.get(route('admin.alumnos'), nuevosFiltros, { preserveState: true, replace: true });
    };

    const abrirEditar = (alumno) => {
        setEditando(alumno);
        setData('creditos_acumulados', alumno.creditos_acumulados);
    };

    const cerrarEditar = () => { setEditando(null); reset(); };

    const guardarCreditos = (e) => {
        e.preventDefault();
        patch(route('admin.alumnos.update', editando.id), { onSuccess: cerrarEditar });
    };
```

- [ ] **Step 2: Conectar KPIs reales**

Reemplazar las dos líneas `const acreditados = ...` y `const enProgreso = ...` calculadas del array hardcodeado por props directas en los StatCard:

```jsx
<StatCard label="Total de Alumnos"     value={kpis.total.toString()}       sub="Registrados en el sistema" icon={UsersIcon} />
<StatCard label="Créditos Acreditados" value={kpis.acreditados.toString()} sub="Requisito cumplido"        icon={CheckCircleIcon} accent="green" />
<StatCard label="En Progreso"          value={kpis.en_progreso.toString()}  sub="Requieren seguimiento"    icon={ClipboardIcon} accent="amber" />
```

- [ ] **Step 3: Conectar filtros al servidor**

Reemplazar los inputs del toolbar:

```jsx
<input
    type="search"
    value={search}
    onChange={(e) => { setSearch(e.target.value); aplicarFiltro({ search: e.target.value, carrera, estatus }); }}
    placeholder="Buscar por nombre o matrícula..."
    className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
/>
<select
    value={carrera}
    onChange={(e) => { setCarrera(e.target.value); aplicarFiltro({ search, carrera: e.target.value, estatus }); }}
    className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none"
>
    <option value="">Todas las Carreras</option>
    {['ISC', 'IGE', 'IDS'].map((c) => <option key={c}>{c}</option>)}
</select>
<select
    value={estatus}
    onChange={(e) => { setEstatus(e.target.value); aplicarFiltro({ search, carrera, estatus: e.target.value }); }}
    className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none"
>
    <option value="">Todos los Estatus</option>
    <option>Acreditado</option>
    <option>En Progreso</option>
    <option>Sin Iniciar</option>
</select>
```

- [ ] **Step 4: Conectar la tabla a `alumnos.data` con paginación**

En el tbody, reemplazar `ALUMNOS.map(...)` por `alumnos.data.map(...)`.

En el botón "Editar":
```jsx
<button onClick={() => abrirEditar(alumno)} ...>Editar</button>
```

Eliminar el botón "Ver" — no hay ruta de detalle aún.

Reemplazar el footer de paginación:

```jsx
<div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
    <p className="text-xs text-gray-400">
        Mostrando {alumnos.from ?? 0}–{alumnos.to ?? 0} de {alumnos.total} alumnos
    </p>
    <div className="flex gap-1">
        {alumnos.links.map((link, i) => (
            <button
                key={i}
                disabled={!link.url}
                onClick={() => link.url && router.get(link.url)}
                className={[
                    'h-7 min-w-[28px] rounded-md px-2 text-xs font-medium transition-colors',
                    link.active
                        ? 'bg-guinda text-white'
                        : 'text-gray-500 hover:bg-cream-200 disabled:opacity-40',
                ].join(' ')}
                dangerouslySetInnerHTML={{ __html: link.label }}
            />
        ))}
    </div>
</div>
```

- [ ] **Step 5: Agregar modal de edición de créditos**

Agregar antes del cierre del div principal del componente (antes de `</AuthenticatedLayout>`):

```jsx
{editando && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-gray-800">Editar créditos</h3>
            <p className="mb-4 text-sm text-gray-500">{editando.nombre}</p>
            <form onSubmit={guardarCreditos} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Créditos acumulados (0–10)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        value={data.creditos_acumulados}
                        onChange={(e) => setData('creditos_acumulados', parseInt(e.target.value))}
                        className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                    />
                    {errors.creditos_acumulados && (
                        <p className="mt-1 text-xs text-red-500">{errors.creditos_acumulados}</p>
                    )}
                </div>
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={cerrarEditar}
                        className="rounded-lg border border-cream-400 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-cream-100">
                        Cancelar
                    </button>
                    <button type="submit" disabled={processing} className="btn-guinda">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
)}
```

- [ ] **Step 6: Eliminar el botón "Agregar Alumno"**

Localizar y eliminar el botón del header (el flujo de creación lo maneja el módulo de invitaciones):

```jsx
// Eliminar:
// <button className="btn-guinda flex-shrink-0">
//     <PlusIcon /> Agregar Alumno
// </button>
```

- [ ] **Step 7: Verificar en navegador**

Entrar como admin a `/admin/alumnos`. Verificar tabla con datos reales, filtros, paginación, y que el modal de edición abre y guarda.

- [ ] **Step 8: Commit**

```bash
git add resources/js/Pages/Admin/Alumnos.jsx
git commit -m "feat: conectar Admin/Alumnos.jsx con paginación, filtros y modal de edición"
```

---

### Task 8: AdminConstanciasController + ruta

**Files:**
- Create: `app/Http/Controllers/AdminConstanciasController.php`
- Create: `tests/Feature/AdminConstanciasTest.php`
- Modify: `routes/web.php`

- [ ] **Step 1: Escribir las pruebas que fallarán**

Crear `tests/Feature/AdminConstanciasTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\Actividad;
use App\Models\Alumno;
use App\Models\Docente;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminConstanciasTest extends TestCase
{
    use RefreshDatabase;

    private function setup_actividad(): array
    {
        $docenteUser = User::factory()->create(['rol' => 'docente']);
        $docente = Docente::create([
            'user_id' => $docenteUser->id, 'numero_empleado' => 'DOC00001',
            'nombre' => 'Prof', 'apellido_paterno' => 'Test', 'apellido_materno' => 'Test',
        ]);
        $actividad = Actividad::create([
            'docente_id' => $docente->id, 'nombre' => 'Danza Folklórica',
            'descripcion' => 'desc', 'creditos' => 1, 'cupo_maximo' => 10,
            'horario' => 'Lun', 'tipo_periodo' => 'semestral',
        ]);
        return [$docente, $actividad];
    }

    private function setup_alumno(): Alumno
    {
        $userAlumno = User::factory()->create(['rol' => 'alumno']);
        return Alumno::create([
            'user_id' => $userAlumno->id, 'matricula' => '210001',
            'nombre' => 'Ana', 'apellido_paterno' => 'García', 'apellido_materno' => 'López',
            'carrera' => 'ISC', 'semestre' => 4, 'creditos_acumulados' => 1,
        ]);
    }

    public function test_no_muestra_inscripciones_sin_constancia(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        [, $actividad] = $this->setup_actividad();
        $alumno = $this->setup_alumno();
        Inscripcion::create([
            'alumno_id' => $alumno->id, 'actividad_id' => $actividad->id,
            'horas_acumuladas' => 20, 'estatus' => 'en_curso', 'ruta_constancia' => null,
        ]);

        $response = $this->actingAs($admin)->get('/admin/constancias');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Constancias')
            ->has('constancias', 0)
        );
    }

    public function test_muestra_inscripciones_con_constancia(): void
    {
        $admin = User::factory()->create(['rol' => 'administrador']);
        [, $actividad] = $this->setup_actividad();
        $alumno = $this->setup_alumno();
        Inscripcion::create([
            'alumno_id' => $alumno->id, 'actividad_id' => $actividad->id,
            'horas_acumuladas' => 24, 'estatus' => 'acreditado',
            'ruta_constancia' => 'constancias/abc123.pdf',
        ]);

        $response = $this->actingAs($admin)->get('/admin/constancias');

        $response->assertInertia(fn ($page) => $page
            ->has('constancias', 1)
            ->where('constancias.0.matricula', '210001')
            ->where('kpis.total', 1)
            ->where('kpis.alumnos_cubiertos', 1)
        );
    }

    public function test_no_admin_es_redirigido(): void
    {
        $user = User::factory()->create(['rol' => 'alumno']);
        $this->actingAs($user)->get('/admin/constancias')->assertRedirect(route('dashboard'));
    }
}
```

- [ ] **Step 2: Correr pruebas para verificar que fallan**

```bash
php artisan test tests/Feature/AdminConstanciasTest.php
```

Resultado esperado: FAIL.

- [ ] **Step 3: Crear el controlador**

Crear `app/Http/Controllers/AdminConstanciasController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminConstanciasController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $query = Inscripcion::with(['alumno', 'actividad'])
            ->whereNotNull('ruta_constancia');

        if ($search = $request->input('search')) {
            $query->whereHas('alumno', fn ($q) => $q
                ->where('nombre', 'like', "%{$search}%")
                ->orWhere('apellido_paterno', 'like', "%{$search}%")
                ->orWhere('matricula', 'like', "%{$search}%")
            );
        }

        if ($tipo = $request->input('tipo')) {
            $query->whereHas('actividad', fn ($q) => $q->where('nombre', 'like', "%{$tipo}%"));
        }

        $inscripciones = $query->orderBy('updated_at', 'desc')->get();

        $constancias = $inscripciones->map(fn ($ins) => [
            'folio'           => 'CON-' . $ins->updated_at->year . '-' . str_pad($ins->id, 4, '0', STR_PAD_LEFT),
            'nombre'          => "{$ins->alumno->nombre} {$ins->alumno->apellido_paterno} {$ins->alumno->apellido_materno}",
            'matricula'       => $ins->alumno->matricula,
            'carrera'         => $ins->alumno->carrera,
            'actividad'       => $ins->actividad->nombre,
            'tipo'            => $this->resolverTipo($ins->actividad->nombre),
            'creditos'        => $ins->actividad->creditos,
            'fecha'           => $ins->updated_at->format('Y-m-d'),
            'ruta_constancia' => $ins->ruta_constancia,
        ])->values()->toArray();

        $kpis = [
            'total'            => $inscripciones->count(),
            'alumnos_cubiertos'=> $inscripciones->pluck('alumno_id')->unique()->count(),
        ];

        return Inertia::render('Admin/Constancias', [
            'constancias' => $constancias,
            'kpis'        => $kpis,
            'filters'     => $request->only(['search', 'tipo']),
        ]);
    }

    private function resolverTipo(string $nombre): string
    {
        $lower = mb_strtolower($nombre, 'UTF-8');
        return (str_contains($lower, 'yoga') || str_contains($lower, 'basquet') || str_contains($lower, 'deport'))
            ? 'deportiva'
            : 'cultural';
    }
}
```

- [ ] **Step 4: Actualizar ruta en `routes/web.php`**

Localizar:
```php
Route::get('/admin/constancias', fn () => Inertia::render('Admin/Constancias'))->name('admin.constancias');
```

Reemplazar con:
```php
Route::get('/admin/constancias', [AdminConstanciasController::class, 'index'])->name('admin.constancias');
```

Agregar import:
```php
use App\Http\Controllers\AdminConstanciasController;
```

- [ ] **Step 5: Correr pruebas**

```bash
php artisan test tests/Feature/AdminConstanciasTest.php
```

Resultado esperado: 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/AdminConstanciasController.php tests/Feature/AdminConstanciasTest.php routes/web.php
git commit -m "feat: implementar AdminConstanciasController vista de auditoría"
```

---

### Task 9: Conectar Admin/Constancias.jsx

**Files:**
- Modify: `resources/js/Pages/Admin/Constancias.jsx`

- [ ] **Step 1: Reemplazar constante hardcodeada por props**

En `resources/js/Pages/Admin/Constancias.jsx`:

1. Eliminar la constante `CONSTANCIAS` hardcodeada.

2. Agregar imports al inicio:

```jsx
import { useState } from 'react';
import { router } from '@inertiajs/react';
```

3. Cambiar la firma del componente:

```jsx
export default function Constancias({ constancias, kpis, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [tipo, setTipo]     = useState(filters?.tipo ?? '');

    const aplicarFiltro = (nuevosFiltros) => {
        router.get(route('admin.constancias'), nuevosFiltros, { preserveState: true, replace: true });
    };
```

Eliminar las líneas `const emitidas = ...` y `const pendientes = ...`.

4. Conectar KPIs reales:

```jsx
<StatCard label="Total Emitidas"     value={kpis.total.toString()}             sub="Este ciclo escolar"         icon={DocumentIcon} />
<StatCard label="Pendientes"         value="0"                                  sub="Sin constancias pendientes" icon={CheckCircleIcon} accent="amber" />
<StatCard label="Alumnos Cubiertos"  value={kpis.alumnos_cubiertos.toString()} sub="Crédito cumplido"           icon={UsersIcon} accent="green" />
```

5. Conectar el input de búsqueda:

```jsx
<input
    type="search"
    value={search}
    onChange={(e) => { setSearch(e.target.value); aplicarFiltro({ search: e.target.value, tipo }); }}
    placeholder="Buscar por folio, alumno o matrícula..."
    ...
/>
```

6. Conectar el select de tipo:

```jsx
<select
    value={tipo}
    onChange={(e) => { setTipo(e.target.value); aplicarFiltro({ search, tipo: e.target.value }); }}
    ...
>
    <option value="">Todos los tipos</option>
    <option value="yoga">Deportiva</option>
    <option value="danza">Cultural</option>
</select>
```

7. Reemplazar `CONSTANCIAS.map(...)` por `constancias.map(...)` en el tbody. Actualizar referencias de campos:
- `c.alumno` → `c.nombre`
- `c.actividad` → `c.actividad` (igual)
- El botón "Ver PDF" con enlace real:

```jsx
{c.ruta_constancia && (
    <a
        href={`/storage/${c.ruta_constancia}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-200 hover:text-guinda transition-colors"
    >
        Ver PDF
    </a>
)}
```

8. Actualizar el footer:

```jsx
<p className="text-xs text-gray-400">Mostrando {constancias.length} constancias</p>
```

- [ ] **Step 2: Verificar en navegador**

Entrar como admin a `/admin/constancias`. Si no hay constancias, la tabla muestra vacío — correcto.

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Admin/Constancias.jsx
git commit -m "feat: conectar Admin/Constancias.jsx a datos reales"
```

---

### Task 10: InvitacionController completo + rutas

**Files:**
- Create: `app/Http/Controllers/InvitacionController.php`
- Create: `tests/Feature/InvitacionTest.php`
- Modify: `routes/web.php`

- [ ] **Step 1: Escribir todas las pruebas que fallarán**

Crear `tests/Feature/InvitacionTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\Alumno;
use App\Models\Invitacion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvitacionTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['rol' => 'administrador']);
    }

    // ── Panel admin ──────────────────────────────────────────────────────────

    public function test_admin_puede_ver_lista_de_invitaciones(): void
    {
        $admin = $this->admin();
        Invitacion::create(['email' => 'test@tescha.edu.mx', 'token' => 'abc-123']);

        $this->actingAs($admin)->get('/admin/invitaciones')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Invitaciones')
                ->has('invitaciones', 1)
            );
    }

    public function test_admin_puede_crear_invitacion(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/invitaciones', [
            'email' => 'nuevo@tescha.edu.mx',
        ])->assertRedirect();

        $this->assertDatabaseHas('invitaciones', ['email' => 'nuevo@tescha.edu.mx']);
        $this->assertNotEmpty(Invitacion::first()->token);
    }

    public function test_no_puede_invitar_email_ya_registrado(): void
    {
        $admin = $this->admin();
        User::factory()->create(['email' => 'existente@tescha.edu.mx']);

        $this->actingAs($admin)->post('/admin/invitaciones', [
            'email' => 'existente@tescha.edu.mx',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseMissing('invitaciones', ['email' => 'existente@tescha.edu.mx']);
    }

    public function test_no_puede_invitar_email_con_invitacion_pendiente(): void
    {
        $admin = $this->admin();
        Invitacion::create(['email' => 'pendiente@tescha.edu.mx', 'token' => 'tok-001']);

        $this->actingAs($admin)->post('/admin/invitaciones', [
            'email' => 'pendiente@tescha.edu.mx',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('invitaciones', 1);
    }

    public function test_admin_puede_revocar_invitacion_pendiente(): void
    {
        $admin = $this->admin();
        $inv = Invitacion::create(['email' => 'revocar@tescha.edu.mx', 'token' => 'tok-002']);

        $this->actingAs($admin)->delete("/admin/invitaciones/{$inv->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('invitaciones', ['id' => $inv->id]);
    }

    public function test_no_puede_revocar_invitacion_ya_usada(): void
    {
        $admin = $this->admin();
        $inv = Invitacion::create([
            'email' => 'usada@tescha.edu.mx', 'token' => 'tok-003', 'usado_en' => now(),
        ]);

        $this->actingAs($admin)->delete("/admin/invitaciones/{$inv->id}")
            ->assertRedirect();

        $this->assertDatabaseHas('invitaciones', ['id' => $inv->id]);
    }

    // ── Activación pública ───────────────────────────────────────────────────

    public function test_token_valido_muestra_formulario(): void
    {
        Invitacion::create(['email' => 'alumno@tescha.edu.mx', 'token' => 'valid-token']);

        $this->get('/activar/valid-token')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Auth/ActivarCuenta')
                ->where('email', 'alumno@tescha.edu.mx')
                ->where('tokenInvalido', false)
            );
    }

    public function test_token_inexistente_muestra_error(): void
    {
        $this->get('/activar/token-no-existe')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Auth/ActivarCuenta')
                ->where('tokenInvalido', true)
            );
    }

    public function test_activacion_crea_usuario_y_alumno(): void
    {
        Invitacion::create(['email' => 'nuevo@tescha.edu.mx', 'token' => 'register-token']);

        $this->post('/activar/register-token', [
            'nombre'                => 'María',
            'apellido_paterno'      => 'Soto',
            'apellido_materno'      => 'Vega',
            'matricula'             => '210999',
            'carrera'               => 'ISC',
            'semestre'              => 3,
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('users',   ['email' => 'nuevo@tescha.edu.mx', 'rol' => 'alumno']);
        $this->assertDatabaseHas('alumnos', ['matricula' => '210999']);
        $this->assertNotNull(Invitacion::first()->usado_en);
    }

    public function test_token_ya_usado_rechaza_activacion(): void
    {
        Invitacion::create([
            'email' => 'usado@tescha.edu.mx', 'token' => 'used-token', 'usado_en' => now(),
        ]);

        $this->post('/activar/used-token', [
            'nombre'                => 'Test',
            'apellido_paterno'      => 'Test',
            'apellido_materno'      => 'Test',
            'matricula'             => '211000',
            'carrera'               => 'ISC',
            'semestre'              => 1,
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertRedirect('/activar/used-token');

        $this->assertDatabaseMissing('users', ['email' => 'usado@tescha.edu.mx', 'rol' => 'alumno']);
    }
}
```

- [ ] **Step 2: Correr pruebas para verificar que fallan**

```bash
php artisan test tests/Feature/InvitacionTest.php
```

Resultado esperado: FAIL — rutas no existen.

- [ ] **Step 3: Crear el controlador completo**

Crear `app/Http/Controllers/InvitacionController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use App\Models\Invitacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InvitacionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $invitaciones = Invitacion::orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($inv) => [
                'id'        => $inv->id,
                'email'     => $inv->email,
                'estado'    => $inv->esPendiente() ? 'Pendiente' : 'Activada',
                'creada_en' => $inv->created_at->format('d M Y'),
                'usado_en'  => $inv->usado_en?->format('d M Y'),
            ])
            ->toArray();

        return Inertia::render('Admin/Invitaciones', [
            'invitaciones'   => $invitaciones,
            'invitacion_url' => session('invitacion_url'),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'email' => [
                'required',
                'email',
                function ($attribute, $value, $fail) {
                    if (User::where('email', $value)->exists()) {
                        $fail('Este correo ya tiene una cuenta registrada.');
                    }
                    if (Invitacion::where('email', $value)->whereNull('usado_en')->exists()) {
                        $fail('Ya existe una invitación pendiente para este correo.');
                    }
                },
            ],
        ]);

        $token = (string) Str::uuid();
        Invitacion::create(['email' => $request->email, 'token' => $token]);

        return redirect()->route('admin.invitaciones')
            ->with('invitacion_url', url("/activar/{$token}"));
    }

    public function destroy(Request $request, Invitacion $invitacion)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'administrador') {
            return redirect()->route('dashboard');
        }

        if (!$invitacion->esPendiente()) {
            return redirect()->back()->with('error', 'No se puede revocar una invitación ya utilizada.');
        }

        $invitacion->delete();

        return redirect()->back()->with('success', 'Invitación revocada.');
    }

    public function show(string $token)
    {
        $invitacion = Invitacion::where('token', $token)->first();

        if (!$invitacion || !$invitacion->esPendiente()) {
            return Inertia::render('Auth/ActivarCuenta', [
                'email'         => null,
                'token'         => $token,
                'tokenInvalido' => true,
            ]);
        }

        return Inertia::render('Auth/ActivarCuenta', [
            'email'         => $invitacion->email,
            'token'         => $token,
            'tokenInvalido' => false,
        ]);
    }

    public function activar(Request $request, string $token)
    {
        $invitacion = Invitacion::where('token', $token)->whereNull('usado_en')->first();

        if (!$invitacion) {
            return redirect("/activar/{$token}")
                ->with('error', 'Este enlace ya fue utilizado o no es válido.');
        }

        $validated = $request->validate([
            'nombre'           => ['required', 'string', 'max:100'],
            'apellido_paterno' => ['required', 'string', 'max:100'],
            'apellido_materno' => ['required', 'string', 'max:100'],
            'matricula'        => ['required', 'string', 'max:20', 'unique:alumnos,matricula'],
            'carrera'          => ['required', 'in:ISC,IGE,IDS'],
            'semestre'         => ['required', 'integer', 'between:1,9'],
            'password'         => ['required', 'confirmed', 'min:8'],
        ]);

        DB::transaction(function () use ($validated, $invitacion) {
            $user = User::create([
                'name'     => "{$validated['nombre']} {$validated['apellido_paterno']}",
                'email'    => $invitacion->email,
                'password' => bcrypt($validated['password']),
                'rol'      => 'alumno',
            ]);

            Alumno::create([
                'user_id'             => $user->id,
                'matricula'           => $validated['matricula'],
                'nombre'              => $validated['nombre'],
                'apellido_paterno'    => $validated['apellido_paterno'],
                'apellido_materno'    => $validated['apellido_materno'],
                'carrera'             => $validated['carrera'],
                'semestre'            => $validated['semestre'],
                'creditos_acumulados' => 0,
            ]);

            $invitacion->update(['usado_en' => now()]);

            Auth::login($user);
        });

        return redirect()->route('dashboard');
    }
}
```

- [ ] **Step 4: Agregar rutas en `routes/web.php`**

Dentro del grupo autenticado (junto a las rutas `/admin/*`), agregar:

```php
Route::get('/admin/invitaciones', [InvitacionController::class, 'index'])->name('admin.invitaciones');
Route::post('/admin/invitaciones', [InvitacionController::class, 'store']);
Route::delete('/admin/invitaciones/{invitacion}', [InvitacionController::class, 'destroy'])->name('admin.invitaciones.destroy');
```

Fuera del grupo autenticado (antes del cierre del archivo), agregar:

```php
Route::get('/activar/{token}', [InvitacionController::class, 'show'])->name('invitacion.activar');
Route::post('/activar/{token}', [InvitacionController::class, 'activar'])->name('invitacion.procesar');
```

Agregar import:

```php
use App\Http\Controllers\InvitacionController;
```

- [ ] **Step 5: Correr pruebas**

```bash
php artisan test tests/Feature/InvitacionTest.php
```

Resultado esperado: 9 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/InvitacionController.php tests/Feature/InvitacionTest.php routes/web.php
git commit -m "feat: implementar InvitacionController completo con rutas admin y públicas"
```

---

### Task 11: Invitaciones.jsx y ActivarCuenta.jsx

**Files:**
- Create: `resources/js/Pages/Admin/Invitaciones.jsx`
- Create: `resources/js/Pages/Auth/ActivarCuenta.jsx`
- Modify: `resources/js/Layouts/AuthenticatedLayout.jsx`

- [ ] **Step 1: Crear Invitaciones.jsx**

Crear `resources/js/Pages/Admin/Invitaciones.jsx`:

```jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Invitaciones({ invitaciones, invitacion_url }) {
    const [copiado, setCopiado] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

    const copiarUrl = () => {
        navigator.clipboard.writeText(invitacion_url);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    const enviar = (e) => {
        e.preventDefault();
        post(route('admin.invitaciones'), { onSuccess: reset });
    };

    const revocar = (id) => {
        if (!confirm('¿Revocar esta invitación?')) return;
        router.delete(route('admin.invitaciones.destroy', id));
    };

    return (
        <AuthenticatedLayout header="Invitaciones">
            <Head title="Gestión de Invitaciones" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Invitaciones de Registro</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Genera enlaces de registro para correos institucionales autorizados.
                    </p>
                </div>

                {invitacion_url && (
                    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                        <span className="mt-0.5 text-green-600">✓</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-green-700">Invitación creada — copia y envía este enlace al alumno</p>
                            <p className="mt-1 break-all font-mono text-xs text-green-700">{invitacion_url}</p>
                        </div>
                        <button
                            onClick={copiarUrl}
                            className="flex-shrink-0 rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 transition-colors"
                        >
                            {copiado ? '¡Copiado!' : 'Copiar'}
                        </button>
                    </div>
                )}

                <div className="card p-5">
                    <h2 className="mb-3 text-sm font-semibold text-gray-700">Nueva invitación</h2>
                    <form onSubmit={enviar} className="flex gap-3">
                        <div className="flex-1">
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="correo@tescha.edu.mx"
                                className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <button type="submit" disabled={processing} className="btn-guinda flex-shrink-0">
                            Generar enlace
                        </button>
                    </form>
                </div>

                <div className="card overflow-hidden">
                    <div className="border-b border-cream-400 bg-cream-50 px-5 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Historial de invitaciones
                        </p>
                    </div>
                    {invitaciones.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="font-semibold text-gray-500">Sin invitaciones aún</p>
                            <p className="mt-1 text-xs text-gray-400">Genera el primer enlace con el formulario de arriba.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Correo', 'Generada', 'Estado', 'Activada', 'Acciones'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {invitaciones.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-cream-50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm text-gray-700">{inv.email}</td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500">{inv.creada_en}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                inv.estado === 'Activada'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {inv.estado}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500">{inv.usado_en ?? '—'}</td>
                                        <td className="px-5 py-3.5">
                                            {inv.estado === 'Pendiente' && (
                                                <button
                                                    onClick={() => revocar(inv.id)}
                                                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    Revocar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

- [ ] **Step 2: Crear ActivarCuenta.jsx**

Crear `resources/js/Pages/Auth/ActivarCuenta.jsx`:

```jsx
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

const CARRERAS = ['ISC', 'IGE', 'IDS'];

export default function ActivarCuenta({ email, token, tokenInvalido }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre:                '',
        apellido_paterno:      '',
        apellido_materno:      '',
        matricula:             '',
        carrera:               'ISC',
        semestre:              1,
        password:              '',
        password_confirmation: '',
    });

    const enviar = (e) => {
        e.preventDefault();
        post(route('invitacion.procesar', token));
    };

    if (tokenInvalido) {
        return (
            <GuestLayout>
                <Head title="Enlace inválido" />
                <div className="text-center">
                    <div className="mb-4 text-5xl">⛔</div>
                    <h1 className="text-xl font-bold text-gray-800">Enlace inválido o ya utilizado</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Este enlace de activación ya fue usado o no existe. Solicita uno nuevo al administrador.
                    </p>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Activar cuenta" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">Activa tu cuenta</h1>
                <p className="mt-1 text-sm text-gray-500">Completa tu perfil para acceder al sistema SAAC.</p>
            </div>

            <form onSubmit={enviar} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Correo institucional</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full rounded-lg border border-cream-400 bg-cream-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                        ['nombre',           'Nombre(s)'],
                        ['apellido_paterno', 'Apellido paterno'],
                        ['apellido_materno', 'Apellido materno'],
                    ].map(([field, label]) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                            <input
                                type="text"
                                value={data[field]}
                                onChange={(e) => setData(field, e.target.value)}
                                className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                            {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Matrícula</label>
                        <input
                            type="text"
                            value={data.matricula}
                            onChange={(e) => setData('matricula', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                        />
                        {errors.matricula && <p className="mt-1 text-xs text-red-500">{errors.matricula}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Carrera</label>
                        <select
                            value={data.carrera}
                            onChange={(e) => setData('carrera', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm focus:border-guinda focus:outline-none"
                        >
                            {CARRERAS.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        {errors.carrera && <p className="mt-1 text-xs text-red-500">{errors.carrera}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Semestre</label>
                        <select
                            value={data.semestre}
                            onChange={(e) => setData('semestre', parseInt(e.target.value))}
                            className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm focus:border-guinda focus:outline-none"
                        >
                            {[1,2,3,4,5,6,7,8,9].map((s) => <option key={s} value={s}>{s}°</option>)}
                        </select>
                        {errors.semestre && <p className="mt-1 text-xs text-red-500">{errors.semestre}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Confirmar contraseña</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn-guinda w-full justify-center py-2.5"
                >
                    {processing ? 'Activando cuenta…' : 'Activar mi cuenta'}
                </button>
            </form>
        </GuestLayout>
    );
}
```

- [ ] **Step 3: Agregar "Invitaciones" al nav del admin en AuthenticatedLayout.jsx**

En `resources/js/Layouts/AuthenticatedLayout.jsx`, localizar el array `administrador` (línea ~32):

```js
administrador: [
    { label: 'Panel Principal',      routeName: 'dashboard',                  icon: HomeIcon },
    { label: 'Catálogo Actividades', routeName: 'admin.catalogo',             icon: GridIcon },
    { label: 'Gestión de Alumnos',   routeName: 'admin.alumnos',              icon: UsersIcon },
    { label: 'Validar Evidencias',   routeName: 'admin.solicitudes.index',    icon: CheckCircleIcon },
    { label: 'Constancias',          routeName: 'admin.constancias',          icon: DocumentIcon },
],
```

Agregar el item de invitaciones al final del array:

```js
administrador: [
    { label: 'Panel Principal',      routeName: 'dashboard',                  icon: HomeIcon },
    { label: 'Catálogo Actividades', routeName: 'admin.catalogo',             icon: GridIcon },
    { label: 'Gestión de Alumnos',   routeName: 'admin.alumnos',              icon: UsersIcon },
    { label: 'Validar Evidencias',   routeName: 'admin.solicitudes.index',    icon: CheckCircleIcon },
    { label: 'Constancias',          routeName: 'admin.constancias',          icon: DocumentIcon },
    { label: 'Invitaciones',         routeName: 'admin.invitaciones',         icon: ClipboardIcon },
],
```

- [ ] **Step 4: Correr toda la suite de pruebas**

```bash
php artisan test
```

Resultado esperado: Todos los tests pasan (incluyendo los existentes `ExampleTest`).

- [ ] **Step 5: Verificar el flujo completo en navegador**

1. Entrar como `admin@tescha.edu.mx` / `saac1234`
2. Navegar a `/admin/invitaciones` (ahora visible en el sidebar)
3. Crear invitación para un email nuevo (ej: `prueba@tescha.edu.mx`)
4. Copiar la URL del banner verde
5. Abrir la URL en ventana incógnita
6. Llenar el formulario y activar la cuenta
7. Verificar que redirige al dashboard del alumno con su nombre correcto

- [ ] **Step 6: Commit final**

```bash
git add resources/js/Pages/Admin/Invitaciones.jsx resources/js/Pages/Auth/ActivarCuenta.jsx resources/js/Layouts/AuthenticatedLayout.jsx
git commit -m "feat: agregar páginas de invitaciones y activación de cuenta"
```
