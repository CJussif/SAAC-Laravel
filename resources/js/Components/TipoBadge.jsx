const TIPOS = {
    deportiva:  { label: 'Deportiva',  cls: 'badge-deportiva' },
    cultural:   { label: 'Cultural',   cls: 'badge-cultural' },
    academica:  { label: 'Académica',  cls: 'badge-academica' },
    académica:  { label: 'Académica',  cls: 'badge-academica' },
};

const ESTATUS = {
    acreditado: { label: 'Acreditado',    cls: 'badge-acreditado' },
    pendiente:  { label: 'Pendiente',     cls: 'badge-pendiente' },
    inscrito:   { label: 'Inscrito',      cls: 'badge-deportiva' },
    'en_curso': { label: 'En Curso',      cls: 'badge-en-curso' },
    'en-curso': { label: 'En Curso',      cls: 'badge-en-curso' },
    'en curso': { label: 'En Curso',      cls: 'badge-en-curso' },
    reprobado:  { label: 'No Acreditado', cls: 'badge-reprobado' },
};

export default function TipoBadge({ tipo, estatus }) {
    const key = (tipo ?? estatus ?? '').toLowerCase().trim();
    const config = tipo ? (TIPOS[key] ?? { label: tipo, cls: 'badge-academica' })
                        : (ESTATUS[key] ?? { label: estatus, cls: 'badge-pendiente' });

    return <span className={config.cls}>{config.label}</span>;
}
