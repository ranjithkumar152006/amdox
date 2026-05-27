import { useState, useEffect } from "react";
import { 
  CreditCard, Search, Filter, Plus, 
  ArrowRight, MoreVertical, ShieldCheck, 
  Wallet, Landmark, CheckCircle, Clock, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Payments() {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const [paymentHistory, setPayments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [menuId, setMenuId]           = useState(null);
  const [form, setForm] = useState({ vendor: "", description: "", amount: "", dueDate: "", method: "Bank Transfer" });

  const fetchPayments = () => {
    setLoading(true);
    API.get("/payments")
      .then((res) => setPayments(res.data.data || []))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load payments."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/payments", form);
      showToast("Payment created.");
      setIsModalOpen(false);
      setForm({ vendor: "", description: "", amount: "", dueDate: "", method: "Bank Transfer" });
      fetchPayments();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (id) => {
    setMenuId(null);
    try {
      await API.put(`/payments/${id}/pay`);
      showToast("Payment marked as paid.");
      fetchPayments();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update payment.");
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
              <h3 className="text-[18px] font-[800] text-slate-900">New Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Vendor / Recipient</label>
                <input required value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. AWS" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="Monthly hosting" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Amount ($)</label>
                  <input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-[#111827] hover:bg-black disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {submitting ? "Processing..." : "Create Payment"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Payment Processing</h1>
          <p className="text-[14px] text-slate-500 font-medium">Securely execute and monitor outbound financial transfers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-300 transition-all active:scale-95"
        >
           <ShieldCheck size={18} /> Process New Payment
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Payment Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-[18px] font-[800] text-slate-800">Available Liquidity</h2>
              <button className="text-blue-600 text-[12px] font-bold hover:underline">Manage Accounts</button>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                 <Wallet className="text-blue-600 mb-3" size={24} />
                 <p className="text-[12px] font-bold text-blue-400 uppercase tracking-wider">Main Wallet</p>
                 <h3 className="text-[24px] font-[900] text-blue-900">$145,280.00</h3>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                 <Landmark className="text-emerald-600 mb-3" size={24} />
                 <p className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider">Settlement Account</p>
                 <h3 className="text-[24px] font-[900] text-emerald-900">$82,400.00</h3>
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-4 bg-[#111827] p-6 rounded-2xl shadow-xl shadow-slate-300 flex flex-col justify-center text-white">
           <h3 className="text-[18px] font-bold mb-2">Automated Payments</h3>
           <p className="text-[13px] text-slate-400 mb-6">3 Scheduled payments are due in the next 48 hours.</p>
           <button className="w-full h-11 bg-blue-600 text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-all">Review Schedule</button>
        </div>

        {/* Payment History Table */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Recent Payment History</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm"><Filter size={16} /> Filters</button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>
              ) : paymentHistory.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400">No payment records found.</td></tr>
              ) : paymentHistory.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{p.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800 leading-tight">{p.vendor || p.recipient}</p>
                    <p className="text-[12px] text-slate-400">{p.description}</p>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-slate-400 font-bold">{p.method || "—"}</td>
                  <td className="px-6 py-4 text-[14px] font-[800] text-slate-900 text-right">${(p.amount||0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center justify-center gap-2">
                        {p.status === 'Paid' ? <CheckCircle size={14} className="text-emerald-500" /> : <Clock size={14} className="text-amber-500" />}
                        <span className={`text-[10px] font-black uppercase tracking-wider ${p.status === 'Paid' ? 'text-emerald-600' : p.status === 'Overdue' ? 'text-rose-600' : 'text-amber-600'}`}>{p.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                     <button onClick={() => setMenuId(menuId === p.id ? null : p.id)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                     {menuId === p.id && (
                       <div className="absolute right-6 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[150px]">
                         {p.status !== "Paid" && (
                           <button onClick={() => handleMarkPaid(p.id)}
                             className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50">Mark as paid</button>
                         )}
                         <button onClick={() => { setMenuId(null); showToast(`${p.vendor}: $${p.amount}`); }}
                           className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50 border-t border-slate-100">View details</button>
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
