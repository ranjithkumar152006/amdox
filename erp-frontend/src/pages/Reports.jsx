import { useState } from "react";
import { 
  BarChart3, Search, Filter, Download, 
  TrendingUp, FileText, CheckCircle, 
  FileSpreadsheet, MoreVertical, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Reports() {
  const [toast, setToast] = useState(null);
  const [generating, setGenerating] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const downloadCsv = (filename, csvText) => {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMasterReport = async () => {
    setGenerating(true);
    try {
      showToast("Generating master report...");
      const res = await API.get("/reports/summary");
      const d = res.data?.data || {};
      const csv = [
        "Metric,Value",
        `Revenue,${d.revenue ?? 0}`,
        `Expenses,${d.expenses ?? 0}`,
        `Employees,${d.employees ?? 0}`,
        `Projects,${d.projects ?? 0}`,
        `Inventory,${d.inventory ?? 0}`,
        `Invoices,${d.invoices ?? 0}`,
        `Transactions,${d.transactions ?? 0}`,
      ].join("\n");
      downloadCsv(`master-report-${new Date().toISOString().slice(0,10)}.csv`, csv);
      showToast("Master report downloaded.");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  };

  const reportsList = [
    { id: "REP-201", name: "Quarterly Financial Statement", type: "Financial", date: "May 20, 2024", size: "2.4 MB", status: "Generated" },
    { id: "REP-202", name: "Expense Breakdown - Q2", type: "Analytical", date: "May 18, 2024", size: "1.8 MB", status: "Generated" },
    { id: "REP-203", name: "Tax Compliance Audit", type: "Regulatory", date: "May 15, 2024", size: "4.2 MB", status: "Generated" },
    { id: "REP-204", name: "Profit & Loss Summary", type: "Executive", date: "May 12, 2024", size: "1.1 MB", status: "Pending" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in">
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Intelligence Reports</h1>
          <p className="text-[14px] text-slate-500 font-medium">Generate and export comprehensive business intelligence data.</p>
        </div>
        <button 
          onClick={handleMasterReport}
          disabled={generating}
          className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] disabled:opacity-60 text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-300 transition-all active:scale-95"
        >
           {generating ? <RefreshCw size={18} className="animate-spin" /> : <BarChart3 size={18} />} Generate Master Report
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText size={24} />
           </div>
           <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Reports Generated</p>
              <h3 className="text-[20px] font-[900] text-slate-900">124</h3>
           </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <TrendingUp size={24} />
           </div>
           <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Data Accuracy</p>
              <h3 className="text-[20px] font-[900] text-slate-900">99.9%</h3>
           </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Download size={24} />
           </div>
           <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Exports Done</p>
              <h3 className="text-[20px] font-[900] text-slate-900">842</h3>
           </div>
        </div>

        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Reports Archive</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reportsList.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <FileSpreadsheet className="text-blue-600" size={20} />
                       <p className="text-[14px] font-[700] text-slate-800">{r.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold text-slate-500">{r.type}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-500">{r.date}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                           r.status === 'Generated' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>{r.status}</span>
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
    </div>
  );
}
