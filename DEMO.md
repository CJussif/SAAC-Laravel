# Guía de Demo — S.A.A.C. TESCHa

Sistema de Administración de Actividades Complementarias  
URL pública: **https://tescha.tlapala.com**

---

## Credenciales de acceso

| Rol                     | Correo                  | Contraseña |
| ----------------------- | ----------------------- | ---------- |
| Administrador           | `admin@tescha.edu.mx`   | `saac1234` |
| Docente                 | `docente@tescha.edu.mx` | `saac1234` |
| Alumno (demo principal) | `alumno@tescha.edu.mx`  | `saac1234` |

> Hay otros 14 alumnos y 2 docentes adicionales con los mismos datos de acceso (ver sección _Escenarios adicionales_).

---

## Recorrido sugerido para la defensa

### 1 — Rol Alumno · Ana García (`alumno@`)

**Panel principal**

- Muestra créditos acumulados y actividades activas del ciclo.

**Catálogo de actividades** → `/actividades`

- 16 actividades disponibles (deportivas, culturales, académicas).
- Buscar por nombre o filtrar por tipo.
- Inscribirse a una actividad con cupo disponible.

**Mi Historial** → `/historial`

- Actividad _Taller de Ajedrez_ con estatus **Acreditado** y folio `CON-XXXX-0001`.
- Actividad _Liderazgo Estudiantil_ en curso con 67 % de asistencia.

**Mis Constancias** → `/constancias`

- Constancia del Taller de Ajedrez lista para descargar.
- El PDF incluye datos del alumno, actividad, créditos, firmas y **código QR de verificación** (RF06/UC18).

---

### 2 — Rol Docente · Méndez (`docente@`)

**Pase de Lista** → `/asistencia`

- Seleccionar una actividad asignada, marcar presentes/ausentes y guardar.

**Mis Grupos** → `/grupos`

- Ver el listado de alumnos por actividad con barra de asistencia por alumno.
- Botón **Ver expediente** lleva directamente al expediente del alumno filtrado.

**Expedientes** → `/expedientes`

- Búsqueda por nombre o matrícula.
- Exportar a CSV.
- **Alerta de riesgo visible:** María Torres (44 %) y Roberto Silva (37.5 %) aparecen en rojo.

---

### 3 — Rol Administrador (`admin@`)

**Catálogo de Actividades** → `/admin/catalogo`

- Crear, editar y eliminar actividades.
- Botón **Nueva Actividad** en la barra lateral.

**Gestión de Alumnos** → `/admin/alumnos`

- Ver todos los alumnos, créditos acumulados y estado de riesgo.
- Editar créditos manualmente si aplica.

**Validar Evidencias** → `/admin/solicitudes`

- Dos solicitudes pendientes de evidencia externa.
- Aprobar o rechazar; el alumno recibe notificación automática en el sistema.

**Constancias** → `/admin/constancias`

- Listado de todas las constancias emitidas.
- Filtro por nombre/matrícula y por tipo de actividad.
- Exportar a CSV.

**Invitaciones** → `/admin/invitaciones`

- El registro es solo por invitación (RF05).
- Hay dos invitaciones pendientes: `nuevo.alumno@tescha.edu.mx` y `nuevo.docente@tescha.edu.mx`.
- Crear nueva invitación y mostrar el enlace de activación.

---

## Escenarios adicionales para mostrar

| Escenario                | Cuenta                         | Detalle                                                    |
| ------------------------ | ------------------------------ | ---------------------------------------------------------- |
| Alumno avanzado          | `jorge.mendoza@tescha.edu.mx`  | 3 actividades acreditadas (Programación, Debate, Robótica) |
| Alumno en riesgo         | `maria.torres@tescha.edu.mx`   | 44 % de asistencia en Danza Folclórica                     |
| Alumno en riesgo crítico | `roberto.silva@tescha.edu.mx`  | 37.5 % de asistencia en Atletismo                          |
| Notificación aprobada    | `luis.ramirez@tescha.edu.mx`   | Tiene notificación de evidencia aprobada sin leer          |
| Notificación rechazada   | `carlos.vega@tescha.edu.mx`    | Tiene notificación de evidencia rechazada sin leer         |
| Múltiples constancias    | `fernanda.ochoa@tescha.edu.mx` | 3 constancias descargables (Locución, Yoga, Fotografía)    |

Todos los alumnos usan contraseña **`saac1234`**.

---

## Puntos clave a destacar durante la defensa

| Requisito                                | Dónde mostrarlo                                      |
| ---------------------------------------- | ---------------------------------------------------- |
| RF01 — Catálogo de actividades           | `/actividades` (alumno)                              |
| RF02 — Inscripción y seguimiento         | Historial del alumno                                 |
| RF03 — Control de asistencia             | Pase de lista (docente)                              |
| RF04 — Validación de evidencias externas | Solicitudes (admin)                                  |
| RF05 — Acceso por invitación             | Invitaciones (admin) → enlace `/activar/{token}`     |
| RF06 — Constancia PDF con QR             | Descargar constancia (alumno)                        |
| RF07 — Expediente académico              | Expedientes (docente) + exportar CSV                 |
| Alertas de riesgo (< 80 %)               | Barras rojas en Grupos y Expedientes                 |
| Notificaciones en tiempo real            | Campana en el topbar (alumno con evidencia evaluada) |

---

## Notas de producción

- La app no expone ningún puerto al host; todo el tráfico entra exclusivamente por el túnel de Cloudflare.
- La base de datos SQLite persiste en un volumen Docker (`sqlite_data`); no se pierde al redeploy.
- Los archivos de storage (evidencias subidas) persisten en el volumen `storage_data`.
- Para redeploy sin pérdida de datos: `git pull && ./scripts/deploy.sh` (sin `--seed`).
- Para ver logs en vivo: `docker compose --profile tunnel logs -f`.
