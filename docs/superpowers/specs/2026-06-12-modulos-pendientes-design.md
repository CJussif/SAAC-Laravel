# Diseño: Módulos Pendientes SAAC

**Fecha:** 2026-06-12
**Estado:** Aprobado

## Alcance

Implementar los 5 módulos pendientes del sistema SAAC:

1. Docente/Grupos — conectar vista estática a BD
2. Docente/Expedientes — conectar vista estática a BD
3. Admin/Alumnos — conectar vista estática a BD + edición de créditos
4. Admin/Constancias — vista de auditoría de solo lectura
5. Flujo de Invitación/Registro — admin carga emails, genera enlace, alumno activa cuenta

---

## Arquitectura general

**Patrón:** Un controlador por vista, siguiendo el estilo existente del proyecto (`AdminEvidenciaController`, `AlumnoEvidenciaController`, etc.).

**Archivos nuevos:**
```
app/Http/Controllers/
  DocenteGruposController.php
  DocenteExpedientesController.php
  AdminAlumnosController.php
  AdminConstanciasController.php
  InvitacionController.php

database/migrations/
  XXXX_create_invitaciones_table.php

resources/js/Pages/Auth/
  ActivarCuenta.jsx

resources/js/Pages/Admin/
  Invitaciones.jsx
```

**Archivos modificados:**
```
routes/web.php   — reemplazar 4 lambdas placeholder por controladores reales + rutas de invitación
```

**Sin migraciones adicionales** para los 4 módulos de datos existentes. Solo se necesita la tabla `invitaciones`.

**Tabla `invitaciones`:**
| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| email | string unique | correo institucional autorizado |
| token | string unique | UUID generado al crear |
| usado_en | timestamp nullable | null = pendiente, fecha = activada |
| created_at / updated_at | timestamps | |

---

## Módulo 1: Docente/Grupos

**Controlador:** `DocenteGruposController@index`
**Ruta:** `GET /grupos` (reemplaza la lambda actual)

### Lógica
- Auth check: `$user->rol !== 'docente' || !$user->docente` → redirect dashboard
- Carga actividades del docente con eager load de alumnos inscritos
- Grupo seleccionado via query param `?grupo_id=X`, default al primer grupo
- Por actividad devuelve: id, nombre, tipo, horario, creditos, inscritos (count con estatus válidos), cupo_maximo, activo (bool)
- Por alumno del grupo seleccionado: matricula, nombre completo, carrera, semestre, porcentaje asistencia, estatus pivot

### Cálculo de tipo de actividad
Extraer a método privado `resolverTipo(string $nombre): string` (reutilizado en Expedientes):
- `yoga` o `basquet` en nombre → `deportiva`
- Default → `cultural`

### Cálculo de porcentaje de asistencia
`(asistencias donde asistio=true) / total asistencias * 100`, redondeado a entero. Si no hay asistencias registradas → 0.

---

## Módulo 2: Docente/Expedientes

**Controlador:** `DocenteExpedientesController@index`
**Ruta:** `GET /expedientes` (reemplaza la lambda actual)

### Lógica
- Auth check idéntico al de Grupos
- Carga **todas** las inscripciones de **todas** las actividades del docente en una query con eager loading: `inscripciones → alumno`, `inscripciones → actividad`, `inscripciones → asistencias`
- Sin query params — el filtrado (búsqueda, actividad, estatus) se maneja en el frontend con estado React local
- Por registro devuelve: matricula, nombre, carrera, semestre, nombre_actividad, tipo, sesiones `{total: count(asistencias registradas), cursadas: count(asistencias donde asistio=true)}`, porcentaje_asistencia, estatus, creditos

---

## Módulo 3: Admin/Alumnos

**Controlador:** `AdminAlumnosController`
**Rutas:**
- `GET /admin/alumnos` → `@index`
- `PATCH /admin/alumnos/{alumno}` → `@updateCreditos`

### `@index`
- Auth check: `$user->rol !== 'administrador'` → redirect dashboard
- Query paginada (20/página) con filtros via `when()`:
  - `?search=X` filtra por nombre o matrícula (LIKE)
  - `?carrera=ISC` filtra por carrera exacta
  - `?estatus=Acreditado` filtra traduciendo a condición sobre `creditos_acumulados`:
    - Acreditado → `creditos_acumulados >= 5`
    - En Progreso → `creditos_acumulados > 0 AND < 5`
    - Sin Iniciar → `creditos_acumulados = 0`
- Estatus calculado en PHP (no en SQL): `creditos_acumulados >= 5` → Acreditado, `> 0` → En Progreso, `= 0` → Sin Iniciar
- KPIs calculados en el mismo request (sin queries adicionales): total alumnos, acreditados, en progreso

