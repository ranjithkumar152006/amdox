import { useState, useEffect } from "react";
import {
  FileSearch, Activity, ShieldCheck, Database,
  Search, Filter, ShieldAlert, CheckCircle, Clock,
  Download, RefreshCw, AlertTriangle, Info
} from "lucide-react";
import API from "../services/api";

export default function AuditLogs() {
  const [logs, setLogs]           = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [severity, setSeverity]   = useState("");
  const [module, setModule]       = useState("");
  const [severityCount, setSeverityCount] = useState({ Info: 0, Warning: 0, Critical: 0 });

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (severity) params.severity = severity;
      if (module)   params.module   = module;
      const res = await API.get("/audit-logs", { params });
      setLogs(res.data.data || []);
      setFiltered(res.data.data || []);
      setSeverityCount(res.data.severityCount || { Info: 0, Warning: 0, Critical: 0 });
    } catch (err) {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  // client-side filter while typing (debounce via useEffect)
  useEffect(() => {
    const q = search.toLowerCase();
    const result = logs.filter((l) =>
      (!q || l.user?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.module?.toLowerCase().includes(q)) &&
      (!severity || l.severity === severity) &&
      (!module   || l.module?.toLowerCase() === module.toLowerCase())
    );
    setFiltered(result);
  }, [search, severity, module, logs]);

  const handleExport = () => {
    const headers = ["ID", "User", "Action", "Module", "Description", "IP", "Severity", "Timestamp"];
    const rows = filtered.map((l) => [
      l.id, l.user, l.action, l.module, l.description, l.ip, l.severity, l.timestamp
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const riskColor = (s) => {
    if (s === "Critical") return "bg-rose-50 text-rose-600";
    if (s === "Warning")  return "bg-amber-50 text-amber-600";
    return "bg-emerald-50 text-emerald-600";
  };

  const RiskIcon = ({ s }) => {
    if (s === "Critical") return <ShieldAlert size={12} />;
    if (s === "Warning")  return <AlertTriangle size={12} />;
    return <ShieldCheck size={12} />;
  };

  const modules = [...new Set(logs.map((l) => l.module).filter(Boolean))];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">System Audit Logs</h1>
          <p className="text-[14px] text-slate-500 font-medium">Monitor system activities, security events, and compliance records.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 h-[48px] bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-[600] shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 h-[48px] bg-[#111827] text-white rounded-xl text-[14px] font-[700] shadow-xl hover:shadow-slate-300 transition-all active:scale-95"
          >
            <Download size={18} /> Export Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Total Events</p>
            <h3 className="text-[20px] font-[900] text-slate-900">{logs.length.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Critical Alerts</p>
            <h3 className="text-[20px] font-[900] text-slate-900">{severityCount.Critical}</h3>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">System Status</p>
            <h3 className="text-[20px] font-[900] text-emerald-600">
              {severityCount.Critical > 0 ? "At Risk" : "Secure"}
            </h3>
          </div>
        </div>

        {/* Table */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-[18px] font-[800] text-slate-800">Activity Stream</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search logs..."
                  className="pl-10 pr-4 h-[40px] w-[220px] bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="h-[40px] px-3 bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 outline-none cursor-pointer"
              >
                <option value="">All Severities</option>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="h-[40px] px-3 bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 outline-none cursor-pointer"
              >
                <option value="">All Modules</option>
                {modules.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {(search || severity || module) && (
                <button
                  onClick={() => { setSearch(""); setSeverity(""); setModule(""); }}
                  className="h-[40px] px-4 bg-rose-50 text-rose-600 rounded-xl text-[13px] font-[600] hover:bg-rose-100 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
              <RefreshCw size={20} className="animate-spin" /> Loading audit logs...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-rose-500 gap-3">
              <ShieldAlert size={20} /> {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
              <FileSearch size={20} /> No logs found.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Event ID</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action / Module</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{l.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-[14px] font-[700] text-slate-800">{l.user}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-[800] text-slate-800">{l.action}</p>
                      <p className="text-[12px] font-medium text-slate-500">{l.module}</p>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 max-w-[220px] truncate">{l.description}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 flex items-center gap-2">
                      <Clock size={14} className="text-slate-400 shrink-0" /> {l.timestamp}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 font-mono">{l.ip}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center w-fit gap-1 ${riskColor(l.severity)}`}>
                        <RiskIcon s={l.severity} />
                        {l.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
