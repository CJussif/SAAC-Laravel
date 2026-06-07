import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircleIcon, BellIcon } from '@/Components/Icons'; // O los iconos que prefieras

// Reutilizamos el mapa de colores para los iconos
const ICON_MAP = {
    info:    { bg: 'bg-blue-100',   text: 'text-blue-600',  symbol: 'ℹ' },
    warning: { bg: 'bg-amber-100',  text: 'text-amber-600', symbol: '⚠' },
    success: { bg: 'bg-green-100',  text: 'text-green-700', symbol: '✓' },
    error:   { bg: 'bg-red-100',    text: 'text-red-600',   symbol: '✕' },
};

export default function Notificaciones({ auth, notificaciones }) {
    return (
        <AuthenticatedLayout
            header="Historial de Notificaciones"
        >
            <Head title="Notificaciones | S.A.A.C." />

            <div className="max-w-4xl mx-auto mt-6">
                <div className="bg-white rounded-xl shadow-card-sm border border-cream-300 overflow-hidden">
                    
                    {/* Encabezado */}
                    <div className="bg-cream-100 border-b border-cream-300 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <BellIcon className="w-5 h-5 text-guinda" />
                            Todas tus notificaciones
                        </h2>
                    </div>

                    {/* Lista */}
                    <ul className="divide-y divide-cream-200">
                        {notificaciones.data.length === 0 ? (
                            <li className="px-6 py-12 text-center text-gray-500">
                                No tienes notificaciones en tu historial.
                            </li>
                        ) : (
                            notificaciones.data.map((n) => {
                                const iconCfg = ICON_MAP[n.data?.icon] ?? ICON_MAP.info;
                                const isUnread = !n.read_at;

                                return (
                                    <li 
                                        key={n.id} 
                                        className={`flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 transition hover:bg-cream-50 ${isUnread ? 'bg-guinda/[0.03]' : ''}`}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Icono */}
                                            <span className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold ${iconCfg.bg} ${iconCfg.text}`}>
                                                {iconCfg.symbol}
                                            </span>

                                            {/* Contenido */}
                                            <div>
                                                <p className={`text-sm ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                                    {n.data?.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(n.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Acción (Si no está leída, mostrar botón) */}
                                        {isUnread ? (
                                            <Link
                                                href={route('notificaciones.leer', n.id)}
                                                method="post"
                                                as="button"
                                                className="text-xs font-semibold text-guinda bg-guinda/10 hover:bg-guinda/20 px-3 py-1.5 rounded-lg transition self-start sm:self-auto"
                                            >
                                                Marcar como leída
                                            </Link>
                                        ) : (
                                            <span className="text-xs font-medium text-green-600 flex items-center gap-1 self-start sm:self-auto">
                                                <CheckCircleIcon className="w-4 h-4" /> Leída
                                            </span>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}