# **Proyecto de Ingeniería de Software: Sistema de Administración de Actividades Complementarias (SAAC)**

Este documento contiene la especificación de software, requisitos, arquitectura, base de datos y flujos del sistema **SAAC** de manera estructurada y optimizada para ser interpretada, procesada y editada nativamente por agentes de Inteligencia Artificial (LLMs).

## **Información General del Proyecto**

- **Institución:** Tecnológico de Estudios Superiores de Chalco (TESCHA)
- **Carrera:** Ingeniería en Sistemas Computacionales
- **Materia:** Ingeniería de Software
- **Profesora:** Niza Lucero Alpizar Martínez
- **Proyecto:** Sistema de Administración de Actividades Complementarias (SAAC)
- **Grupo:** 4651
- **Semestre:** 2026-1

### **Integrantes del Equipo**

- Arellano Palacios Daniel
- Gerónimo Isguerra Jesús Esteban
- Martinez De Jesus Alexa Citlali
- Rodríguez Mújica Danniela Michelle
- Ugalde Ponce Carlos Jussif

## **1\. Introducción y Marco Contextual**

### **1.1 Introducción**

Las actividades complementarias en la educación superior representan un componente fundamental para la formación integral de los estudiantes, fomentando el desarrollo de competencias transversales, el compromiso social y la adquisición de habilidades prácticas. Actividades como los talleres culturales, los torneos deportivos, las conferencias académicas o las tutorías no solo enriquecen la vida universitaria, sino que son un requisito indispensable para que los alumnos puedan avanzar en sus trámites y llegar a su titulación.  
Sin embargo, en el Tecnológico de Estudios Superiores de Chalco (TESCHA), la gestión y el seguimiento puntual de estas actividades se ha vuelto un proceso administrativo cada vez más complejo, principalmente debido al constante crecimiento de la comunidad estudiantil y a la gran variedad de opciones que la institución ofrece cada ciclo escolar.  
Para dar solución a estos retos y modernizar la gestión escolar, este documento sustenta las bases para el diseño, desarrollo e implementación de un sistema de software dedicado, con el objetivo de centralizar y automatizar todos los procesos relacionados con las actividades complementarias. La idea central es crear una plataforma donde toda la información viva en un solo lugar y esté disponible en tiempo real para quienes la necesitan.  
Al integrar funciones clave como el registro sencillo de participantes y docentes, la gestión automática de cupos y horarios, la detección del tipo de periodo (semestral o intersemestral) y, sobre todo, la automatización en la generación de constancias, el sistema busca transformar un proceso tradicionalmente lento e ineficiente en un flujo de trabajo ágil, transparente y orientado al servicio. Con la incorporación de un apartado específico donde cada estudiante pueda consultar y descargar su constancia correspondiente, este proyecto no solo representa una mejora tecnológica, sino un gran paso para brindar un mejor servicio a toda la comunidad académica del TESCHA, ahorrando tiempo, papel y esfuerzo a todos los involucrados.

### **1.2 Justificación**

Actualmente, el control de qué alumno se inscribe, cuántos lugares quedan disponibles en un taller y quién ya acreditó su actividad depende en gran medida de procesos manuales, revisión de listas en papel y captura de datos en diferentes archivos. Esta forma de trabajo tradicional genera cuellos de botella. Provoca que los alumnos enfrenten procesos lentos para registrarse o para obtener el documento que avala su participación, al mismo tiempo que sobrecarga de trabajo rutinario a los docentes y al personal administrativo, aumentando la posibilidad de errores humanos o traspapelado de información.  
El desarrollo del Sistema de Administración de Actividades Complementarias surge de la necesidad urgente de facilitar y modernizar la vida académica y administrativa dentro del Tecnológico de Estudios Superiores de Chalco (TESCHA). En la actualidad, llevar el control de estas actividades mediante procesos manuales representa una carga de trabajo pesada que consume tiempo valioso, genera estrés y retrasa procesos importantes. Implementar este sistema no es solo una actualización tecnológica, sino una solución práctica que impactará positivamente a toda la comunidad escolar.

