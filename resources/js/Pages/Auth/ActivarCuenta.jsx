import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

const CARRERAS = ['ISC', 'IGE', 'IDS'];

export default function ActivarCuenta({ email, token, tokenInvalido }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre:                '',
        apellido_paterno:      '',
        apellido_materno:      '',
        matricula:             '',
        carrera:               'ISC',
        semestre:              1,
        password:              '',
        password_confirmation: '',
    });

    const enviar = (e) => {
        e.preventDefault();
        post(route('invitacion.procesar', token));
    };

    if (tokenInvalido) {
        return (
            <GuestLayout>
                <Head title="Enlace inválido" />
                <div className="text-center">
                    <div className="mb-4 text-5xl">⛔</div>
                    <h1 className="text-xl font-bold text-gray-800">Enlace inválido o ya utilizado</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Este enlace de activación ya fue usado o no existe. Solicita uno nuevo al administrador.
                    </p>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Activar cuenta" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">Activa tu cuenta</h1>
                <p className="mt-1 text-sm text-gray-500">Completa tu perfil para acceder al sistema SAAC.</p>
            </div>

            <form onSubmit={enviar} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Correo institucional</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full rounded-lg border border-cream-400 bg-cream-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                        ['nombre',           'Nombre(s)'],
                        ['apellido_paterno', 'Apellido paterno'],
                        ['apellido_materno', 'Apellido materno'],
                    ].map(([field, label]) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                            <input
                                type="text"
                                value={data[field]}
                                onChange={(e) => setData(field, e.target.value)}
                                className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                            />
                            {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Matrícula</label>
                        <input
                            type="text"
                            value={data.matricula}
                            onChange={(e) => setData('matricula', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                        />
                        {errors.matricula && <p className="mt-1 text-xs text-red-500">{errors.matricula}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Carrera</label>
                        <select
                            value={data.carrera}
                            onChange={(e) => setData('carrera', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm focus:border-guinda focus:outline-none"
                        >
                            {CARRERAS.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        {errors.carrera && <p className="mt-1 text-xs text-red-500">{errors.carrera}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Semestre</label>
                        <select
                            value={data.semestre}
                            onChange={(e) => setData('semestre', parseInt(e.target.value))}
                            className="w-full rounded-lg border border-cream-400 bg-white px-3 py-2 text-sm focus:border-guinda focus:outline-none"
                        >
                            {[1,2,3,4,5,6,7,8,9].map((s) => <option key={s} value={s}>{s}°</option>)}
                        </select>
                        {errors.semestre && <p className="mt-1 text-xs text-red-500">{errors.semestre}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Confirmar contraseña</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-lg border border-cream-400 px-3 py-2 text-sm focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                        />
                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn-guinda w-full justify-center py-2.5"
                >
                    {processing ? 'Activando cuenta…' : 'Activar mi cuenta'}
                </button>
            </form>
        </GuestLayout>
    );
}
