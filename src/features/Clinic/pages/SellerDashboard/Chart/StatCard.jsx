const StatCard = ({ icon, label, value, sub, color = "#185FA5", bgColor = "#E6F1FB" }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
             style={{ background: bgColor, color }}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-xl font-semibold text-gray-900 leading-tight">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

export default StatCard;