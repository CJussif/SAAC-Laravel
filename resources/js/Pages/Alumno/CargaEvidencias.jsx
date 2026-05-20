import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { UploadIcon } from '@/Components/Icons';

const TIPOS = ['Deportiva', 'Cultural', 'Académica'];

const REQUISITOS = [
    'El archivo debe ser PDF, JPG o PNG (máximo 5 MB).',
    'La constancia debe estar expedida por una institución reconocida.',
    'Debe incluir nombre del alumno, actividad y horas o duración.',
    'No se aceptan documentos con correcciones o alteraciones.',
];

function DropZone({ file, onFile }) {
    const [drag, setDrag] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFile(dropped);
    };

    return (
        <label
            className={[
                'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
                drag
                    ? 'border-guinda bg-guinda/5'
                    : file
                        ? 'border-green-400 bg-green-50'
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-xl">
                        ✓
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">{file.name}</p>
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
    );
}

export default function CargaEvidencias() {
    const [file, setFile] = useState(null);
    const [tipo, setTipo] = useState('');
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);
    };

    if (enviado) {
        return (
            <AuthenticatedLayout header="Subir Evidencia">
                <Head title="Subir Evidencia" />
                <div className="flex flex-col items-center justify-center py-24 gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
                        ✓
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-800">Evidencia enviada correctamente</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Tu solicitud ha sido registrada y está pendiente de revisión por el área de SAAC.
                            Recibirás una notificación cuando sea validada.
                        </p>
                    </div>
                    <button
                        onClick={() => { setEnviado(false); setFile(null); setTipo(''); }}
                        className="btn-guinda"
                    >
                        Enviar otra evidencia
                    </button>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header="Subir Evidencia">
            <Head title="Subir Evidencia" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Subir Evidencia Externa</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Si realizaste una actividad complementaria fuera del catálogo institucional, sube aquí tu constancia para que sea validada.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* ── Formulario ─────────────────────────── */}
                    <form onSubmit={handleSubmit} className="card flex-1 space-y-5 p-6">
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
                                        key={t}
                                        type="button"
                                        onClick={() => setTipo(t)}
                                        className={[
                                            'flex-1 rounded-lg border py-2 text-sm font-semibold transition-all',
                                            tipo === t
                                                ? 'border-guinda bg-guinda text-white'
                                                : 'border-cream-400 bg-white text-gray-600 hover:border-guinda/40',
                                        ].join(' ')}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
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
                                placeholder="Ej. Torneo Regional de Ajedrez"
                                className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
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
                                placeholder="Ej. UNAM, SEP, CONADE..."
                                className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
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
                                    className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm text-gray-700 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                                />
                            </div>
                            <div>
                                <label htmlFor="fecha_fin" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Fecha de Término <span className="text-guinda">*</span>
                                </label>
                                <input
                                    id="fecha_fin"
                                    type="date"
                                    required
                                    className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm text-gray-700 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                                />
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
                                placeholder="Ej. 40"
                                className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Descripción breve
                            </label>
                            <textarea
                                id="descripcion"
                                rows={3}
                                placeholder="Describe brevemente la actividad y tu participación..."
                                className="w-full resize-none rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                        </div>

                        <div className="border-t border-cream-300 pt-4">
                            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                                Documento Comprobante
                            </h2>
                            <DropZone file={file} onFile={setFile} />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={!file || !tipo}
                                className={[
                                    'btn-guinda transition-all',
                                    (!file || !tipo) && 'cursor-not-allowed opacity-50',
                                ].join(' ')}
                            >
                                Enviar Solicitud
                            </button>
                        </div>
                    </form>

                    {/* ── Panel lateral ──────────────────────── */}
                    <aside className="w-full space-y-4 lg:w-64 lg:flex-shrink-0">
                        {/* Estado actual */}
                        <div className="card p-4 space-y-2">
                            <h3 className="text-sm font-bold text-gray-700">Tu Solicitud Actual</h3>
                            <div className="rounded-lg bg-cream-100 p-3 text-xs text-gray-500 text-center">
                                No tienes solicitudes pendientes de revisión.
                            </div>
                        </div>

                        {/* Requisitos */}
                        <div className="card p-4">
                            <h3 className="mb-3 text-sm font-bold text-gray-700">Requisitos del Documento</h3>
                            <ul className="space-y-2.5">
                                {REQUISITOS.map((r, i) => (
                                    <li key={i} className="flex gap-2 text-xs text-gray-500">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-guinda" />
                                        {r}
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
                                        {step.label}
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
