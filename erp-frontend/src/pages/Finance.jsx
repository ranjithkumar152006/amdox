import { useState } from "react";
import { 
  Wallet, TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, ArrowDownRight, FileText, 
  Calendar, Search, Filter, Plus, PieChart,
  ArrowRight, CreditCard, Landmark, Receipt
} from "lucide-react";
import Card from "../components/Card";
import ChartBox from "../components/ChartBox";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Finance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [financeData, setFinanceData] = useState(null);

  useEffect(() => {
    Promise.all([
      API.get("/reports/finance"),
      API.get("/transactions"),
      API.get("/accounts")
    ]).then(([repRes, transRes, accRes]) => {
      setFinanceData({
        reports: repRes.data.data,
        transactions: transRes.data.data.slice(0, 5),
        accounts: accRes.data.data.slice(0, 4)
      });
    }).catch(console.error);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  if (!financeData) {
    return <div className="p-8 flex items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const { reports, transactions, accounts } = financeData;

  const financeStats = [
    { title: "Total Revenue", value: `$${reports.totalIncome.toLocaleString()}`, trend: "up", trendValue: "18.6", Icon: DollarSign, color: "blue", path: "/income" },
    { title: "Total Expenses", value: `$${reports.totalExpenses.toLocaleString()}`, trend: "down", trendValue: "8.4", Icon: TrendingDown, color: "emerald", path: "/expenses" },
    { title: "Net Profit", value: `$${reports.netProfit.toLocaleString()}`, trend: "up", trendValue: "24.8", Icon: TrendingUp, color: "indigo", path: "/analytics" },
    { title: "Outstanding Receivables", value: `$${reports.invoiceTotal.toLocaleString()}`, trend: "up", trendValue: `${reports.pendingInvoices} Invoices`, Icon: Receipt, color: "amber", path: "/invoices" },
    { title: "Profit Margin", value: `${reports.profitMargin}%`, trend: "up", trendValue: "Stable", Icon: FileText, color: "rose", path: "/reports" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-bold text-slate-900">Record New Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form className="p-6 space-y-5" onSubmit={(e) => {
              e.preventDefault();
              showToast("Transaction recorded successfully");
              setIsModalOpen(false);
            }}>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <input required type="text" className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. Office Equipment" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Amount ($)</label>
                    <input required type="number" className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="0.00" />
                 </div>
                 <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10">
                       <option>Operating</option>
                       <option>Capital</option>
                       <option>Payroll</option>
                    </select>
                 </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Confirm Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Finance Management</h1>
          <p className="text-[14px] text-slate-500 font-medium">Real-time financial intelligence and cash flow monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <select className="pl-10 pr-10 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] appearance-none cursor-pointer outline-none shadow-sm hover:bg-slate-50">
                <option>May 12, 2024 - May 18, 2024</option>
                <option>Current Fiscal Year</option>
             </select>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-[44px] px-6 bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Transaction
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-10 gap-6">
        {financeStats.map((stat, i) => (
          <Link key={i} to={stat.path} className="col-span-10 md:col-span-5 lg:col-span-2 group">
            <Card {...stat} className="group-hover:border-blue-500 group-hover:shadow-md transition-all" />
          </Link>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Cash Flow Line Chart */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-[18px] font-[800] text-slate-800">Cash Flow Overview</h2>
              <select className="text-[11px] font-bold text-slate-500 border border-slate-100 bg-slate-50 rounded-lg px-2 py-1 outline-none">
                 <option>This Week</option>
              </select>
           </div>
           <div className="h-[280px]">
              <ChartBox type="line" />
           </div>
        </div>

        {/* Expense Category Doughnut */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-[18px] font-[800] text-slate-800">Expense by Category</h2>
              <select className="text-[11px] font-bold text-slate-500 border border-slate-100 bg-slate-50 rounded-lg px-2 py-1 outline-none">
                 <option>This Week</option>
              </select>
           </div>
           <div className="h-[280px]">
              <ChartBox type="doughnut" />
           </div>
        </div>

        {/* Recent Transactions List */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-[800] text-slate-800">Recent Transactions</h2>
              <Link to="/transactions" className="text-blue-600 text-[11px] font-bold hover:underline">View All</Link>
           </div>
           <div className="space-y-4">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                        t.type === 'income' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                      }`}>
                         {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                         <p className="text-[13px] font-[800] text-slate-800 leading-tight">{t.label}</p>
                         <p className="text-[11px] text-slate-400 font-bold">{t.party}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-[14px] font-[800] ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                         {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{t.date}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-12 gap-6">
         {/* Top Revenue Sources */}
         <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-[18px] font-[800] text-slate-800">Top Revenue Sources</h2>
               <select className="text-[11px] font-bold text-slate-500 border border-slate-100 bg-slate-50 rounded-lg px-2 py-1 outline-none">
                  <option>This Month</option>
               </select>
            </div>
            <div className="space-y-6">
               {[
                 { name: "ABC Pvt Ltd", amount: "$45,680", progress: 85, color: "blue" },
                 { name: "Global Enterprises", amount: "$38,750", progress: 70, color: "emerald" },
                 { name: "XYZ Corporation", amount: "$28,450", progress: 55, color: "amber" },
                 { name: "Tech Solutions", amount: "$22,300", progress: 40, color: "rose" },
               ].map((s, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-[13px]">
                       <span className="font-[700] text-slate-700">{s.name}</span>
                       <span className="font-[800] text-slate-900">{s.amount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full bg-${s.color}-500 rounded-full`} style={{ width: `${s.progress}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Budget vs Actual Bar Chart */}
         <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-[18px] font-[800] text-slate-800">Budget vs Actual</h2>
               <select className="text-[11px] font-bold text-slate-500 border border-slate-100 bg-slate-50 rounded-lg px-2 py-1 outline-none">
                  <option>This Month</option>
               </select>
            </div>
            <div className="h-[280px]">
               <ChartBox type="bar" />
            </div>
         </div>

         {/* Account Balance Summary */}
         <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-[18px] font-[800] text-slate-800">Account Balance Summary</h2>
               <Link to="/accounts" className="text-blue-600 text-[11px] font-bold hover:underline">View All</Link>
            </div>
            <div className="space-y-5">
               {accounts.map((a, i) => {
                 const icons = [Landmark, Wallet, CreditCard, Receipt];
                 const IconComponent = icons[i % icons.length];
                 const colors = ["blue", "emerald", "indigo", "amber"];
                 const color = colors[i % colors.length];
                 return (
                 <div key={a.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center border border-${color}-100`}>
                          <IconComponent size={20} />
                       </div>
                       <div>
                          <p className="text-[14px] font-[800] text-slate-800">{a.name}</p>
                          <p className="text-[11px] text-slate-400 font-bold">{a.bank} - {a.accNo}</p>
                       </div>
                    </div>
                    <p className="text-[16px] font-[900] text-slate-900">${a.balance.toLocaleString()}</p>
                 </div>
               )})}
            </div>
         </div>
      </div>
    </div>
  );
}