### **1.3 Planteamiento del Problema**

En el Tecnológico de Estudios Superiores de Chalco (TESCHA), la forma actual de organizar y llevar el control de las actividades complementarias se ha vuelto un proceso complicado y desgastante para todos los involucrados. Al no contar con una plataforma digital unificada, la información se maneja de forma manual, apoyándose en listas de papel, correos electrónicos sueltos o archivos de Excel que fácilmente se desactualizan o traspapelan.  
Esta falta de un sistema automatizado provoca varios problemas muy puntuales:

- **Desconexión de información:** Al estar los registros de alumnos, docentes y actividades separados, es extremadamente difícil coordinar y saber con certeza quién está inscrito en dónde.
- **Falta de control de aforos:** Sin un freno de cupos automático, es común sobrepasar el límite físico y de profesores de los talleres, o bien, dejar espacios vacíos por falta de visibilidad en el registro.
- **Conflictos de horarios:** La planeación manual causa constantemente empalmes de horarios entre las materias curriculares obligatorias y los talleres complementarios del alumno.
- **Dificultad de segmentación:** Resulta complejo categorizar y rastrear si una actividad se cursa en periodo semestral regular o intersemestral.
- **Proceso de titulación lento:** El cálculo final de créditos, acreditaciones e impresión física de constancias consume semanas de trabajo manual al fin de cada periodo académico. Nombres erróneos, folios duplicados o extravío de documentos físicos retrasan los trámites de titulación.

## **2\. Objetivos del Sistema**

### **2.1 Objetivo General**

Desarrollar e implementar un sistema informático para el Tecnológico de Estudios Superiores de Chalco (TESCHA) que automatice y facilite toda la administración de las actividades complementarias.

### **2.2 Objetivos Específicos**

- Desarrollar un portal seguro con autenticación de usuarios institucional donde los estudiantes puedan realizar su pre-registro e inscripción.
- Implementar un panel de administración del catálogo de actividades complementarias (CRUD completo: creación, lectura, actualización y desactivación de actividades).
- Diseñar un módulo para el registro y gestión de perfiles de docentes o instructores responsables de impartir y evaluar las actividades.
- Configurar algoritmos de validación en tiempo real para evitar sobrecupos de alumnos y el cruce de horarios con clases vigentes.
- Programar lógica del sistema para la discriminación automática del tipo de periodo académico (Semestral o Intersemestral).
- Automatizar el cálculo de créditos completados por estudiante y la generación de constancias oficiales digitales en formato PDF con identificadores únicos de validación.
- Proveer un repositorio digital personal para cada alumno desde donde pueda consultar, visualizar y descargar su constancia de manera asíncrona.

## **3\. Especificación de Requisitos del Sistema**

### **3.1 Requisitos Funcionales (RF)**

- **RF01 \- Gestión de Catálogo (CRUD):** El sistema debe permitir al administrador crear, modificar, consultar y deshabilitar actividades complementarias especificando nombre, créditos asociados, cupo límite, horarios y tipo de periodo.
- **RF02 \- Inscripción y Validación:** El sistema debe permitir la inscripción de alumnos a actividades activas verificando de manera atómica la disponibilidad de cupos y la inexistencia de cruce de horarios.
- **RF03 \- Pase de Lista Digital:** Los instructores deben poder registrar asistencias de los alumnos asignados a sus actividades directamente en el portal.
- **RF04 \- Carga de Portafolio / Evidencias:** El alumno debe poder cargar documentos PDF de actividades externas autorizadas para su posterior validación y canje de créditos.
- **RF05 \- Cómputo de Créditos:** El sistema debe procesar las calificaciones y asistencias de las inscripciones activas para actualizar automáticamente el estatus del alumno al cumplir con las horas o créditos requeridos.
- **RF06 \- Generador de Constancia Oficial:** El backend debe generar un PDF automático al finalizar la aprobación de créditos, utilizando una plantilla oficial de la institución con firmas digitalizadas y un código QR de verificación.

