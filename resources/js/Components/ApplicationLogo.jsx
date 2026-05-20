export default function ApplicationLogo({ className = '' }) {
    return (
        <svg
            viewBox="0 0 40 36"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="TESCHA"
        >
            {/* Frontón / tímpano */}
            <polygon points="20,1 1,11 39,11" />
            {/* Friso */}
            <rect x="1" y="11" width="38" height="3" rx="0.5" />
            {/* Columnas */}
            <rect x="4"  y="14" width="3.5" height="14" rx="0.5" />
            <rect x="10" y="14" width="3.5" height="14" rx="0.5" />
            <rect x="16.25" y="14" width="3.5" height="14" rx="0.5" />
            <rect x="22.5" y="14" width="3.5" height="14" rx="0.5" />
            <rect x="28.75" y="14" width="3.5" height="14" rx="0.5" />
            <rect x="34.5" y="14" width="3.5" height="14" rx="0.5" />
            {/* Estilóbato */}
            <rect x="0" y="28" width="40" height="2.5" rx="0.5" />
            <rect x="0" y="31.5" width="40" height="2" rx="0.5" />
            <rect x="0" y="34" width="40" height="1.5" rx="0.5" />
        </svg>
    );
}
