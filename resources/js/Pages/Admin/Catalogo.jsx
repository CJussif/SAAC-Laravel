import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import TipoBadge from '@/Components/TipoBadge';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { GridIcon, UsersIcon, DocumentIcon, PlusIcon } from '@/Components/Icons';
import Modal from '@/Components/Modal';

const TABS = ['Todos', 'Deportivos', 'Culturales', 'Académicos'];

const field = 'block w-full rounded-lg border border-cream-400 bg-cream-50 px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-2 focus:ring-guinda/20 transition-colors';

function CupoPill({ inscritos, cupo }) {
    const pct = Math.round((inscritos / cupo) * 100);
    const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500';
    return (
        <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 h-1.5 rounded-full bg-cream-300">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className="text-xs tabular-nums text-gray-500 whitespace-nowrap">{inscritos}/{cupo}</span>
        </div>
    );
}

// Helper to determine category based on name keywords
const getCategory = (name) => {
    if (!name) return 'academica';
    const lower = name.toLowerCase();
    const deportivaKeywords = ['yoga', 'deport', 'fut', 'basquet', 'volei'];
    const culturalKeywords = ['danza', 'teatro', 'music', 'músic', 'cant', 'guitar', 'radio', 'locuc'];
    
    if (deportivaKeywords.some(kw => lower.includes(kw))) {
        return 'deportiva';
    }
    if (culturalKeywords.some(kw => lower.includes(kw))) {
        return 'cultural';
    }
    return 'academica';
};

// Helper to generate padded Clave
const getClave = (actividad) => {
    const category = getCategory(actividad.nombre);
    const prefix = category === 'deportiva' ? 'DEP-' : category === 'cultural' ? 'CUL-' : 'ACA-';
    return `${prefix}${String(actividad.id).padStart(3, '0')}`;
};

