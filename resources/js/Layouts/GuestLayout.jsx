import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream">
            {/* Fondo difuminado institucional */}
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/img/tescha-bg.jpg')",
                    filter: 'blur(3px) brightness(0.50)',
                    transform: 'scale(1.05)',
                }}
            />
            {/* Overlay verde sidebar */}
            <div className="pointer-events-none absolute inset-0 bg-sidebar/35" />

            {/* Tarjeta centrada */}
            <div className="relative z-10 w-full max-w-sm px-4">
                {/* Logo + nombre del sistema */}
                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                        <ApplicationLogo className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">S.A.A.C.</h1>
                        <p className="text-sm font-semibold text-white/70">TESCHA</p>
                        <p className="mt-1 text-xs text-white/45 leading-relaxed">
                            Sistema de Administración de<br />Actividades Complementarias
                        </p>
                    </div>
                </div>

                {/* Card de autenticación */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div className="p-8">
                        {children}
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-white/35">
                    Tecnológico de Estudios Superiores de Chalco · {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
