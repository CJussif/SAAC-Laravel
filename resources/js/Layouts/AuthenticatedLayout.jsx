import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    HomeIcon, GridIcon, UsersIcon, ClipboardIcon, UploadIcon,
    DocumentIcon, CheckSquareIcon, CheckCircleIcon, CogIcon,
    LogOutIcon, BellIcon, SearchIcon, PlusIcon, MenuIcon, XIcon,
} from '@/Components/Icons';

const CICLO = '2024-2025';

const ROL_LABEL = {
    alumno:        'Estudiante',
    docente:       'Docente',
    administrador: 'Administración',
};

const NAV = {
    alumno: [
        { label: 'Panel Principal',         href: route('dashboard'),          icon: HomeIcon },
        { label: 'Catálogo de Actividades', href: route('actividades.index'),  icon: GridIcon },
        { label: 'Mi Historial',            href: route('historial.index'),    icon: ClipboardIcon },
        { label: 'Subir Evidencia',         href: route('evidencias.create'),  icon: UploadIcon },
        { label: 'Mis Constancias',         href: route('constancias.index'),  icon: DocumentIcon },
    ],
    docente: [
        { label: 'Panel Principal', href: route('dashboard'),          icon: HomeIcon },
        { label: 'Pase de Lista',   href: route('asistencia.index'),   icon: CheckSquareIcon },
        { label: 'Mis Grupos',      href: route('grupos.index'),       icon: UsersIcon },
        { label: 'Expedientes',     href: route('expedientes.index'),  icon: ClipboardIcon },
    ],
    administrador: [
        { label: 'Panel Principal',      href: route('dashboard'),           icon: HomeIcon },
        { label: 'Catálogo Actividades', href: route('admin.catalogo'),      icon: GridIcon },
        { label: 'Gestión de Alumnos',   href: route('admin.alumnos'),       icon: UsersIcon },
        { label: 'Validar Evidencias',   href: route('admin.evidencias'),    icon: CheckCircleIcon },
        { label: 'Constancias',          href: route('admin.constancias'),   icon: DocumentIcon },
    ],
};

function SidebarLink({ item, isActive }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={[
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
            ].join(' ')}
        >
            <span className={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}>
                <Icon />
            </span>
            {item.label}
        </Link>
    );
}

function Sidebar({ user, currentPath, onClose }) {
    const rol = user?.rol ?? 'alumno';
    const links = NAV[rol] ?? NAV.alumno;
    const canCreateActivity = rol === 'administrador' || rol === 'docente';

    return (
        <aside className="flex h-full w-60 flex-col bg-sidebar shadow-sidebar">
            {/* Logo & branding */}
            <div className="flex items-center gap-3 px-5 py-5">
                <ApplicationLogo className="h-8 w-8 flex-shrink-0 text-white opacity-90" />
                <div className="min-w-0">
                    <p className="text-sm font-bold tracking-wide text-white">S.A.A.C.</p>
                    <p className="text-xs font-medium text-sidebar-muted">TESCHA</p>
                </div>
            </div>

            {/* Role + cycle */}
            <div className="mx-4 mb-4 rounded-lg bg-sidebar-active/60 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    {ROL_LABEL[rol] ?? 'Usuario'}
                </p>
                <p className="mt-0.5 text-xs text-white/70">Ciclo Escolar {CICLO}</p>
            </div>

            {/* Nueva Actividad button (admin/docente) */}
            {canCreateActivity && (
                <div className="px-4 pb-4">
                    <Link
                        href="/actividades/nueva"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-guinda py-2 text-sm font-semibold text-white transition-colors hover:bg-guinda-700 active:scale-[0.98]"
                    >
                        <PlusIcon />
                        Nueva Actividad
                    </Link>
                </div>
            )}

            <div className="mx-4 mb-3 border-t border-white/10" />

            {/* Navigation */}
            <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 pb-4">
                <ul className="space-y-0.5">
                    {links.map((item) => (
                        <li key={item.href}>
                            <SidebarLink
                                item={item}
                                isActive={currentPath === item.href || (item.href === route('dashboard') && currentPath === '/dashboard')}
                            />
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mx-4 border-t border-white/10" />

            {/* Bottom actions */}
            <div className="px-3 py-3 space-y-0.5">
                <Link
                    href={route('profile.edit')}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-text transition-all hover:bg-sidebar-hover hover:text-white"
                >
                    <span className="opacity-60 group-hover:opacity-90"><CogIcon /></span>
                    Configuración
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-text transition-all hover:bg-red-900/30 hover:text-red-300"
                >
                    <span className="opacity-60 group-hover:opacity-90"><LogOutIcon /></span>
                    Cerrar Sesión
                </Link>
            </div>

            <div className="px-4 py-3">
                <p className="text-[10px] text-white/25 text-center">SAAC v1.0 · {new Date().getFullYear()}</p>
            </div>
        </aside>
    );
}

function Topbar({ user, header }) {
    return (
        <div className="flex h-14 items-center justify-between gap-4 border-b border-cream-400 bg-cream-100 px-6">
            {/* Left: page title or breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    S.A.A.C. TESCHA
                </span>
                {header && (
                    <>
                        <span className="text-gray-300">/</span>
                        <span className="text-sm font-medium text-gray-700 truncate">{header}</span>
                    </>
                )}
            </div>

            {/* Right: search + notifications + avatar */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="relative hidden md:block">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <SearchIcon />
                    </span>
                    <input
                        type="search"
                        placeholder="Buscar..."
                        className="w-48 rounded-lg border border-cream-400 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda/30"
                    />
                </div>

                <button className="relative rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-cream-300 hover:text-gray-700">
                    <BellIcon />
                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-guinda" />
                </button>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-guinda text-xs font-bold text-white select-none">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth, ziggy } = usePage().props;
    const user = auth.user;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-cream">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — desktop fixed, mobile drawer */}
            <div className={[
                'fixed inset-y-0 left-0 z-30 transition-transform duration-200 lg:static lg:translate-x-0',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}>
                <Sidebar
                    user={user}
                    currentPath={currentPath}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile topbar toggle */}
                <div className="flex h-14 items-center gap-3 border-b border-cream-400 bg-cream-100 px-4 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-1.5 text-gray-600 hover:bg-cream-300"
                    >
                        <MenuIcon />
                    </button>
                    <span className="text-sm font-bold text-gray-700">S.A.A.C. TESCHA</span>
                </div>

                {/* Desktop topbar */}
                <div className="hidden lg:block">
                    <Topbar user={user} header={header} />
                </div>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto bg-cream p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
