import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';

const CREDITOS_META = 5;
const CREDITOS_ACUMULADOS = 3;

const HISTORIAL = [
    {
        id: 1, clave: 'CUL-07', tipo: 'cultural',
        nombre: 'Taller de Danza Folklórica',
        instructor: 'Lic. Roberto Méndez',
        semestre: '2023-2024 / Primavera',
        creditos: 1, asistencia: 92, estatus: 'acreditado',
        folio: 'CON-2024-0012',
    },
    {
        id: 2, clave: 'DEP-01', tipo: 'deportiva',
        nombre: 'Taller de Yoga y Meditación',
        instructor: 'Inst. María Elena Rojas',
        semestre: '2024-2025 / Otoño',
        creditos: 1, asistencia: 88, estatus: 'acreditado',
        folio: 'CON-2024-0047',
    },
    {
        id: 3, clave: 'ACA-08', tipo: 'academica',
        nombre: 'Programación Competitiva Avanzada',
        instructor: 'Dr. Roberto Sandoval',
        semestre: '2024-2025 / Otoño',
        creditos: 1, asistencia: 95, estatus: 'acreditado',
        folio: 'CON-2025-0003',
    },
    {
        id: 4, clave: 'CUL-12', tipo: 'cultural',
        nombre: 'Taller de Teatro Clásico',
        instructor: 'Mtra. Laura Vega',
        semestre: '2024-2025 / Primavera',
        creditos: 2, asistencia: 70, estatus: 'en-curso',
        folio: null,
    },
];

function AsistenciaBar({ pct }) {
    const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-full bg-cream-300">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-medium tabular-nums text-gray-600">{pct}%</span>
        </div>
    );
}

function CreditosRueda() {
    const pct = (CREDITOS_ACUMULADOS / CREDITOS_META) * 100;
    const radio = 44;
    const circunferencia = 2 * Math.PI * radio;
    const dash = (pct / 100) * circunferencia;

    return (
        <div className="flex flex-col items-center gap-1">
            <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={radio} fill="none" stroke="#E8E0D0" strokeWidth="10" />
                <circle
                    cx="55" cy="55" r={radio}
                    fill="none" stroke="#8B1A2E" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circunferencia}`}
                    transform="rotate(-90 55 55)"
                />
                <text x="55" y="50" textAnchor="middle" className="font-bold" fill="#1F2937" fontSize="22" fontWeight="700">
                    {CREDITOS_ACUMULADOS}
                </text>
                <text x="55" y="66" textAnchor="middle" fill="#9CA3AF" fontSize="11">
                    de {CREDITOS_META}
                </text>
            </svg>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Créditos</p>
        </div>
    );
}

export default function Historial() {
    const acreditados = HISTORIAL.filter((h) => h.estatus === 'acreditado');
    const enCurso = HISTORIAL.filter((h) => h.estatus === 'en-curso');

    return (
        <AuthenticatedLayout header="Mi Historial">
            <Head title="Mi Historial" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mi Historial Académico</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Registro de todas tus actividades complementarias, créditos y constancias emitidas.
                    </p>
                </div>

                {/* Resumen de créditos */}
                <div className="card p-6">
                    <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-500">
                        Progreso de Créditos Complementarios
                    </h2>
                    <div className="flex flex-wrap items-center gap-8">
                        <CreditosRueda />

                        <div className="flex-1 space-y-3 min-w-48">
                            {/* Barra grande */}
                            <div>
                                <div className="mb-1.5 flex justify-between text-xs">
                                    <span className="font-semibold text-gray-600">Progreso general</span>
                                    <span className="text-guinda font-bold">
                                        {CREDITOS_ACUMULADOS} / {CREDITOS_META} créditos
                                    </span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-cream-300">
                                    <div
                                        className="h-3 rounded-full bg-guinda transition-all"
                                        style={{ width: `${(CREDITOS_ACUMULADOS / CREDITOS_META) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Mini stats */}
                            <div className="grid grid-cols-3 gap-3 pt-1">
                                <div className="rounded-lg bg-cream-100 p-3 text-center">
                                    <p className="text-xl font-bold text-guinda">{acreditados.length}</p>
                                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Acreditadas</p>
                                </div>
                                <div className="rounded-lg bg-cream-100 p-3 text-center">
                                    <p className="text-xl font-bold text-amber-600">{enCurso.length}</p>
                                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">En Curso</p>
                                </div>
                                <div className="rounded-lg bg-cream-100 p-3 text-center">
                                    <p className="text-xl font-bold text-gray-600">{CREDITOS_META - CREDITOS_ACUMULADOS}</p>
                                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Faltantes</p>
                                </div>
                            </div>
                        </div>

                        {/* Estado final */}
                        <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-cream-400 px-6 py-4">
                            <div className={[
                                'flex h-12 w-12 items-center justify-center rounded-full text-xl',
                                CREDITOS_ACUMULADOS >= CREDITOS_META
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-cream-200 text-gray-400',
                            ].join(' ')}>
                                {CREDITOS_ACUMULADOS >= CREDITOS_META ? '✓' : '○'}
                            </div>
                            <p className="text-center text-xs font-semibold text-gray-500">
                                {CREDITOS_ACUMULADOS >= CREDITOS_META
                                    ? 'Requisito cumplido'
                                    : `Faltan ${CREDITOS_META - CREDITOS_ACUMULADOS} crédito${CREDITOS_META - CREDITOS_ACUMULADOS > 1 ? 's' : ''}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabla de actividades */}
                <div className="card overflow-hidden">
                    <div className="border-b border-cream-400 px-5 py-4">
                        <h2 className="text-sm font-bold text-gray-700">Registro de Actividades</h2>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-cream-100">
                            <tr>
                                {['Clave', 'Actividad', 'Tipo', 'Semestre', 'Asistencia', 'Créditos', 'Estatus', 'Folio'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-300">
                            {HISTORIAL.map((item) => (
                                <tr key={item.id} className="hover:bg-cream-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-500">{item.clave}</td>
                                    <td className="px-5 py-3.5">
                                        <p className="font-medium text-gray-800">{item.nombre}</p>
                                        <p className="text-xs text-gray-400">{item.instructor}</p>
                                    </td>
                                    <td className="px-5 py-3.5"><TipoBadge tipo={item.tipo} /></td>
                                    <td className="px-5 py-3.5 text-xs text-gray-500">{item.semestre}</td>
                                    <td className="px-5 py-3.5">
                                        {item.estatus === 'en-curso'
                                            ? <span className="text-xs text-gray-400 italic">En progreso</span>
                                            : <AsistenciaBar pct={item.asistencia} />
                                        }
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className="font-bold text-gray-700">{item.creditos}</span>
                                    </td>
                                    <td className="px-5 py-3.5"><TipoBadge estatus={item.estatus} /></td>
                                    <td className="px-5 py-3.5">
                                        {item.folio ? (
                                            <span className="font-mono text-xs text-guinda font-medium">{item.folio}</span>
                                        ) : (
                                            <span className="text-xs text-gray-300 italic">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
