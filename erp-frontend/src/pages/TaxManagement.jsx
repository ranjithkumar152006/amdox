import { useState, useEffect } from "react";
import {
  FileCheck, Download, MoreVertical, ShieldCheck,
  Percent, Calendar, CheckCircle, AlertTriangle, RefreshCw, Plus
} from "lucide-react";
import API from "../services/api";

export default function TaxManagement() {
  const [toast, setToast] = useState(null);
  const [taxFilings, setTaxFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [form, setForm] = useState({
    type: "GST",
    period: "",
    taxableAmount: "",
    rate: "18",
    dueDate: "",
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTax = () => {
    setLoading(true);
    API.get("/tax")
      .then((res) => setTaxFilings(res.data.data || []))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load tax records."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTax(); }, []);

  const summary = taxFilings.reduce(
    (acc, t) => {
      acc.liability += t.taxAmount || 0;
      if (t.status === "Filed") acc.filed += 1;
      if (t.status === "Pending" || t.status === "Due") acc.pending += 1;
      return acc;
    },
    { liability: 0, filed: 0, pending: 0 }
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/tax", {
        type: form.type,
        period: form.period,
        taxableAmount: form.taxableAmount,
        rate: form.rate,
        dueDate: form.dueDate || undefined,
      });
      showToast("Tax filing created.");
      setIsModalOpen(false);
      setForm({ type: "GST", period: "", taxableAmount: "", rate: "18", dueDate: "" });
      fetchTax();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create tax filing.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkFiled = async (id) => {
    setMenuId(null);
    try {
      await API.put(`/tax/${id}/file`);
      showToast("Marked as filed.");
      fetchTax();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update status.");
    }
  };

  const handleExport = () => {
    const rows = taxFilings.map((t) =>
      [t.id, t.type, t.period, t.taxableAmount, t.rate, t.taxAmount, t.status, t.dueDate].join(",")
    );
    const csv = ["ID,Type,Period,TaxableAmount,Rate,TaxAmount,Status,DueDate", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tax-filings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Tax report exported.");
  };

  const cards = [
    { label: "Total Tax Liability", val: `$${summary.liability.toLocaleString()}`, trend: "All records", Icon: Percent, color: "blue" },
    { label: "Filed", val: summary.filed.toString(), trend: "Completed", Icon: Calendar, color: "emerald" },
    { label: "Pending / Due", val: summary.pending.toString(), trend: "Needs action", Icon: ShieldCheck, color: "amber" },
  ];

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
              <h3 className="text-[18px] font-[800] text-slate-900">New Tax Filing</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tax Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none cursor-pointer">
                  <option>GST</option>
                  <option>Corporate Tax</option>
                  <option>TDS</option>
                  <option>Professional Tax</option>
                  <option>Value Added Tax (VAT)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Period</label>
                <input required value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Q2 2024" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Taxable Amount</label>
                  <input required type="number" step="0.01" value={form.taxableAmount}
                    onChange={(e) => setForm({ ...form, taxableAmount: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="245680" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Rate (%)</label>
                  <input required type="number" step="0.01" value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="18" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" />
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-[#111827] hover:bg-black disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <FileCheck size={16} />}
                {submitting ? "Creating..." : "Create Filing"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Tax Compliance & Management</h1>
          <p className="text-[14px] text-slate-500 font-medium">Monitor tax liabilities, filings, and regulatory compliance.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchTax}
            className="flex items-center gap-2 px-4 h-[48px] bg-white border border-slate-200 text-slate-700 rounded-xl text-[14px] font-[700] shadow-sm hover:bg-slate-50 transition-all">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-300 transition-all active:scale-95">
            <FileCheck size={18} /> New Tax Filing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {cards.map((s, i) => (
          <div key={i} className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-11 h-11 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center border border-${s.color}-100`}>
                <s.Icon size={20} />
              </div>
              <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">{s.trend}</span>
            </div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <h3 className="text-[24px] font-[900] text-slate-900 mt-1">{s.val}</h3>
          </div>
        ))}

        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Recent Tax Filings</h2>
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
              <Download size={16} /> Export Reports
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Filing ID</th>
                <th className="px-6 py-4">Tax Category</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2" />Loading...</td></tr>
              )}
              {!loading && taxFilings.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400">No tax records found.</td></tr>
              )}
              {taxFilings.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{t.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{t.type}</p>
                    <p className="text-[11px] text-slate-400 font-bold">Due: {t.dueDate}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{t.period}</td>
                  <td className="px-6 py-4 text-[14px] font-[800] text-slate-900 text-right">${(t.taxAmount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {t.status === "Filed" ? (
                        <CheckCircle size={14} className="text-emerald-500" />
                      ) : t.status === "Audit" ? (
                        <AlertTriangle size={14} className="text-rose-500" />
                      ) : (
                        <ShieldCheck size={14} className="text-amber-500" />
                      )}
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        t.status === "Filed" ? "text-emerald-600" :
                        t.status === "Audit" ? "text-rose-600" : "text-amber-600"
                      }`}>{t.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setMenuId(menuId === t.id ? null : t.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                    {menuId === t.id && (
                      <div className="absolute right-6 top-12 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[160px]">
                        {t.status !== "Filed" && (
                          <button onClick={() => handleMarkFiled(t.id)}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50">
                            Mark as Filed
                          </button>
                        )}
                        <button onClick={() => { setMenuId(null); handleExport(); }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50 border-t border-slate-100">
                          Export CSV
                        </button>
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
