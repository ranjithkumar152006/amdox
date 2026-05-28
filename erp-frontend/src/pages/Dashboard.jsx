import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, Users, Package, Calendar, TrendingUp, Wallet, 
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, 
  Activity, Zap, Target, Star
} from "lucide-react";
import Card from "../components/Card";
import ChartBox from "../components/ChartBox";
import API from "../services/api";
export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [userName, setUserName] = useState("there");
  const [chartView, setChartView] = useState("monthly");

  useEffect(() => {
    let alive = true;

    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        if (alive) setDashboardData(res.data.data);
      } catch (e) {
        // Keep last good data; don't break the UI on transient errors.
        console.error(e);
      }
    };

    fetchDashboard();
    const dashboardPoller = setInterval(fetchDashboard, 5000);

    API.get("/auth/me").then(res => {
      const name = res.data?.user?.name || res.data?.data?.name || "";
      setUserName(name.split(" ")[0] || "there");
    }).catch(() => {});
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      alive = false;
      clearInterval(timer);
      clearInterval(dashboardPoller);
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    showToast("Generating Intelligence Report...");
    
    const s = stats;
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Metric,Value,Trend\n"
      + `Total Revenue,$${s.totalRevenue.value},+${s.totalRevenue.trendValue}%\n`
      + `Net Profit,$${s.netProfit.value},+${s.netProfit.trendValue}%\n`
      + `Active Projects,${s.activeProjects.value},+${s.activeProjects.trendValue}%\n`
      + `Customer Satisfaction,${s.satisfaction.value}%,+${s.satisfaction.trendValue}%`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Amdox_Enterprise_Report.csv");
    document.body.appendChild(link);
    
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      showToast("Full Enterprise Report Exported");
    }, 800);
  };

  const safeDashboardData = dashboardData ?? {
    stats: {
      totalRevenue: { value: 0, trend: "up", trendValue: 0 },
      netProfit: { value: 0, trend: "up", trendValue: 0 },
      activeProjects: { value: 0, trend: "up", trendValue: 0 },
      satisfaction: { value: 0, trend: "up", trendValue: 0 },
    },
    recentActivity: [],
    topProjects: [],
    monthlyRevenue: { labels: [], revenue: [], expenses: [] },
  };
  const { stats, recentActivity, topProjects, monthlyRevenue } = safeDashboardData;
  const chartData = useMemo(() => {
    if (chartView === "monthly") return monthlyRevenue;

    const latestRevenue = Number(monthlyRevenue?.revenue?.at(-1) || 0);
    const latestExpenses = Number(monthlyRevenue?.expenses?.at(-1) || 0);
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weights = [0.14, 0.15, 0.14, 0.16, 0.17, 0.12, 0.12];

    return {
      labels,
      revenue: weights.map((w) => Math.round(latestRevenue * w)),
      expenses: weights.map((w) => Math.round(latestExpenses * (w + 0.01))),
    };
  }, [chartView, monthlyRevenue]);

  if (!dashboardData) {
    return <div className="p-8 flex items-center justify-center min-h-screen bg-slate-50/30">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="p-8 space-y-10 bg-slate-50/30 min-h-screen animate-fade-in font-['Inter']">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700/50 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Zap size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-[14px] font-[700] tracking-tight">{toast}</p>
              <p className="text-[12px] text-slate-400 font-medium">System Intelligence Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-[32px] font-[800] text-[#111827] tracking-tight flex items-center gap-3">
            Welcome back, {userName} <span className="animate-wave inline-block">👋</span>
          </h1>
          <div className="flex items-center gap-3 text-slate-500">
            <p className="text-[14px] font-medium">Here's what's happening with your enterprise today.</p>
            <div className="h-4 w-[1px] bg-slate-300" />
            <p className="text-[13px] font-[600] flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <Clock size={14} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-4 mr-4 text-right">
             <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">System Status</p>
                <div className="text-[13px] font-bold text-emerald-500 flex items-center gap-1 mt-1 justify-end">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
                </div>
             </div>
          </div>
          <button 
            onClick={handleExport}
            className="group relative overflow-hidden bg-[#111827] text-white px-6 h-[48px] rounded-xl text-[14px] font-[700] transition-all hover:shadow-xl hover:shadow-slate-200 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
               <TrendingUp size={18} className="group-hover:rotate-12 transition-transform" />
               Full System Report
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Main Stats with New Style */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Total Revenue" value={`$${stats.totalRevenue.value.toLocaleString()}`} trend={stats.totalRevenue.trend} trendValue={stats.totalRevenue.trendValue} Icon={DollarSign} color="blue" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Net Profit" value={`$${stats.netProfit.value.toLocaleString()}`} trend={stats.netProfit.trend} trendValue={stats.netProfit.trendValue} Icon={Target} color="emerald" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Active Projects" value={stats.activeProjects.value.toString()} trend={stats.activeProjects.trend} trendValue={stats.activeProjects.trendValue} Icon={Zap} color="indigo" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Customer Satisfaction" value={`${stats.satisfaction.value}%`} trend={stats.satisfaction.trend} trendValue={stats.satisfaction.trendValue} Icon={Star} color="amber" />
        </div>
      </div>

      {/* Primary Insights Row */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-lg">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-[20px] font-[800] text-[#111827] tracking-tight">Financial Trajectory</h2>
              <p className="text-[13px] text-slate-500 font-medium mt-1">Growth overview across all departments</p>
            </div>
            <div className="flex gap-2">
               <button
                 onClick={() => setChartView("daily")}
                 className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-colors ${
                   chartView === "daily"
                     ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                     : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                 }`}
               >
                 Daily
               </button>
               <button
                 onClick={() => setChartView("monthly")}
                 className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-colors ${
                   chartView === "monthly"
                     ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                     : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                 }`}
               >
                 Monthly
               </button>
            </div>
          </div>
          <div className="h-[350px]">
            <ChartBox type="line" data={chartData} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[18px] font-[800] text-[#111827] tracking-tight">Recent Activity</h3>
                 <button
                   onClick={() => navigate("/audit-logs")}
                   className="text-blue-600 text-[12px] font-bold hover:underline"
                 >
                   View All
                 </button>
              </div>
              <div className="space-y-5 flex-1">
                 {recentActivity.map(item => (
                   <div key={item.id} className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                         <Activity size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="flex-1 border-b border-slate-50 pb-4 group-last:border-0">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-[14px] font-[700] text-slate-800">{item.user}</p>
                            <span className="text-[11px] font-medium text-slate-400">{item.time}</span>
                         </div>
                         <p className="text-[13px] text-slate-500 font-medium">{item.action}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50">
                 <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                       <p className="text-[13px] font-[700] text-blue-700">Project v2.0 Rollout</p>
                       <p className="text-[11px] font-medium text-blue-500">Upcoming Milestone: 2 days</p>
                    </div>
                    <ArrowUpRight className="text-blue-600" size={20} />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Operational Efficiency Section */}
      <div className="grid grid-cols-12 gap-6">
         <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-[18px] font-[800] text-[#111827] tracking-tight mb-8">Resource Allocation</h3>
            <div className="h-[280px]">
               <ChartBox type="doughnut" />
            </div>
            <div className="mt-8 space-y-4">
               {[
                 { label: "Engineering", val: "42%", color: "blue" },
                 { label: "Marketing", val: "28%", color: "indigo" },
                 { label: "Operations", val: "30%", color: "emerald" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                       <span className="text-[14px] font-medium text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-[14px] font-[700] text-slate-900">{item.val}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-[18px] font-[800] text-[#111827] tracking-tight">Project Performance Matrix</h3>
               <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><Activity size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-8">
               {topProjects.map((p, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[15px] font-[700] text-slate-800">{p.name}</p>
                          <p className="text-[12px] text-slate-400 font-medium">Global Enterprise Resource</p>
                       </div>
                       <div className="text-right">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                             p.status === 'Healthy' ? 'text-emerald-600 bg-emerald-50' : 
                             p.status === 'Excellent' ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'
                          }`}>{p.status}</span>
                          <p className="text-[14px] font-[800] text-slate-900 mt-2">{p.progress}%</p>
                       </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${
                            p.status === 'At Risk' ? 'bg-rose-500' : 
                            p.status === 'Excellent' ? 'bg-blue-600' : 'bg-emerald-500'
                         }`} 
                         style={{ width: `${p.progress}%` }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200">
                     <Users size={24} className="text-indigo-500" />
                  </div>
                  <div>
                     <p className="text-[14px] font-[700] text-slate-800">Total Collaborative Workforce</p>
                     <p className="text-[12px] text-slate-500 font-medium">840 Active across 12 regions</p>
                  </div>
               </div>
               <button className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] font-[700] text-slate-700 hover:bg-slate-100 transition-all shadow-sm">Manage Teams</button>
            </div>
         </div>
      </div>
    </div>
  );
}
