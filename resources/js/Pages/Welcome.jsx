import { Head, Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

const FEATURES = [
    {
        icon: '📋',
        title: 'Catálogo Digital',
        desc: 'Consulta todas las actividades disponibles: deportivas, culturales y académicas. Inscríbete en segundos desde cualquier dispositivo.',
    },
    {
        icon: '✅',
        title: 'Asistencia en Línea',
        desc: 'Los docentes registran el pase de lista directamente en el sistema. Sin papel, sin demoras, sin pérdidas de información.',
    },
    {
        icon: '📄',
        title: 'Constancias Automáticas',
        desc: 'Al acreditar tu actividad, descarga tu constancia oficial con código QR de validación directamente desde tu perfil.',
    },
];

const ROLES = [
    { label: 'Estudiante',     color: 'bg-guinda',   desc: 'Inscríbete, sube evidencias y descarga tus constancias.' },
    { label: 'Docente',        color: 'bg-sidebar',  desc: 'Gestiona tus grupos y registra asistencia digitalmente.' },
    { label: 'Administrador',  color: 'bg-gray-700', desc: 'Administra el catálogo, valida evidencias y genera reportes.' },
];

export default function Welcome({ auth }) {
    const { current_semester } = usePage().props;
    return (
        <>
            <Head title="Bienvenido — SAAC TESCHA" />

            <div className="flex min-h-screen flex-col bg-cream font-sans">
                {/* ── Navbar ──────────────────────────────── */}
                <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-cream-400 bg-cream/90 px-6 backdrop-blur-sm lg:px-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-guinda text-white">
                            <ApplicationLogo className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-sm font-bold tracking-wide text-gray-800">S.A.A.C.</span>
                            <span className="ml-1.5 text-xs font-medium text-gray-400">TESCHA</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-guinda px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-guinda-700"
                            >
                                Ir al Panel →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-cream-300 hover:text-gray-800"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-guinda px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-guinda-700"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* ── Hero ────────────────────────────────── */}
                <section className="relative overflow-hidden px-6 py-24 lg:px-12">
                    {/* Fondo campus */}
                    <div
                        className="pointer-events-none absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/img/tescha-bg.jpg')", filter: 'brightness(0.35)', transform: 'scale(1.04)' }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-sidebar/60" />

                    <div className="relative mx-auto max-w-4xl text-center">
                        {/* Badge */}
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                            {current_semester} activo
                        </span>

                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Gestiona tus actividades<br />
                            <span className="text-guinda-300">complementarias</span> desde aquí
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
                            El Sistema de Administración de Actividades Complementarias del TESCHA centraliza la inscripción, el control de asistencia y la emisión de constancias en una sola plataforma institucional.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-xl bg-guinda px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-guinda-700 hover:shadow-guinda/30 active:scale-[0.98]"
                                >
                                    Ir a mi Panel →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl bg-guinda px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-guinda-700 active:scale-[0.98]"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
                                    >
                                        Crear Cuenta
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Stats strip ─────────────────────────── */}
                <section className="border-b border-cream-400 bg-white">
                    <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-cream-300 sm:grid-cols-4">
                        {[
                            { n: '24', label: 'Actividades disponibles' },
                            { n: '500+', label: 'Alumnos inscritos' },
                            { n: '18', label: 'Docentes activos' },
                            { n: '3', label: 'Categorías' },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col items-center px-6 py-6 text-center">
                                <span className="text-3xl font-extrabold text-guinda">{s.n}</span>
                                <span className="mt-1 text-xs text-gray-500">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Features ────────────────────────────── */}
                <section className="px-6 py-20 lg:px-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-12 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                                Todo lo que necesitas, en un solo lugar
                            </h2>
                            <p className="mt-3 text-sm text-gray-500">
                                Diseñado para simplificar los procesos de la comunidad TESCHA.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="rounded-2xl border border-cream-400 bg-white p-6 shadow-card transition-shadow hover:shadow-card-md">
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cream-100 text-xl">
                                        {f.icon}
                                    </div>
                                    <h3 className="mb-2 font-bold text-gray-800">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Roles ───────────────────────────────── */}
                <section className="bg-cream-100 px-6 py-20 lg:px-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                                Una plataforma, tres roles
                            </h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {ROLES.map((r) => (
                                <div key={r.label} className="flex items-start gap-4 rounded-2xl border border-cream-400 bg-white p-5 shadow-card">
                                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${r.color}`}>
                                        {r.label[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{r.label}</p>
                                        <p className="mt-0.5 text-xs text-gray-500">{r.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA final ───────────────────────────── */}
                {!auth.user && (
                    <section className="bg-guinda px-6 py-16 text-center lg:px-12">
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">
                            ¿Listo para empezar?
                        </h2>
                        <p className="mt-3 text-sm text-white/70">
                            Accede con tu cuenta institucional o regístrate si es tu primer ciclo.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href={route('login')}
                                className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-guinda transition-colors hover:bg-cream-100"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-xl border border-white/30 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                            >
                                Crear Cuenta
                            </Link>
                        </div>
                    </section>
                )}

                {/* ── Footer ──────────────────────────────── */}
                <footer className="border-t border-cream-400 bg-white px-6 py-6 text-center">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Tecnológico de Estudios Superiores de Chalco — TESCHA · S.A.A.C. v1.0
                    </p>
                </footer>
            </div>
        </>
    );
}
