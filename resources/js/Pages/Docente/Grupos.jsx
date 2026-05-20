import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';

const GRUPOS = [
    {
        id: 1,
        clave: 'CUL-07',
        nombre: 'Taller de Danza Folklórica',
        tipo: 'cultural',
        horario: 'Lun, Mié y Vie — 09:00 a 11:00 hrs',
        periodo: 'Semestral',
        creditos: 1,
        inscritos: 30,
        cupo: 50,
        activo: true,
    },
    {
        id: 2,
        clave: 'CUL-12',
        nombre: 'Taller de Teatro Clásico',
        tipo: 'cultural',
        horario: 'Mar y Jue — 14:00 a 16:00 hrs',
        periodo: 'Semestral',
        creditos: 2,
        inscritos: 22,
        cupo: 25,
        activo: true,
    },
    {
        id: 3,
        clave: 'CUL-03',
        nombre: 'Coro Institucional TESCHA',
        tipo: 'cultural',
        horario: 'Vie — 16:00 a 18:00 hrs',
        periodo: 'Intersemestral',
        creditos: 1,
        inscritos: 18,
        cupo: 30,
        activo: false,
    },
];

const ALUMNOS = {
    1: [
        { matricula: '210001', nombre: 'Ana García López',       carrera: 'ISC', asistencia: 92, estatus: 'acreditado' },
        { matricula: '210045', nombre: 'Luis Pérez Ramírez',     carrera: 'IGE', asistencia: 85, estatus: 'en-curso'   },
        { matricula: '210078', nombre: 'María Torres Vega',      carrera: 'ISC', asistencia: 78, estatus: 'en-curso'   },
        { matricula: '210103', nombre: 'Carlos Mendoza Ríos',    carrera: 'IDS', asistencia: 55, estatus: 'pendiente'  },
        { matricula: '210134', nombre: 'Sofía Ramos Castro',     carrera: 'ISC', asistencia: 90, estatus: 'en-curso'   },
    ],
    2: [
        { matricula: '210167', nombre: 'Diego Flores Núñez',     carrera: 'IGE', asistencia: 88, estatus: 'en-curso'  },
        { matricula: '210188', nombre: 'Valeria López Soto',     carrera: 'IDS', asistencia: 95, estatus: 'en-curso'  },
        { matricula: '210209', nombre: 'Roberto Chávez Medina',  carrera: 'ISC', asistencia: 60, estatus: 'pendiente' },
    ],
    3: [],
};

const ESTATUS_COLOR = {
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
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-cream-300">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs font-semibold tabular-nums ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                {pct}%
            </span>
        </div>
    );
}

import { useState } from 'react';

export default function Grupos() {
    const [grupoActivo, setGrupoActivo] = useState(GRUPOS[0]);
    const alumnos = ALUMNOS[grupoActivo.id] ?? [];

    return (
        <AuthenticatedLayout header="Mis Grupos">
            <Head title="Mis Grupos" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mis Grupos</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Selecciona un grupo para ver el listado de alumnos inscritos y su seguimiento de asistencia.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* ── Panel izquierdo: lista de grupos ── */}
                    <aside className="w-full space-y-2 lg:w-72 lg:flex-shrink-0">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Actividades asignadas
                        </p>
                        {GRUPOS.map((g) => (
                            <button
                                key={g.id}
                                onClick={() => setGrupoActivo(g)}
                                className={[
                                    'w-full rounded-xl border p-4 text-left transition-all',
                                    grupoActivo.id === g.id
                                        ? 'border-guinda bg-guinda/5 shadow-sm'
                                        : 'border-cream-400 bg-white hover:border-guinda/40 hover:bg-cream-50',
                                ].join(' ')}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-mono text-[10px] font-bold text-gray-400">{g.clave}</p>
                                        <p className={`mt-0.5 text-sm font-semibold leading-snug ${grupoActivo.id === g.id ? 'text-guinda' : 'text-gray-800'}`}>
                                            {g.nombre}
                                        </p>
                                    </div>
                                    <TipoBadge tipo={g.tipo} />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                                    <span>{g.inscritos}/{g.cupo} alumnos</span>
                                    <span className={g.activo ? 'text-green-600 font-medium' : 'text-gray-400'}>
                                        {g.activo ? '● Activo' : '○ Cerrado'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </aside>

                    {/* ── Panel derecho: lista de alumnos ─── */}
                    <div className="flex-1 min-w-0">
                        <div className="card overflow-hidden">
                            {/* Header del grupo seleccionado */}
                            <div className="border-b border-cream-400 bg-cream-50 px-5 py-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold text-gray-800">{grupoActivo.nombre}</h2>
                                            <TipoBadge tipo={grupoActivo.tipo} />
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            {grupoActivo.horario} · {grupoActivo.periodo} · {grupoActivo.creditos} crédito{grupoActivo.creditos > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="rounded-full bg-cream-200 px-3 py-1 font-semibold text-gray-600">
                                            {alumnos.length} inscrito{alumnos.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
                                            {alumnos.filter((a) => a.estatus === 'acreditado').length} acreditado{alumnos.filter((a) => a.estatus === 'acreditado').length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {alumnos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="mb-3 text-4xl">📭</div>
                                    <p className="font-semibold text-gray-600">Sin alumnos inscritos</p>
                                    <p className="mt-1 text-xs text-gray-400">Este grupo no tiene inscripciones activas.</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-cream-100">
                                        <tr>
                                            {['Matrícula', 'Alumno', 'Carrera', 'Asistencia', 'Estatus', 'Acciones'].map((h) => (
                                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cream-300">
                                        {alumnos.map((a) => (
                                            <tr key={a.matricula} className="hover:bg-cream-50 transition-colors">
                                                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-500">{a.matricula}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-guinda text-[10px] font-bold text-white">
                                                            {a.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{a.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="rounded bg-cream-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{a.carrera}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <AsistenciaBar pct={a.asistencia} />
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTATUS_COLOR[a.estatus]}`}>
                                                        {ESTATUS_LABEL[a.estatus]}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-200 hover:text-guinda transition-colors">
                                                        Ver expediente
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
