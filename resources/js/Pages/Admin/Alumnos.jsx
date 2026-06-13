import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head, useForm, router } from '@inertiajs/react';
import { UsersIcon, CheckCircleIcon, ClipboardIcon, SearchIcon } from '@/Components/Icons';

const ESTATUS_STYLE = {
    'Acreditado':  'bg-green-100 text-green-700',
    'En Progreso': 'bg-amber-100 text-amber-700',
    'Sin Iniciar': 'bg-gray-100 text-gray-500',
};

function CreditosMini({ creditos, meta }) {
    const pct = (creditos / meta) * 100;
    const color = creditos >= meta ? 'bg-green-500' : creditos > 0 ? 'bg-guinda' : 'bg-gray-300';
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-full bg-cream-300">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className="text-xs font-medium tabular-nums text-gray-600">{creditos}/{meta}</span>
        </div>
    );
}

export default function Alumnos({ alumnos, kpis, filters }) {
    const [editando, setEditando] = useState(null);
    const [search, setSearch]   = useState(filters?.search ?? '');
    const [carrera, setCarrera] = useState(filters?.carrera ?? '');
    const [estatus, setEstatus] = useState(filters?.estatus ?? '');

    const { data, setData, patch, processing, errors, reset } = useForm({
        creditos_acumulados: '',
    });

    const aplicarFiltro = (nuevosFiltros) => {
        router.get(route('admin.alumnos'), nuevosFiltros, { preserveState: true, replace: true });
    };

    const abrirEditar = (alumno) => {
        setEditando(alumno);
        setData('creditos_acumulados', alumno.creditos_acumulados);
    };

    const cerrarEditar = () => { setEditando(null); reset(); };

    const guardarCreditos = (e) => {
        e.preventDefault();
        patch(route('admin.alumnos.update', editando.id), { onSuccess: cerrarEditar });
    };

    return (
        <AuthenticatedLayout header="Gestión de Alumnos">
            <Head title="Gestión de Alumnos" />

            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Alumnos</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Consulta el avance de créditos complementarios de todos los estudiantes del plantel.
                        </p>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total de Alumnos"     value={kpis.total.toString()}       sub="Registrados en el sistema" icon={UsersIcon} />
                    <StatCard label="Créditos Acreditados" value={kpis.acreditados.toString()} sub="Requisito cumplido"        icon={CheckCircleIcon} accent="green" />
                    <StatCard label="En Progreso"          value={kpis.en_progreso.toString()}  sub="Requieren seguimiento"    icon={ClipboardIcon} accent="amber" />
                </div>

                {/* Tabla */}
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
                                onChange={(e) => { setSearch(e.target.value); aplicarFiltro({ search: e.target.value, carrera, estatus }); }}
                                placeholder="Buscar por nombre o matrícula..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
                        <select
                            value={carrera}
                            onChange={(e) => { setCarrera(e.target.value); aplicarFiltro({ search, carrera: e.target.value, estatus }); }}
                            className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none"
                        >
                            <option value="">Todas las Carreras</option>
                            {['ISC', 'IGE', 'IDS'].map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <select
                            value={estatus}
                            onChange={(e) => { setEstatus(e.target.value); aplicarFiltro({ search, carrera, estatus: e.target.value }); }}
                            className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none"
                        >
                            <option value="">Todos los Estatus</option>
                            <option>Acreditado</option>
                            <option>En Progreso</option>
                            <option>Sin Iniciar</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Matrícula', 'Alumno', 'Carrera', 'Semestre', 'Créditos', 'Estatus', 'Acciones'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {alumnos.data.map((alumno) => (
                                    <tr key={alumno.id} className="hover:bg-cream-50 transition-colors">
                                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-500">
                                            {alumno.matricula}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-guinda text-xs font-bold text-white">
                                                    {alumno.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <span className="font-medium text-gray-800">{alumno.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <span className="rounded bg-cream-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                                {alumno.carrera}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center text-sm text-gray-600">
                                            {alumno.semestre}°
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <CreditosMini creditos={alumno.creditos_acumulados} meta={alumno.creditos_requeridos} />
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTATUS_STYLE[alumno.estatus] ?? 'bg-gray-100 text-gray-500'}`}>
                                                {alumno.estatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => abrirEditar(alumno)}
                                                title="Editar"
                                                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-200 hover:text-gray-700 transition-colors"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Paginación */}
                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">
                            Mostrando {alumnos.from ?? 0}–{alumnos.to ?? 0} de {alumnos.total} alumnos
                        </p>
                        <div className="flex gap-1">
                            {alumnos.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={[
                                        'h-7 min-w-[28px] rounded-md px-2 text-xs font-medium transition-colors',
                                        link.active
                                            ? 'bg-guinda text-white'
                                            : 'text-gray-500 hover:bg-cream-200 disabled:opacity-40',
                                    ].join(' ')}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            {editando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="mb-1 text-lg font-bold text-gray-800">Editar créditos</h3>
                        <p className="mb-4 text-sm text-gray-500">{editando.nombre}</p>
                        <form onSubmit={guardarCreditos} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Créditos acumulados (0–10)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={data.creditos_acumulados}
                                    onChange={(e) => setData('creditos_acumulados', parseInt(e.target.value))}
                                    className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                                />
                                {errors.creditos_acumulados && (
                                    <p className="mt-1 text-xs text-red-500">{errors.creditos_acumulados}</p>
                                )}
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={cerrarEditar}
                                    className="rounded-lg border border-cream-400 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-cream-100">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} className="btn-guinda">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
