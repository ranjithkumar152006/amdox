import { useState, useEffect } from "react";
import { FileText, Search, Plus, Download, MoreVertical, CheckCircle, RefreshCw } from "lucide-react";
import API from "../services/api";

export default function Invoices() {
  const [toast, setToast] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [form, setForm] = useState({ client: "", amount: "", issue: "", due: "", tax: "" });

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const fetchInvoices = () => {
    setLoading(true);
    API.get("/invoices")
      .then((res) => setInvoices(res.data.data || []))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load invoices."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, []);

  const filtered = invoices.filter((inv) =>
    (!search || inv.client?.toLowerCase().includes(search.toLowerCase()) || inv.id?.toLowerCase().includes(search.toLowerCase())) &&
    (!status || inv.status === status)
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/invoices", form);
      showToast("Invoice created.");
      setIsModalOpen(false);
      setForm({ client: "", amount: "", issue: "", due: "", tax: "" });
      fetchInvoices();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id, newStatus) => {
    setMenuId(null);
    try {
      await API.put(`/invoices/${id}/status`, { status: newStatus });
      showToast(`Invoice marked ${newStatus}.`);
      fetchInvoices();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update invoice.");
    }
  };

  const downloadInvoice = (inv) => {
    const csv = `Invoice,${inv.id}\nClient,${inv.client}\nAmount,${inv.total || inv.amount}\nStatus,${inv.status}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${inv.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <h3 className="text-[18px] font-[800] text-slate-900">Create Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Client</label>
                <input required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Amount ($)</label>
                <input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Issue Date</label>
                  <input type="date" value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Due Date</label>
                  <input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" />
                </div>
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                {submitting ? "Creating..." : "Create Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Invoice Management</h1>
          <p className="text-[14px] text-slate-500 font-medium">Issue and track client invoices and receivables.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
          <Plus size={18} /> Create New Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-4 focus:ring-blue-500/10" />
          </div>
          <div className="flex gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-[44px] px-3 bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 outline-none cursor-pointer">
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <button onClick={fetchInvoices} className="h-[44px] px-4 bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm hover:bg-slate-50 flex items-center gap-2">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Issue Date</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">No invoices found.</td></tr>
            ) : filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-[13px] font-[800] text-blue-600">#{inv.id}</td>
                <td className="px-6 py-4"><p className="text-[14px] font-[700] text-slate-800">{inv.client}</p></td>
                <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">{inv.issue || inv.date}</td>
                <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">{inv.due}</td>
                <td className="px-6 py-4 text-[14px] font-[800] text-slate-900">${(inv.total || inv.amount || 0).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    inv.status === "Paid" ? "bg-emerald-50 text-emerald-600" :
                    inv.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                  }`}>{inv.status}</span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => downloadInvoice(inv)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download size={18} /></button>
                    <button onClick={() => setMenuId(menuId === inv.id ? null : inv.id)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                  </div>
                  {menuId === inv.id && (
                    <div className="absolute right-6 top-12 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[150px]">
                      {inv.status !== "Paid" && (
                        <button onClick={() => handleStatus(inv.id, "Paid")}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50">Mark as paid</button>
                      )}
                      {inv.status === "Pending" && (
                        <button onClick={() => handleStatus(inv.id, "Overdue")}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-rose-600 hover:bg-rose-50 border-t border-slate-100">Mark overdue</button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {menuId && <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />}
    </div>
  );
}
