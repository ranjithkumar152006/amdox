import { useEffect, useMemo, useState } from "react";
import { 
  ShieldCheck, Shield, Key, Users,
  CheckCircle, Plus, Edit2, Trash2, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Roles() {
  const [toast, setToast] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", permissions: "" });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRoles = () => {
    setLoading(true);
    API.get("/roles")
      .then((res) => setRoles(res.data.data || []))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load roles."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoles(); }, []);

  const roleColor = (name) => {
    const n = String(name || "").toLowerCase();
    if (n.includes("super")) return "indigo";
    if (n.includes("admin")) return "blue";
    if (n.includes("hr")) return "emerald";
    if (n.includes("finance")) return "amber";
    if (n.includes("it")) return "rose";
    return "slate";
  };

  const accessLabel = (permissions) => {
    if (!permissions || permissions.length === 0) return "Limited";
    if (permissions.includes("all")) return "All Modules";
    return permissions.slice(0, 3).join(", ") + (permissions.length > 3 ? "…" : "");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const permissions = form.permissions
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      await API.post("/roles", {
        name: form.name,
        description: form.description,
        permissions,
      });
      showToast("Role created.");
      setIsModalOpen(false);
      setForm({ name: "", description: "", permissions: "" });
      fetchRoles();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (role) => {
    if (!role?.id) return;
    setSubmitting(true);
    try {
      await API.delete(`/roles/${role.id}`);
      showToast("Role removed.");
      fetchRoles();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove role.");
    } finally {
      setSubmitting(false);
    }
  };

  const cards = useMemo(() => roles.map((r) => ({
    ...r,
    color: roleColor(r.name),
    users: r.userCount ?? 0,
    access: accessLabel(r.permissions),
    desc: r.description || "",
  })), [roles]);

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-[800] text-slate-900">Create New Role</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Role Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. Auditor" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[90px]"
                  placeholder="What can this role do?" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Permissions (comma-separated)</label>
                <input value={form.permissions} onChange={(e) => setForm({ ...form, permissions: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="e.g. reports, audit-logs, users" />
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-[#111827] hover:bg-black disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                {submitting ? "Creating..." : "Create Role"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Roles & Permissions</h1>
          <p className="text-[14px] text-slate-500 font-medium">Define access control policies and permission sets for users.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchRoles}
            className="flex items-center gap-2 px-4 h-[48px] bg-white border border-slate-200 text-slate-700 rounded-xl text-[14px] font-[700] shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-300 transition-all active:scale-95"
          >
             <Plus size={18} /> Create New Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {loading ? (
          <div className="col-span-12 flex justify-center py-20 text-slate-400 gap-3"><RefreshCw size={20} className="animate-spin" /> Loading...</div>
        ) : cards.map((r, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl bg-${r.color}-50 text-${r.color}-600 flex items-center justify-center border border-${r.color}-100`}>
                   <ShieldCheck size={24} />
                </div>
                <div className="flex gap-2">
                   <button onClick={() => showToast("Edit role coming soon")} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                   <button disabled={submitting} onClick={() => handleDelete(r)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-60"><Trash2 size={14} /></button>
                </div>
             </div>
             
             <h3 className="text-[18px] font-[800] text-slate-900 mb-1">{r.name}</h3>
             <p className="text-[13px] text-slate-500 font-medium mb-6 h-[40px]">{r.desc}</p>
             
             <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                   <span className="text-[12px] font-[700] text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Key size={14}/> Access Level</span>
                   <span className="text-[13px] font-[800] text-slate-700">{r.access}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[12px] font-[700] text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Users size={14}/> Assigned Users</span>
                   <span className={`text-[12px] font-black px-2.5 py-1 rounded-full bg-${r.color}-50 text-${r.color}-700`}>{r.users} Users</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
