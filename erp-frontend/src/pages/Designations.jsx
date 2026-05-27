import { useState, useEffect } from "react";
import { ShieldCheck, Briefcase, Search, Plus, Filter, CheckCircle, RefreshCw } from "lucide-react";
import API from "../services/api";

export default function Designations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const [designations, setDesignations] = useState([]);
  const [loading, setLoading]           = useState(true);
  useEffect(() => {
    API.get("/designations").then(res => setDesignations(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

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

      {/* Add Designation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-bold text-slate-900">Add Job Designation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form className="p-6 space-y-5" onSubmit={(e) => {
              e.preventDefault();
              showToast("Designation added successfully");
              setIsModalOpen(false);
            }}>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Designation Title</label>
                <input required type="text" className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. Lead Developer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                    <select className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10">
                       <option>Engineering</option>
                       <option>Marketing</option>
                       <option>Finance</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Grade Level</label>
                    <select className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10">
                       <option>L1</option>
                       <option>L2</option>
                       <option>L3</option>
                       <option>L4</option>
                    </select>
                 </div>
              </div>
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Save Designation
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Job Designations</h1>
          <p className="text-[14px] text-slate-500 font-medium">Standardize job titles and organizational levels.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
        >
           <Plus size={18} /> Add Designation
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
           <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search designations..." className="w-full pl-10 pr-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/10" />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm"><Filter size={16} /> Filters</button>
           </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4">Designation Title</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Grade Level</th>
              <th className="px-6 py-4 text-right">Active Openings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {designations.map((d, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-all">
                        <Briefcase size={18} className="text-slate-400 group-hover:text-blue-600" />
                     </div>
                     <p className="text-[14px] font-[700] text-slate-800">{d.title}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{d.dept}</td>
                <td className="px-6 py-4">
                   <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{d.level}</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <span className={`text-[13px] font-bold ${d.openings > 0 ? 'text-blue-600' : 'text-slate-400'}`}>{d.openings} Open</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
