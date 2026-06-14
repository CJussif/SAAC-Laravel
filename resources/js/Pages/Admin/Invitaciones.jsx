import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Invitaciones({ invitaciones = [], invitacion_url }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/invitaciones', { onSuccess: () => reset() });
    };

    return (
        <>
            <Head title="Invitaciones" />
            <div>
                <h1>Invitaciones</h1>
                {invitacion_url && (
                    <p>URL de activación: <a href={invitacion_url}>{invitacion_url}</a></p>
                )}
                <form onSubmit={submit}>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Correo electrónico"
                    />
                    {errors.email && <span>{errors.email}</span>}
                    <button type="submit" disabled={processing}>Invitar</button>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Correo</th>
                            <th>Estado</th>
                            <th>Creada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitaciones.map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.email}</td>
                                <td>{inv.estado}</td>
                                <td>{inv.creada_en}</td>
                                <td>
                                    {inv.estado === 'Pendiente' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('¿Revocar esta invitación?')) {
                                                    // handled via Inertia delete
                                                }
                                            }}
                                        >
                                            Revocar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
