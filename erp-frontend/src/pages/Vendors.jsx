import { useState, useEffect } from "react";
import { 
  Truck, Search, Filter, Plus, 
  Mail, Phone, MoreVertical, Star,
  ShieldCheck, ArrowRight, ExternalLink, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Vendors() {
  const [toast, setToast]   = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    contact: "",
    phone: "",
    country: "",
    rating: 3,
  });

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };

  const fetchVendors = () => {
    setLoading(true);
    API.get("/vendors")
      .then((res) => setVendors(res.data.data || []))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load vendors."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/vendors", form);
      showToast("Vendor created.");
      setIsModalOpen(false);
      setForm({ name: "", category: "", contact: "", phone: "", country: "", rating: 3 });
      fetchVendors();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create vendor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setMenuId(null);
    if (!window.confirm("Remove this vendor?")) return;
    try {
      await API.delete(`/vendors/${id}`);
      showToast("Vendor removed.");
      fetchVendors();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove vendor.");
    }
  };

  const filtered = vendors.filter(v =>
    !search || v.name?.toLowerCase().includes(search.toLowerCase()) || v.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <ShieldCheck className="text-emerald-400" size={18} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-[800] text-slate-900">Add New Vendor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Vendor Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Dell Inc." />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Electronics" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contact</label>
                  <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. support@dell.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. +1 800..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Country</label>
                  <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. USA" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Rating</label>
                  <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer">
                    {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                {submitting ? "Creating..." : "Create Vendor"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Vendor Management</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage your supply chain partners and service providers.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchVendors}
            className="flex items-center gap-2 px-4 h-[48px] bg-white border border-slate-200 text-slate-700 rounded-xl text-[14px] font-[700] shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
             <Plus size={18} /> Add New Vendor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {loading ? (
          <div className="col-span-12 flex justify-center py-20 text-slate-400 gap-3"><RefreshCw size={20} className="animate-spin"/>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-12 text-center py-20 text-slate-400">No vendors found.</div>
        ) : filtered.map((v) => (
          <div key={v.id} className="col-span-12 lg:col-span-6 xl:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Truck size={24} />
               </div>
               <button onClick={() => setMenuId(menuId === v.id ? null : v.id)} className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
               {menuId === v.id && (
                 <div className="absolute right-4 top-14 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[140px]">
                   <button onClick={() => handleDelete(v.id)}
                     className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-rose-600 hover:bg-rose-50">Remove vendor</button>
                 </div>
               )}
            </div>
            
            <div className="space-y-1 mb-4">
               <h3 className="text-[16px] font-[800] text-slate-900 line-clamp-1">{v.name}</h3>
               <p className="text-[12px] text-slate-500 font-bold">{v.category}</p>
            </div>

            <div className="flex items-center gap-1 mb-6">
               {[...Array(5)].map((_, idx) => (
                 <Star key={idx} size={14} className={idx < Math.floor(v.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
               ))}
               <span className="text-[12px] font-black text-slate-700 ml-1">{v.rating}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
               <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact</span>
                  <span className="text-[12px] font-[700] text-slate-700">{v.contact || v.name}</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-1">
                     {v.status === 'Verified' && <ShieldCheck size={12} className="text-emerald-500" />}
                     <span className={`text-[10px] font-black uppercase ${v.status === 'Verified' ? 'text-emerald-600' : 'text-amber-600'}`}>{v.status}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <a
                href={`mailto:${v.contact || ""}`}
                className="h-9 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
              >
                <Mail size={14} /> Email
              </a>
              <a
                href={`tel:${(v.phone || "").replace(/\\s+/g, "")}`}
                className="h-9 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
              >
                <Phone size={14} /> Call
              </a>
            </div>
          </div>
        ))}
        {!loading && <></>}
      </div>
      {menuId && <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />}
    </div>
  );
}
