import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircleIcon, DocumentIcon, SearchIcon } from '@/Components/Icons';

/* ─── Paleta y helpers ──────────────────────────────────────── */
const AVATAR_COLORS = [
    'bg-guinda',
    'bg-emerald-700',
    'bg-amber-700',
    'bg-sky-700',
    'bg-indigo-700',
];

function EstatusBadge({ estatus }) {
    const map = {
        pendiente: {
            label: 'Pendiente',
            cls: 'bg-amber-50 text-amber-700 border border-amber-200',
            dot: 'bg-amber-400',
        },
        aprobada: {
            label: 'Aprobada',
            cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            dot: 'bg-emerald-500',
        },
        rechazada: {
            label: 'Rechazada',
            cls: 'bg-red-50 text-red-700 border border-red-200',
            dot: 'bg-red-500',
        },
    };
    const cfg = map[estatus?.toLowerCase()] ?? map.pendiente;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.cls}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

/* ─── Modal de rechazo ──────────────────────────────────────── */
function ModalRechazo({ solicitud, onClose, onConfirm, processing }) {
    const [motivo, setMotivo] = useState('');
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-4">
                <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">Rechazar Solicitud</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{solicitud.nombre} · {solicitud.matricula}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none">✕</button>
                </div>
                <div>
                    <p className="text-xs text-gray-600 mb-1">
                        Actividad: <span className="font-semibold text-gray-800">{solicitud.actividad}</span>
                    </p>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1.5">
                        Motivo de Rechazo <span className="text-guinda">*</span>
                    </label>
                    <textarea
                        rows={3}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Indica el motivo por el cual no se acredita la evidencia..."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/20"
                    />
                </div>
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!motivo.trim() || processing}
                        onClick={() => onConfirm(motivo)}
                        className="px-4 py-2 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Enviando...' : 'Confirmar Rechazo'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Modal de aprobación ──────────────────────────────────── */
