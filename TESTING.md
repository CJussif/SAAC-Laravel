# SAAC — Guía de Pruebas de Interfaces

Documento para que cualquier integrante del equipo pueda levantar el proyecto localmente y probar las interfaces maquetadas hasta la fecha.

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| PHP         | 8.2+           |
| Composer    | 2.x            |
| Node.js     | 18+            |
| npm         | 9+             |

---

## 1. Instalación desde cero

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/SAAC-Laravel.git
cd SAAC-Laravel

# 2. Instalar dependencias PHP
composer install

# 3. Instalar dependencias JS
npm install

# 4. Copiar el archivo de entorno
cp .env.example .env

# 5. Generar la clave de la aplicación
php artisan key:generate
```

---

## 2. Configurar la base de datos

El proyecto usa **SQLite** por defecto (sin necesidad de MySQL).

Verifica que en tu `.env` esté configurado así:

```env
DB_CONNECTION=sqlite
```

> El archivo `database/database.sqlite` ya existe en el repositorio.

Ejecuta las migraciones y el seeder:

```bash
php artisan migrate:fresh --seed
```

Esto crea las tablas y genera los **3 usuarios de prueba** automáticamente.

---

## 3. Usuarios de prueba

| Rol           | Correo                    | Contraseña | Dashboard que verá          |
|---------------|---------------------------|------------|-----------------------------|
| Estudiante    | `alumno@tescha.edu.mx`    | `saac1234` | Dashboard Alumno            |
| Docente       | `docente@tescha.edu.mx`   | `saac1234` | Dashboard Docente           |
| Administrador | `admin@tescha.edu.mx`     | `saac1234` | Dashboard Administrador     |

---

## 4. Levantar el servidor

Abre **dos terminales** en la carpeta del proyecto:

**Terminal 1 — Backend Laravel:**
```bash
php artisan serve
```

**Terminal 2 — Frontend Vite (hot reload):**
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:8000**

---

## 5. Rutas para probar por rol

### Auth (sin login requerido)
| URL | Descripción |
|---|---|
| `http://localhost:8000/login` | Pantalla de inicio de sesión |
| `http://localhost:8000/register` | Registro de cuenta |
| `http://localhost:8000/forgot-password` | Recuperación de contraseña |

---

### Rol: Estudiante
Inicia sesión con `alumno@tescha.edu.mx` / `saac1234`

| URL | Descripción |
|---|---|
| `http://localhost:8000/dashboard` | Panel principal con progreso de créditos |
| `http://localhost:8000/actividades` | Catálogo de actividades e inscripción |
| `http://localhost:8000/historial` | Historial académico y progreso de créditos |
| `http://localhost:8000/subir-evidencia` | Formulario para subir constancias externas |
| `http://localhost:8000/constancias` | Mis constancias descargables |
| `http://localhost:8000/profile` | Configuración de perfil |

---

### Rol: Docente
Inicia sesión con `docente@tescha.edu.mx` / `saac1234`

| URL | Descripción |
|---|---|
| `http://localhost:8000/dashboard` | Panel docente con grupos y métricas |
| `http://localhost:8000/asistencia` | Pase de lista digital por semana |
| `http://localhost:8000/grupos` | Lista de alumnos inscritos por grupo |
| `http://localhost:8000/expedientes` | Expedientes de asistencia y avance |
| `http://localhost:8000/profile` | Configuración de perfil |

---

### Rol: Administrador
Inicia sesión con `admin@tescha.edu.mx` / `saac1234`

| URL | Descripción |
|---|---|
| `http://localhost:8000/dashboard` | Resumen global con KPIs del sistema |
| `http://localhost:8000/admin/catalogo` | Catálogo completo de actividades (CRUD) |
| `http://localhost:8000/admin/alumnos` | Gestión de alumnos y seguimiento de créditos |
| `http://localhost:8000/admin/evidencias` | Validación de evidencias externas |
| `http://localhost:8000/admin/constancias` | Registro y control de constancias emitidas |
| `http://localhost:8000/profile` | Configuración de perfil |

---

## 6. Notas sobre el estado actual

- Todos los datos mostrados son **estáticos (datos de maqueta)**. No hay operaciones reales de BD aún (inscripciones, asistencia, etc.).
- El sidebar cambia automáticamente según el `rol` del usuario logueado.
- Las rutas marcadas como `#` en el sidebar aún no tienen página implementada.
- La imagen de fondo del login (`/images/tescha-bg.jpg`) es opcional; sin ella el fondo será oscuro pero funcional.

---

## 7. Solución de problemas comunes

**Error: `Class "Inertia\Middleware" not found`**
```bash
composer install
```

**Error: Página en blanco o JS no carga**
```bash
npm run dev   # asegúrate de que Vite esté corriendo
```

**Error: `Table not found` al iniciar sesión**
```bash
php artisan migrate:fresh --seed
```

**Resetear la base de datos y usuarios**
```bash
php artisan migrate:fresh --seed
```