### **3.2 Requisitos No Funcionales (RNF)**

- **RNF01 \- Usabilidad e Interfaz:** El sistema debe contar con un diseño responsivo mediante hojas de estilo CSS modernas, garantizando tiempos de aprendizaje para el usuario final menores a 15 minutos (intuitividad).
- **RNF02 \- Seguridad y Control de Roles (RBAC):** La seguridad del sistema debe basarse en control de acceso por roles (Roles: Estudiante, Docente, Administrador). Toda contraseña almacenada debe estar encriptada con algoritmos hashing de un solo sentido (ej. bcrypt).
- **RNF03 \- Alta Disponibilidad:** El sistema debe asegurar una disponibilidad mínima del 99% (uptime) durante las semanas de alta concurrencia por inscripciones.
- **RNF04 \- Latencia y Rendimiento:** La generación y visualización de listados e informes de inscripción masivos no debe superar una latencia de 3 segundos por petición.
- **RNF05 \- Concurrencia y Carga:** La arquitectura debe soportar peticiones concurrentes de hasta 500 usuarios simultáneos en el módulo de inscripciones sin degradar el rendimiento del servidor.
- **RNF06 \- Integridad Transaccional:** Todas las operaciones de inscripción deben ejecutarse dentro de transacciones SQL atómicas para evitar inconsistencias de datos por interrupciones de red.

## **4\. Matriz de Trazabilidad de Requisitos**

La siguiente tabla asocia los Requisitos del Sistema con sus correspondientes elementos de diseño de módulos de desarrollo y las estrategias para la fase de pruebas de aseguramiento de calidad (QA).

| ID        | Requisito                | Prioridad | Módulo / Componente Asociado                                | Estrategia de Prueba (QA)                                                                                                     |
| :-------- | :----------------------- | :-------- | :---------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **RF01**  | Catálogo de Actividades  | Alta      | AdminController, Vista CRUD de Actividades (React)          | Pruebas unitarias de inserción y de validación de campos frontera (ej: cupo \< 1).                                            |
| **RF02**  | Inscripción Automatizada | Alta      | InscripcionController, Algoritmos de validación de horarios | Prueba de estrés de peticiones concurrentes sobre un mismo taller con cupo límite de 1\.                                      |
| **RF03**  | Pase de Lista Digital    | Media     | Módulo Docentes, API de asistencias                         | Inyección de datos de asistencia nulos o fuera de rango de fechas para verificar control de errores.                          |
| **RF04**  | Subida de Evidencias     | Media     | EvidenciasController, Storage Driver (File Upload)          | Prueba de carga de archivos maliciosos, verificación de filtros MIME de archivos (.pdf e imágenes).                           |
| **RF05**  | Cálculo de Créditos      | Alta      | Lógica de negocio (Observer / Eventos en BD de Laravel)     | Caso de prueba donde el alumno completa la última sesión de asistencia y se verifica el cambio de estatus a "Acreditado".     |
| **RF06**  | Generador de Constancias | Alta      | PdfGeneratorService con DomPDF en Backend                   | Pruebas de renderizado y validación de coincidencia de cadenas de caracteres inyectados contra los datos de la base de datos. |
| **RNF01** | Usabilidad               | Media     | Frontend general (Tailwind CSS)                             | Evaluaciones de compatibilidad entre navegadores web modernos (Chrome, Firefox, Safari) y móviles.                            |
| **RNF02** | Control de Acceso (RBAC) | Alta      | Middleware de seguridad de Laravel (Breeze/Sanctum)         | Intentos forzados de acceso a rutas de administración /admin desde cuentas de alumnos no autorizados (HTTP 403).              |
| **RNF03** | Disponibilidad           | Alta      | Infraestructura y Servidor de Base de Datos                 | Monitoreo sintético y simulaciones de caída parcial del servidor de aplicaciones.                                             |
| **RNF04** | Rendimiento              | Alta      | Base de Datos, Indexación de Tablas Transaccionales         | Profiling de consultas complejas (Joins entre Alumnos, Inscripciones y Actividades) midiendo tiempos en ms.                   |
| **RNF05** | Concurrencia             | Alta      | Arquitectura del Servidor Web (Apache/Nginx/Node)           | Pruebas de carga mediante herramientas externas (Apache JMeter) simulando 500 solicitudes concurrentes de inscripción.        |
| **RNF06** | Integridad Transaccional | Alta      | Conexión PDO, Database Engine InnoDB                        | Interrupción forzada del servidor durante un proceso de registro de asistencia masiva para corroborar el Rollback de SQL.     |

