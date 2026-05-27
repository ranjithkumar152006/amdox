import { useState, useEffect } from "react";
import { 
  ClipboardCheck, CheckCircle, XCircle, Clock,
  Filter, Search, AlertCircle, FileText, RefreshCw
} from "lucide-react";
import API from "../services/api";

export default function Approvals() {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const [requests, setRequests] = useState([]);
  const [summary, setSummary]   = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading]   = useState(true);

  const fetchApprovals = () => {
    setLoading(true);
    API.get("/approvals")
      .then((res) => {
        setRequests(res.data.data || []);
        setSummary(res.data.summary || { pending: 0, approved: 0, rejected: 0 });
      })
      .catch((err) => showToast(err.response?.data?.message || "Failed to load approvals."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApprovals(); }, []);

  const handleAction = async (id, action) => {
    try {
      await API.put(`/approvals/${id}/action`, { action });
      showToast(`Request ${action.toLowerCase()}.`);
      fetchApprovals();
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed.");
    }
  };

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
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Approval Requests</h1>
          <p className="text-[14px] text-slate-500 font-medium">Review and authorize pending organizational requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock size={24} />
           </div>
           <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Pending Approvals</p>
              <h3 className="text-[20px] font-[900] text-slate-900">{summary.pending}</h3>
           </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle size={24} />
           </div>
           <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Approved This Month</p>
              <h3 className="text-[20px] font-[900] text-slate-900">{summary.approved}</h3>
           </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <XCircle size={24} />
           </div>
           <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Rejected Requests</p>
              <h3 className="text-[20px] font-[900] text-slate-900">{summary.rejected}</h3>
           </div>
        </div>

        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-[18px] font-[800] text-slate-800">Request Queue</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600 shadow-sm"><Filter size={16} /> Filters</button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Requester</th>
                <th className="px-6 py-4">Type & Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>}
              {!loading && requests.length === 0 && <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">No approval requests found.</td></tr>}
              {requests.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-500">{r.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{r.requestedBy || r.requester}</p>
                    <p className="text-[11px] text-slate-400 font-bold">{r.department || r.dept}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-[13px] font-[800] text-slate-800">{r.type}</p>
                     <p className="text-[12px] font-bold text-slate-500">{r.amount ? `$${r.amount.toLocaleString()}` : r.description}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">{r.date}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        r.priority === 'High' ? 'bg-rose-50 text-rose-600' : 
                        r.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                     }`}>{r.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                        r.status === 'Rejected' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                     }`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     {r.status === 'Pending' ? (
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handleAction(r.id, "Approved")} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"><CheckCircle size={16} /></button>
                          <button onClick={() => handleAction(r.id, "Rejected")} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"><XCircle size={16} /></button>
                       </div>
                     ) : (
                        <span className="text-[12px] font-bold text-slate-400">Processed</span>
                     )}
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
