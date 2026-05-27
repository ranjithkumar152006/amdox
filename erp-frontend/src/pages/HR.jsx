import { useState } from "react";
import { 
  Users, UserCheck, UserMinus, UserPlus, BarChart3, 
  Calendar, Mail, MoreVertical, CheckCircle2, 
  Clock, AlertCircle, Search, Filter, TrendingUp,
  Cake, CheckCircle, XCircle, RotateCcw
} from "lucide-react";
import ChartBox from "../components/ChartBox";
import Card from "../components/Card";
import { useEffect } from "react";
import API from "../services/api";

export default function HR() {
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [hrData, setHrData] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fallbackStats = { total: 0, active: 0, onLeave: 0, newHires: 0, depts: 0 };
    const loadHrData = async () => {
      const [statsRes, empRes] = await Promise.allSettled([
        API.get("/employees/stats"),
        API.get("/employees"),
      ]);

      if (!mounted) return;

      const statsOk = statsRes.status === "fulfilled";
      const empOk = empRes.status === "fulfilled";
      const stats = statsOk ? (statsRes.value.data?.data || fallbackStats) : fallbackStats;
      const employees = empOk ? (empRes.value.data?.data || []) : [];

      setHrData({ stats, employees });
      if (!statsOk || !empOk) {
        setLoadError("Some HR data failed to load. Showing available data.");
      } else {
        setLoadError("");
      }
    };

    loadHrData().catch(() => {
      if (mounted) {
        setHrData({ stats: fallbackStats, employees: [] });
        setLoadError("Unable to load HR data right now.");
      }
    });

    return () => { mounted = false; };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/employees", {
        name: newName,
        email: newName.toLowerCase().replace(" ", ".") + "@amdox.com",
        role: newRole,
        department: newDept
      });
      if (res.data.success) {
        showToast(`Successfully onboarded ${newName}!`);
        setIsModalOpen(false);
        setNewName("");
        setNewRole("");
        // Reload data
        API.get("/employees").then((r) =>
          setHrData((prev) => ({ ...prev, employees: r.data.data || [] }))
        );
      }
    } catch (err) {
      showToast("Error adding employee: " + (err.response?.data?.message || err.message));
    }
  };

  if (!hrData) {
    return <div className="p-8 flex items-center justify-center min-h-screen bg-slate-50/50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const { stats, employees } = hrData;

  const hrStats = [
    { title: "Total Employees", value: stats.total.toString(), trend: "up", trendValue: "12.5", Icon: Users, color: "indigo" },
    { title: "Present Today", value: stats.active.toString(), trend: "up", trendValue: "8.3", Icon: UserCheck, color: "emerald" },
    { title: "On Leave", value: stats.onLeave.toString(), trend: "down", trendValue: "3.2", Icon: UserMinus, color: "amber" },
    { title: "New Hires", value: stats.newHires.toString(), trend: "up", trendValue: "20", Icon: UserPlus, color: "blue" },
    { title: "Departments", value: stats.depts.toString(), trend: "up", trendValue: "2.1", Icon: BarChart3, color: "rose" },
  ];

  // Map backend employees to recent activities style
  const recentActivities = employees.slice(0, 4).map(e => ({
    id: e.id, user: e.name, action: `joined as ${e.role}`, time: e.joinDate, Icon: UserPlus, color: "blue"
  }));

  // Create mock birthdays from employees
  const birthdays = employees.slice(0, 5).map(e => ({
    name: e.name, role: e.role, date: "Upcoming", avatar: e.avatar
  }));

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen animate-fade-in font-['Inter']">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[14px] font-[600]">{toast}</p>
              <p className="text-[12px] text-slate-400">HR Intelligence Update</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-bold text-slate-900">Onboard New Employee</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form className="p-6 space-y-5" onSubmit={handleAddEmployee}>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
                  placeholder="e.g. Alex Johnson" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                  <select 
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option>Engineering</option>
                    <option>Finance</option>
                    <option>HR</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Role</label>
                  <input 
                    required 
                    type="text" 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10" 
                    placeholder="e.g. Lead Designer" 
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Confirm Onboarding
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">HR Management</h1>
          <p className="text-[14px] text-[#6B7280] font-[500] mt-1">Manage employee lifecycle, attendance, and organizational performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select className="pl-10 pr-10 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
              <option>May 12, 2024 - May 18, 2024</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2563EB] text-white px-6 h-[44px] rounded-xl text-[14px] font-[700] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700">
          {loadError}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-10 gap-6">
        {hrStats.map((stat, i) => (
          <div key={i} className="col-span-10 md:col-span-5 lg:col-span-2">
            <Card {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Employee Overview Chart */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[18px] font-[700] text-[#111827]">Employee Overview</h2>
            <select className="text-[11px] font-[700] border border-slate-200 bg-slate-50 rounded-lg px-2 py-1 outline-none text-slate-500">
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[280px]">
            <ChartBox type="line" />
          </div>
        </div>

        {/* Employees by Department */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[18px] font-[700] text-[#111827]">Employees by Department</h2>
          </div>
          <div className="h-[280px]">
            <ChartBox type="doughnut" />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-[700] text-[#111827]">Recent Activities</h2>
            <button className="text-blue-600 text-[11px] font-[700] hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-9 h-9 rounded-xl bg-${activity.color}-50 flex items-center justify-center shrink-0 border border-${activity.color}-100`}>
                  <activity.Icon size={16} className={`text-${activity.color}-500`} />
                </div>
                <div>
                  <p className="text-[13px] font-[700] text-slate-800 leading-snug">
                    New employee <span className="text-blue-600">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Upcoming Birthdays */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-[700] text-[#111827] flex items-center gap-2">
              <Cake size={20} className="text-rose-500" /> Upcoming Birthdays
            </h2>
            <button className="text-blue-600 text-[11px] font-[700] hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-4">Employee</th>
                  <th className="pb-4">Department</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {birthdays.map((b, i) => (
                  <tr key={i} className="group">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-100 uppercase">
                          {b.avatar}
                        </div>
                        <p className="text-[13px] font-[700] text-slate-800">{b.name}</p>
                      </div>
                    </td>
                    <td className="py-3 text-[12px] font-medium text-slate-500">{b.role}</td>
                    <td className="py-3 text-[12px] font-[700] text-slate-900">{b.date}</td>
                    <td className="py-3 text-right">
                      <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                        <Mail size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Summary */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[18px] font-[700] text-[#111827]">Leave Summary</h2>
            <button className="text-blue-600 text-[11px] font-[700] hover:underline">View All</button>
          </div>
          <div className="space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
               <p className="text-[13px] font-[700] text-slate-700">Total Leave Requests</p>
               <span className="text-[16px] font-[800] text-slate-900">48</span>
            </div>
            {[
              { label: "Approved", val: 32, color: "emerald", Icon: CheckCircle },
              { label: "Pending", val: 8, color: "amber", Icon: Clock },
              { label: "Rejected", val: 8, color: "rose", Icon: XCircle },
              { label: "Cancelled", val: 0, color: "slate", Icon: RotateCcw },
            ].map((l, i) => (
              <div key={i} className="flex justify-between items-center group">
                 <div className="flex items-center gap-3">
                    <l.Icon size={16} className={`text-${l.color}-500`} />
                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{l.label}</span>
                 </div>
                 <span className={`text-[14px] font-[800] text-${l.color}-600`}>{l.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Status */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
            <h2 className="text-[18px] font-[700] text-[#111827]">Employee Status</h2>
            <button className="text-blue-600 text-[11px] font-[700] hover:underline">View All</button>
          </div>
          <div className="space-y-6">
             {[
               { label: "Permanent", val: 180, percentage: 70.3, color: "emerald" },
               { label: "Probation", val: 40, percentage: 15.6, color: "blue" },
               { label: "Contract", val: 28, percentage: 10.9, color: "indigo" },
               { label: "Trainee", val: 8, percentage: 3.1, color: "amber" },
             ].map((s, i) => (
               <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[13px]">
                     <span className="font-bold text-slate-700">{s.label}</span>
                     <span className="font-[800] text-slate-900">{s.val} ({s.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                     <div 
                       className={`h-full rounded-full bg-${s.color}-500`} 
                       style={{ width: `${s.percentage}%` }}
                     />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StarIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