## **5\. Cronograma de Actividades (Plan de Trabajo 2026\)**

Plan de ejecución desglosado por fases cronológicas temporales:  
\+----------------------------------------------------------------------------------+  
| FASE 1: Definición y Documentación Inicial (Marzo \- 03 de Abril) |  
| ├── Identificación de problemáticas de control manual |  
| └── Definición de alcance y objetivos |  
\+----------------------------------------------------------------------------------+  
 │  
 ▼  
\+----------------------------------------------------------------------------------+  
| FASE 2: Requisitos y Configuración de Repositorios (06 \- 15 de Abril) |  
| ├── Redacción de especificaciones de requisitos (IEEE 830\) |  
| └── Inicialización de repositorios de control de cambios (GitHub) |  
\+----------------------------------------------------------------------------------+  
 │  
 ▼  
\+----------------------------------------------------------------------------------+  
| FASE 3: Diseño de Datos y Arquitectura de Software (16 de Abril \- 12 de Mayo) |  
| ├── Escritura de migraciones de base de datos en Laravel |  
| └── Integración de Laravel, Inertia, React, Vite y Tailwind |  
\+----------------------------------------------------------------------------------+  
 │  
 ▼  
\+----------------------------------------------------------------------------------+  
| FASE 4: Construcción del Frontend y UI (13 \- 22 de Mayo) |  
| ├── Maquetación de dashboards de Alumnos, Docentes y Admin |  
| └── Implementación de vistas responsivas con Tailwind |  
\+----------------------------------------------------------------------------------+  
 │  
 ▼  
\+----------------------------------------------------------------------------------+  
| FASE 5: Lógica de Inscripción y Controles Core (25 de Mayo \- 03 de Junio) |  
| ├── Desarrollo del motor transaccional de validación de cupos y empalmes |  
| └── Módulo de asistencia digital para docentes |  
\+----------------------------------------------------------------------------------+  
 │  
 ▼  
\+----------------------------------------------------------------------------------+  
| FASE 6: Automatización de PDFs, QA y Liberación (04 \- 12 de Junio) |  
| ├── Integración del sistema DomPDF y plantillas html oficiales |  
| ├── Pruebas de regresión, estrés y aceptación |  
| └── Presentación y puesta en marcha del SAAC |  
\+----------------------------------------------------------------------------------+

## **6\. Modelado de Procesos (Diagramas de Flujo)**

### **6.1 Proceso Actual (Manual \- AS-IS)**

