import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TipoBadge from '@/Components/TipoBadge';
import { Head, router, usePage } from '@inertiajs/react';
import { SearchIcon } from '@/Components/Icons';

function CupoBar({ inscritos, cupo }) {
    const pct = cupo > 0 ? Math.round((inscritos / cupo) * 100) : 0;
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

function ActividadCard({ act, onInscribirse }) {
    const agotado = act.estatus === 'agotado';
    const inscrito = act.ya_inscrito;

    return (
        <div className="card flex flex-col overflow-hidden">
            {/* Header con gradiente */}
            <div className={`relative h-28 bg-gradient-to-br ${act.color || 'from-blue-500 to-blue-700'} flex items-end p-3`}>
                <TipoBadge tipo={act.tipo} />
                {inscrito ? (
                    <span className="absolute right-3 top-3 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                        Inscrito
                    </span>
                ) : (
                    agotado && (
                        <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                            Grupo Lleno
                        </span>
                    )
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

                {inscrito ? (
                    <button
                        disabled
                        className="mt-auto w-full rounded-lg py-2 text-sm font-semibold cursor-not-allowed bg-green-600 text-white"
                    >
                        Inscrito
                    </button>
                ) : agotado ? (
                    <button
                        disabled
                        className="mt-auto w-full rounded-lg py-2 text-sm font-semibold cursor-not-allowed bg-cream-300 text-gray-400"
                    >
                        Agotado
                    </button>
                ) : (
                    <button
                        onClick={() => onInscribirse && onInscribirse(act.id)}
                        className="mt-auto w-full rounded-lg py-2 text-sm font-semibold transition-all active:scale-[0.98] bg-guinda text-white hover:bg-guinda-700"
                    >
                        Inscribirse
                    </button>
                )}
            </div>
        </div>
    );
}

export default function Actividades({ actividades = [], inscripcionesActivas = [], alumno = {} }) {
    const { flash, errors } = usePage().props;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedStatus, setSelectedStatus] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);

    const normalizeText = (text) => {
        return text
            ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            : "";
    };

    // Filter activities
    const filteredActividades = actividades.filter((act) => {
        const query = normalizeText(searchQuery);
        const matchesSearch = query === '' || 
            normalizeText(act.nombre).includes(query) || 
            normalizeText(act.instructor).includes(query) ||
            normalizeText(act.clave).includes(query);
        const matchesCategory = selectedCategory === 'Todas' || 
            normalizeText(act.tipo) === normalizeText(selectedCategory);
        const matchesStatus = selectedStatus === 'Todos' || act.estatus === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Reset pagination to page 1 on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedStatus]);

    // Client-side pagination config
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredActividades.length / itemsPerPage);
    const activePage = Math.min(currentPage, totalPages || 1);
    const paginatedActividades = filteredActividades.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const handleInscribirse = (id) => {
        router.post(route('inscripciones.store'), { actividad_id: id });
    };

    const creditos = alumno?.creditos_acumulados || 0;
    const pctCreditos = Math.min(Math.round((creditos / 5) * 100), 100);

    return (
        <AuthenticatedLayout header="Catálogo de Actividades">
            <Head title="Catálogo de Actividades" />

            {/* Alert banners */}
            <div className="space-y-3 mb-6">
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xs">✓</span>
                        <div className="flex-1 font-medium">{flash.success}</div>
                    </div>
                )}
                {(flash?.error || errors?.actividad_id) && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">✕</span>
                        <div className="flex-1 font-medium">{flash?.error || errors?.actividad_id}</div>
                    </div>
                )}
            </div>

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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por nombre, instructor..."
                                className="w-full rounded-lg border border-cream-400 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm text-gray-600 focus:border-guinda focus:outline-none"
                        >
                            <option value="Todas">Categoría: Todas</option>
                            <option value="Deportiva">Deportiva</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Académica">Académica</option>
                        </select>
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm text-gray-600 focus:border-guinda focus:outline-none"
                        >
                            <option value="Todos">Estatus: Todos</option>
                            <option value="disponible">Disponible</option>
                            <option value="agotado">Agotado</option>
                        </select>
                    </div>

                    {/* Grid de actividades */}
                    {filteredActividades.length === 0 ? (
                        <div className="card p-8 text-center text-gray-500">
                            No se encontraron actividades que coincidan con los filtros aplicados.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {paginatedActividades.map((act) => (
                                <ActividadCard 
                                    key={act.id} 
                                    act={act} 
                                    onInscribirse={handleInscribirse} 
                                />
                            ))}
                        </div>
                    )}

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-1 pt-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setCurrentPage(n)}
                                    className={[
                                        'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                                        n === activePage ? 'bg-guinda text-white' : 'bg-white text-gray-600 hover:bg-cream-300 border border-cream-400',
                                    ].join(' ')}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Panel lateral derecho ──────────────── */}
                <aside className="hidden w-64 flex-shrink-0 space-y-4 xl:block">
                    {/* Estatus del estudiante */}
                    <div className="card p-4 space-y-3">
                        <h3 className="text-sm font-bold text-gray-700">Estatus del Estudiante</h3>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Créditos Acumulados</p>
                            <div className="mt-1 flex items-end gap-1">
                                <span className="text-3xl font-bold text-guinda">{creditos}</span>
                                <span className="mb-1 text-sm text-gray-400">/ 5</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-cream-300">
                                <div className="h-2 rounded-full bg-guinda transition-all" style={{ width: `${pctCreditos}%` }} />
                            </div>
                        </div>
                        
                        {/* Inscripciones Activas */}
                        <div className="space-y-2 pt-2 border-t border-cream-300">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Actividades Activas</p>
                            {inscripcionesActivas.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">No tienes actividades activas en este ciclo.</p>
                            ) : (
                                inscripcionesActivas.map((insc) => (
                                    <div key={insc.id} className="rounded-lg bg-cream-100 p-3">
                                        <p className="text-[10px] font-semibold text-gray-600">Actividad</p>
                                        <p className="mt-0.5 text-xs font-semibold text-gray-800 line-clamp-2">
                                            {insc.actividad?.nombre || 'Actividad sin nombre'}
                                        </p>
                                        <div className="mt-1">
                                            {insc.estatus === 'en_curso' ? (
                                                <span className="badge-en-curso">En Curso</span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5">
                                                    Inscrito
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Reglamento */}
                    <div className="card p-4">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">Reglamento de Inscripción</h3>
                        <ul className="space-y-2 text-xs text-gray-500">
                            <li className="flex gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda" />
                                Solo puedes inscribirte en un máximo de <strong>dos actividades</strong> por ciclo escolar.
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda" />
                                Debes cumplir el <strong>60% de asistencia</strong> para acreditar la actividad.
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda" />
                                Las bajas solo se permiten durante las primeras <strong>dos semanas</strong> de inicio del curso.
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}

