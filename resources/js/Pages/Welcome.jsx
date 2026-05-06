import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <nav className="bg-green-700 shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <span className="text-white font-bold text-lg">SAAC — TESCHA</span>
                        <div className="flex gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-white hover:text-green-200 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-white hover:text-green-200 text-sm font-medium"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-white text-green-700 hover:bg-green-50 text-sm font-medium px-3 py-1 rounded-md"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center max-w-xl">
                        <h1 className="text-4xl font-bold text-green-700 mb-4">
                            Bienvenido al SAAC
                        </h1>
                        <p className="text-xl text-gray-600 mb-2">
                            Sistema de Administración de Actividades Complementarias
                        </p>
                        <hr className="my-6 border-gray-300" />
                        <p className="text-gray-500 mb-8">
                            Gestiona tus actividades complementarias, consulta horarios y descarga tus constancias.
                        </p>
                        {!auth.user && (
                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="bg-green-700 text-white hover:bg-green-800 font-medium px-6 py-3 rounded-lg transition"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="border border-green-700 text-green-700 hover:bg-green-50 font-medium px-6 py-3 rounded-lg transition"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="text-center text-xs text-gray-400 py-4">
                    TESCHA — Tecnológico Superior de Chalco
                </footer>
            </div>
        </>
    );
}
