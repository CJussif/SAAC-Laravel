import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';
import { DocumentIcon, CheckCircleIcon, UsersIcon, SearchIcon } from '@/Components/Icons';

const CONSTANCIAS = [
    { folio: 'CON-2025-0001', alumno: 'Ana García López',      matricula: '210001', carrera: 'ISC', actividad: 'Taller de Danza Folklórica',     tipo: 'cultural',  creditos: 1, fecha: '2025-01-15', estatus: 'emitida' },
    { folio: 'CON-2025-0002', alumno: 'Luis Pérez Ramírez',    matricula: '210045', carrera: 'IGE', actividad: 'Selección de Basquetbol Femenil', tipo: 'deportiva', creditos: 2, fecha: '2025-01-18', estatus: 'emitida' },
    { folio: 'CON-2025-0003', alumno: 'María Torres Vega',     matricula: '210078', carrera: 'ISC', actividad: 'Club de Robótica Avanzada',        tipo: 'academica', creditos: 3, fecha: '2025-01-22', estatus: 'emitida' },
    { folio: 'CON-2025-0004', alumno: 'Sofía Ramos Castro',    matricula: '210134', carrera: 'ISC', actividad: 'Programación Competitiva',         tipo: 'academica', creditos: 2, fecha: '2025-02-03', estatus: 'emitida' },
    { folio: 'CON-2025-0005', alumno: 'Diego Flores Núñez',    matricula: '210167', carrera: 'IGE', actividad: 'Taller de Yoga y Meditación',      tipo: 'deportiva', creditos: 1, fecha: '2025-02-10', estatus: 'emitida' },
    { folio: 'CON-2025-0006', alumno: 'Valeria López Soto',    matricula: '210188', carrera: 'IDS', actividad: 'Locución y Radio Universitaria',   tipo: 'cultural',  creditos: 2, fecha: '2025-02-14', estatus: 'pendiente' },
];

const ESTATUS_STYLE = {
    'emitida':  'bg-green-100 text-green-700',
    'pendiente': 'bg-amber-100 text-amber-700',
};

export default function Constancias() {
    const emitidas  = CONSTANCIAS.filter((c) => c.estatus === 'emitida').length;
    const pendientes = CONSTANCIAS.filter((c) => c.estatus === 'pendiente').length;

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
                    <StatCard label="Total Emitidas"  value={emitidas.toString()}    sub="Este ciclo escolar"    icon={DocumentIcon}    />
                    <StatCard label="Pendientes"       value={pendientes.toString()}  sub="En proceso de emisión" icon={CheckCircleIcon} accent="amber" />
                    <StatCard label="Alumnos Cubiertos" value={CONSTANCIAS.length.toString()} sub="Crédito cumplido" icon={UsersIcon} accent="green" />
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
                                placeholder="Buscar por folio, alumno o matrícula..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            <option>Todos los tipos</option>
                            <option>Deportiva</option>
                            <option>Cultural</option>
                            <option>Académica</option>
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
                            {CONSTANCIAS.map((c) => (
                                <tr key={c.folio} className="hover:bg-cream-50 transition-colors">
                                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-guinda">{c.folio}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-guinda text-[10px] font-bold text-white">
                                                {c.alumno.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{c.alumno}</p>
                                                <p className="text-[10px] font-mono text-gray-400">{c.matricula}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="rounded bg-cream-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{c.carrera}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-xs font-medium text-gray-700 max-w-[180px] truncate">{c.actividad}</td>
                                    <td className="px-4 py-3.5"><TipoBadge tipo={c.tipo} /></td>
                                    <td className="px-4 py-3.5 text-center font-bold text-gray-700">{c.creditos}</td>
                                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{c.fecha}</td>
                                    <td className="px-4 py-3.5">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTATUS_STYLE[c.estatus]}`}>
                                            {c.estatus === 'emitida' ? 'Emitida' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex gap-1">
                                            <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-200 hover:text-guinda transition-colors">
                                                Ver PDF
                                            </button>
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

                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">Mostrando {CONSTANCIAS.length} constancias</p>
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
