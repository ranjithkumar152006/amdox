import { useState, useEffect } from "react";
import { ArrowUpToLine, Search, Filter, Plus, MoreVertical, CreditCard, PieChart, DollarSign, CheckCircle, RefreshCw } from "lucide-react";
import API from "../services/api";

export default function Expenses() {
  const [toast, setToast]       = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [form, setForm] = useState({
    description: "",
    category: "",
    amount: "",
    date: "",
    receipt: false,
  });

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    API.get("/expenses").then(res => setExpenses(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fetchExpenses = () => {
    setLoading(true);
    API.get("/expenses")
      .then((res) => setExpenses(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/expenses", {
        description: form.description,
        category: form.category,
        amount: form.amount,
        date: form.date || undefined,
        receipt: form.receipt,
      });
      showToast("Expense submitted.");
      setIsModalOpen(false);
      setForm({ description: "", category: "", amount: "", date: "", receipt: false });
      fetchExpenses();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    setMenuId(null);
    try {
      await API.put(`/expenses/${id}/approve`);
      showToast("Expense approved.");
      fetchExpenses();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    setMenuId(null);
    try {
      await API.put(`/expenses/${id}/reject`);
      showToast("Expense rejected.");
      fetchExpenses();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reject.");
    }
  };

  const filtered = expenses.filter(e =>
    !search || e.description?.toLowerCase().includes(search.toLowerCase()) || e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmt   = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const pending    = expenses.filter(e => e.status === "Pending").length;
  const approved   = expenses.filter(e => e.status === "Approved").length;

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
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
              <h3 className="text-[18px] font-[800] text-slate-900">New Expense</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Description
                </label>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Cloud server bill"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Category
                </label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Technology"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Amount
                  </label>
                  <input
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    type="number"
                    step="0.01"
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. 4200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Date
                  </label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    type="date"
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 text-[13px] text-slate-700 font-[600]">
                <input
                  type="checkbox"
                  checked={form.receipt}
                  onChange={(e) => setForm({ ...form, receipt: e.target.checked })}
                />
                Receipt available
              </label>

              <button
                disabled={submitting}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Submit Expense
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Expense Tracking</h1>
          <p className="text-[14px] text-slate-500 font-medium">Monitor and categorize all organizational expenditures.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
          <Plus size={18} /> New Expense
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {[
          { label: "Total Expenses", val: `$${totalAmt.toLocaleString()}`, color: "blue",   Icon: DollarSign },
          { label: "Pending Approvals", val: pending.toString(),           color: "amber",  Icon: PieChart   },
          { label: "Approved",          val: approved.toString(),           color: "emerald",Icon: CreditCard },
        ].map((s, i) => (
          <div key={i} className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center border border-${s.color}-100`}>
              <s.Icon size={24} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-[20px] font-[900] text-slate-900">{s.val}</h3>
            </div>
          </div>
        ))}

        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..." className="w-full pl-10 pr-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-4 focus:ring-blue-500/10" />
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Expense Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Approved By</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">No expenses found.</td></tr>
              ) : filtered.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{e.description}</p>
                    <p className="text-[11px] text-slate-400 font-bold">{e.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{e.category}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{e.approvedBy || "—"}</td>
                  <td className="px-6 py-4 text-[14px] font-[800] text-slate-900">${(e.amount||0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-500">{e.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      e.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      e.status === 'Pending'  ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>{e.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setMenuId(menuId === e.id ? null : e.id)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                    {menuId === e.id && e.status === "Pending" && (
                      <div className="absolute right-6 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[140px]">
                        <button onClick={() => handleApprove(e.id)} className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-emerald-600 hover:bg-emerald-50">Approve</button>
                        <button onClick={() => handleReject(e.id)} className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-rose-600 hover:bg-rose-50 border-t border-slate-100">Reject</button>
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
