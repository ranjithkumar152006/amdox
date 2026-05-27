export default function Card({ title, value, trend, trendValue, Icon, color }) {
  const colorMap = {
    emerald: "text-emerald-500 bg-emerald-50 border-emerald-100",
    rose: "text-rose-500 bg-rose-50 border-rose-100",
    blue: "text-blue-500 bg-blue-50 border-blue-100",
    indigo: "text-indigo-500 bg-indigo-50 border-indigo-100",
    amber: "text-amber-500 bg-amber-50 border-amber-100",
  };

  return (
    <div className="bg-white rounded-[12px] p-[16px] shadow-sm border border-slate-100 flex flex-col justify-between h-[140px] relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-[600] text-[#6B7280] uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-[24px] font-[700] text-[#111827] leading-none">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.blue} border transition-all group-hover:scale-110 duration-500`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`text-[12px] font-[600] px-2 py-0.5 rounded-full ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
          {trend === 'up' ? '▲' : '▼'} {trendValue}%
        </span>
        <span className="text-[12px] text-[#6B7280] font-[400]">vs last month</span>
      </div>
    </div>
  );
}
