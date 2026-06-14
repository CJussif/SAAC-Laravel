import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { DocumentIcon, CheckCircleIcon, UsersIcon, SearchIcon } from '@/Components/Icons';

const ESTATUS_STYLE = {
    'emitida':  'bg-green-100 text-green-700',
    'pendiente': 'bg-amber-100 text-amber-700',
};

export default function Constancias({ constancias, kpis, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [tipo, setTipo]     = useState(filters?.tipo ?? '');

    const aplicarFiltro = (nuevosFiltros) => {
        router.get(route('admin.constancias'), nuevosFiltros, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header="Constancias">
            <Head title="Gestión de Constancias" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Constancias</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Registro y control de todas las constancias emitidas en el ciclo escolar vigente.
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total Emitidas"     value={kpis.total.toString()}             sub="Este ciclo escolar"         icon={DocumentIcon} />
                    <StatCard label="Pendientes"         value="0"                                  sub="Sin constancias pendientes" icon={CheckCircleIcon} accent="amber" />
                    <StatCard label="Alumnos Cubiertos"  value={kpis.alumnos_cubiertos.toString()} sub="Crédito cumplido"           icon={UsersIcon} accent="green" />
                </div>

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
                                onChange={(e) => { setSearch(e.target.value); aplicarFiltro({ search: e.target.value, tipo }); }}
                                placeholder="Buscar por folio, alumno o matrícula..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
                        <select
                            value={tipo}
                            onChange={(e) => { setTipo(e.target.value); aplicarFiltro({ search, tipo: e.target.value }); }}
                            className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="yoga">Deportiva</option>
                            <option value="danza">Cultural</option>
                        </select>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            <option>Todos los estatus</option>
                            <option>Emitida</option>
                            <option>Pendiente</option>
                        </select>
                        <button className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-cream-100 transition-colors">
                            Exportar CSV
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Folio', 'Alumno', 'Carrera', 'Actividad', 'Tipo', 'Créditos', 'Fecha de Emisión', 'Estatus', 'Acciones'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {constancias.map((c) => (
                                    <tr key={c.folio} className="hover:bg-cream-50 transition-colors">
                                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-guinda">{c.folio}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-guinda text-[10px] font-bold text-white">
                                                    {c.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{c.nombre}</p>
                                                    <p className="text-[10px] font-mono text-gray-400">{c.matricula}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className="rounded bg-cream-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{c.carrera}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs font-medium text-gray-700 max-w-[180px] truncate">{c.actividad}</td>
                                        <td className="px-4 py-3.5"><TipoBadge tipo={c.tipo} /></td>
                                        <td className="px-4 py-3.5 text-center font-bold text-gray-700">{c.creditos}</td>
                                        <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{c.fecha}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTATUS_STYLE[c.estatus] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {c.estatus === 'emitida' ? 'Emitida' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex gap-1">
                                                {c.ruta_constancia && (
                                                    <a
                                                        href={`/storage/${c.ruta_constancia}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-200 hover:text-guinda transition-colors"
                                                    >
                                                        Ver PDF
                                                    </a>
                                                )}
                                                {c.estatus === 'pendiente' && (
                                                    <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 transition-colors">
                                                        Emitir
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">Mostrando {constancias.length} constancias</p>
                        <div className="flex gap-1">
                            {[1, 2, 3].map((n) => (
                                <button
                                    key={n}
                                    className={[
                                        'h-7 min-w-[28px] rounded-md px-2 text-xs font-medium transition-colors',
                                        n === 1 ? 'bg-guinda text-white' : 'text-gray-500 hover:bg-cream-200',
                                    ].join(' ')}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
