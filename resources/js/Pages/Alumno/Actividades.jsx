import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TipoBadge from '@/Components/TipoBadge';
import { Head } from '@inertiajs/react';
import { SearchIcon } from '@/Components/Icons';

const ACTIVIDADES = [
    {
        id: 1, tipo: 'deportiva', clave: 'DEP-01',
        nombre: 'Taller de Yoga y Meditación',
        horario: 'Mar y Jue, 16:00 – 18:00 hrs',
        instructor: 'Inst. María Elena Rojas',
        creditos: 1, inscritos: 32, cupo: 36,
        estatus: 'disponible',
        color: 'from-blue-500 to-blue-700',
    },
    {
        id: 2, tipo: 'cultural', clave: 'CUL-04',
        nombre: 'Locución y Radio Universitaria',
        horario: 'Lun y Mié, 14:00 – 16:00 hrs',
        instructor: 'Inst. Carlos Fuentes',
        creditos: 2, inscritos: 25, cupo: 25,
        estatus: 'agotado',
        color: 'from-amber-500 to-amber-700',
    },
    {
        id: 3, tipo: 'academica', clave: 'ACA-08',
        nombre: 'Programación Competitiva Avanzada',
        horario: 'Vie, 10:00 – 14:00 hrs',
        instructor: 'Dr. Roberto Sandoval',
        creditos: 2, inscritos: 8, cupo: 20,
        estatus: 'disponible',
        color: 'from-teal-500 to-teal-700',
    },
    {
        id: 4, tipo: 'cultural', clave: 'CUL-07',
        nombre: 'Taller de Danza Folklórica',
        horario: 'Lun, Mié y Vie, 09:00 – 11:00 hrs',
        instructor: 'Lic. Roberto Méndez',
        creditos: 1, inscritos: 30, cupo: 50,
        estatus: 'disponible',
        color: 'from-rose-500 to-rose-700',
    },
    {
        id: 5, tipo: 'deportiva', clave: 'DEP-03',
        nombre: 'Selección de Basquetbol Femenil',
        horario: 'Mar y Jue, 16:00 – 18:00 hrs',
        instructor: 'Mtra. Elena Rosas',
        creditos: 2, inscritos: 20, cupo: 20,
        estatus: 'agotado',
        color: 'from-indigo-500 to-indigo-700',
    },
    {
        id: 6, tipo: 'academica', clave: 'ACA-03',
        nombre: 'Club de Robótica Avanzada',
        horario: 'Sáb, 09:00 – 13:00 hrs',
        instructor: 'Ing. Carlos Valdés',
        creditos: 3, inscritos: 13, cupo: 15,
        estatus: 'disponible',
        color: 'from-green-500 to-green-700',
    },
];

function CupoBar({ inscritos, cupo }) {
    const pct = Math.round((inscritos / cupo) * 100);
    const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500';
    return (
        <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Disponibilidad</span>
                <span className="font-medium text-gray-600">{inscritos} / {cupo} lugares</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-cream-300">
                <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
        </div>
    );
}

function ActividadCard({ act }) {
    const agotado = act.estatus === 'agotado';
    return (
        <div className="card flex flex-col overflow-hidden">
            {/* Header con gradiente */}
            <div className={`relative h-28 bg-gradient-to-br ${act.color} flex items-end p-3`}>
                <TipoBadge tipo={act.tipo} />
                {agotado && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                        Grupo Lleno
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{act.clave}</p>
                    <h3 className="mt-0.5 text-sm font-bold text-gray-800 leading-snug">{act.nombre}</h3>
                </div>

                <div className="space-y-1 text-xs text-gray-500">
                    <p>⏰ {act.horario}</p>
                    <p>👤 {act.instructor}</p>
                    <p>🎖 Valor: {act.creditos} Crédito{act.creditos > 1 ? 's' : ''} Complementario{act.creditos > 1 ? 's' : ''}</p>
                </div>

                <CupoBar inscritos={act.inscritos} cupo={act.cupo} />

                <button
                    disabled={agotado}
                    className={[
                        'mt-auto w-full rounded-lg py-2 text-sm font-semibold transition-all active:scale-[0.98]',
                        agotado
                            ? 'cursor-not-allowed bg-cream-300 text-gray-400'
                            : 'bg-guinda text-white hover:bg-guinda-700',
                    ].join(' ')}
                >
                    {agotado ? 'Agotado' : 'Inscribirse'}
                </button>
            </div>
        </div>
    );
}

export default function Actividades() {
    return (
        <AuthenticatedLayout header="Catálogo de Actividades">
            <Head title="Catálogo de Actividades" />

            <div className="flex gap-6">
                {/* ── Columna principal ─────────────────── */}
                <div className="flex-1 min-w-0 space-y-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Inscripción de Actividades</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Explora y regístrate en las actividades complementarias disponibles para este ciclo escolar.
                        </p>
                    </div>

                    {/* Barra de búsqueda + filtros */}
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-48">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="search"
                                placeholder="Buscar por nombre, instructor..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            <option>Categoría: Todas</option>
                            <option>Deportiva</option>
                            <option>Cultural</option>
                            <option>Académica</option>
                        </select>
                        <select className="rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm text-gray-600 focus:border-guinda focus:outline-none">
                            <option>Estatus: Disponible</option>
                            <option>Todos</option>
                            <option>Agotado</option>
                        </select>
                    </div>

                    {/* Grid de actividades */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {ACTIVIDADES.map((act) => (
                            <ActividadCard key={act.id} act={act} />
                        ))}
                    </div>

                    {/* Paginación */}
                    <div className="flex justify-center gap-1 pt-2">
                        {[1, 2, 3].map((n) => (
                            <button
                                key={n}
                                className={[
                                    'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                                    n === 1 ? 'bg-guinda text-white' : 'bg-white text-gray-600 hover:bg-cream-300 border border-cream-400',
                                ].join(' ')}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Panel lateral derecho ──────────────── */}
                <aside className="hidden w-64 flex-shrink-0 space-y-4 xl:block">
                    {/* Estatus del estudiante */}
                    <div className="card p-4 space-y-3">
                        <h3 className="text-sm font-bold text-gray-700">Estatus del Estudiante</h3>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Créditos Acumulados</p>
                            <div className="mt-1 flex items-end gap-1">
                                <span className="text-3xl font-bold text-guinda">3</span>
                                <span className="mb-1 text-sm text-gray-400">/ 5</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-cream-300">
                                <div className="h-2 rounded-full bg-guinda" style={{ width: '60%' }} />
                            </div>
                        </div>
                        <div className="rounded-lg bg-cream-100 p-3">
                            <p className="text-xs font-semibold text-gray-600">Actividad Actual</p>
                            <p className="mt-0.5 text-sm font-medium text-gray-800">Taller de Teatro Clásico</p>
                            <span className="badge-en-curso mt-1">En Curso</span>
                        </div>
                    </div>

                    {/* Reglamento */}
                    <div className="card p-4">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">Reglamento de Inscripción</h3>
                        <ul className="space-y-2 text-xs text-gray-500">
                            <li className="flex gap-2">
                                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda mt-1.5" />
                                Solo puedes inscribirte en un máximo de <strong>dos actividades</strong> por ciclo escolar.
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda mt-1.5" />
                                Debes cumplir el <strong>60% de asistencia</strong> para acreditar la actividad.
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda mt-1.5" />
                                Las bajas solo se permiten durante las primeras <strong>dos semanas</strong> de inicio del curso.
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}
