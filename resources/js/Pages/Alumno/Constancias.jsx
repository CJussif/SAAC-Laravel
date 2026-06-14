import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DocumentIcon } from '@/Components/Icons';

const TIPO_COLOR = {
    cultural:  'bg-amber-100 text-amber-700',
    academica: 'bg-teal-100 text-teal-700',
    deportiva: 'bg-blue-100 text-blue-700',
};

function ConstanciaCard({ c }) {
    return (
        <div className="card overflow-hidden flex flex-col">
            {/* Franja decorativa */}
            <div className={`h-1.5 w-full ${TIPO_COLOR[c.tipo]?.replace('text-','bg-').split(' ')[0] ?? 'bg-guinda'}`} />

            <div className="flex flex-1 flex-col p-5 gap-4">
                <div className="flex items-start justify-between gap-2">
                    <span className="badge-acreditado">Acreditado</span>
                    <span className="text-[11px] font-mono text-gray-400">{c.folio}</span>
                </div>

                {/* Miniatura de documento */}
                <div className="flex h-28 items-center justify-center rounded-lg border border-cream-400 bg-cream-100">
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                        <DocumentIcon />
                        <div className="space-y-1 w-24">
                            <div className="h-1.5 w-full rounded-full bg-cream-400" />
                            <div className="h-1.5 w-3/4 rounded-full bg-cream-400" />
                            <div className="h-1.5 w-5/6 rounded-full bg-cream-400" />
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800 leading-snug">{c.nombre}</h3>
                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                        <p>📅 Completado: {c.completado}</p>
                        <p>🎖 Créditos Obtenidos: <strong className="text-gray-700">{c.creditos}</strong></p>
                    </div>
                </div>

                {c.ruta_constancia ? (
                    <a
                        href={`/storage/${c.ruta_constancia}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-guinda py-2.5 text-sm font-semibold text-white transition-all hover:bg-guinda-700 active:scale-[0.98]"
                    >
                        ⬇ Descargar Constancia
                    </a>
                ) : (
                    <span className="flex w-full items-center justify-center gap-2 rounded-lg bg-cream-300 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed">
                        Constancia no disponible
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Constancias({ constancias = [] }) {
    return (
        <AuthenticatedLayout header="Mis Constancias">
            <Head title="Mis Constancias" />

            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mis Constancias</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Historial digital de actividades complementarias acreditadas. Descarga tus documentos oficiales para trámites institucionales.
                    </p>
                </div>

                {/* Aviso firmas físicas */}
                <div className="flex gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <span className="mt-0.5 flex-shrink-0 text-teal-600">ℹ</span>
                    <div className="text-sm text-teal-800">
                        <strong>Acerca de las firmas físicas:</strong>{' '}
                        Las constancias descargadas cuentan con validez digital. Si tu trámite requiere firmas autógrafas o
                        sellos institucionales en físico, por favor acude a la Subdirección de Servicios Escolares con tu
                        documento impreso de Lunes a Viernes de 9:00 a 14:00 hrs.
                    </div>
                </div>

                {/* Grid de constancias */}
                {constancias.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {constancias.map((c) => <ConstanciaCard key={c.id} c={c} />)}
                    </div>
                ) : (
                    <div className="card flex flex-col items-center gap-3 py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200 text-gray-400">
                            <DocumentIcon />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Aún no tienes constancias generadas</p>
                        <p className="text-xs text-gray-400">Completa y acredita una actividad complementaria para ver tu constancia aquí.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
