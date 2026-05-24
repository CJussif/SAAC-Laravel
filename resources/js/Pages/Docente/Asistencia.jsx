import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

const DIAS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'];

function CheckBox({ checked, onClick, disabled }) {
    return (
        <div 
            onClick={disabled ? undefined : onClick}
            className={[
                'mx-auto h-5 w-5 rounded flex items-center justify-center border-2 transition-colors',
                disabled ? 'cursor-not-allowed opacity-40 bg-cream-100 border-cream-300' : 'cursor-pointer',
                checked ? 'border-guinda bg-guinda text-white' : 'border-cream-400 bg-white hover:border-guinda/60',
            ].join(' ')}
        >
            {checked && (
                <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3">
                    <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
    );
}

export default function Asistencia({
    grupos = [],
    alumnos = [],
    selectedGrupoId,
    semana = 1,
    weekRange = "",
    weekDates = []
}) {
    const { flash = {}, errors = {} } = usePage().props;

    const [attendanceMatrix, setAttendanceMatrix] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const matrix = {};
        alumnos.forEach((a) => {
            matrix[a.inscripcion_id] = Array.isArray(a.asistencia)
                ? [...a.asistencia]
                : [null, null, null, null, null];
        });
        setAttendanceMatrix(matrix);
        setIsDirty(false);
    }, [alumnos]);

    const handleToggle = (inscripcionId, dayIndex) => {
        const student = alumnos.find((a) => a.inscripcion_id === inscripcionId);
        if (student && (student.estatus === 'acreditado' || student.estatus === 'reprobado')) {
            return;
        }

        setAttendanceMatrix((prev) => {
            const currentList = prev[inscripcionId] ? [...prev[inscripcionId]] : [null, null, null, null, null];
            currentList[dayIndex] = currentList[dayIndex] === true ? false : true;
            return {
                ...prev,
                [inscripcionId]: currentList,
            };
        });
        setIsDirty(true);
    };

    const handlePrevWeek = () => {
        if (semana > 1) {
            router.get(route("asistencia.index"), { grupo_id: selectedGrupoId, semana: semana - 1 });
        }
    };

    const handleNextWeek = () => {
        if (semana < 16) {
            router.get(route("asistencia.index"), { grupo_id: selectedGrupoId, semana: semana + 1 });
        }
    };

    const handleSaveAttendance = () => {
        const payload = [];
        Object.entries(attendanceMatrix).forEach(([inscripcionId, days]) => {
            days.forEach((asistio, index) => {
                if (asistio !== null) {
                    payload.push({
                        inscripcion_id: parseInt(inscripcionId, 10),
                        fecha: weekDates[index],
                        asistio: asistio
                    });
                }
            });
        });

        router.post(route('asistencia.store'), {
            asistencias: payload
        }, {
            onSuccess: () => {
                setIsDirty(false);
            }
        });
    };

    const handleAcreditacion = () => {
        if (confirm('¿Está seguro de que desea realizar la acreditación final de este grupo? Esta acción modificará el estado final y créditos de los alumnos y no se puede deshacer.')) {
            router.post(route('asistencia.acreditar'), {
                grupo_id: selectedGrupoId
            });
        }
    };

    const isAcreditacionDisabled = grupos.length === 0 || !selectedGrupoId;

    return (
        <AuthenticatedLayout header="Pase de Lista">
            <Head title="Control de Asistencia" />

            <div className="space-y-5">
                {/* Alert banners */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm animate-fade-in">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xs">✓</span>
                        <div className="flex-1 font-medium">{flash.success}</div>
                    </div>
                )}

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Control de Asistencia</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Gestiona la asistencia y acreditación final de sus grupos asignados para el periodo en curso.
                        </p>
                    </div>
                    <button 
                        onClick={handleAcreditacion}
                        disabled={isAcreditacionDisabled}
                        className={[
                            'btn-guinda flex-shrink-0 font-semibold',
                            isAcreditacionDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        ].join(' ')}
                    >
                        ✔ Realizar Acreditación Final
                    </button>
                </div>

                {/* Selector de grupo */}
                <div>
                    <h2 className="mb-3 text-sm font-semibold text-gray-600">Mis Grupos Asignados</h2>
                    {grupos.length === 0 ? (
                        <p className="text-sm text-gray-500">No tiene grupos asignados.</p>
                    ) : (
                        <div className="flex gap-3 flex-wrap">
                            {grupos.map((g) => (
                                <div
                                    key={g.id}
                                    onClick={() => router.get(route("asistencia.index"), { grupo_id: g.id, semana })}
                                    className={[
                                        'flex-1 min-w-[240px] max-w-xs cursor-pointer rounded-xl border-2 p-4 transition-all',
                                        g.id === selectedGrupoId
                                            ? 'border-guinda bg-guinda/5'
                                            : 'border-cream-400 bg-white hover:border-guinda/40',
                                    ].join(' ')}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className={[
                                                'text-[10px] font-bold uppercase tracking-wider',
                                                g.tipo === 'DEPORTIVA' ? 'text-blue-600' : 'text-amber-600',
                                            ].join(' ')}>
                                                {g.tipo}
                                            </span>
                                            <p className="mt-0.5 text-sm font-bold text-gray-800">{g.nombre}</p>
                                            <p className="text-xs text-gray-400">{g.horario || 'Sin horario'} · {g.creditos || 0} Crd.</p>
                                        </div>
                                        {g.id === selectedGrupoId && (
                                            <span className="badge-en-curso text-[10px]">Activo</span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-xs text-gray-500">
                                        Alumnos Inscritos: <strong className="text-gray-700">{g.inscritos}</strong>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tabla de pase de lista */}
                <div className="card overflow-hidden">
                    {/* Header de semana */}
                    <div className="flex items-center justify-between border-b border-cream-400 px-5 py-3 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-semibold text-gray-700">
                                Pase de Lista — <span className="text-gray-500 font-normal">{weekRange}</span>
                            </h2>
                            {isDirty && (
                                <button 
                                    onClick={handleSaveAttendance}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-guinda px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-guinda-700 shadow-md hover:scale-105"
                                >
                                    💾 Guardar Asistencias
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handlePrevWeek}
                                disabled={semana <= 1}
                                className={[
                                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                    semana <= 1
                                        ? 'border-cream-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : 'border-cream-400 bg-white text-gray-500 hover:bg-cream-100'
                                ].join(' ')}
                            >
                                ← Semana Anterior
                            </button>
                            <button 
                                onClick={handleNextWeek}
                                disabled={semana >= 16}
                                className={[
                                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                    semana >= 16
                                        ? 'border-cream-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : 'border-cream-400 bg-white text-gray-500 hover:bg-cream-100'
                                ].join(' ')}
                            >
                                Siguiente Semana →
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-cream-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-10">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Matrícula</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre del Alumno</th>
                                    {DIAS.map((d) => (
                                        <th key={d} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 w-14">{d}</th>
                                    ))}
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 w-20">% Asist.</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 w-28">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-300">
                                {alumnos.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                                            No hay alumnos inscritos en este grupo.
                                        </td>
                                    </tr>
                                ) : (
                                    alumnos.map((a, idx) => (
                                        <tr key={a.inscripcion_id} className="hover:bg-cream-50 transition-colors">
                                            <td className="px-4 py-3.5 text-xs text-gray-400">{idx + 1}</td>
                                            <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{a.matricula}</td>
                                            <td className="px-4 py-3.5 font-medium text-gray-800">{a.nombre}</td>
                                            {DIAS.map((d, di) => {
                                                const isChecked = attendanceMatrix[a.inscripcion_id]?.[di] === true;
                                                const isDisabled = a.estatus === 'acreditado' || a.estatus === 'reprobado';
                                                return (
                                                    <td key={di} className="px-3 py-3.5 text-center">
                                                        <CheckBox 
                                                            checked={isChecked}
                                                            disabled={isDisabled}
                                                            onClick={() => handleToggle(a.inscripcion_id, di)}
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="px-4 py-3.5 text-center">
                                                <span className={[
                                                    'text-sm font-bold tabular-nums',
                                                    a.pct >= 80 ? 'text-green-600' : a.pct >= 60 ? 'text-amber-600' : 'text-red-500',
                                                ].join(' ')}>
                                                    {a.pct}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                {a.estatus === 'acreditado' ? (
                                                    <span className="badge-acreditado">Acreditado</span>
                                                ) : a.estatus === 'reprobado' ? (
                                                    <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5">Reprobado</span>
                                                ) : (
                                                    <span className="badge-pendiente">Pendiente</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
