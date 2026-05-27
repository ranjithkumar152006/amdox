import { useState, useEffect } from "react";
import { 
  PieChart, Search, Filter, Plus, 
  TrendingUp, TrendingDown, Target,
  DollarSign, MoreVertical, CheckCircle, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Budgets() {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({ totalAllocated: 0, totalSpent: 0, totalRemaining: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [form, setForm] = useState({ department: "", fiscalYear: "FY 2024", allocated: "" });

  const fetchBudgets = () => {
    setLoading(true);
    API.get("/budgets")
      .then((res) => {
        setBudgets(res.data.data || []);
        setSummary(res.data.summary || { totalAllocated: 0, totalSpent: 0, totalRemaining: 0 });
      })
      .catch((err) => showToast(err.response?.data?.message || "Failed to load budgets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/budgets", form);
      showToast("Budget created.");
      setIsModalOpen(false);
      setForm({ department: "", fiscalYear: "FY 2024", allocated: "" });
      fetchBudgets();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create budget.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-[800] text-slate-900">Create Budget</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                <input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. Engineering" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fiscal Year</label>
                  <input value={form.fiscalYear} onChange={(e) => setForm({ ...form, fiscalYear: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Allocated ($)</label>
                  <input required type="number" value={form.allocated} onChange={(e) => setForm({ ...form, allocated: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="50000" />
                </div>
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                {submitting ? "Creating..." : "Create Budget"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Budget Planning</h1>
          <p className="text-[14px] text-slate-500 font-medium">Define fiscal targets and monitor departmental spending.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
        >
           <Plus size={18} /> Create New Budget
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Budget Performance Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-[18px] font-[800] text-slate-800">Overall Fiscal Performance</h2>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Stable</span>
              </div>
           </div>
           <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Total Allocated", val: `$${summary.totalAllocated.toLocaleString()}`, Icon: Target, color: "blue" },
                { label: "Actual Spent", val: `$${summary.totalSpent.toLocaleString()}`, Icon: TrendingDown, color: "rose" },
                { label: "Remaining", val: `$${summary.totalRemaining.toLocaleString()}`, Icon: DollarSign, color: "emerald" },
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                   <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center border border-${s.color}-100 mb-3`}>
                      <s.Icon size={20} />
                   </div>
                   <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                   <h3 className="text-[20px] font-[900] text-slate-900">{s.val}</h3>
                </div>
              ))}
           </div>
        </div>

        {/* Efficiency Score */}
        <div className="col-span-12 lg:col-span-4 bg-[#111827] p-6 rounded-2xl shadow-xl shadow-slate-300 text-white relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-[18px] font-bold mb-2">Budget Efficiency</h3>
              <p className="text-[13px] text-slate-400 mb-6">Your organization is currently operating at <span className="text-emerald-400 font-bold">82%</span> efficiency.</p>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-4 font-medium italic">Target: 90% Efficiency by Q3</p>
           </div>
           <PieChart className="absolute -right-8 -bottom-8 text-slate-800/50" size={160} />
        </div>

        {/* Detailed Budgets Ledger */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Departmental Budgets</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm"><Filter size={16} /> Filters</button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Budget ID</th>
                <th className="px-6 py-4">Budget Name</th>
                <th className="px-6 py-4">Allocated</th>
                <th className="px-6 py-4">Spent</th>
                <th className="px-6 py-4">Utilization</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>
              ) : budgets.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">No budget records found.</td></tr>
              ) : budgets.map((b, i) => {
                const progress = b.allocated ? Math.round((b.spent / b.allocated) * 100) : 0;
                return (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{b.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800 leading-tight">{b.department || b.name}</p>
                    <p className="text-[11px] text-slate-400">{b.fiscalYear}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-900 font-[800]">${(b.allocated||0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-900 font-[800]">${(b.spent||0).toLocaleString()}</td>
                  <td className="px-6 py-4 min-w-[140px]">
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">{progress}% Used</span>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full transition-all duration-1000 ${progress > 100 ? 'bg-rose-500' : progress > 85 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(progress,100)}%` }} />
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        b.status === 'Critical' || b.status === 'At Risk' ? 'bg-rose-50 text-rose-600' :
                        b.status === 'On Track' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                     }`}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                     <button onClick={() => setMenuId(menuId === b.id ? null : b.id)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                     {menuId === b.id && (
                       <div className="absolute right-6 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[150px]">
                         <button onClick={() => { setMenuId(null); showToast(`${b.department}: $${b.remaining?.toLocaleString()} remaining`); }}
                           className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50">View details</button>
                       </div>
                     )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
      {menuId && <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />}
    </div>
  );
}
