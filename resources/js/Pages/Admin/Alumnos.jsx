import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head } from '@inertiajs/react';
import { UsersIcon, CheckCircleIcon, ClipboardIcon, SearchIcon, PlusIcon } from '@/Components/Icons';

const ALUMNOS = [
    { id: 1, matricula: '210001', nombre: 'Ana García López',       carrera: 'ISC', semestre: 6, creditos: 3, meta: 5, estatus: 'En Progreso' },
    { id: 2, matricula: '210045', nombre: 'Luis Pérez Ramírez',     carrera: 'IGE', semestre: 4, creditos: 5, meta: 5, estatus: 'Acreditado' },
    { id: 3, matricula: '210078', nombre: 'María Torres Vega',      carrera: 'ISC', semestre: 8, creditos: 5, meta: 5, estatus: 'Acreditado' },
    { id: 4, matricula: '210103', nombre: 'Carlos Mendoza Ríos',    carrera: 'IDS', semestre: 2, creditos: 0, meta: 5, estatus: 'Sin Iniciar' },
    { id: 5, matricula: '210134', nombre: 'Sofía Ramos Castro',     carrera: 'ISC', semestre: 6, creditos: 2, meta: 5, estatus: 'En Progreso' },
    { id: 6, matricula: '210167', nombre: 'Diego Flores Núñez',     carrera: 'IGE', semestre: 4, creditos: 4, meta: 5, estatus: 'En Progreso' },
    { id: 7, matricula: '210188', nombre: 'Valeria López Soto',     carrera: 'IDS', semestre: 8, creditos: 5, meta: 5, estatus: 'Acreditado' },
    { id: 8, matricula: '210209', nombre: 'Roberto Chávez Medina',  carrera: 'ISC', semestre: 2, creditos: 1, meta: 5, estatus: 'En Progreso' },
];

const CARRERAS = ['Todas las Carreras', 'ISC', 'IGE', 'IDS'];

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

export default function Alumnos() {
    const acreditados = ALUMNOS.filter((a) => a.estatus === 'Acreditado').length;
    const enProgreso  = ALUMNOS.filter((a) => a.estatus === 'En Progreso').length;

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
                    <button className="btn-guinda flex-shrink-0">
                        <PlusIcon /> Agregar Alumno
                    </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total de Alumnos"  value={ALUMNOS.length.toString()} sub="Registrados en el sistema" icon={UsersIcon} />
                    <StatCard label="Créditos Acreditados" value={acreditados.toString()} sub="Requisito cumplido"       icon={CheckCircleIcon} accent="green" />
                    <StatCard label="En Progreso"       value={enProgreso.toString()}     sub="Requieren seguimiento"   icon={ClipboardIcon} accent="amber" />
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
                                placeholder="Buscar por nombre o matrícula..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            {CARRERAS.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            <option>Todos los Estatus</option>
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
                                {ALUMNOS.map((alumno) => (
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
                                            <CreditosMini creditos={alumno.creditos} meta={alumno.meta} />
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTATUS_STYLE[alumno.estatus]}`}>
                                                {alumno.estatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex gap-1">
                                                <button
                                                    title="Ver expediente"
                                                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-200 hover:text-guinda transition-colors"
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    title="Editar"
                                                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-200 hover:text-gray-700 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">Mostrando 1 – 8 de 312 alumnos</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, '…', 40].map((n, i) => (
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
