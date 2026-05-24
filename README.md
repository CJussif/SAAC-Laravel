# SAAC — Sistema de Acreditación de Actividades Complementarias

SAAC es una plataforma web integral diseñada para la gestión, control y acreditación de **actividades complementarias universitarias** (deportivas, culturales y académicas) del instituto. El sistema interconecta a estudiantes, docentes y administradores a través de flujos dinámicos controlados por reglas de negocio robustas a nivel de base de datos.

---

## 🚀 Características Clave

### 🎓 Para Alumnos
* **Inscripción en Tiempo Real**: Catálogo interactivo con validaciones contra traslapes de horario, límite de inscripciones activas (máximo 2) y capacidad de cupos.
* **Historial & Constancias**: Avance interactivo de créditos acumulados y descarga de constancias con folios autogenerados para cursos acreditados.
* **Acreditación Externa**: Carga de evidencias y constancias externas en formato PDF o imagen (JPG/PNG) para revisión administrativa.

### 📝 Para Docentes
* **Pase de Lista Digital**: Control de asistencia diario de lunes a viernes clasificado por periodos semanales.
* **Cálculo de Porcentaje**: Monitoreo dinámico del porcentaje general de asistencia de cada alumno.
* **Cierre y Acreditación**: Cierre atómico del grupo donde alumnos con **>= 60% de asistencia** son acreditados de forma automática y sus créditos son abonados a su expediente.

### ⚙️ Para Administradores
* **CRUD de Actividades**: Administración del catálogo complementario vinculando docentes e institutos.
* **Validación de Evidencias**: Tablero de aprobación/rechazo de comprobantes externos cargados por los alumnos con asignación de créditos.

---

## 🛠️ Stack Tecnológico

El proyecto está construido sobre un stack moderno y eficiente:
* **Backend**: [Laravel 12 (PHP 8.4)](https://laravel.com)
* **Frontend**: [React 19](https://react.dev) con [Inertia.js](https://inertiajs.com) (eliminando la necesidad de APIs REST complejas).
* **Estilos**: Vanilla CSS y [Tailwind CSS v4](https://tailwindcss.com) (diseño premium y responsive).
* **Compilador**: [Vite](https://vite.dev)
* **Base de Datos**: [SQLite](https://www.sqlite.org) (en archivo local para facilidad de desarrollo).

---

## 💻 Guía de Instalación y Setup

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/TU_USUARIO/SAAC-Laravel.git
cd SAAC-Laravel

# Instalar dependencias del Backend (Composer)
composer install

# Instalar dependencias del Frontend (npm)
npm install
```

### 2. Configurar el Entorno
Copia el archivo de ejemplo y genera la llave única de la aplicación:
```bash
cp .env.example .env
php artisan key:generate
```

*Nota: Asegúrate de que el archivo `.env` contenga la conexión SQLite:*
```env
DB_CONNECTION=sqlite
```

### 3. Preparar la Base de Datos
Crea las tablas y puebla la base de datos con los datos semilla (usuarios iniciales y actividades):
```bash
php artisan migrate:fresh --seed
```

### 4. Ejecutar la Aplicación
Inicia los servidores de desarrollo. Necesitarás ejecutar estos comandos en terminales separadas o en segundo plano:

* **Terminal 1 (Servidor PHP):**
  ```bash
  php artisan serve
  ```

* **Terminal 2 (Compilador JS/Vite):**
  ```bash
  npm run dev
  ```

La aplicación estará disponible en tu navegador en: **`http://localhost:8000`**

---

## 🔑 Usuarios de Prueba (Semilla)

Al sembrar la base de datos, se crean cuentas preconfiguradas para probar los diferentes dashboards:

| Rol | Correo Electrónico | Contraseña | Vista / Dashboard |
|---|---|---|---|
| **Estudiante** | `alumno@tescha.edu.mx` | `saac1234` | Panel del Alumno, Catálogo e Historial |
| **Docente** | `docente@tescha.edu.mx` | `saac1234` | Panel del Docente y Pase de Lista |
| **Administrador** | `admin@tescha.edu.mx` | `saac1234` | Panel Global, Catálogo CRUD y Evidencias |

---

## 🧪 Pruebas Automatizadas

El sistema cuenta con una cobertura de pruebas de integración robusta que evalúa todas las restricciones de inscripción, asistencia, transacciones atómicas y cargas de evidencias:

```bash
# Ejecutar todas las pruebas del sistema
./vendor/bin/phpunit
```

---

## 📖 Documentación para Desarrolladores

Para comprender a fondo la arquitectura, el diseño de la base de datos y la integración de endpoints, consulta las guías dedicadas:
1. **[Manual de Arquitectura y Reglas de Negocio](file:///home/kedap/Documentos/repos/SAAC-Laravel/docs/architecture.md)**: Diagramas C4, Modelo de Entidad-Relación y explicación de reglas duras.
2. **[Guía de Integración y API](file:///home/kedap/Documentos/repos/SAAC-Laravel/docs/api.md)**: Estructura de controladores, endpoints e integración de Inertia.js.
