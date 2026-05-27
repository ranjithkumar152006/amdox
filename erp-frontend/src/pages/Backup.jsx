import { useEffect, useMemo, useState } from "react";
import { 
  HardDrive, Download, Upload, AlertTriangle, 
  CheckCircle, Clock, Database, Server, RotateCcw
} from "lucide-react";
import API from "../services/api";

export default function Backup() {
  const [toast, setToast] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backups, setBackups] = useState([]);
  const [backupMeta, setBackupMeta] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBackups = async () => {
    try {
      const res = await API.get("/backup");
      setBackups(res.data?.data || []);
      setBackupMeta({
        totalSize: res.data?.totalSize || "0 GB",
        schedule: res.data?.schedule || null,
      });
    } catch (_) {}
  };

  useEffect(() => {
    fetchBackups();
    const poller = setInterval(fetchBackups, 5000);
    return () => clearInterval(poller);
  }, []);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      await API.post("/backup", { name: "Manual Backup", type: "Full" });
      showToast("Manual backup started.");
      fetchBackups();
    } catch (_) {
      showToast("Failed to start backup.");
    } finally {
      setIsBackingUp(false);
    }
  };
  const usagePercent = useMemo(() => {
    const raw = Number((backupMeta?.totalSize || "0").toString().replace(/[^\d.]/g, ""));
    if (!raw) return 0;
    return Math.min(100, Math.round((raw / 1000) * 100));
  }, [backupMeta]);

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

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Backup & Restore</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage system data snapshots and recovery points.</p>
        </div>
        <button 
          onClick={handleBackup}
          disabled={isBackingUp}
          className={`flex items-center gap-2 px-6 h-[48px] text-white rounded-xl text-[14px] font-[700] shadow-xl transition-all active:scale-95 ${
            isBackingUp ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700'
          }`}
        >
           {isBackingUp ? (
             <><RotateCcw size={18} className="animate-spin" /> Processing...</>
           ) : (
             <><HardDrive size={18} /> Create Manual Backup</>
           )}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Storage Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                 <Database size={24} />
              </div>
              <div>
                 <h2 className="text-[20px] font-[800] text-slate-900">Storage Utilization</h2>
                 <p className="text-[13px] text-slate-500 font-medium">Enterprise Cloud Infrastructure (US-East)</p>
              </div>
           </div>
           
           <div className="space-y-3">
              <div className="flex justify-between text-[14px] font-[700]">
                 <span className="text-slate-700">{backupMeta?.totalSize || "0 GB"} Used</span>
                 <span className="text-slate-400">1000 GB Total</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                 <div className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{ width: `${usagePercent}%` }}></div>
              </div>
              <div className="flex gap-6 mt-4 pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-[12px] font-[700] text-slate-500">Database (310 GB)</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                    <span className="text-[12px] font-[700] text-slate-500">Media/Assets (118 GB)</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Server Status */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-3 mb-6">
                <Server className="text-slate-400" size={20} />
                <h3 className="text-[16px] font-[800] text-slate-800">Server Health</h3>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                   <span className="text-[13px] font-[600] text-slate-600">MongoDB Primary</span>
                   <span className="flex items-center gap-1.5 text-[12px] font-black text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                   <span className="text-[13px] font-[600] text-slate-600">Redis Cache</span>
                   <span className="flex items-center gap-1.5 text-[12px] font-black text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                   <span className="text-[13px] font-[600] text-slate-600">S3 Storage Link</span>
                   <span className="flex items-center gap-1.5 text-[12px] font-black text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Active</span>
                </div>
             </div>
           </div>
        </div>

        {/* Backup History */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-2">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Snapshot History</h2>
            <div className="flex gap-2 text-[12px] font-bold text-slate-400 items-center">
               <Clock size={14}/> Next automated backup: {backupMeta?.schedule?.nextRun || "N/A"}
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Snapshot ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {backups.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{b.id}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-500">{b.date}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1.5 rounded-lg text-[11px] font-[800] tracking-wide ${
                        b.type === "Manual" || b.type === "Full" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"
                     }`}>
                       {b.type}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-[800] text-slate-700">{b.size}</td>
                  <td className="px-6 py-4">
                     {b.status === "Completed" || b.status === "Success" ? (
                       <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
                          <CheckCircle size={12}/> Success
                       </span>
                     ) : b.status === "In Progress" ? (
                       <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600">
                          <RotateCcw size={12} className="animate-spin" /> Running
                       </span>
                     ) : (
                       <span className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600">
                          <AlertTriangle size={12}/> Failed
                       </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                        <button onClick={() => showToast(`Restoring ${b.id}...`)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Restore"><Upload size={18} /></button>
                        <button onClick={() => showToast(`Downloading ${b.id}...`)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Download"><Download size={18} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
