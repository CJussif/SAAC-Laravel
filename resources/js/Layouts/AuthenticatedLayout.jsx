import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    HomeIcon, GridIcon, UsersIcon, ClipboardIcon, UploadIcon,
    DocumentIcon, CheckSquareIcon, CheckCircleIcon, CogIcon,
    LogOutIcon, BellIcon, SearchIcon, PlusIcon, MenuIcon, XIcon,
} from '@/Components/Icons';



const ROL_LABEL = {
    alumno:        'Estudiante',
    docente:       'Docente',
    administrador: 'Administración',
};

const NAV = {
    alumno: [
        { label: 'Panel Principal',         routeName: 'dashboard',          icon: HomeIcon },
        { label: 'Catálogo de Actividades', routeName: 'actividades.index',  icon: GridIcon },
        { label: 'Mi Historial',            routeName: 'historial.index',    icon: ClipboardIcon },
        { label: 'Subir Evidencia',         routeName: 'evidencias.create',  icon: UploadIcon },
        { label: 'Mis Constancias',         routeName: 'constancias.index',  icon: DocumentIcon },
    ],
    docente: [
        { label: 'Panel Principal', routeName: 'dashboard',          icon: HomeIcon },
        { label: 'Pase de Lista',   routeName: 'asistencia.index',   icon: CheckSquareIcon },
        { label: 'Mis Grupos',      routeName: 'grupos.index',       icon: UsersIcon },
        { label: 'Expedientes',     routeName: 'expedientes.index',  icon: ClipboardIcon },
    ],
    administrador: [
        { label: 'Panel Principal',      routeName: 'dashboard',           icon: HomeIcon },
        { label: 'Catálogo Actividades', routeName: 'admin.catalogo',      icon: GridIcon },
        { label: 'Gestión de Alumnos',   routeName: 'admin.alumnos',       icon: UsersIcon },
        { label: 'Validar Evidencias',   routeName: 'admin.solicitudes.index',    icon: CheckCircleIcon },
        { label: 'Constancias',          routeName: 'admin.constancias',   icon: DocumentIcon },
        { label: 'Invitaciones',         routeName: 'admin.invitaciones',  icon: ClipboardIcon },
    ],
};

function SidebarLink({ item, isActive }) {
    const Icon = item.icon;
    return (
        <Link
            href={route(item.routeName)}
            className={[
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                    ? 'bg-sidebar-active text-white hover:bg-sidebar-active'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
            ].join(' ')}
        >
            <span className={isActive ? 'opacity-100 group-hover:opacity-100' : 'opacity-60 group-hover:opacity-90'}>
                <Icon />
            </span>
            {item.label}
        </Link>
    );
}

function Sidebar({ user, currentPath, onClose }) {
    const { current_semester } = usePage().props;
    const rol = user?.rol ?? 'alumno';
    const links = NAV[rol] ?? NAV.alumno;
    const canCreateActivity = rol === 'administrador';

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
                <p className="mt-0.5 text-xs text-white/70">{current_semester}</p>
            </div>

            {/* Nueva Actividad button (admin/docente) */}
            {canCreateActivity && (
                <div className="px-4 pb-4">
                    <Link
                        href={route('admin.actividades.create')}
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
                        <li key={item.routeName}>
                            <SidebarLink
                                item={item}
                                isActive={route().current(item.routeName)}
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

// ── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(isoString) {
    const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (diff < 60)   return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return `Hace ${Math.floor(diff / 86400)} d`;
}

const ICON_MAP = {
    info:    { bg: 'bg-blue-100',   text: 'text-blue-600',  symbol: 'ℹ' },
    warning: { bg: 'bg-amber-100',  text: 'text-amber-600', symbol: '⚠' },
    success: { bg: 'bg-green-100',  text: 'text-green-700', symbol: '✓' },
    error:   { bg: 'bg-red-100',    text: 'text-red-600',   symbol: '✕' },
};

// ── NotificationsDropdown ─────────────────────────────────────────────────────
function NotificationsDropdown({ notifications = [] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const unreadCount = notifications.filter((n) => !n.read_at).length;

    // Close on outside click
    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Bell trigger */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Notificaciones"
                className="relative rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-cream-300 hover:text-gray-700 focus:outline-none"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-guinda text-[9px] font-bold text-white leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {open && (
                <div
                    className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl border border-cream-400 bg-white shadow-card-md"
                    style={{ animation: 'fadeSlideDown 0.15s ease-out' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-cream-300 px-4 py-3">
                        <h3 className="text-sm font-semibold text-gray-800">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-guinda/10 px-2 py-0.5 text-xs font-semibold text-guinda">
                                {unreadCount} nueva{unreadCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {/* List */}
                    <ul className="max-h-72 overflow-y-auto divide-y divide-cream-200">
                        {notifications.length === 0 ? (
                            <li className="px-4 py-6 text-center text-sm text-gray-400">
                                No tienes notificaciones.
                            </li>
                        ) : (
                            notifications.map((n) => {
                                const iconCfg = ICON_MAP[n.data?.icon] ?? ICON_MAP.info;
                                const isUnread = !n.read_at;
                                return (
                                    <Link
                                        key={n.id}
                                        href={route('notificaciones.leer', n.id)}
                                        method="post"
                                        as="button"
                                        className={[
                                            'flex w-full text-left gap-3 px-4 py-3 transition-colors hover:bg-cream-50',
                                            isUnread ? 'bg-guinda/[0.03]' : '',
                                        ].join(' ')}
                                    >
                                        {/* Icon bubble */}
                                        <span
                                            className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${iconCfg.bg} ${iconCfg.text}`}
                                        >
                                            {iconCfg.symbol}
                                        </span>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-snug ${ isUnread ? 'font-semibold text-gray-800' : 'font-medium text-gray-600' }`}>
                                                {n.data?.message}
                                            </p>
                                            <p className="mt-1 text-[10px] text-gray-400">{timeAgo(n.created_at)}</p>
                                        </div>

                                        {/* Unread dot */}
                                        {isUnread && (
                                            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-guinda" />
                                        )}
                                    </Link>
                                );
                            })
                        )}
                    </ul>

                    {/* Footer */}
                    <div className="border-t border-cream-300 px-4 py-2.5 text-center">
                        <Link
                            href={route('notificaciones.index')}
                            onClick={() => setOpen(false)}
                            className="block w-full text-xs font-medium text-guinda hover:text-guinda-700 transition-colors"
                        >
                            Ver todas las notificaciones
                        </Link>
                    </div>
                </div>
            )}

            {/* Micro-animation keyframe (injected inline once) */}
            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
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

                <NotificationsDropdown notifications={usePage().props.auth?.notifications ?? []} />

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
    const currentPath = usePage().url;
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