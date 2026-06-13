import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';
import { SearchIcon } from '@/Components/Icons';

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
                {expedientes.some((e) => e.porcentaje_asistencia < 60 && e.estatus === 'en_curso') && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <span className="mt-0.5 text-red-500">⚠️</span>
                        <div>
                            <p className="text-sm font-semibold text-red-700">Alumnos en riesgo de no acreditar</p>
                            <p className="mt-0.5 text-xs text-red-500">
                                {expedientes.filter((e) => e.porcentaje_asistencia < 60 && e.estatus === 'en_curso').length} alumno(s) tienen asistencia por debajo del 60% mínimo requerido.
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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar alumno o matrícula..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
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
                    </div>

                    <div className="overflow-x-auto">
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
                                {expedientesFiltrados.map((exp) => (
                                    <tr key={exp.matricula + exp.nombre_actividad} className="hover:bg-cream-50 transition-colors">
                                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-500">{exp.matricula}</td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
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
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <p className="text-xs font-medium text-gray-700">{exp.nombre_actividad}</p>
                                            <TipoBadge tipo={exp.tipo} />
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="tabular-nums text-xs font-medium text-gray-600">
                                                {exp.sesiones_cursadas}/{exp.sesiones_total}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5"><AsistenciaBar pct={exp.porcentaje_asistencia} /></td>
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
                    </div>

                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">Mostrando {expedientesFiltrados.length} registros</p>
                        <button className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-cream-100 transition-colors">
                            Exportar lista
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
