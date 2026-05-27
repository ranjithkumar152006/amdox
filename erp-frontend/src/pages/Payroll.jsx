import { useState, useEffect } from "react";
import { Wallet, TrendingUp, Download, DollarSign, FileText, RefreshCw } from "lucide-react";
import Card from "../components/Card";
import API from "../services/api";

export default function Payroll() {
  const [payroll, setPayroll]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get("/payroll").then(res => setPayroll(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalPay   = payroll.reduce((s, p) => s + (p.netPay || 0), 0);
  const avgSalary  = payroll.length ? Math.round(totalPay / payroll.length) : 0;
  const processed  = payroll.filter(p => p.status === "Processed").length;

  const stats = [
    { title: "Total Monthly Payroll", value: `$${totalPay.toLocaleString()}`, trend: "up",   trendValue: "4.2",  Icon: Wallet,    color: "blue"   },
    { title: "Average Net Pay",       value: `$${avgSalary.toLocaleString()}`, trend: "up",   trendValue: "1.1",  Icon: TrendingUp, color: "emerald" },
    { title: "Processed Records",     value: `${processed} / ${payroll.length}`, trend: "up", trendValue: "0",    Icon: DollarSign, color: "amber"  },
  ];

  const handleExport = () => {
    const rows = payroll.map(p =>
      `${p.id},${p.name},${p.month},${p.basicSalary},${p.netPay},${p.status}`
    );
    const csv  = ["ID,Name,Month,Basic Salary,Net Pay,Status", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "payroll.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-10 bg-slate-50/50 min-h-screen animate-fade-in font-['Inter']">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Payroll Management</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage salary disbursements, taxes, and bonuses.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 h-[48px] bg-white border border-slate-200 rounded-xl text-[14px] font-[600] text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-200 transition-all active:scale-95">
            <FileText size={18} /> Generate Payslips
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="col-span-12 lg:col-span-4"><Card {...s} /></div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-[18px] font-[800] text-[#111827]">Salary Disbursement Records</h2>
          <span className="text-[13px] text-slate-400 font-medium">{payroll.length} records</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 gap-3">
            <RefreshCw size={20} className="animate-spin" /> Loading payroll data...
          </div>
        ) : payroll.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No payroll records found.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Basic Salary</th>
                <th className="px-6 py-4">HRA</th>
                <th className="px-6 py-4">Deductions</th>
                <th className="px-6 py-4">Net Pay</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payroll.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.employeeId || p.id}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600">{p.month}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-800">${(p.basicSalary||0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600">${(p.hra||0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] text-rose-500">-${(p.deductions||0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[14px] font-[800] text-slate-900">${(p.netPay||0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.status === "Processed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
