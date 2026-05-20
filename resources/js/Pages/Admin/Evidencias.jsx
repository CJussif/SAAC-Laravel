import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head } from '@inertiajs/react';
import { CheckCircleIcon, DocumentIcon, SearchIcon } from '@/Components/Icons';

const SOLICITUDES = [
    {
        id: 1, initials: 'AG', nombre: 'Ana García López',     matricula: '2021045987',
        actividad: 'Conferencia Liderazgo Tecnológico', institucion: 'Tecnológico de Monterrey',
        fecha: '12 Oct 2024', estatus: 'pendiente',
    },
    {
        id: 2, initials: 'CM', nombre: 'Carlos Martínez Ruiz', matricula: '033200913',
        actividad: 'Curso React Avanzado', institucion: 'Platzi',
        fecha: '11 Oct 2024', estatus: 'pendiente',
    },
    {
        id: 3, initials: 'LP', nombre: 'Laura Pérez Gómez',   matricula: '202097234',
        actividad: 'Voluntariado Ambiental', institucion: 'Reforestamos México AC',
        fecha: '10 Oct 2024', estatus: 'pendiente',
    },
    {
        id: 4, initials: 'MR', nombre: 'Miguel Reyes Torres',  matricula: '202134521',
        actividad: 'Hackathon Nacional STEM', institucion: 'CONACYT',
        fecha: '09 Oct 2024', estatus: 'pendiente',
    },
];

const AVATAR_COLORS = ['bg-guinda', 'bg-teal-600', 'bg-amber-600', 'bg-blue-600', 'bg-indigo-600'];

export default function Evidencias() {
    return (
        <AuthenticatedLayout header="Validar Evidencias">
            <Head title="Validación de Evidencias" />

            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Validación de Evidencias</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Revisión de actividades externas pendientes de acreditación.
                        </p>
                    </div>
                    <button className="btn-ghost border border-cream-400">
                        ≡ Filtrar
                    </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Pendientes de Revisión" value="24" sub="Solicitudes en cola"      icon={DocumentIcon}    accent="guinda" />
                    <StatCard label="Acreditadas Hoy"        value="12" sub="Validadas esta sesión"    icon={CheckCircleIcon} />
                    <StatCard label="Rechazadas"             value="3"  sub="Documentación insuficiente" icon={DocumentIcon} />
                </div>

                {/* Tabla */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-cream-400 px-5 py-3">
                        <h2 className="text-sm font-semibold text-gray-700">Solicitudes Recientes</h2>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="search"
                                placeholder="Buscar alumno o control..."
                                className="w-52 rounded-lg border border-cream-400 bg-cream-50 py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none"
                            />
                        </div>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-cream-100">
                            <tr>
                                {['Alumno / No. Control', 'Actividad Externa', 'Fecha Subida', 'Estado', 'Acciones'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-300">
                            {SOLICITUDES.map((s, idx) => (
                                <tr key={s.id} className="hover:bg-cream-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-xs font-bold text-white`}>
                                                {s.initials}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{s.nombre}</p>
                                                <p className="font-mono text-xs text-gray-400">{s.matricula}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-800">{s.actividad}</p>
                                        <p className="text-xs text-gray-400">{s.institucion}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{s.fecha}</td>
                                    <td className="px-5 py-4">
                                        <span className="badge-pendiente">Pendiente</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <button className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-cream-100 transition-colors">
                                                Ver Evidencia
                                            </button>
                                            <button className="rounded-lg bg-guinda px-3 py-1.5 text-xs font-semibold text-white hover:bg-guinda-700 transition-colors">
                                                Validar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">Mostrando 1 a 4 de 34 registros</p>
                        <div className="flex gap-2">
                            <button className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-100">Anterior</button>
                            <button className="rounded-lg bg-guinda px-3 py-1.5 text-xs font-medium text-white hover:bg-guinda-700">Siguiente</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
