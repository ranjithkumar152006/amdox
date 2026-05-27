import { useState, useEffect } from "react";
import { 
  ArrowDownToLine, Search, Filter, Plus, 
  TrendingUp, DollarSign, ArrowUpRight,
  MoreVertical, CheckCircle, PieChart, Landmark, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Income() {
  const [toast, setToast]                 = useState(null);
  const [incomeSources, setIncomeSources] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [form, setForm] = useState({
    source: "",
    category: "",
    amount: "",
    date: "",
    month: "",
  });

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    API.get("/income").then(res => setIncomeSources(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fetchIncome = () => {
    setLoading(true);
    API.get("/income")
      .then((res) => setIncomeSources(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/income", {
        source: form.source,
        category: form.category,
        amount: form.amount,
        date: form.date || undefined,
        month: form.month || undefined,
      });
      showToast("Income record added.");
      setIsModalOpen(false);
      setForm({ source: "", category: "", amount: "", date: "", month: "" });
      fetchIncome();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add income record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkReceived = async (id) => {
    setMenuId(null);
    try {
      await API.put(`/income/${id}/status`, { status: "Received" });
      showToast("Marked as received.");
      fetchIncome();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status.");
    }
  };

  const filtered = incomeSources.filter(r =>
    !search || r.source?.toLowerCase().includes(search.toLowerCase()) || r.category?.toLowerCase().includes(search.toLowerCase())
  );
  const totalIncome   = incomeSources.reduce((s, r) => s + (r.amount || 0), 0);
  const pendingCount  = incomeSources.filter(r => r.status === "Pending").length;
  const receivedCount = incomeSources.filter(r => r.status === "Received").length;

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
              <h3 className="text-[18px] font-[800] text-slate-900">Add Income Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Source / Client
                </label>
                <input
                  required
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. ABC Pvt Ltd"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Consulting"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Amount
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. 15600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Month (optional)
                  </label>
                  <input
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. May"
                  />
                </div>
              </div>
              <button
                disabled={submitting}
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Create Income
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Income Tracking</h1>
          <p className="text-[14px] text-slate-500 font-medium">Monitor all revenue streams and inbound financial transfers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-emerald-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
        >
           <Plus size={18} /> Add Income Record
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Income Analytics */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-[18px] font-[800] text-slate-800">Monthly Revenue Stream</h2>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Growth +12.5%</span>
           </div>
           <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Total Revenue", val: `$${totalIncome.toLocaleString()}`, Icon: DollarSign, color: "emerald" },
                { label: "Received",      val: receivedCount.toString(),           Icon: CheckCircle, color: "blue"    },
                { label: "Pending",       val: pendingCount.toString(),             Icon: Landmark,    color: "amber"   },
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

        {/* Growth Card */}
        <div className="col-span-12 lg:col-span-4 bg-emerald-600 p-6 rounded-2xl shadow-xl shadow-emerald-200 text-white relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-[18px] font-bold mb-2">Yearly Target</h3>
              <p className="text-[13px] text-emerald-100 mb-6">You've reached <span className="text-white font-bold">78%</span> of your annual revenue target.</p>
              <div className="w-full h-2 bg-emerald-700/50 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-[10px] text-emerald-200 mt-4 font-medium italic">Target: $2.5M by Dec 2024</p>
           </div>
           <TrendingUp className="absolute -right-8 -bottom-8 text-emerald-500/50" size={160} />
        </div>

        {/* Income Ledger */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Inbound Transaction Ledger</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm"><Filter size={16} /> Filters</button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Source Client</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">No income records found.</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{s.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{s.source}</p>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[12px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{s.category}</span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-[800] text-emerald-600">${(s.amount||0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">{s.date}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center justify-center gap-2">
                        {s.status === 'Received' ? <CheckCircle size={14} className="text-emerald-500" /> : <Landmark size={14} className="text-amber-500" />}
                        <span className={`text-[10px] font-black uppercase tracking-wider ${s.status === 'Received' ? 'text-emerald-600' : 'text-amber-600'}`}>{s.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                     <button onClick={() => setMenuId(menuId === s.id ? null : s.id)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                     {menuId === s.id && s.status !== "Received" && (
                       <div className="absolute right-6 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[150px]">
                         <button onClick={() => handleMarkReceived(s.id)}
                           className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-emerald-600 hover:bg-emerald-50">Mark received</button>
                       </div>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {menuId && <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />}
    </div>
  );
}
