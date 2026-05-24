import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { UploadIcon } from '@/Components/Icons';

const TIPOS = [
    { value: 'deportiva', label: 'Deportiva' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'academica', label: 'Académica' }
];

const REQUISITOS = [
    'El archivo debe ser PDF, JPG o PNG (máximo 5 MB).',
    'La constancia debe estar expedida por una institución reconocida.',
    'Debe incluir nombre del alumno, actividad y horas o duración.',
    'No se aceptan documentos con correcciones o alteraciones.',
];

function DropZone({ file, onFile, error }) {
    const [drag, setDrag] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFile(dropped);
    };

    return (
        <div className="space-y-1.5">
            <label
                className={[
                    'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
                    drag
                        ? 'border-guinda bg-guinda/5'
                        : file
                            ? 'border-green-400 bg-green-50'
                            : error
                                ? 'border-red-400 bg-red-50 hover:border-red-500'
                                : 'border-cream-400 bg-cream-50 hover:border-guinda/50 hover:bg-cream-100',
                ].join(' ')}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onFile(e.target.files[0])}
                />

                {file ? (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-xl font-bold">
                            ✓
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB · Listo para subir</p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); onFile(null); }}
                            className="text-xs font-medium text-gray-400 underline hover:text-guinda"
                        >
                            Cambiar archivo
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-200 text-gray-400">
                            <UploadIcon />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700">
                                Arrastra tu archivo aquí
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">o haz clic para seleccionarlo</p>
                        </div>
                        <p className="text-[11px] text-gray-400">PDF, JPG o PNG · Máx. 5 MB</p>
                    </>
                )}
            </label>
            {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
}

