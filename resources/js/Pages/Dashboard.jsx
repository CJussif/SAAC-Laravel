import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import TipoBadge from '@/Components/TipoBadge';
import { Head, usePage } from '@inertiajs/react';
import { UsersIcon, GridIcon, DocumentIcon, CheckCircleIcon } from '@/Components/Icons';

/* ── Placeholder dashboards por rol ─────────────────────────── */

function getActivityType(name) {
    name = (name ?? '').toLowerCase();
    if (name.includes('ajedrez') || name.includes('yoga') || name.includes('basquetbol') || name.includes('meditación')) return 'deportiva';
    if (name.includes('danza') || name.includes('teatro') || name.includes('locución') || name.includes('radio') || name.includes('folklórica')) return 'cultural';
    return 'academica';
}

function DashboardAlumno({ user }) {
    const alumno = user.alumno;
    const actividades = alumno?.actividades ?? [];
    const creditosAcumulados = alumno?.creditos_acumulados ?? 0;
    const actividadesInscritas = actividades.length;
    const constanciasDisponibles = actividades.filter(act => act.pivot?.estatus === 'acreditado').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Hola, {user.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Revisa tu progreso y gestiona tus actividades complementarias para el ciclo actual.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Créditos Acumulados" value={creditosAcumulados.toString()} sub="Requeridos para titulación: 5" icon={CheckCircleIcon} />
                <StatCard label="Actividades Inscritas" value={actividadesInscritas.toString()} sub="Semestre Actual" icon={GridIcon} />
                <StatCard label="Constancias Disponibles" value={constanciasDisponibles.toString()} sub="Listas para descargar" icon={DocumentIcon} />
            </div>

            <div className="card overflow-hidden">
                <div className="border-b border-cream-400 px-5 py-3">
                    <h2 className="text-sm font-semibold text-gray-700">Actividades Inscritas</h2>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-cream-100">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Actividad</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Horario</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tipo</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-300">
                        {actividades.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-4 text-center text-xs text-gray-500 bg-cream-50">
                                    No estás inscrito en ninguna actividad este semestre.
                                </td>
                            </tr>
                        ) : (
                            actividades.map((act) => (
                                <tr key={act.id} className="hover:bg-cream-100 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">{act.nombre}</td>
                                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{act.horario || 'Sin horario registrado'}</td>
                                    <td className="px-5 py-3.5"><TipoBadge tipo={getActivityType(act.nombre)} /></td>
                                    <td className="px-5 py-3.5"><TipoBadge estatus={act.pivot?.estatus || 'en curso'} /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DashboardDocente({ user }) {
    const docente = user.docente;
    const actividades = docente?.actividades ?? [];
    const gruposActivos = actividades.length;
    const alumnosTotales = actividades.reduce((acc, act) => acc + (act.alumnos?.length ?? 0), 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Resumen de tus actividades complementarias para el semestre actual.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Grupos Activos"   value={gruposActivos.toString()}    sub="Este semestre"   icon={GridIcon} />
                <StatCard label="Alumnos Totales"  value={alumnosTotales.toString()}   sub="Inscritos"       icon={UsersIcon} />
                <StatCard label="Asistencia Prom." value="92%"  sub="Semana actual"   icon={CheckCircleIcon} />
            </div>

            <div className="card p-5">
                <p className="text-sm text-gray-500">
                    Las vistas de Pase de Lista y Mis Grupos están en construcción.
                </p>
            </div>
        </div>
    );
}

function DashboardAdmin({ user, stats }) {
    const totalAlumnos = stats?.totalAlumnos ?? 0;
    const totalActividades = stats?.totalActividades ?? 0;
    const cuposDisponibles = (stats?.cuposTotales ?? 0) - (stats?.cuposInscritos ?? 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Resumen Global</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Vista general del rendimiento y estado del ciclo escolar actual.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Alumnos"           value={totalAlumnos.toLocaleString()} sub="Registrados en el sistema" icon={UsersIcon} />
                <StatCard label="Cupos Disponibles"       value={cuposDisponibles.toLocaleString()}   sub="En todos los talleres"   icon={GridIcon} accent={cuposDisponibles < 50 ? "guinda" : "green"} />
                <StatCard label="Actividades Activas"     value={totalActividades.toLocaleString()}   sub="En el ciclo escolar" icon={DocumentIcon} />
            </div>

            <div className="card p-5">
                <p className="text-sm text-gray-500">
                    Las vistas de Catálogo, Alumnos y Validación están en construcción.
                </p>
            </div>
        </div>
    );
}

/* ── Componente principal ────────────────────────────────────── */

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    const adminStats = auth.adminStats;
    const rol = user?.rol ?? 'alumno';

    const DASHBOARDS = {
        alumno:        <DashboardAlumno user={user} />,
        docente:       <DashboardDocente user={user} />,
        administrador: <DashboardAdmin user={user} stats={adminStats} />,
    };

    const pageTitle = {
        alumno:        'Panel Estudiante',
        docente:       'Dashboard Docente',
        administrador: 'Panel Administrador',
    }[rol] ?? 'Dashboard';

    return (
        <AuthenticatedLayout header={pageTitle}>
            <Head title={pageTitle} />
            {DASHBOARDS[rol] ?? DASHBOARDS.alumno}
        </AuthenticatedLayout>
    );
}