export default function Catalogo({ actividades = [], docentes = [] }) {
    const { flash } = usePage().props;
    
    // Tabs state
    const [selectedTab, setSelectedTab] = useState('Todos');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal & editing state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    // Form setup using Inertia's useForm
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        descripcion: '',
        creditos: 1,
        cupo_maximo: 20,
        horario: '',
        docente_id: '',
        tipo_periodo: 'semestral',
    });

    // Reset pagination when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTab]);

    // Calculate KPIs dynamically
    const totalActividades = actividades.length;
    const cuposDisponibles = actividades.reduce(
        (acc, act) => acc + (Math.max(0, (act.cupo_maximo || 0) - (act.inscritos || 0))),
        0
    );
    const docentesAsignados = new Set(
        actividades.map((act) => act.docente_id).filter((id) => id !== null && id !== undefined)
    ).size;

    // Filter activities by tab
    const filteredActividades = actividades.filter((act) => {
        if (selectedTab === 'Todos') return true;
        const cat = getCategory(act.nombre);
        if (selectedTab === 'Deportivos') return cat === 'deportiva';
        if (selectedTab === 'Culturales') return cat === 'cultural';
        if (selectedTab === 'Académicos') return cat === 'academica';
        return true;
    });

    // Client-side pagination
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredActividades.length / itemsPerPage) || 1;
    const activePage = Math.max(1, Math.min(currentPage, totalPages));
    const paginatedActividades = filteredActividades.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const startIndex = filteredActividades.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(activePage * itemsPerPage, filteredActividades.length);

    // Handlers
    const openCreateModal = () => {
        setEditingActivity(null);
        setData({
            nombre: '',
            descripcion: '',
            creditos: 1,
            cupo_maximo: 20,
            horario: '',
            docente_id: '',
            tipo_periodo: 'semestral',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (activity) => {
        setEditingActivity(activity);
        setData({
            nombre: activity.nombre || '',
            descripcion: activity.descripcion || '',
            creditos: activity.creditos || 1,
            cupo_maximo: activity.cupo_maximo || 20,
            horario: activity.horario || '',
            docente_id: activity.docente_id ?? '',
            tipo_periodo: activity.tipo_periodo || 'semestral',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
            router.delete(route('admin.catalogo.destroy', id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingActivity) {
            put(route('admin.catalogo.update', editingActivity.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.catalogo.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout header="Catálogo Actividades">
            <Head title="Catálogo de Actividades" />

            <div className="space-y-6">
                {/* Alert banners */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xs">✓</span>
                        <div className="flex-1 font-medium">{flash.success}</div>
                    </div>
                )}

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Catálogo de Actividades Complementarias</h1>
                        <p className="mt-1 text-sm text-gray-500">Gestiona y administra la oferta de actividades para el ciclo escolar vigente.</p>
                    </div>
                    <button onClick={openCreateModal} className="btn-guinda flex-shrink-0">
                        <PlusIcon /> Nueva Actividad
                    </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total Actividades"  value={totalActividades.toString()}  sub="Catálogo actualizado" icon={GridIcon} />
                    <StatCard label="Cupos Disponibles"  value={cuposDisponibles.toString()} sub="En todas las categorías" icon={UsersIcon} />
                    <StatCard label="Docentes Asignados" value={docentesAsignados.toString()} sub="Este semestre" icon={DocumentIcon} />
                </div>

                {/* Tabla con tabs */}
                <div className="card overflow-hidden">
                    {/* Tabs + búsqueda */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-400 px-5 py-3">
                        <div className="flex gap-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={[
                                        'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                                        tab === selectedTab
                                            ? 'bg-guinda text-white'
                                            : 'text-gray-500 hover:bg-cream-200',
                                    ].join(' ')}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button className="text-xs font-medium text-gray-400 hover:text-guinda transition-colors">
                            ≡ Filtros Avanzados
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Clave', 'Nombre de la Actividad', 'Tipo', 'Docente Responsable', 'Créditos', 'Cupo', 'Acciones'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {paginatedActividades.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-8 text-center text-gray-500">
                                            No se encontraron actividades.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedActividades.map((a) => {
                                        const clave = getClave(a);
                                        const category = getCategory(a.nombre);
                                        const instructor = a.docente ? `${a.docente.nombre} ${a.docente.apellido_paterno}` : 'Sin asignar';
                                        return (
                                            <tr key={a.id} className="hover:bg-cream-50 transition-colors">
                                                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-500">{clave}</td>
                                                <td className="px-5 py-3.5 font-medium text-gray-800">{a.nombre}</td>
                                                <td className="px-5 py-3.5"><TipoBadge tipo={category} /></td>
                                                <td className="px-5 py-3.5 text-gray-600">{instructor}</td>
                                                <td className="px-5 py-3.5 text-center font-semibold text-gray-700">{a.creditos}</td>
                                                <td className="px-5 py-3.5"><CupoPill inscritos={a.inscritos || 0} cupo={a.cupo_maximo} /></td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEditModal(a)}
                                                            className="rounded-md p-1.5 text-gray-400 hover:bg-cream-200 hover:text-guinda transition-colors"
                                                            title="Editar"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(a.id)}
                                                            className="rounded-md p-1.5 text-gray-400 hover:bg-cream-200 hover:text-red-600 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer paginación */}
                    <div className="flex items-center justify-between border-t border-cream-400 px-5 py-3">
                        <p className="text-xs text-gray-400">
                            Mostrando {startIndex} – {endIndex} de {filteredActividades.length} actividades
                        </p>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setCurrentPage(n)}
                                    className={[
                                        'h-7 min-w-[28px] rounded-md px-2 text-xs font-medium transition-colors',
                                        n === activePage ? 'bg-guinda text-white' : 'text-gray-500 hover:bg-cream-200',
                                    ].join(' ')}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Creation & Edition */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-cream-300 pb-2">
                        {editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nombre" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                Nombre de la Actividad
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className={field}
                                placeholder="ej. Selección de Fútbol Femenil"
                            />
                            {errors.nombre && <div className="text-xs text-red-500 mt-1">{errors.nombre}</div>}
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                value={data.descripcion || ''}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className={`${field} h-20 resize-none`}
                                placeholder="Escribe una breve descripción de la actividad..."
                            />
                            {errors.descripcion && <div className="text-xs text-red-500 mt-1">{errors.descripcion}</div>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="creditos" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                    Créditos
                                </label>
                                <input
                                    type="number"
                                    id="creditos"
                                    value={data.creditos}
                                    onChange={(e) => setData('creditos', parseInt(e.target.value) || 0)}
                                    className={field}
                                    min="1"
                                />
                                {errors.creditos && <div className="text-xs text-red-500 mt-1">{errors.creditos}</div>}
                            </div>

                            <div>
                                <label htmlFor="cupo_maximo" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                    Cupo Máximo
                                </label>
                                <input
                                    type="number"
                                    id="cupo_maximo"
                                    value={data.cupo_maximo}
                                    onChange={(e) => setData('cupo_maximo', parseInt(e.target.value) || 0)}
                                    className={field}
                                    min="1"
                                />
                                {errors.cupo_maximo && <div className="text-xs text-red-500 mt-1">{errors.cupo_maximo}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="horario" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                    Horario
                                </label>
                                <input
                                    type="text"
                                    id="horario"
                                    value={data.horario}
                                    onChange={(e) => setData('horario', e.target.value)}
                                    className={field}
                                    placeholder="ej. Lunes y Miércoles 10-12"
                                />
                                {errors.horario && <div className="text-xs text-red-500 mt-1">{errors.horario}</div>}
                            </div>

                            <div>
                                <label htmlFor="tipo_periodo" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                    Tipo de Periodo
                                </label>
                                <select
                                    id="tipo_periodo"
                                    value={data.tipo_periodo}
                                    onChange={(e) => setData('tipo_periodo', e.target.value)}
                                    className={field}
                                >
                                    <option value="semestral">Semestral</option>
                                    <option value="intersemestral">Intersemestral</option>
                                </select>
                                {errors.tipo_periodo && <div className="text-xs text-red-500 mt-1">{errors.tipo_periodo}</div>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="docente_id" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                Docente Responsable
                            </label>
                            <select
                                id="docente_id"
                                value={data.docente_id}
                                onChange={(e) => setData('docente_id', e.target.value)}
                                className={field}
                            >
                                <option value="">Selecciona un docente...</option>
                                {docentes.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.nombre_completo}
                                    </option>
                                ))}
                            </select>
                            {errors.docente_id && <div className="text-xs text-red-500 mt-1">{errors.docente_id}</div>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-cream-400 pt-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-cream-100 rounded-lg transition-colors"
                            disabled={processing}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-guinda px-4 py-2 text-sm font-semibold text-white bg-guinda rounded-lg hover:bg-guinda-dark transition-colors"
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
