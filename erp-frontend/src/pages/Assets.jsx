import { useState, useEffect } from "react";
import {
  Box, Search, Filter, Plus, MoreVertical, Monitor, Car,
  Building2, Laptop, ShieldCheck, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Assets() {
  const [toast, setToast] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "IT Equipment",
    location: "",
    purchaseDate: "",
    purchaseValue: "",
    currentValue: "",
    assignedTo: "",
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAssets = () => {
    setLoading(true);
    API.get("/assets")
      .then((res) => setAssets(res.data.data || []))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load assets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAssets(); }, []);

  const filtered = assets.filter((a) => {
    const q = search.toLowerCase();
    return !q || a.name?.toLowerCase().includes(q) || a.id?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q);
  });

  const categoryStats = () => {
    const cats = {};
    assets.forEach((a) => {
      cats[a.category] = cats[a.category] || { count: 0, value: 0 };
      cats[a.category].count += 1;
      cats[a.category].value += a.currentValue || 0;
    });
    return Object.entries(cats).slice(0, 3).map(([label, data]) => ({
      label,
      count: data.count,
      val: `$${data.value.toLocaleString()}`,
    }));
  };

  const iconFor = (cat) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("it")) return Laptop;
    if (c.includes("facil")) return Building2;
    if (c.includes("fleet") || c.includes("transport") || c.includes("vehicle")) return Car;
    return Box;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/assets", {
        name: form.name,
        category: form.category,
        location: form.location,
        purchaseDate: form.purchaseDate || undefined,
        purchaseValue: form.purchaseValue || 0,
        currentValue: form.currentValue || form.purchaseValue || 0,
        assignedTo: form.assignedTo,
      });
      showToast("Asset registered.");
      setIsModalOpen(false);
      setForm({
        name: "", category: "IT Equipment", location: "", purchaseDate: "",
        purchaseValue: "", currentValue: "", assignedTo: "",
      });
      fetchAssets();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to register asset.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setMenuId(null);
    if (!window.confirm("Remove this asset from the registry?")) return;
    try {
      await API.delete(`/assets/${id}`);
      showToast("Asset removed.");
      fetchAssets();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove asset.");
    }
  };

  const catCards = categoryStats();
  const defaultCats = [
    { label: "IT Infrastructure", count: 0, val: "$0", Icon: Laptop, color: "blue" },
    { label: "Facilities", count: 0, val: "$0", Icon: Building2, color: "indigo" },
    { label: "Fleet/Transport", count: 0, val: "$0", Icon: Car, color: "emerald" },
  ];
  const displayCats = catCards.length ? catCards.map((c, i) => ({
    ...c,
    Icon: iconFor(c.label),
    color: ["blue", "indigo", "emerald"][i] || "slate",
  })) : defaultCats;

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <ShieldCheck className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0">
              <h3 className="text-[18px] font-[800] text-slate-900">Register Asset</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Asset Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. MacBook Pro 16" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none cursor-pointer">
                  <option>IT Equipment</option>
                  <option>Furniture</option>
                  <option>Vehicles</option>
                  <option>AV Equipment</option>
                  <option>Facilities</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Floor 4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Purchase Value</label>
                  <input type="number" step="0.01" value={form.purchaseValue}
                    onChange={(e) => setForm({ ...form, purchaseValue: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="2499" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Current Value</label>
                  <input type="number" step="0.01" value={form.currentValue}
                    onChange={(e) => setForm({ ...form, currentValue: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="2000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Purchase Date</label>
                  <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned To</label>
                  <input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. Engineering" />
                </div>
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-[#111827] hover:bg-black disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                {submitting ? "Registering..." : "Register Asset"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Fixed Asset Registry</h1>
          <p className="text-[14px] text-slate-500 font-medium">Track and manage organizational assets and depreciation.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-300 transition-all active:scale-95">
            <Plus size={18} /> Register Asset
          </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {displayCats.map((c, i) => (
          <div key={i} className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${c.color}-50 text-${c.color}-600 flex items-center justify-center border border-${c.color}-100`}>
                <c.Icon size={24} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{c.label}</p>
                <h3 className="text-[18px] font-[900] text-slate-900">{c.val}</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{c.count} Items</span>
            </div>
          </div>
        ))}

        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Asset Inventory Ledger</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID or Name..." className="pl-9 pr-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] outline-none w-64 focus:ring-4 focus:ring-blue-500/10 transition-all" />
              </div>
              <button onClick={fetchAssets}
                className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm hover:bg-slate-50">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Asset ID</th>
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Current Value</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2" />Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">No assets found.</td></tr>
              ) : filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{a.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{a.name}</p>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{a.category}</span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-[800] text-slate-900">${(a.currentValue || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{a.assignedTo || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      a.status === "In Use" ? "bg-blue-50 text-blue-600" :
                      a.status === "Available" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setMenuId(menuId === a.id ? null : a.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                    {menuId === a.id && (
                      <div className="absolute right-6 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[140px]">
                        <button onClick={() => { setMenuId(null); showToast(`${a.name}: ${a.location}`); }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50">
                          View details
                        </button>
                        <button onClick={() => handleDelete(a.id)}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-rose-600 hover:bg-rose-50 border-t border-slate-100">
                          Remove asset
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
