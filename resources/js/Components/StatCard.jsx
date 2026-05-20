export default function StatCard({ label, value, sub, icon: Icon, accent, badge }) {
    return (
        <div className="card flex items-start justify-between p-5">
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
                <p className={[
                    'mt-1 text-3xl font-bold tabular-nums',
                    accent === 'guinda' ? 'text-guinda' : 'text-gray-800',
                ].join(' ')}>
                    {value}
                </p>
                {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
                {badge && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        {badge}
                    </span>
                )}
            </div>
            {Icon && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cream-200 text-guinda">
                    <Icon />
                </div>
            )}
        </div>
    );
}
