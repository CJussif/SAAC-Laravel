import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';
import { SearchIcon } from '@/Components/Icons';

const EXPEDIENTES = [
    {
        matricula: '210001', nombre: 'Ana García López',       carrera: 'ISC', semestre: 6,
        actividad: 'Taller de Danza Folklórica', tipo: 'cultural',
        asistencia: 92, creditos: 1, estatus: 'acreditado',
        sesiones: { total: 24, cursadas: 22 },
    },
    {
        matricula: '210045', nombre: 'Luis Pérez Ramírez',     carrera: 'IGE', semestre: 4,
        actividad: 'Taller de Danza Folklórica', tipo: 'cultural',
        asistencia: 85, creditos: 1, estatus: 'en-curso',
        sesiones: { total: 24, cursadas: 20 },
    },
    {
        matricula: '210078', nombre: 'María Torres Vega',      carrera: 'ISC', semestre: 8,
        actividad: 'Taller de Teatro Clásico', tipo: 'cultural',
        asistencia: 78, creditos: 2, estatus: 'en-curso',
        sesiones: { total: 16, cursadas: 12 },
    },
    {
        matricula: '210103', nombre: 'Carlos Mendoza Ríos',    carrera: 'IDS', semestre: 2,
        actividad: 'Taller de Danza Folklórica', tipo: 'cultural',
        asistencia: 55, creditos: 1, estatus: 'pendiente',
        sesiones: { total: 24, cursadas: 13 },
    },
    {
        matricula: '210134', nombre: 'Sofía Ramos Castro',     carrera: 'ISC', semestre: 6,
        actividad: 'Taller de Teatro Clásico', tipo: 'cultural',
        asistencia: 90, creditos: 2, estatus: 'en-curso',
        sesiones: { total: 16, cursadas: 14 },
    },
];

const ESTATUS_STYLE = {
    'acreditado': 'bg-green-100 text-green-700',
    'en-curso':   'bg-amber-100 text-amber-700',
    'pendiente':  'bg-red-100 text-red-600',
};
const ESTATUS_LABEL = {
    'acreditado': 'Acreditado',
    'en-curso':   'En Curso',
    'pendiente':  'En Riesgo',
};

function AsistenciaBar({ pct }) {
    const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
    const text  = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-600';
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-cream-300">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs font-semibold tabular-nums ${text}`}>{pct}%</span>
        </div>
    );
}

export default function Expedientes() {
    return (
        <AuthenticatedLayout header="Expedientes">
            <Head title="Expedientes de Alumnos" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Expedientes de Alumnos</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Historial detallado de asistencia y avance de los alumnos en tus actividades.
                    </p>
                </div>

                {/* Alerta alumnos en riesgo */}
                {EXPEDIENTES.some((e) => e.estatus === 'pendiente') && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <span className="mt-0.5 text-red-500">⚠️</span>
                        <div>
                            <p className="text-sm font-semibold text-red-700">Alumnos en riesgo de no acreditar</p>
                            <p className="mt-0.5 text-xs text-red-500">
                                {EXPEDIENTES.filter((e) => e.estatus === 'pendiente').length} alumno(s) tienen asistencia por debajo del 60% mínimo requerido.
                            </p>
                        </div>
                    </div>
                )}

                <div className="card overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-cream-400 px-5 py-3">
                        <div className="relative flex-1 min-w-48">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="search"
                                placeholder="Buscar alumno o matrícula..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            <option>Todas las actividades</option>
                            <option>Taller de Danza Folklórica</option>
                            <option>Taller de Teatro Clásico</option>
                        </select>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            <option>Todos los estatus</option>
                            <option>Acreditado</option>
                            <option>En Curso</option>
                            <option>En Riesgo</option>
                        </select>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-cream-100">
                            <tr>
                                {['Matrícula', 'Alumno', 'Actividad', 'Sesiones', 'Asistencia', 'Estatus', 'Crédito'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-300">
                            {EXPEDIENTES.map((exp) => (
                                <tr key={exp.matricula + exp.actividad} className="hover:bg-cream-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-500">{exp.matricula}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-guinda text-[10px] font-bold text-white">
                                                {exp.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{exp.nombre}</p>
                                                <p className="text-[10px] text-gray-400">{exp.carrera} · {exp.semestre}° semestre</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-xs font-medium text-gray-700">{exp.actividad}</p>
                                        <TipoBadge tipo={exp.tipo} />
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className="tabular-nums text-xs font-medium text-gray-600">
                                            {exp.sesiones.cursadas}/{exp.sesiones.total}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5"><AsistenciaBar pct={exp.asistencia} /></td>
                                    <td className="px-5 py-3.5">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTATUS_STYLE[exp.estatus]}`}>
                                            {ESTATUS_LABEL[exp.estatus]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className="font-bold text-gray-700">{exp.creditos}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">Mostrando {EXPEDIENTES.length} registros</p>
                        <button className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-cream-100 transition-colors">
                            Exportar lista
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
