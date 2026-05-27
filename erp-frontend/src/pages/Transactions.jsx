import { useState, useEffect } from "react";
import { 
  ArrowRightLeft, Search, Filter, Download, 
  ArrowUpRight, ArrowDownRight, MoreVertical,
  CheckCircle, Clock, XCircle, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState("");

  useEffect(() => {
    API.get("/transactions").then(res => setTransactions(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(t =>
    (!search || t.label?.toLowerCase().includes(search.toLowerCase()) || t.party?.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || t.type === typeFilter)
  );

  const handleExport = () => {
    const rows = filtered.map(t => `${t.id},"${t.label}","${t.party}",${t.amount},${t.type},${t.date},${t.status}`);
    const csv = ["ID,Label,Party,Amount,Type,Date,Status", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Transaction Ledger</h1>
          <p className="text-[14px] text-slate-500 font-medium">Detailed record of all financial inflows and outflows.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] font-[600] text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <Download size={18} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 h-[44px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
             Add Transaction
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, description or party..." className="w-full pl-10 pr-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
          </div>
          <div className="flex gap-2">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-[44px] px-3 bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 outline-none cursor-pointer">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4">Transaction Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400">No transactions found.</td></tr>
            ) : filtered.map((t, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                     <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        t.type === 'income' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                     }`}>
                        {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                     </div>
                     <div>
                        <p className="text-[14px] font-[700] text-slate-800 leading-tight">{t.label || t.desc}</p>
                        <p className="text-[11px] text-slate-400 font-bold">{t.id} · {t.party}</p>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className="text-[12px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{t.category}</span>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{t.date}</td>
                <td className={`px-6 py-4 text-[14px] font-[800] ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : ''}{typeof t.amount === 'number' ? `$${Math.abs(t.amount).toLocaleString()}` : t.amount}
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      {t.status === 'Completed' && <CheckCircle size={14} className="text-emerald-500" />}
                      {t.status === 'Pending'   && <Clock size={14} className="text-amber-500" />}
                      {t.status === 'Failed'    && <XCircle size={14} className="text-rose-500" />}
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        t.status === 'Completed' ? 'text-emerald-600' :
                        t.status === 'Pending'   ? 'text-amber-600' : 'text-rose-600'
                      }`}>{t.status}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
