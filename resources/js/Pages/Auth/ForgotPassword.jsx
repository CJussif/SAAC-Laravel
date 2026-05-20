import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña" />

            <h2 className="mb-2 text-lg font-bold text-gray-800">Recuperar Contraseña</h2>
            <p className="mb-5 text-sm text-gray-500">
                Ingresa tu correo institucional asociado. Te enviaremos un enlace seguro para restablecer tu acceso.
            </p>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                        Correo Institucional
                    </label>
                    <input
                        id="email" type="email" name="email" value={data.email}
                        autoFocus onChange={(e) => setData('email', e.target.value)}
                        placeholder="ejemplo@tescha.edu.mx"
                        className="block w-full rounded-lg border border-cream-400 bg-cream-50 px-3.5 py-2.5 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-2 focus:ring-guinda/20 transition-colors"
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <button type="submit" disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-guinda py-2.5 text-sm font-semibold text-white transition-all hover:bg-guinda-700 active:scale-[0.98] disabled:opacity-60">
                    {processing ? 'Enviando...' : 'Enviar enlace →'}
                </button>

                <p className="text-center text-xs text-gray-400">
                    <Link href={route('login')} className="text-guinda hover:underline">
                        ← Volver al inicio de sesión
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
