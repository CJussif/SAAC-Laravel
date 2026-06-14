import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function ActivarCuenta({ email, token, tokenInvalido }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        matricula: '',
        carrera: 'ISC',
        semestre: 1,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/activar/${token}`);
    };

    if (tokenInvalido) {
        return (
            <>
                <Head title="Enlace inválido" />
                <div>
                    <h1>Enlace inválido o expirado</h1>
                    <p>Este enlace de activación no es válido o ya fue utilizado.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Activar Cuenta" />
            <div>
                <h1>Activar Cuenta</h1>
                <p>Activando cuenta para: <strong>{email}</strong></p>
                <form onSubmit={submit}>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        placeholder="Nombre"
                    />
                    {errors.nombre && <span>{errors.nombre}</span>}

                    <input
                        type="text"
                        value={data.apellido_paterno}
                        onChange={(e) => setData('apellido_paterno', e.target.value)}
                        placeholder="Apellido paterno"
                    />
                    {errors.apellido_paterno && <span>{errors.apellido_paterno}</span>}

                    <input
                        type="text"
                        value={data.apellido_materno}
                        onChange={(e) => setData('apellido_materno', e.target.value)}
                        placeholder="Apellido materno"
                    />
                    {errors.apellido_materno && <span>{errors.apellido_materno}</span>}

                    <input
                        type="text"
                        value={data.matricula}
                        onChange={(e) => setData('matricula', e.target.value)}
                        placeholder="Matrícula"
                    />
                    {errors.matricula && <span>{errors.matricula}</span>}

                    <select value={data.carrera} onChange={(e) => setData('carrera', e.target.value)}>
                        <option value="ISC">ISC</option>
                        <option value="IGE">IGE</option>
                        <option value="IDS">IDS</option>
                    </select>
                    {errors.carrera && <span>{errors.carrera}</span>}

                    <input
                        type="number"
                        value={data.semestre}
                        onChange={(e) => setData('semestre', parseInt(e.target.value))}
                        min={1}
                        max={9}
                        placeholder="Semestre"
                    />
                    {errors.semestre && <span>{errors.semestre}</span>}

                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Contraseña"
                    />
                    {errors.password && <span>{errors.password}</span>}

                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirmar contraseña"
                    />

                    <button type="submit" disabled={processing}>Activar cuenta</button>
                </form>
            </div>
        </>
    );
}
