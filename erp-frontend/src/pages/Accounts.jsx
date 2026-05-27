import { useEffect, useState } from "react";
import { Landmark, Plus, MoreVertical, ArrowRight } from "lucide-react";
import API from "../services/api";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const loadAccounts = async () => {
      try {
        const res = await API.get("/accounts");
        if (mounted) setAccounts(res.data?.data || []);
      } catch (_) {}
    };
    loadAccounts();
    const poller = setInterval(loadAccounts, 5000);
    return () => {
      mounted = false;
      clearInterval(poller);
    };
  }, []);

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Financial Accounts</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage and monitor all organizational bank accounts and funds.</p>
        </div>
        <button className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-300 transition-all active:scale-95">
           <Plus size={18} /> Link New Account
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {accounts.map((a, i) => (
          <div key={a.id || i} className="col-span-12 lg:col-span-6 xl:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-8">
               <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Landmark size={24} />
               </div>
               <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
            </div>
            <div className="space-y-1 mb-6">
               <h3 className="text-[18px] font-[800] text-slate-900">{a.name}</h3>
               <p className="text-[13px] text-slate-500 font-bold tracking-tight">{a.bank} •••• {String(a.accNo || "0000").slice(-4)}</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
               <h2 className="text-[24px] font-[900] text-slate-900">${Number(a.balance || 0).toLocaleString()}</h2>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[12px] font-bold text-slate-600">{a.status}</span>
               </div>
               <button className="flex items-center gap-1 text-[12px] font-black text-blue-600 hover:gap-2 transition-all">
                  VIEW DETAILS <ArrowRight size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