function ModalAprobacion({ solicitud, onClose, onConfirm, processing }) {
    const [creditos, setCreditos] = useState(1);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-4">
                <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">Aprobar Solicitud</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{solicitud.nombre} · {solicitud.matricula}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none">✕</button>
                </div>
                <div>
                    <p className="text-xs text-gray-600 mb-1">
                        Actividad: <span className="font-semibold text-gray-800">{solicitud.actividad}</span>
                    </p>
                    <p className="text-xs text-gray-500">Institución: {solicitud.institucion} · {solicitud.horas || 0} hrs</p>
                    <label htmlFor="creditos-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1.5">
                        Créditos a Otorgar <span className="text-guinda">*</span>
                    </label>
                    <input
                        id="creditos-input"
                        type="number"
                        min={1}
                        max={10}
                        value={creditos}
                        onChange={(e) => setCreditos(parseInt(e.target.value, 10) || 1)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/20"
                    />
                </div>
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={processing}
                        onClick={() => onConfirm(creditos)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Enviando...' : 'Confirmar Aprobación'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Página principal ──────────────────────────────────────── */
export default function Evidencias({ solicitudes = {} }) {
    const { flash = {} } = usePage().props;

    const items = solicitudes.data ?? (Array.isArray(solicitudes) ? solicitudes : []);
    const meta  = solicitudes.meta ?? null;
    const links = solicitudes.links ?? null;

    const [searchQuery, setSearchQuery] = useState('');
    const [processing, setProcessing] = useState(false);

    /* modales */
    const [modalAprobar, setModalAprobar] = useState(null);  // solicitud seleccionada
    const [modalRechazar, setModalRechazar] = useState(null);

    /* ── Envío de decisión ── */
    const sendDecision = (solicitudId, payload) => {
        setProcessing(true);
        router.put(route('admin.solicitudes.update', solicitudId), payload, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setModalAprobar(null);
                setModalRechazar(null);
            },
        });
    };

    const handleAprobar = (solicitud) => setModalAprobar(solicitud);
    const handleRechazar = (solicitud) => setModalRechazar(solicitud);

    const confirmAprobar = (creditos) => {
        if (!modalAprobar) return;
        sendDecision(modalAprobar.id, { estatus: 'Aprobada', creditos });
    };

    const confirmRechazar = (motivo) => {
        if (!modalRechazar) return;
        sendDecision(modalRechazar.id, { estatus: 'Rechazada', motivo_rechazo: motivo });
    };

    /* ── Búsqueda local ── */
    const filtered = items.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
            !q ||
            s.nombre?.toLowerCase().includes(q) ||
            s.matricula?.toLowerCase().includes(q) ||
            s.actividad?.toLowerCase().includes(q) ||
            s.institucion?.toLowerCase().includes(q)
        );
    });

    /* ── KPIs ── */
    const totalPendientes  = items.filter((s) => s.estatus === 'pendiente').length;
    const totalAprobadas   = items.filter((s) => s.estatus === 'aprobada').length;
    const totalRechazadas  = items.filter((s) => s.estatus === 'rechazada').length;

    return (
        <AuthenticatedLayout header="Validar Evidencias">
            <Head title="Validación de Evidencias Externas" />

            <div className="space-y-6">

                {/* ── Flash ── */}
                {flash.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">✓</span>
                        <div className="flex-1 font-medium">{flash.success}</div>
                    </div>
                )}
                {flash.error && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">✕</span>
                        <div className="flex-1 font-medium">{flash.error}</div>
                    </div>
                )}

                {/* ── Header ── */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Panel de Revisión de Evidencias</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestión y validación de actividades externas subidas por los estudiantes.
                    </p>
                </div>

                {/* ── KPIs ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Pendientes de Revisión"
                        value={totalPendientes.toString()}
                        sub="En cola de validación"
                        icon={DocumentIcon}
                        accent={totalPendientes > 0 ? 'guinda' : 'green'}
                    />
                    <StatCard
                        label="Aprobadas"
                        value={totalAprobadas.toString()}
                        sub="Validadas y acreditadas"
                        icon={CheckCircleIcon}
                    />
                    <StatCard
                        label="Rechazadas"
                        value={totalRechazadas.toString()}
                        sub="Documentación insuficiente"
                        icon={DocumentIcon}
                    />
                </div>

                {/* ── Tabla ── */}
                <div className="overflow-hidden rounded-2xl border border-cream-400 bg-white shadow-card">

                    {/* Cabecera de la tabla */}
                    <div className="flex flex-col gap-3 border-b border-cream-400 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-gray-800">Solicitudes de Alumnos</h2>
                            {meta && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {meta.total ?? items.length} registros · página {meta.current_page} de {meta.last_page}
                                </p>
                            )}
                        </div>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="search"
                                id="buscar-solicitud"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar alumno, matrícula o actividad…"
                                className="w-72 rounded-xl border border-cream-400 bg-cream-50 py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/20"
                            />
                        </div>
                    </div>

                    {/* Tabla de datos */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Alumno / No. Control', 'Actividad', 'Institución', 'Estatus', 'Acciones'].map((h) => (
                                        <th
                                            key={h}
                                            className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-gray-400 italic">
                                            No se encontraron solicitudes.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((s, idx) => (
                                        <tr
                                            key={s.id}
                                            className="group hover:bg-cream-50 transition-colors duration-100"
                                        >
                                            {/* Alumno */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-xs font-bold text-white select-none`}
                                                    >
                                                        {s.initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{s.nombre}</p>
                                                        <p className="font-mono text-xs text-gray-400">{s.matricula}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actividad */}
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-800 max-w-[200px] truncate" title={s.actividad}>
                                                    {s.actividad}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{s.horas || 0} hrs · {s.fecha}</p>
                                            </td>

                                            {/* Institución */}
                                            <td className="px-5 py-4">
                                                <p className="text-gray-700 max-w-[160px] truncate" title={s.institucion}>
                                                    {s.institucion}
                                                </p>
                                            </td>

                                            {/* Estatus badge */}
                                            <td className="px-5 py-4">
                                                <EstatusBadge estatus={s.estatus} />
                                            </td>

                                            {/* Acciones */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {/* Ver PDF */}
                                                    {s.ruta_archivo && (
                                                        <a
                                                            href={`/storage/${s.ruta_archivo}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Ver evidencia en PDF"
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-cream-100 hover:border-gray-300 whitespace-nowrap"
                                                        >
                                                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Ver PDF
                                                        </a>
                                                    )}

                                                    {s.estatus === 'pendiente' ? (
                                                        <>
                                                            {/* Aprobar */}
                                                            <button
                                                                id={`btn-aprobar-${s.id}`}
                                                                onClick={() => handleAprobar(s)}
                                                                disabled={processing}
                                                                title="Aprobar solicitud"
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                                                            >
                                                                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Aprobar
                                                            </button>

                                                            {/* Rechazar */}
                                                            <button
                                                                id={`btn-rechazar-${s.id}`}
                                                                onClick={() => handleRechazar(s)}
                                                                disabled={processing}
                                                                title="Rechazar solicitud"
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                                                            >
                                                                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Rechazar
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-medium italic">
                                                            Evaluada
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {links && links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 border-t border-cream-400 px-5 py-3 flex-wrap">
                            {links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url || link.active}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={[
                                        'min-w-[2rem] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                                        link.active
                                            ? 'bg-guinda text-white cursor-default'
                                            : link.url
                                                ? 'border border-cream-400 text-gray-600 hover:bg-cream-100'
                                                : 'border border-cream-300 text-gray-300 cursor-not-allowed',
                                    ].join(' ')}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal Aprobar ── */}
            {modalAprobar && (
                <ModalAprobacion
                    solicitud={modalAprobar}
                    processing={processing}
                    onClose={() => setModalAprobar(null)}
                    onConfirm={confirmAprobar}
                />
            )}

            {/* ── Modal Rechazar ── */}
            {modalRechazar && (
                <ModalRechazo
                    solicitud={modalRechazar}
                    processing={processing}
                    onClose={() => setModalRechazar(null)}
                    onConfirm={confirmRechazar}
                />
            )}
        </AuthenticatedLayout>
    );
}
