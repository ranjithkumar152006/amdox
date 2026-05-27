import { useState, useEffect } from "react";
import { 
  Users as UsersIcon, Shield, Search, Filter, 
  MoreVertical, CheckCircle, XCircle, Plus, Mail, RefreshCw, Eye, EyeOff
} from "lucide-react";
import API from "../services/api";

export default function Users() {
  const [toast, setToast]       = useState(null);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [isModalOpen, setModal] = useState(false);
  const [search, setSearch]     = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [submitting, setSubmit] = useState(false);
  const [menuId, setMenuId]     = useState(null);
  const [form, setForm]         = useState({
    name: "", email: "", password: "", role: "employee", department: "", phone: ""
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchUsers = () => {
    setLoading(true);
    API.get("/users").then(res => setUsers(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    try {
      await API.post("/users", form);
      showToast(`User "${form.name}" created successfully!`);
      setModal(false);
      setForm({ name: "", email: "", password: "", role: "employee", department: "", phone: "" });
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create user.");
    } finally {
      setSubmit(false);
    }
  };

  const handleToggleStatus = async (id) => {
    setMenuId(null);
    try {
      await API.put(`/users/${id}/toggle-status`);
      showToast("User status updated.");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    setMenuId(null);
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      showToast("User removed.");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-[800] text-slate-900">Add New User</h3>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input
                  required type="text" placeholder="e.g. Alice Johnson"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
                <input
                  required type="email" placeholder="e.g. alice@amdox.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <input
                    required type={showPw ? "text" : "password"} placeholder="Min 6 characters"
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 pr-10 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Role</label>
                  <select
                    value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                    <option value="employee">Employee</option>
                    <option value="it">IT Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                  <input
                    type="text" placeholder="e.g. Engineering"
                    value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Phone (optional)</label>
                <input
                  type="text" placeholder="e.g. +1 555-0101"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-[700] h-12 rounded-xl mt-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw size={16} className="animate-spin"/> : <Plus size={16}/>}
                {submitting ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">System Users</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage user accounts, roles, and system access.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-6 h-[48px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><UsersIcon size={24}/></div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Total Users</p>
            <h3 className="text-[20px] font-[900] text-slate-900">{users.length}</h3>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><CheckCircle size={24}/></div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
            <h3 className="text-[20px] font-[900] text-slate-900">{users.filter(u => u.status === 'Active').length}</h3>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100"><Shield size={24}/></div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Admin Accounts</p>
            <h3 className="text-[20px] font-[900] text-slate-900">{users.filter(u => u.role === 'admin').length}</h3>
          </div>
        </div>

        {/* Table */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="pl-10 pr-4 h-[44px] w-[300px] bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            <button onClick={fetchUsers} className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
              <RefreshCw size={15}/> Refresh
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400">No users found.</td></tr>}
              {filtered.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[13px] font-[800] text-white">
                        {u.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[14px] font-[700] text-slate-800">{u.name}</p>
                        <p className="text-[12px] font-medium text-slate-500 flex items-center gap-1"><Mail size={11}/> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-[800] tracking-wide ${
                      u.role === 'admin'   ? 'bg-indigo-50 text-indigo-700' :
                      u.role === 'hr'      ? 'bg-blue-50 text-blue-700' :
                      u.role === 'finance' ? 'bg-emerald-50 text-emerald-700' :
                      u.role === 'it'      ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{u.department || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-400'}`}/>
                      <span className="text-[13px] font-[700] text-slate-700">{u.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-500">{u.lastLogin}</td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setMenuId(menuId === u.id ? null : u.id)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={18}/></button>
                    {menuId === u.id && (
                      <div className="absolute right-6 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[150px]">
                        <button onClick={() => handleToggleStatus(u.id)}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50">
                          {u.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => handleDelete(u.id)}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-rose-600 hover:bg-rose-50 border-t border-slate-100">Delete user</button>
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
