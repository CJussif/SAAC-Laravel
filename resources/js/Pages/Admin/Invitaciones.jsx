import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Invitaciones({ invitaciones, invitacion_url }) {
    const [copiado, setCopiado] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

    const copiarUrl = () => {
        navigator.clipboard.writeText(invitacion_url)
            .then(() => {
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
            })
            .catch(() => {});
    };

    const enviar = (e) => {
        e.preventDefault();
        post(route('admin.invitaciones'), { onSuccess: reset });
    };

    const revocar = (id) => {
        if (!confirm('¿Revocar esta invitación?')) return;
        router.delete(route('admin.invitaciones.destroy', id));
    };

    return (
        <AuthenticatedLayout header="Invitaciones">
            <Head title="Gestión de Invitaciones" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Invitaciones de Registro</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Genera enlaces de registro para correos institucionales autorizados.
                    </p>
                </div>

                {invitacion_url && (
                    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                        <span className="mt-0.5 text-green-600">✓</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-green-700">Invitación creada — copia y envía este enlace al alumno</p>
                            <p className="mt-1 break-all font-mono text-xs text-green-700">{invitacion_url}</p>
                        </div>
                        <button
                            onClick={copiarUrl}
                            className="flex-shrink-0 rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 transition-colors"
                        >
                            {copiado ? '¡Copiado!' : 'Copiar'}
                        </button>
                    </div>
                )}

                <div className="card p-5">
                    <h2 className="mb-3 text-sm font-semibold text-gray-700">Nueva invitación</h2>
                    <form onSubmit={enviar} className="flex gap-3">
                        <div className="flex-1">
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="correo@tescha.edu.mx"
                                className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <button type="submit" disabled={processing} className="btn-guinda flex-shrink-0">
                            Generar enlace
                        </button>
                    </form>
                </div>

                <div className="card overflow-hidden">
                    <div className="border-b border-cream-400 bg-cream-50 px-5 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Historial de invitaciones
                        </p>
                    </div>
                    {invitaciones.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="font-semibold text-gray-500">Sin invitaciones aún</p>
                            <p className="mt-1 text-xs text-gray-400">Genera el primer enlace con el formulario de arriba.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    {['Correo', 'Generada', 'Estado', 'Activada', 'Acciones'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {invitaciones.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-cream-50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm text-gray-700">{inv.email}</td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500">{inv.creada_en}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                inv.estado === 'Activada'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {inv.estado}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500">{inv.usado_en ?? '—'}</td>
                                        <td className="px-5 py-3.5">
                                            {inv.estado === 'Pendiente' && (
                                                <button
                                                    onClick={() => revocar(inv.id)}
                                                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    Revocar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
