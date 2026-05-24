import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import TipoBadge from '@/Components/TipoBadge';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircleIcon, DocumentIcon, SearchIcon } from '@/Components/Icons';

const AVATAR_COLORS = ['bg-guinda', 'bg-teal-600', 'bg-amber-600', 'bg-blue-600', 'bg-indigo-600'];

export default function Evidencias({ solicitudes = [] }) {
    const { flash = {} } = usePage().props;

    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        estatus: 'aprobada',
        creditos: 1,
        motivo_rechazo: '',
    });

    const handleOpenModal = (sol) => {
        setSelectedSolicitud(sol);
        setData({
            estatus: 'aprobada',
            creditos: 1,
            motivo_rechazo: '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSolicitud(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.evidencias.validar', selectedSolicitud.id), {
            onSuccess: () => {
                handleCloseModal();
            }
        });
    };

    // Filter solicitudes
    const filteredSolicitudes = solicitudes.filter((s) => {
        const query = searchQuery.toLowerCase();
        return (
            s.nombre.toLowerCase().includes(query) ||
            s.matricula.toLowerCase().includes(query) ||
            s.actividad.toLowerCase().includes(query)
        );
    });

    // Stats
    const totalPendientes = solicitudes.filter((s) => s.estatus === 'pendiente').length;
    const totalAprobadas = solicitudes.filter((s) => s.estatus === 'aprobada').length;
    const totalRechazadas = solicitudes.filter((s) => s.estatus === 'rechazada').length;

    return (
        <AuthenticatedLayout header="Validar Evidencias">
            <Head title="Validación de Evidencias" />

            <div className="space-y-6">
                {/* Banner de Éxito */}
                {flash.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm animate-fade-in">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xs">✓</span>
                        <div className="flex-1 font-medium">{flash.success}</div>
                    </div>
                )}

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Validación de Evidencias</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Revisión de actividades externas pendientes de acreditación.
                        </p>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Pendientes de Revisión" value={totalPendientes.toString()} sub="Solicitudes en cola" icon={DocumentIcon} accent={totalPendientes > 0 ? "guinda" : "green"} />
                    <StatCard label="Aprobadas" value={totalAprobadas.toString()} sub="Validadas y acreditadas" icon={CheckCircleIcon} />
                    <StatCard label="Rechazadas" value={totalRechazadas.toString()} sub="Documentación insuficiente" icon={DocumentIcon} />
                </div>

                {/* Tabla */}
                <div className="card overflow-hidden bg-white">
                    <div className="flex items-center justify-between border-b border-cream-400 px-5 py-3">
                        <h2 className="text-sm font-semibold text-gray-700">Solicitudes de Alumnos</h2>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar alumno o control..."
                                className="w-64 rounded-lg border border-cream-400 bg-cream-50 py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Alumno / No. Control', 'Actividad Externa', 'Fecha Subida', 'Estado', 'Acciones'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {filteredSolicitudes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-8 text-center text-gray-500 bg-cream-50 italic">
                                            No se encontraron solicitudes.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSolicitudes.map((s, idx) => (
                                        <tr key={s.id} className="hover:bg-cream-50 transition-colors">
                                            <td className="px-5 py-4 whitespace-nowrap">
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
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <p className="font-medium text-gray-800">{s.actividad}</p>
                                                <p className="text-xs text-gray-400">{s.institucion} · {s.horas || 0} hrs</p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{s.fecha}</td>
                                            <td className="px-5 py-4">
                                                <TipoBadge estatus={s.estatus} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2">
                                                    <a 
                                                        href={`/storage/${s.ruta_archivo}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-lg border border-cream-400 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-cream-100 transition-colors whitespace-nowrap"
                                                    >
                                                        Ver Evidencia
                                                    </a>
                                                    {s.estatus === 'pendiente' ? (
                                                        <button 
                                                            onClick={() => handleOpenModal(s)}
                                                            className="rounded-lg bg-guinda px-3 py-1.5 text-xs font-semibold text-white hover:bg-guinda-700 transition-colors whitespace-nowrap"
                                                        >
                                                            Validar
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-medium italic self-center px-2">Evaluada</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Validación */}
            {isModalOpen && selectedSolicitud && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="card w-full max-w-md bg-white p-6 space-y-4 animate-fade-in shadow-xl">
                        <div className="flex items-start justify-between border-b border-cream-300 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Validar Actividad Externa</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {selectedSolicitud.nombre} ({selectedSolicitud.matricula})
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actividad</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedSolicitud.actividad}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{selectedSolicitud.institucion} · {selectedSolicitud.horas || 'N/A'} hrs</p>
                            </div>

                            {/* Estatus selection */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Dictamen</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('estatus', 'aprobada')}
                                        className={[
                                            'flex-1 rounded-lg border py-2 text-xs font-bold transition-all',
                                            data.estatus === 'aprobada'
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-cream-400 bg-white text-gray-600 hover:border-green-600/40',
                                        ].join(' ')}
                                    >
                                        ✓ Aprobar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('estatus', 'rechazada')}
                                        className={[
                                            'flex-1 rounded-lg border py-2 text-xs font-bold transition-all',
                                            data.estatus === 'rechazada'
                                                ? 'border-red-600 bg-red-50 text-red-700'
                                                : 'border-cream-400 bg-white text-gray-600 hover:border-red-600/40',
                                        ].join(' ')}
                                    >
                                        ✕ Rechazar
                                    </button>
                                </div>
                            </div>

                            {/* Conditional inputs */}
                            {data.estatus === 'aprobada' ? (
                                <div>
                                    <label htmlFor="creditos" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Créditos a Otorgar <span className="text-guinda">*</span>
                                    </label>
                                    <input
                                        id="creditos"
                                        type="number"
                                        min="1"
                                        max="5"
                                        required
                                        value={data.creditos}
                                        onChange={(e) => setData('creditos', e.target.value)}
                                        className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm focus:border-guinda focus:outline-none"
                                    />
                                    {errors.creditos && (
                                        <p className="mt-1 text-xs text-red-600 font-medium">{errors.creditos}</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="motivo_rechazo" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Motivo de Rechazo <span className="text-guinda">*</span>
                                    </label>
                                    <textarea
                                        id="motivo_rechazo"
                                        rows={3}
                                        required
                                        value={data.motivo_rechazo}
                                        onChange={(e) => setData('motivo_rechazo', e.target.value)}
                                        placeholder="Indica el motivo por el cual no se acredita la evidencia..."
                                        className="w-full resize-none rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm focus:border-guinda focus:outline-none"
                                    />
                                    {errors.motivo_rechazo && (
                                        <p className="mt-1 text-xs text-red-600 font-medium">{errors.motivo_rechazo}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 border-t border-cream-300 pt-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded-lg border border-cream-400 text-xs font-semibold text-gray-500 hover:bg-cream-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-guinda text-xs font-bold"
                                >
                                    {processing ? 'Enviando...' : 'Confirmar Dictamen'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
