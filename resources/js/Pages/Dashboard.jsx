import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import TipoBadge from '@/Components/TipoBadge';
import { Head, usePage } from '@inertiajs/react';
import { UsersIcon, GridIcon, DocumentIcon, CheckCircleIcon } from '@/Components/Icons';

/* ── Placeholder dashboards por rol ─────────────────────────── */

function DashboardAlumno({ user }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Hola, {user.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Revisa tu progreso y gestiona tus actividades complementarias para el ciclo actual.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Créditos Acumulados" value="3" sub="Requeridos para titulación: 5" icon={CheckCircleIcon} />
                <StatCard label="Actividades Inscritas" value="2" sub="Semestre Actual" icon={GridIcon} />
                <StatCard label="Constancias Disponibles" value="1" sub="Listas para descargar" icon={DocumentIcon} />
            </div>

            <div className="card overflow-hidden">
                <div className="border-b border-cream-400 px-5 py-3">
                    <h2 className="text-sm font-semibold text-gray-700">Actividades Inscritas</h2>
                </div>
                <div className="overflow-x-auto">
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
                            <tr className="hover:bg-cream-100 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">Taller de Ajedrez Básico</td>
                                <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">Lun, Mié · 14:00 – 16:00</td>
                                <td className="px-5 py-3.5"><TipoBadge tipo="deportiva" /></td>
                                <td className="px-5 py-3.5"><TipoBadge estatus="en curso" /></td>
                            </tr>
                            <tr className="hover:bg-cream-100 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">Seminario de Liderazgo</td>
                                <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">Vie · 10:00 – 13:00</td>
                                <td className="px-5 py-3.5"><TipoBadge tipo="académica" /></td>
                                <td className="px-5 py-3.5"><TipoBadge estatus="en curso" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function DashboardDocente({ user }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Resumen de tus actividades complementarias para el semestre actual.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Grupos Activos"   value="3"    sub="Este semestre"   icon={GridIcon} />
                <StatCard label="Alumnos Totales"  value="84"   sub="Inscritos"       icon={UsersIcon} />
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

function DashboardAdmin({ user }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Resumen Global</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Vista general del rendimiento y estado del ciclo escolar actual.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Alumnos Inscritos" value="2,450" sub="+8.2% este semestre" icon={UsersIcon} badge="+8.2%" />
                <StatCard label="Cupos Disponibles"       value="185"   sub="Requiere atención"   icon={GridIcon} accent="guinda" />
                <StatCard label="Evidencias por Validar"  value="342"   sub="Pendientes de revisión" icon={DocumentIcon} />
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
    const rol = user?.rol ?? 'alumno';

    const DASHBOARDS = {
        alumno:        <DashboardAlumno user={user} />,
        docente:       <DashboardDocente user={user} />,
        administrador: <DashboardAdmin user={user} />,
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
