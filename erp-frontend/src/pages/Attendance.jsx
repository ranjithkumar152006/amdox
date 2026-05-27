import { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Search, Filter, Download, RefreshCw } from "lucide-react";
import API from "../services/api";

export default function Attendance() {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [toast, setToast]               = useState(null);
  const [attendanceData, setAttendance] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    date: new Date().toISOString().slice(0, 10),
    checkIn: "09:00",
    checkOut: "17:00",
    status: "Present",
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAttendance = () => {
    setLoading(true);
    API.get("/attendance")
      .then((res) => setAttendance(res.data.data || []))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load attendance."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAttendance(); }, []);

  const handleExport = () => {
    const rows = attendanceData.map((r) =>
      [r.id, r.employeeId, r.name, r.date, r.checkIn, r.checkOut, r.status].join(",")
    );
    const csv = ["ID,EmployeeID,Name,Date,CheckIn,CheckOut,Status", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Attendance log exported.");
  };

  const handleLog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/attendance", form);
      showToast("Attendance logged successfully");
      setIsModalOpen(false);
      setForm({ employeeId: "", name: "", date: new Date().toISOString().slice(0, 10), checkIn: "09:00", checkOut: "17:00", status: "Present" });
      fetchAttendance();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to log attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = attendanceData.filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen animate-fade-in font-['Inter']">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {/* Log Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[18px] font-bold text-slate-900">Manual Attendance Log</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form className="p-6 space-y-5" onSubmit={handleLog}>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Employee ID</label>
                <input required type="text" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" placeholder="EMP-001" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Employee Name</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
                <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check In</label>
                  <input required type="time" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check Out</label>
                  <input required type="time" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none cursor-pointer">
                  <option>Present</option>
                  <option>Late</option>
                  <option>Absent</option>
                  <option>On Leave</option>
                </select>
              </div>
              <button disabled={submitting} type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : null}
                {submitting ? "Saving..." : "Save Attendance Record"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Attendance Tracking</h1>
          <p className="text-[14px] text-slate-500 font-medium">Monitor daily check-ins and operational hours.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] font-[600] text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <Download size={18} /> Export Log
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 h-[44px] bg-blue-600 text-white rounded-xl text-[14px] font-[700] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95"
          >
             Log Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="w-full pl-10 pr-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/10" />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 h-[44px] bg-white border border-slate-200 rounded-xl text-[13px] font-[600] text-slate-600">
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Work Hours</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400">No attendance records found.</td></tr>
              ) : filtered.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-[700] text-slate-800">{row.name}</p>
                    <p className="text-[11px] text-slate-400 font-bold tracking-tight">{row.employeeId || row.id}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{row.date}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-900 font-bold">{row.checkIn}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-900 font-bold">{row.checkOut}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-bold">{row.hours}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      row.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                      row.status === 'Late' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {row.status}
                    </span>
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