Este flujo visualiza los pasos de la gestión sin plataforma del TESCHA, destacando los puntos propensos a errores y los tiempos de espera excesivos.  
graph TD  
 A\[Alumno: Identifica necesidad de acreditar\] \--\> B\[Consulta créditos de forma personal sin sistema\]  
 B \--\> C\[Acude en persona o envía correo a administración\]  
 C \--\> D\[Admin: Busca manualmente en lista de papel o Excel\]  
 D \--\>|No hay opciones| E\[Informa al alumno que no hay disponibles\] \--\> End1((Fin))  
 D \--\>|Sí hay opciones| F\[Verifica manualmente si el alumno ya está inscrito\]  
 F \--\>|Sí está inscrito| G\[Informa al alumno que ya tiene actividad\] \--\> End2((Fin))  
 F \--\>|No está inscrito| H\[Revisa manualmente el cupo disponible\]  
 H \--\>|No hay cupo| I\[Informa al alumno que el cupo está lleno\] \--\> End3((Fin))  
 H \--\>|Sí hay cupo| J\[Anota manualmente al alumno en lista \- Riesgo de pérdida\]  
 J \--\> K\[Alumno asiste a las sesiones\]  
 K \--\> L\[Docente: Registra asistencia diaria manual en papel\]  
 L \--\> M{¿Periodo en curso?}  
 M \--\>|Sí| L  
 M \--\>|No| N\[Entrega lista física a administración al finalizar\]  
 N \--\> O\[Admin: Contabiliza manualmente horas y faltas\]  
 O \--\> P{¿Cumplió horas mínimas?}  
 P \--\>|No| Q\[Recibe notificación de no acreditación\] \--\> End4((Fin))  
 P \--\>|Sí| R\[Elabora constancia manualmente en Word o físico\]  
 R \--\> S\[La envía a firmar a las autoridades correspondientes\]  
 S \--\> T\[Alumno acude en persona a recoger constancia\]  
 T \--\> U\[Recibe constancia física\] \--\> End5((Fin))

### **6.2 Proceso Propuesto con el Software (TO-BE)**

Optimización completa con control automático de reglas de negocio, eliminando procesos burocráticos e impresiones innecesarias.  
graph TD  
 A\[Alumno: Inicia sesión con cuenta institucional\] \--\> B\[Consulta catálogo digital en tiempo real\]  
 B \--\> C\[Selecciona actividad y solicita inscripción\]  
 C \--\> D\[Sistema: Detecta automáticamente tipo de periodo\]  
 D \--\> E\[Sistema: Verifica cupo disponible y cruce de horarios\]  
 E \--\>|No disponible/Conflicto| F\[Genera mensaje de error específico\] \--\> G\[Alumno recibe notificación de rechazo\]  
 E \--\>|Cupo disponible y sin conflicto| H\[Registra inscripción automáticamente en BD\]  
 H \--\> I\[Envía confirmación de inscripción al alumno\]  
 I \--\> J\[Alumno recibe confirmación digital\]  
 J \--\> K\[Alumno asiste a las sesiones\]  
 K \--\> L\[Docente: Inicia sesión en el sistema\]  
 L \--\> M\[Abre lista digital de alumnos de su actividad\]  
 M \--\> N\[Registra asistencia digitalmente en el sistema\]  
 N \--\> O{¿Periodo en curso?}  
 O \--\>|Sí| L  
 O \--\>|No| P\[Sistema: Calcula automáticamente horas acreditadas\]  
 P \--\> Q{¿Cumplió con horas mínimas?}  
 Q \--\>|No| R\[Sistema: Notifica automáticamente la no acreditación\]  
 Q \--\>|Sí| S\[Sistema: Notifica al administrador para revisión y aprobación\]  
 S \--\> T\[Admin: Revisa resumen del alumno y aprueba liberación\]  
 T \--\> U\[Sistema: Genera automáticamente constancia PDF con QR\]  
 U \--\> V\[Sistema: Notifica al alumno que su constancia está lista\]  
 V \--\> W\[Alumno: Descarga constancia PDF directamente del sistema\]

## **7\. Diagrama de Casos de Uso (UML)**