export default function CargaEvidencias({ solicitudes = [] }) {
    const { flash = {} } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_actividad: '',
        nombre_actividad: '',
        institucion: '',
        fecha_inicio: '',
        fecha_fin: '',
        horas: '',
        descripcion: '',
        archivo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('evidencias.store'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout header="Subir Evidencia">
            <Head title="Subir Evidencia" />

            <div className="space-y-6">
                {/* Banner de Éxito */}
                {flash.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm animate-fade-in">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xs">✓</span>
                        <div className="flex-1 font-medium">{flash.success}</div>
                    </div>
                )}

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Subir Evidencia Externa</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Si realizaste una actividad complementaria fuera del catálogo institucional, sube aquí tu constancia para que sea validada.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* ── Formulario ─────────────────────────── */}
                    <form onSubmit={handleSubmit} className="card flex-1 space-y-5 p-6 bg-white">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                            Datos de la Actividad
                        </h2>

                        {/* Tipo de actividad */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Tipo de Actividad <span className="text-guinda">*</span>
                            </label>
                            <div className="flex gap-2">
                                {TIPOS.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setData('tipo_actividad', t.value)}
                                        className={[
                                            'flex-1 rounded-lg border py-2 text-sm font-semibold transition-all',
                                            data.tipo_actividad === t.value
                                                ? 'border-guinda bg-guinda text-white shadow-sm'
                                                : 'border-cream-400 bg-white text-gray-600 hover:border-guinda/40',
                                        ].join(' ')}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            {errors.tipo_actividad && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.tipo_actividad}</p>
                            )}
                        </div>

                        {/* Nombre de la actividad */}
                        <div>
                            <label htmlFor="nombre_actividad" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Nombre de la Actividad <span className="text-guinda">*</span>
                            </label>
                            <input
                                id="nombre_actividad"
                                type="text"
                                required
                                value={data.nombre_actividad}
                                onChange={(e) => setData('nombre_actividad', e.target.value)}
                                placeholder="Ej. Torneo Regional de Ajedrez"
                                className={[
                                    'w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30',
                                    errors.nombre_actividad ? 'border-red-400' : 'border-cream-400'
                                ].join(' ')}
                            />
                            {errors.nombre_actividad && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.nombre_actividad}</p>
                            )}
                        </div>

                        {/* Institución */}
                        <div>
                            <label htmlFor="institucion" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Institución Organizadora <span className="text-guinda">*</span>
                            </label>
                            <input
                                id="institucion"
                                type="text"
                                required
                                value={data.institucion}
                                onChange={(e) => setData('institucion', e.target.value)}
                                placeholder="Ej. UNAM, SEP, CONADE..."
                                className={[
                                    'w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30',
                                    errors.institucion ? 'border-red-400' : 'border-cream-400'
                                ].join(' ')}
                            />
                            {errors.institucion && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.institucion}</p>
                            )}
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fecha_inicio" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Fecha de Inicio <span className="text-guinda">*</span>
                                </label>
                                <input
                                    id="fecha_inicio"
                                    type="date"
                                    required
                                    value={data.fecha_inicio}
                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                    className={[
                                        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30',
                                        errors.fecha_inicio ? 'border-red-400' : 'border-cream-400'
                                    ].join(' ')}
                                />
                                {errors.fecha_inicio && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.fecha_inicio}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="fecha_fin" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Fecha de Término <span className="text-guinda">*</span>
                                </label>
                                <input
                                    id="fecha_fin"
                                    type="date"
                                    required
                                    value={data.fecha_fin}
                                    onChange={(e) => setData('fecha_fin', e.target.value)}
                                    className={[
                                        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30',
                                        errors.fecha_fin ? 'border-red-400' : 'border-cream-400'
                                    ].join(' ')}
                                />
                                {errors.fecha_fin && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.fecha_fin}</p>
                                )}
                            </div>
                        </div>

                        {/* Horas */}
                        <div>
                            <label htmlFor="horas" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Total de Horas / Duración
                            </label>
                            <input
                                id="horas"
                                type="number"
                                min="1"
                                value={data.horas}
                                onChange={(e) => setData('horas', e.target.value)}
                                placeholder="Ej. 40"
                                className={[
                                    'w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30',
                                    errors.horas ? 'border-red-400' : 'border-cream-400'
                                ].join(' ')}
                            />
                            {errors.horas && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.horas}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Descripción breve
                            </label>
                            <textarea
                                id="descripcion"
                                rows={3}
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Describe brevemente la actividad y tu participación..."
                                className={[
                                    'w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30',
                                    errors.descripcion ? 'border-red-400' : 'border-cream-400'
                                ].join(' ')}
                            />
                            {errors.descripcion && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.descripcion}</p>
                            )}
                        </div>

                        <div className="border-t border-cream-300 pt-4">
                            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                                Documento Comprobante
                            </h2>
                            <DropZone file={data.archivo} onFile={(f) => setData('archivo', f)} error={errors.archivo} />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing || !data.archivo || !data.tipo_actividad}
                                className={[
                                    'btn-guinda transition-all',
                                    (processing || !data.archivo || !data.tipo_actividad) && 'cursor-not-allowed opacity-50',
                                ].join(' ')}
                            >
                                {processing ? 'Enviando...' : 'Enviar Solicitud'}
                            </button>
                        </div>
                    </form>

                    {/* ── Panel lateral ──────────────────────── */}
                    <aside className="w-full space-y-4 lg:w-80 lg:flex-shrink-0">
                        {/* Estado actual / Solicitudes */}
                        <div className="card p-4 space-y-3">
                            <h3 className="text-sm font-bold text-gray-700">Tus Solicitudes</h3>
                            <div className="space-y-3 max-h-[350px] overflow-y-auto sidebar-scroll pr-1">
                                {solicitudes.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic py-2 text-center">No tienes solicitudes enviadas.</p>
                                ) : (
                                    solicitudes.map((sol) => (
                                        <div 
                                            key={sol.id} 
                                            className={[
                                                'rounded-xl border p-3.5 space-y-2.5 transition-all hover:shadow-sm bg-white',
                                                sol.estatus === 'pendiente' 
                                                    ? 'border-amber-200 bg-amber-50/20' 
                                                    : sol.estatus === 'aprobada' 
                                                        ? 'border-green-200 bg-green-50/20' 
                                                        : 'border-red-200 bg-red-50/20'
                                            ].join(' ')}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                                                    REF-{String(sol.id).padStart(4, '0')}
                                                </span>
                                                <span className={[
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                                                    sol.estatus === 'pendiente' 
                                                        ? 'bg-amber-100 text-amber-800' 
                                                        : sol.estatus === 'aprobada' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                ].join(' ')}>
                                                    {sol.estatus === 'pendiente' 
                                                        ? 'Pendiente' 
                                                        : sol.estatus === 'aprobada' 
                                                            ? 'Aprobada' 
                                                            : 'Rechazada'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-800 truncate" title={sol.nombre_actividad}>
                                                    {sol.nombre_actividad}
                                                </h4>
                                                <p className="mt-0.5 text-[10px] text-gray-400 truncate">{sol.institucion}</p>
                                                {sol.motivo_rechazo && (
                                                    <p className="mt-2 text-[10px] text-red-600 bg-red-100/50 p-2 rounded border border-red-200/50 font-medium">
                                                        <strong>Motivo:</strong> {sol.motivo_rechazo}
                                                    </p>
                                                )}
                                                {sol.estatus === 'aprobada' && (
                                                    <p className="mt-2 text-[10px] text-green-700 bg-green-100/50 p-1.5 rounded border border-green-200/50 font-medium">
                                                        🎖️ Créditos Otorgados: <strong>{sol.creditos_otorgados}</strong>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between border-t border-cream-300 pt-2 text-[10px] text-gray-500">
                                                <span>📅 {sol.fecha_inicio}</span>
                                                <a
                                                    href={`/storage/${sol.ruta_archivo}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-semibold text-guinda hover:underline"
                                                >
                                                    Ver Comprobante
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Requisitos */}
                        <div className="card p-4">
                            <h3 className="mb-3 text-sm font-bold text-gray-700">Requisitos del Documento</h3>
                            <ul className="space-y-2.5">
                                {REQUISITOS.map((r, i) => (
                                    <li key={i} className="flex gap-2 text-xs text-gray-500">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda" />
                                        <span>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Proceso */}
                        <div className="card p-4">
                            <h3 className="mb-3 text-sm font-bold text-gray-700">Proceso de Validación</h3>
                            <ol className="space-y-3">
                                {[
                                    { n: '1', label: 'Envías tu solicitud con el documento' },
                                    { n: '2', label: 'El área SAAC revisa el comprobante' },
                                    { n: '3', label: 'Se te notifica el resultado' },
                                    { n: '4', label: 'El crédito se acredita a tu historial' },
                                ].map((step) => (
                                    <li key={step.n} className="flex gap-3 text-xs text-gray-500">
                                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-guinda text-[10px] font-bold text-white">
                                            {step.n}
                                        </span>
                                        <span>{step.label}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
