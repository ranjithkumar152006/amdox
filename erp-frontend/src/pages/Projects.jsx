import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  MoreVertical, 
  Calendar,
  Users,
  BarChart2,
  Filter
} from "lucide-react";
import Card from "../components/Card";

import API from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuId, setMenuId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    API.get("/projects")
      .then((res) => setProjects(res.data.data || []))
      .catch(() => showToast("Failed to load projects."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'All'
  });
  const [toast, setToast] = useState(null);

  const [newProjectName, setNewProjectName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newManager, setNewManager] = useState("");

  const showToast = (message) => {
    console.log("Projects Action:", message);
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/projects", {
        name: newProjectName,
        client: newClient,
        manager: newManager,
        dueDate: newDueDate,
        status: "Planning",
        progress: 0,
      });
      setIsModalOpen(false);
      showToast("Project successfully created!");
      setNewProjectName("");
      setNewClient("");
      setNewManager("");
      setNewDueDate("");
      fetchProjects();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    setMenuId(null);
    if (!window.confirm("Delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      showToast("Project deleted.");
      fetchProjects();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete project.");
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeFilters.status === 'All' || p.status === activeFilters.status;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-8 animate-fade-in font-['Inter']">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[14px] font-[600]">{toast}</p>
              <p className="text-[12px] text-slate-400">Action performed successfully</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleAddProject}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Name</label>
                <input required type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="e.g. Website Redesign" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client</label>
                  <input required type="text" value={newClient} onChange={(e) => setNewClient(e.target.value)} className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm outline-none" placeholder="Client Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Manager</label>
                  <input required type="text" value={newManager} onChange={(e) => setNewManager(e.target.value)} className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm outline-none" placeholder="e.g. Alex Chen" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                <input required type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm outline-none" />
              </div>
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-11 rounded-lg mt-4 transition-all shadow-lg shadow-blue-600/20">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-[700] text-[#111827] leading-[1.2]">Project Portfolio</h1>
          <p className="text-[14px] text-[#6B7280] font-[400] mt-1">Track active initiatives, milestones, and delivery performance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] text-white px-4 h-[44px] rounded-[8px] text-[14px] font-[600] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Active Projects" value="24" trend="up" trendValue="12" Icon={Briefcase} color="blue" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="In Planning" value="08" trend="up" trendValue="5" Icon={Clock} color="amber" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Completed" value="156" trend="up" trendValue="24" Icon={CheckCircle2} color="emerald" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Delayed" value="03" trend="down" trendValue="1" Icon={AlertCircle} color="rose" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 h-[40px] bg-white border border-slate-200 rounded-lg text-[13px] outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-500/10 transition-all" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 h-[40px] border rounded-lg text-[13px] font-[600] transition-all shadow-sm ${
                  showFilters || activeFilters.status !== 'All'
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Filter size={16} className={showFilters ? 'text-blue-600' : 'text-slate-400'} /> Filter
                {activeFilters.status !== 'All' && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50 animate-fade-in">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Project Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Planning', 'In Progress', 'Completed', 'At Risk'].map(status => (
                          <button
                            key={status}
                            onClick={() => setActiveFilters({...activeFilters, status})}
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              activeFilters.status === status 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-50">
                      <button 
                        onClick={() => {
                          setActiveFilters({status: 'All'});
                          setShowFilters(false);
                        }}
                        className="w-full py-2 text-[11px] font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        Reset Status Filter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-[700] text-slate-500 uppercase tracking-widest">Project Name</th>
                <th className="px-6 py-4 text-[11px] font-[700] text-slate-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[11px] font-[700] text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-[700] text-slate-500 uppercase tracking-widest">Progress</th>
                <th className="px-6 py-4 text-[11px] font-[700] text-slate-500 uppercase tracking-widest">Team</th>
                <th className="px-6 py-4 text-[11px] font-[700] text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-[14px] font-[600] text-[#111827]">{p.name}</p>
                      <p className="text-[12px] text-slate-500">{p.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] text-slate-600 font-[500]">{p.client}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-[700] uppercase tracking-wider ${
                      p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      p.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                      p.status === 'At Risk' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-32">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-slate-500">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            p.progress === 100 ? 'bg-emerald-500' : 
                            p.status === 'At Risk' ? 'bg-rose-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {p.manager[0]}
                        </div>
                      ))}
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                        +2
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} />
                      <span className="text-[13px]">{p.dueDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <button onClick={() => setMenuId(menuId === p.id ? null : p.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                    {menuId === p.id && (
                      <div className="absolute right-6 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[140px]">
                        <button onClick={() => { setMenuId(null); showToast(`${p.name} — ${p.client}`); }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-slate-700 hover:bg-slate-50">View details</button>
                        <button onClick={() => handleDeleteProject(p.id)}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-[600] text-rose-600 hover:bg-rose-50 border-t border-slate-100">Delete</button>
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
