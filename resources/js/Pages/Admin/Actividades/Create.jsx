import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

/* ─── Clases reutilizables ──────────────────────────────────────────────────── */
const inputBase =
    'block w-full rounded-xl border border-cream-400 bg-white px-4 py-2.5 text-sm text-gray-800 ' +
    'placeholder-gray-400 shadow-sm transition-all duration-150 ' +
    'focus:border-guinda focus:outline-none focus:ring-2 focus:ring-guinda/20';

const labelBase =
    'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500';

const errorText = 'mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600';

/* ─── Sub-componentes ───────────────────────────────────────────────────────── */
function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className={errorText}>
            <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-[9px] font-bold">!</span>
            {message}
        </p>
    );
}

function SectionCard({ title, subtitle, children }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-cream-400 bg-white shadow-card">
            <div className="border-b border-cream-300 bg-cream-50 px-6 py-4">
                <h2 className="text-sm font-bold text-gray-800">{title}</h2>
                {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

/* ─── Página principal ──────────────────────────────────────────────────────── */
export default function Create({ docentes = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre:       '',
        descripcion:  '',
        creditos:     1,
        cupo_maximo:  20,
        horario:      '',
        tipo_periodo: 'semestral',
        docente_id:   '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.actividades.store'));
    };

    return (
        <AuthenticatedLayout header="Nueva Actividad">
            <Head title="Nueva Actividad Complementaria" />

            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">

                {/* ── Encabezado de página ── */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Nueva Actividad Complementaria
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Completa todos los campos requeridos para registrar la actividad en el catálogo.
                        </p>
                    </div>
                    {/* Breadcrumb pill */}
                    <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-cream-400 bg-cream-50 px-3.5 py-1.5 text-xs font-medium text-gray-500 sm:flex">
                        <Link href={route('admin.catalogo')} className="hover:text-guinda transition-colors">
                            Catálogo
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-700">Nueva</span>
                    </div>
                </div>

                {/* ── Sección 1: Información General ── */}
                <SectionCard
                    title="Información General"
                    subtitle="Datos descriptivos que verán los estudiantes en el catálogo."
                >
                    <div className="space-y-5">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className={labelBase}>
                                Nombre de la Actividad <span className="text-guinda">*</span>
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className={inputBase}
                                placeholder="ej. Selección de Fútbol Femenil"
                                autoFocus
                            />
                            <FieldError message={errors.nombre} />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className={labelBase}>
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                rows={4}
                                className={`${inputBase} resize-none`}
                                placeholder="Describe brevemente los objetivos, metodología y beneficios de la actividad..."
                            />
                            <FieldError message={errors.descripcion} />
                        </div>
                    </div>
                </SectionCard>

                {/* ── Sección 2: Configuración ── */}
                <SectionCard
                    title="Configuración Académica"
                    subtitle="Parámetros que controlan la inscripción y asignación de créditos."
                >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Créditos */}
                        <div>
                            <label htmlFor="creditos" className={labelBase}>
                                Créditos <span className="text-guinda">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="creditos"
                                    type="number"
                                    min="1"
                                    value={data.creditos}
                                    onChange={(e) => setData('creditos', parseInt(e.target.value) || 1)}
                                    className={`${inputBase} pr-14`}
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center rounded-r-xl border-l border-cream-300 bg-cream-50 px-3 text-xs font-semibold text-gray-400">
                                    cr.
                                </span>
                            </div>
                            <FieldError message={errors.creditos} />
                        </div>

                        {/* Cupo máximo */}
                        <div>
                            <label htmlFor="cupo_maximo" className={labelBase}>
                                Cupo Máximo <span className="text-guinda">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="cupo_maximo"
                                    type="number"
                                    min="1"
                                    value={data.cupo_maximo}
                                    onChange={(e) => setData('cupo_maximo', parseInt(e.target.value) || 1)}
                                    className={`${inputBase} pr-20`}
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center rounded-r-xl border-l border-cream-300 bg-cream-50 px-3 text-xs font-semibold text-gray-400">
                                    alumnos
                                </span>
                            </div>
                            <FieldError message={errors.cupo_maximo} />
                        </div>

                        {/* Horario */}
                        <div>
                            <label htmlFor="horario" className={labelBase}>
                                Horario <span className="text-guinda">*</span>
                            </label>
                            <input
                                id="horario"
                                type="text"
                                value={data.horario}
                                onChange={(e) => setData('horario', e.target.value)}
                                className={inputBase}
                                placeholder="ej. Lun y Mié 10:00 – 12:00"
                            />
                            <FieldError message={errors.horario} />
                        </div>

                        {/* Tipo de periodo */}
                        <div>
                            <label htmlFor="tipo_periodo" className={labelBase}>
                                Tipo de Periodo <span className="text-guinda">*</span>
                            </label>
                            <select
                                id="tipo_periodo"
                                value={data.tipo_periodo}
                                onChange={(e) => setData('tipo_periodo', e.target.value)}
                                className={inputBase}
                            >
                                <option value="semestral">Semestral</option>
                                <option value="intersemestral">Intersemestral</option>
                            </select>
                            <FieldError message={errors.tipo_periodo} />
                        </div>
                    </div>
                </SectionCard>

                {/* ── Sección 3: Docente ── */}
                <SectionCard
                    title="Docente Responsable"
                    subtitle="El docente que impartirá y tendrá control sobre esta actividad."
                >
                    <div>
                        <label htmlFor="docente_id" className={labelBase}>
                            Selecciona un docente <span className="text-guinda">*</span>
                        </label>
                        <select
                            id="docente_id"
                            value={data.docente_id}
                            onChange={(e) => setData('docente_id', e.target.value)}
                            className={inputBase}
                        >
                            <option value="">— Selecciona un docente —</option>
                            {docentes.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.nombre_completo}
                                </option>
                            ))}
                        </select>
                        <FieldError message={errors.docente_id} />

                        {docentes.length === 0 && (
                            <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                ⚠ No hay docentes registrados en el sistema. Registra al menos uno antes de crear una actividad.
                            </p>
                        )}
                    </div>
                </SectionCard>

                {/* ── Barra de acciones ── */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-cream-400 bg-white px-6 py-4 shadow-card">
                    <p className="text-xs text-gray-400">
                        Los campos marcados con <span className="font-bold text-guinda">*</span> son obligatorios.
                    </p>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.catalogo')}
                            className="rounded-xl border border-cream-400 bg-cream-50 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-cream-200 hover:text-gray-800 active:scale-[0.98]"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={[
                                'relative flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white',
                                'transition-all duration-150 active:scale-[0.97]',
                                processing
                                    ? 'cursor-not-allowed bg-guinda/60'
                                    : 'bg-guinda shadow-md shadow-guinda/30 hover:bg-guinda-700 hover:shadow-lg hover:shadow-guinda/40',
                            ].join(' ')}
                        >
                            {processing ? (
                                <>
                                    {/* Spinner inline */}
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                    </svg>
                                    Guardar Actividad
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </form>
        </AuthenticatedLayout>
    );
}