Organización funcional de los casos de uso agrupando a los actores del sistema y los disparadores automáticos del backend.  
graph LR  
 subgraph Actores  
 A\[Alumno\]  
 D\[Docente\]  
 ADM\[Administrador\]  
 end

    subgraph Sistema de Administración de Actividades Complementarias
        subgraph Acceso al Sistema
            UC1(Registrar cuenta institucional)
            UC2(Iniciar sesión)
        end

        subgraph Módulo de Alumno
            UC3(Subir evidencias de participación externa)
            UC4(Descargar constancia PDF)
            UC5(Consultar catálogo de actividades)
            UC6(Inscribirse a una actividad)
            UC7(Consultar avance de créditos)
        end

        subgraph Módulo de Docente
            UC8(Consultar lista de alumnos inscritos)
            UC9(Registrar asistencia digital)
        end

        subgraph Módulo de Administrador
            UC10(Validar evidencias de participación externa)
            UC11(Aprobar liberación de créditos)
            UC12(Gestionar catálogo de actividades CRUD)
            UC13(Gestionar alumnos y docentes)
        end

        subgraph Procesos Automáticos del Sistema
            UC14(Detectar tipo de periodo)
            UC15(Validar cupo y cruce de horario)
            UC16(Calcular horas acreditadas)
            UC17(Enviar notificaciones)
            UC18(Generar constancia PDF con código QR)
        end
    end

    A \--\> UC1
    A \--\> UC2
    A \--\> UC3
    A \--\> UC4
    A \--\> UC5
    A \--\> UC6
    A \--\> UC7

    D \--\> UC2
    D \--\> UC8
    D \--\> UC9

    ADM \--\> UC2
    ADM \--\> UC10
    ADM \--\> UC11
    ADM \--\> UC12
    ADM \--\> UC13

    UC6 \-.-\>|include|-\> UC14
    UC6 \-.-\>|include|-\> UC15
    UC9 \-.-\>|include|-\> UC16
    UC16 \-.-\>|include|-\> UC17
    UC11 \-.-\>|include|-\> UC18
    UC18 \-.-\>|include|-\> UC17

## **8\. Diseño Arquitectónico (Monolito Moderno SPA)**

Estructura de arquitectura de capas del sistema. Al usar Laravel \+ React mediante Inertia.js, se eliminan APIs intermedias innecesarias para formar un monolito moderno y reactivo.  
graph TD  
 U\[Usuarios: Alumnos, Docentes, Admin\] \--\>|Interactúa| CP\[Capa de Presentación \- Frontend\]

    subgraph CP \[Capa de Presentación \- Frontend\]
        R\[React.js: Componentes e Interfaz\] \--\> TW\[Tailwind CSS: Diseño Responsivo\]
        R \--\> V\[Vite: Empaquetador\]
    end

    CP \--\>|Envía peticiones / Recibe props| CE\[Capa de Enlace y Comunicación\]

    subgraph CE \[Capa de Enlace y Comunicación\]
        I\[Inertia.js: Conecta vistas con backend\]
    end

    I \--\> CLN\[Capa de Lógica de Negocio \- Backend\]

    subgraph CLN \[Capa de Lógica de Negocio \- Backend\]
        L\[Laravel PHP: Rutas y Controladores\] \--\> BS\[Breeze & Sanctum: Autenticación\]
        L \--\> DP\[DomPDF: Generador de Constancias\]
    end

    CLN \--\>|Peticiones de datos| CAD\[Capa de Acceso a Datos\]

    subgraph CAD \[Capa de Acceso a Datos\]
        E\[Eloquent ORM: Mapeador Relacional\] \--\> BD\[(MySQL / MariaDB: Base de Datos)\]
    end

## **9\. Diseño de Datos (Modelo Entidad-Relación)**

