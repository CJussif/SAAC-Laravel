# SAAC — Guía de Integración y API

Este documento detalla la estructura de endpoints del sistema, el flujo de peticiones/respuestas a través de **Inertia.js**, los esquemas de datos (payloads) y los controladores backend encargados del procesamiento.

---

## 🔄 1. Protocolo de Comunicación Inertia.js

SAAC no utiliza APIs JSON tradicionales ni redireccionamientos HTML completos. La comunicación sigue el flujo de ciclo cerrado de **Inertia.js**:

1. El cliente inicia una acción mediante Inertia Router (ej. `router.post(...)`).
2. El servidor procesa la petición y valida las entradas.
3. Si la validación falla, Laravel retorna un redirect con errores en la sesión, los cuales Inertia captura y expone en el frontend bajo la propiedad `errors`.
4. Si la transacción es exitosa, Laravel redirige (`redirect()->back()`) inyectando flash messages (`success`, `error`), los cuales se inyectan dinámicamente como `props` en el componente React.

---

## 🗺️ 2. Mapeo de Endpoints y Controladores

A continuación se listan todos los endpoints protegidos bajo el middleware de autenticación (`auth`):

### 🎓 A. Endpoints de Alumno

#### 1. Ver Catálogo de Actividades
* **Ruta**: `GET /actividades`
* **Controlador**: `AlumnoActividadesController@index`
* **Response Props**:
  * `actividades`: Lista de talleres con información de cupo, docente y estado de inscripción del alumno.
  * `inscripcionesActivas`: Talleres que el alumno cursa actualmente.
  * `alumno`: Información básica y créditos acumulados.

#### 2. Inscribir Actividad Complementaria
* **Ruta**: `POST /inscripciones`
* **Controlador**: `InscripcionController@store`
* **Payload**:
  ```json
  {
    "actividad_id": 3
  }
  ```

#### 3. Cargar Evidencia Externa
* **Ruta**: `POST /subir-evidencia`
* **Controlador**: `AlumnoEvidenciaController@store`
* **Payload (Multipart Form-Data)**:
  * `tipo_actividad` (string, `deportiva|cultural|academica`)
  * `nombre_actividad` (string)
  * `institucion` (string)
  * `fecha_inicio` (date: `Y-m-d`)
  * `fecha_fin` (date: `Y-m-d`)
  * `horas` (integer, opcional)
  * `descripcion` (string, opcional)
  * `archivo` (archivo PDF o Imagen, máx 5MB)

---

### 📝 B. Endpoints de Docente

#### 1. Ver Lista de Asistencia Semanal
* **Ruta**: `GET /asistencia`
* **Controlador**: `AsistenciaController@index`
* **Query Params**: `grupo_id` (opcional), `semana` (opcional, `1` a `16`)
* **Response Props**:
  * `grupos`: Grupos impartidos por el docente.
  * `alumnos`: Lista de alumnos inscritos en el grupo, con su porcentaje de asistencia y su estado en cada uno de los 5 días de la semana seleccionada.
  * `weekDates`: Array con las 5 fechas formateadas de lunes a viernes correspondientes a la semana elegida.

#### 2. Guardar Asistencia Masiva
* **Ruta**: `POST /asistencia`
* **Controlador**: `AsistenciaController@store`
* **Payload**:
  ```json
  {
    "asistencias": [
      {
        "inscripcion_id": 12,
        "fecha": "2026-05-18",
        "asistio": true
      },
      {
        "inscripcion_id": 12,
        "fecha": "2026-05-19",
        "asistio": false
      }
    ]
  }
  ```

#### 3. Ejecutar Acreditación Final del Grupo
* **Ruta**: `POST /asistencia/acreditar`
* **Controlador**: `AsistenciaController@acreditar`
* **Payload**:
  ```json
  {
    "grupo_id": 2
  }
  ```

---

### ⚙️ C. Endpoints de Administrador

#### 1. CRUD de Actividades Complementarias
* **Listar**: `GET /admin/catalogo` (`AdminActividadController@index`)
* **Crear**: `POST /admin/catalogo` (`AdminActividadController@store`)
* **Editar**: `PUT /admin/catalogo/{actividad}` (`AdminActividadController@update`)
* **Eliminar**: `DELETE /admin/catalogo/{actividad}` (`AdminActividadController@destroy`)
* **Payload (Crear/Editar)**:
  ```json
  {
    "nombre": "Selección de Voleibol",
    "descripcion": "Actividad deportiva",
    "creditos": 2,
    "cupo_maximo": 20,
    "horario": "Mar y Jue, 14:00 - 16:00",
    "docente_id": 1,
    "tipo_periodo": "semestral"
  }
  ```

#### 2. Validar Solicitud de Evidencia Externa
* **Ruta**: `POST /admin/evidencias/{solicitud}/validar`
* **Controlador**: `AdminEvidenciaController@validar`
* **Payload**:
  ```json
  {
    "estatus": "aprobada",
    "creditos": 2,
    "motivo_rechazo": null
  }
  ```
  *(Nota: Si `estatus` es `"rechazada"`, el campo `motivo_rechazo` es requerido)*

---

## 💾 3. Manejo de Archivos Subidos (File Storage)

Cuando un estudiante sube un archivo soporte de evidencia, el sistema lo almacena en el disco local usando el storage de Laravel:

```php
// AlumnoEvidenciaController.php
$path = $request->file('archivo')->store('evidencias', 'public');
```

Esto almacena el archivo físicamente en la ruta `storage/app/public/evidencias/` y genera un hash único para el nombre (ej. `evidencias/AbCdEfGh12345.pdf`).

Para acceder a él desde el navegador:
1. El enlace simbólico vincula `public/storage` a `storage/app/public`.
2. El frontend de React lee el campo `ruta_archivo` y construye el enlace `/storage/{ruta_archivo}`.
3. El archivo se visualiza o descarga de forma nativa en el navegador mediante:
   ```jsx
   <a href={`/storage/${solicitud.ruta_archivo}`} target="_blank">Ver Comprobante</a>
   ```
