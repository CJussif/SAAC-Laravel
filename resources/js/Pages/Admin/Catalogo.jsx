import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';
import { GridIcon, UsersIcon, DocumentIcon, PlusIcon, SearchIcon } from '@/Components/Icons';

const ACTIVIDADES = [
    { clave: 'DEP-001', nombre: 'Selección de Basquetbol Femenil', tipo: 'deportiva', docente: 'Mtra. Elena Rosas',    creditos: 2, inscritos: 45, cupo: 50 },
    { clave: 'CUL-042', nombre: 'Taller de Danza Folklórica',       tipo: 'cultural',  docente: 'Lic. Roberto Méndez', creditos: 1, inscritos: 20, cupo: 30 },
    { clave: 'ACA-105', nombre: 'Club de Robótica Avanzada',         tipo: 'academica', docente: 'Ing. Carlos Valdés',  creditos: 3, inscritos: 5,  cupo: 15 },
    { clave: 'DEP-012', nombre: 'Acondicionamiento Físico',          tipo: 'deportiva', docente: 'Prof. Javier Solís',  creditos: 1, inscritos: 36, cupo: 40 },
    { clave: 'CUL-018', nombre: 'Locución y Radio Universitaria',    tipo: 'cultural',  docente: 'Inst. Carlos Fuentes', creditos: 2, inscritos: 25, cupo: 25 },
    { clave: 'ACA-031', nombre: 'Programación Competitiva',           tipo: 'academica', docente: 'Dr. Roberto Sandoval', creditos: 2, inscritos: 8,  cupo: 20 },
];

const TABS = ['Todos', 'Deportivos', 'Culturales', 'Académicos'];

function CupoPill({ inscritos, cupo }) {
    const pct = Math.round((inscritos / cupo) * 100);
    const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500';
    return (
        <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 h-1.5 rounded-full bg-cream-300">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className="text-xs tabular-nums text-gray-500 whitespace-nowrap">{inscritos}/{cupo}</span>
        </div>
    );
}

export default function Catalogo() {
    return (
        <AuthenticatedLayout header="Catálogo Actividades">
            <Head title="Catálogo de Actividades" />

            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Catálogo de Actividades Complementarias</h1>
                        <p className="mt-1 text-sm text-gray-500">Gestiona y administra la oferta de actividades para el ciclo escolar vigente.</p>
                    </div>
                    <button className="btn-guinda flex-shrink-0">
                        <PlusIcon /> Nueva Actividad
                    </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total Actividades"  value="24"  sub="Catálogo actualizado" icon={GridIcon} />
                    <StatCard label="Cupos Disponibles"  value="145" sub="En todas las categorías" icon={UsersIcon} />
                    <StatCard label="Docentes Asignados" value="18"  sub="Este semestre" icon={DocumentIcon} />
                </div>

                {/* Tabla con tabs */}
                <div className="card overflow-hidden">
                    {/* Tabs + búsqueda */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-400 px-5 py-3">
                        <div className="flex gap-1">
                            {TABS.map((tab, i) => (
                                <button
                                    key={tab}
                                    className={[
                                        'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                                        i === 0
                                            ? 'bg-guinda text-white'
                                            : 'text-gray-500 hover:bg-cream-200',
                                    ].join(' ')}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button className="text-xs font-medium text-gray-400 hover:text-guinda transition-colors">
                            ≡ Filtros Avanzados
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Clave', 'Nombre de la Actividad', 'Tipo', 'Docente Responsable', 'Créditos', 'Cupo', 'Acciones'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {ACTIVIDADES.map((a) => (
                                    <tr key={a.clave} className="hover:bg-cream-50 transition-colors">
                                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-500">{a.clave}</td>
                                        <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">{a.nombre}</td>
                                        <td className="px-5 py-3.5"><TipoBadge tipo={a.tipo} /></td>
                                        <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.docente}</td>
                                        <td className="px-5 py-3.5 text-center font-semibold text-gray-700">{a.creditos}</td>
                                        <td className="px-5 py-3.5 whitespace-nowrap"><CupoPill inscritos={a.inscritos} cupo={a.cupo} /></td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex gap-2">
                                                <button className="rounded-md p-1.5 text-gray-400 hover:bg-cream-200 hover:text-guinda transition-colors" title="Editar">
                                                    ✏️
                                                </button>
                                                <button className="rounded-md p-1.5 text-gray-400 hover:bg-cream-200 hover:text-gray-600 transition-colors" title="Ver">
                                                    👁
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer paginación */}
                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">Mostrando 1 – 6 de 24 actividades</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, '…', 4].map((n, i) => (
                                <button
                                    key={i}
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
