import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, Filter, Search, Plus, RefreshCw } from "lucide-react";
import API from "../services/api";

export default function Leaves() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/leaves").then(res => setLeaves(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAction = (id, status) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
    showToast(`Leave request ${status.toLowerCase()} successfully`);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen animate-fade-in font-['Inter']">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-bold text-slate-900">Request Time Off</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form className="p-6 space-y-5" onSubmit={(e) => {
              e.preventDefault();
              showToast("Leave request submitted for approval");
              setIsModalOpen(false);
            }}>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Leave Type</label>
                <select className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10">
                   <option>Annual Leave</option>
                   <option>Sick Leave</option>
                   <option>Personal Leave</option>
                   <option>Maternity/Paternity</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Start Date</label>
                  <input required type="date" className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">End Date</label>
                  <input required type="date" className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Leave Management</h1>
          <p className="text-[14px] text-slate-500 font-medium">Approve and track employee time-off requests.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
        >
           <Plus size={18} /> Apply Leave
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search leave requests..." className="w-full pl-10 pr-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] outline-none" />
             </div>
             <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm"><Filter size={16} /> Filters</button>
             </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{l.name}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{l.type}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-bold">{l.start} - {l.end}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      l.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     {l.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                           <button 
                             onClick={() => handleAction(l.id, "Approved")}
                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-100 transition-all"
                           >
                             <CheckCircle size={18} />
                           </button>
                           <button 
                             onClick={() => handleAction(l.id, "Rejected")}
                             className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all"
                           >
                             <XCircle size={18} />
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
    </div>
  );
}
