import { useState, useEffect } from "react";
import { Layers, Users, TrendingUp, Search, Plus, MoreVertical, CheckCircle, RefreshCw } from "lucide-react";
import API from "../services/api";

export default function Departments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast]             = useState(null);
  const [depts, setDepts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [menuId, setMenuId]           = useState(null);
  const [form, setForm]               = useState({ name: "", head: "", location: "", budget: "" });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDepts = () => {
    setLoading(true);
    API.get("/departments").then(res => setDepts(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleDelete = async (id) => {
    setMenuId(null);
    if (!window.confirm("Delete this department?")) return;
    try {
      await API.delete(`/departments/${id}`);
      showToast("Department removed.");
      fetchDepts();
    } catch {
      showToast("Failed to remove department");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/departments", form);
      showToast("New department created successfully");
      setIsModalOpen(false);
      setForm({ name: "", head: "", location: "", budget: "" });
      fetchDepts();
    } catch { showToast("Failed to create department"); }
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

      {/* New Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-bold text-slate-900">Define New Department</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form className="p-6 space-y-5" onSubmit={handleCreate}>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department Name</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. Product Design" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department Head</label>
                <input required type="text" value={form.head} onChange={e => setForm({...form, head: e.target.value})} className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="Search employee..." />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. HQ – Floor 3" />
              </div>
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Create Department
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Organization Departments</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage departmental hierarchy and leadership.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
        >
           <Plus size={18} /> New Department
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {loading ? (
          <div className="col-span-12 flex justify-center py-20 text-slate-400 gap-3"><RefreshCw size={20} className="animate-spin" /> Loading...</div>
        ) : depts.length === 0 ? (
          <div className="col-span-12 text-center py-20 text-slate-400">No departments found.</div>
        ) : depts.map((d) => (
          <div key={d.id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Layers size={24} />
               </div>
               <button onClick={() => setMenuId(menuId === d.id ? null : d.id)} className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
               {menuId === d.id && (
                 <div className="absolute right-4 top-14 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[140px]">
                   <button onClick={() => handleDelete(d.id)}
                     className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-rose-600 hover:bg-rose-50">Delete department</button>
                 </div>
               )}
            </div>
            <h3 className="text-[18px] font-[800] text-slate-800 mb-1">{d.name}</h3>
            <p className="text-[13px] text-slate-500 font-medium mb-6">Head: <span className="text-slate-800 font-[700]">{d.head}</span></p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-[13px] font-bold text-slate-700">{d.employees} Members</span>
               </div>
               <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">{d.status}</span>
            </div>
          </div>
        ))}
        {!loading && <></>}
      </div>
      {menuId && <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />}
    </div>
  );
}