Modelo físico-relacional optimizado que detalla los tipos de datos principales, claves primarias/foráneas e integridad lógica en base de datos.  
erDiagram  
 users {  
 bigint id PK  
 varchar name  
 varchar email UK  
 timestamp email_verified_at  
 varchar password  
 rol_usuario rol  
 }

    alumnos {
        bigint id PK
        bigint user\_id FK
        varchar matricula UK
        varchar nombre
        varchar apellido\_paterno
        varchar apellido\_materno
        varchar carrera
        int semestre
        int creditos\_acumulados
    }

    docentes {
        bigint id PK
        bigint user\_id FK
        varchar numero\_empleado UK
        varchar nombre
        varchar apellido\_paterno
        varchar apellido\_materno
    }

    actividades {
        bigint id PK
        bigint docente\_id FK
        varchar nombre
        text descripcion
        int creditos
        int cupo\_maximo
        varchar horario
        tipo\_periodo\_actividad tipo\_periodo
    }

    inscripciones {
        bigint id PK
        bigint alumno\_id FK
        bigint activity\_id FK
        int horas\_acumuladas
        estatus\_inscripcion estatus
        varchar ruta\_constancia
    }

    users ||--o| alumnos : "pertenece a (1:1)"
    users ||--o| docentes : "pertenece a (1:1)"
    docentes ||--o{ actividades : "imparte (1:N)"
    alumnos ||--o{ inscripciones : "registra (1:N)"
    actividades ||--o{ inscripciones : "incluye (1:N)"

### **Reglas de Negocio a Nivel de Base de Datos (Integridad)**

1. **Restricción de Inscripción Única:** Para evitar que un alumno se inscriba doble en la misma actividad, se aplica un índice único compuesto en la tabla inscripciones:  
   ALTER TABLE inscripciones ADD UNIQUE KEY \`alumno_actividad_unique\` (\`alumno_id\`, \`activity_id\`);

2. **Validación de Roles en Usuarios (users):** Se utiliza un campo enumerado para el campo rol permitiendo únicamente los valores estáticos: \['alumno', 'docente', 'administrador'\].
3. **Mecanismo de Freno de Cupo:** Cada inserción en la tabla inscripciones dispara una consulta de agregación previa en el backend que verifica la restricción lógica:  
   ![][image1]  
   Si no se cumple, la transacción no se consolida (hace _rollback_) y devuelve un error de validación.

[image1]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABCCAYAAADqrIpKAAARlklEQVR4Xu2dB7RlSVWGt4qKmCMm6BYHzIqKCiL2DKADRtRZRsQGFbOiYkCEGXAQMYJiBqZFRCSoKCguhRFFRVGXCZcKOg0GUMGAkWA4H3U2d9/d59533+vX4TXft1atvmdXnTrn1Knw1646ryNERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERex/t2g4hcdHxSN4iI7ML/bQj3qYkuMHeewtOn8IY94pA41/mfLx4zhVt14yFyvym8YgoP6BGvR7zJFJ4xhX+ewv9O4YYpvP0c94lTeMT8+2LhT2K9XX/devQabz2Ff4v19HdZS7HOC2Kcs1/eYAo/N4Ure8RFAPf2zCn8wRSua3GHxd/EuM65IMv2ZbH/8t31XCaGPzOF50/hi1rcQbh6Cs+LUVdFZAceEqODvhi57RQeH+eukzvX+Z8P7hTj/dHxnS0fO4Vf6caJL5nCi6bw1T3i9YArpvAfU/jvHhGj7F8do/x/qMVdLHxxjDrOPd66xSXPnsJ3xEiDqNjEZTGE3Qf1iH3w6Cmc6MaLhI+IUQZP6xGHwLfEyJtyPlu+tRtmKNu/jIOV737O5Tnu240H5D+n8O/dKCLLZEciR5NHTuElMd7hzVvcfvnGWBZsR5k3nsJnTOFte8QO3GwKL49RtgifJa6Ni1+wcW/c43e2uOR3pvAFsV2wUY5MCn6/R1xCfHCcO8GWHk9E0dmCp/dCcpiC7V9DwSayMw8OBdtRBc8gA+xnxXiHX7UevS9Y8vuLuLQE202m8FdTeFwcbAkvPVN/2iMK7xDDS3AUBNvfTeGN1qNfC57TvQTbm0/hYfO/lyp4IM+FYLtljDpC3oSz8VCSF17dC8lhCrZ/CQWbyM48KDYLNgTBhdzfxbXfZwo36hGHxNnmfyHLBljSxQPE/fMOWdo6KE+JkceSYEPMvUuMwQK4Xl1GxvsClAeBuDddRZ933irGvjsESt7zQfifGGXyDT2icX3sJti4r/NNCrZ/iPEsLHt3eLd7Cbb9UttUFYmI6Hcrx8lB2+Bhcq4EG57rp8ZYVid/+tyDgAeQ/WOb+mvK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