### `@updateCreditos`
- Valida `creditos_acumulados`: integer, entre 0 y 10
- Actualiza el campo del alumno
- Devuelve `redirect()->back()->with('success', '...')`
- El modal de edición en el frontend usa `useForm` de Inertia (misma estrategia que modales en `AdminActividadController`)

---

## Módulo 4: Admin/Constancias

**Controlador:** `AdminConstanciasController@index`
**Ruta:** `GET /admin/constancias` (reemplaza la lambda actual)

### Lógica
- Auth check: `$user->rol !== 'administrador'` → redirect dashboard
- Carga inscripciones donde `ruta_constancia IS NOT NULL` con eager load de `alumno` y `actividad`
- Filtros via query params: `?search=X` (nombre/matrícula), `?tipo=cultural`
- Por registro devuelve: folio (`CON-{año}-{id:04d}`), nombre alumno, matricula, carrera, nombre actividad, tipo actividad, creditos, fecha (`updated_at` formateado), estatus siempre `emitida`
- KPIs: total emitidas, alumnos distintos cubiertos
- Botón "Ver PDF" apunta a la ruta de storage existente: `/storage/{ruta_constancia}`
- Sin paginación (volumen esperado bajo)

---

## Módulo 5: Flujo de Invitación/Registro

**Controlador:** `InvitacionController`

### Rutas
```
GET  /admin/invitaciones          → @index     (panel admin, requiere auth + rol admin)
POST /admin/invitaciones          → @store     (crear invitación)
DELETE /admin/invitaciones/{inv}  → @destroy   (revocar invitación pendiente)
GET  /activar/{token}             → @show      (pública, formulario activación)
POST /activar/{token}             → @activar   (pública, procesar activación)
```

### `@index` — Panel admin
Lista todas las invitaciones ordenadas por fecha desc. Muestra: email, fecha creación, estado (Pendiente/Activada), fecha de uso. Cuando se crea una nueva, el flash incluye la URL completa del enlace para que el admin la copie.

### `@store` — Crear invitación
- Valida: email requerido, formato válido
- Rechaza si: ya existe en `users.email` O tiene invitación con `usado_en IS NULL`
- Crea registro con `token = Str::uuid()`
- Devuelve `redirect()->back()->with('invitacion_url', url("/activar/{token}"))`

### `@destroy` — Revocar
- Solo permite revocar si `usado_en IS NULL`
- Elimina el registro

### `@show` — Formulario de activación (ruta pública)
- Verifica token existe y `usado_en IS NULL`, si no → vista de error "enlace inválido o ya utilizado"
- Renderiza `Auth/ActivarCuenta` con el email prellenado (deshabilitado)

### `@activar` — Procesar activación (ruta pública)
Validaciones:
- nombre, apellido_paterno, apellido_materno: requeridos, string
- matricula: requerido, único en `alumnos`
- carrera: requerido, in: `ISC, IGE, IDS`
- semestre: requerido, integer, between: 1,9
- password: requerido, confirmado, min: 8

Proceso (en transacción DB):
1. Verificar token válido (doble check)
2. Crear `User` con email del token, password hasheado, rol='alumno'
3. Crear `Alumno` con los datos del formulario, `creditos_acumulados = 0`
4. Marcar `invitaciones.usado_en = now()`
5. Login automático con `Auth::login($user)`
6. Redirect al dashboard del alumno

Si token ya fue usado → error 422 con mensaje claro.

### `ActivarCuenta.jsx`
Formulario público (sin AuthenticatedLayout, usar el layout de guest existente). Campos: nombre, apellidos, matrícula, carrera (select), semestre (select 1-9), contraseña + confirmación. Email deshabilitado visible. Usa `useForm` de Inertia.

### `Invitaciones.jsx`
Panel admin. Lista de invitaciones con estado badge (Pendiente/Activada). Formulario inline para agregar email. Cuando hay `invitacion_url` en flash, mostrar banner copiable con la URL generada.

---

## Decisiones de diseño

- **Sin SMTP:** El enlace de invitación se muestra en pantalla para que el admin lo copie manualmente.
- **Edición de créditos solo:** Admin/Alumnos permite editar `creditos_acumulados` pero no crear alumnos (eso lo maneja el flujo de invitación).
- **Admin/Constancias es solo lectura:** No genera PDFs nuevos, solo audita los ya emitidos por el módulo de alumno.
- **Filtrado en frontend vs backend:** Grupos y Expedientes filtran en el frontend (datos por docente son pocos). Alumnos filtra en backend (puede haber cientos de registros, necesita paginación).
