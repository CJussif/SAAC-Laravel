import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const GRUPOS = [
    { id: 1, tipo: 'CULTURAL',  nombre: 'Taller de Danza Folklórica', turno: 'Grupo A · Sabatino', activo: true,  inscritos: 24 },
    { id: 2, tipo: 'DEPORTIVA', nombre: 'Deportes Basquetbol',         turno: 'Grupo C · Vespertino', activo: false, inscritos: 18 },
];

const ALUMNOS = [
    { id: 1, matricula: '202145001', nombre: 'Aguilar Morales, Sofía Elena',    asistencia: [true,true,true,true,true],  pct: 95, estatus: 'acreditado' },
    { id: 2, matricula: '202145023', nombre: 'Castillo Reyes, Luis Manuel',     asistencia: [true,false,true,false,true], pct: 65, estatus: 'pendiente'  },
    { id: 3, matricula: '202145088', nombre: 'Hernández Juárez, Valeria',       asistencia: [true,true,true,true,false],  pct: 88, estatus: 'acreditado' },
    { id: 4, matricula: '202145102', nombre: 'López Santos, Diego',             asistencia: [true,true,true,true,true],  pct: 100, estatus: 'acreditado' },
    { id: 5, matricula: '202145117', nombre: 'Martínez Cruz, Paola',            asistencia: [false,true,true,false,true], pct: 60, estatus: 'pendiente'  },
    { id: 6, matricula: '202145134', nombre: 'Ramírez Silva, Juan',             asistencia: [true,true,false,true,true],  pct: 80, estatus: 'pendiente'  },
];

const DIAS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'];

function CheckBox({ checked }) {
    return (
        <div className={[
            'mx-auto h-5 w-5 rounded flex items-center justify-center border-2 transition-colors',
            checked ? 'border-guinda bg-guinda text-white' : 'border-cream-400 bg-white',
        ].join(' ')}>
            {checked && (
                <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3">
                    <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
    );
}

export default function Asistencia() {
    return (
        <AuthenticatedLayout header="Pase de Lista">
            <Head title="Control de Asistencia" />

            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Control de Asistencia</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Gestiona la asistencia y acreditación final de sus grupos asignados para el periodo en curso.
                        </p>
                    </div>
                    <button className="btn-guinda flex-shrink-0">
                        ✔ Realizar Acreditación Final
                    </button>
                </div>

                {/* Selector de grupo */}
                <div>
                    <h2 className="mb-3 text-sm font-semibold text-gray-600">Mis Grupos Asignados</h2>
                    <div className="flex gap-3">
                        {GRUPOS.map((g) => (
                            <div
                                key={g.id}
                                className={[
                                    'flex-1 max-w-xs cursor-pointer rounded-xl border-2 p-4 transition-all',
                                    g.activo
                                        ? 'border-guinda bg-guinda/5'
                                        : 'border-cream-400 bg-white hover:border-guinda/40',
                                ].join(' ')}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className={[
                                            'text-[10px] font-bold uppercase tracking-wider',
                                            g.tipo === 'CULTURAL' ? 'text-amber-600' : 'text-blue-600',
                                        ].join(' ')}>
                                            {g.tipo}
                                        </span>
                                        <p className="mt-0.5 text-sm font-bold text-gray-800">{g.nombre}</p>
                                        <p className="text-xs text-gray-400">{g.turno}</p>
                                    </div>
                                    {g.activo && (
                                        <span className="badge-en-curso text-[10px]">Activo</span>
                                    )}
                                </div>
                                <p className="mt-3 text-xs text-gray-500">
                                    Alumnos Inscritos: <strong className="text-gray-700">{g.inscritos}</strong>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabla de pase de lista */}
                <div className="card overflow-hidden">
                    {/* Header de semana */}
                    <div className="flex items-center justify-between border-b border-cream-400 px-5 py-3">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Pase de Lista — <span className="text-gray-500 font-normal">Semana 12 (18 – 22 Nov)</span>
                        </h2>
                        <div className="flex gap-2">
                            <button className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-100 transition-colors">
                                ← Semana Anterior
                            </button>
                            <button className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-cream-100 transition-colors">
                                Siguiente Semana →
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-10">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Matrícula</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre del Alumno</th>
                                    {DIAS.map((d) => (
                                        <th key={d} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 w-14">{d}</th>
                                    ))}
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">% Asist.</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {ALUMNOS.map((a, idx) => (
                                    <tr key={a.id} className="hover:bg-cream-50 transition-colors">
                                        <td className="px-4 py-3.5 text-xs text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{a.matricula}</td>
                                        <td className="px-4 py-3.5 font-medium text-gray-800">{a.nombre}</td>
                                        {a.asistencia.map((presente, di) => (
                                            <td key={di} className="px-3 py-3.5 text-center">
                                                <CheckBox checked={presente} />
                                            </td>
                                        ))}
                                        <td className="px-4 py-3.5 text-center">
                                            <span className={[
                                                'text-sm font-bold tabular-nums',
                                                a.pct >= 80 ? 'text-green-600' : a.pct >= 60 ? 'text-amber-600' : 'text-red-500',
                                            ].join(' ')}>
                                                {a.pct}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            {a.estatus === 'acreditado'
                                                ? <span className="badge-acreditado">Acreditado</span>
                                                : <span className="badge-pendiente">Pendiente</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
