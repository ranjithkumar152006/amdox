import { useState, useEffect } from "react";
import {
  Mail, Phone, Building, MapPin, Calendar, Clock, Globe,
  CheckCircle2, Trophy, Edit, CheckCircle, Lock, LogIn, Edit3, RefreshCw
} from "lucide-react";
import API from "../services/api";

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=6366f1&color=fff&size=128`;

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", department: "", bio: "", location: "",
    timezone: "", language: "", dateOfBirth: "", gender: "",
    skills: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProfile = () => {
    setLoading(true);
    API.get("/profile")
      .then((res) => {
        const data = res.data.data;
        setProfile(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          department: data.department || "",
          bio: data.bio || "",
          location: data.location || "",
          timezone: data.timezone || "",
          language: data.language || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
        });
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role);
      })
      .catch((err) => showToast(err.response?.data?.message || "Failed to load profile."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put("/profile", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setProfile(res.data.data);
      setIsEditOpen(false);
      showToast("Profile updated successfully.");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await API.put("/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password changed successfully.");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center text-slate-400 gap-3">
        <RefreshCw size={20} className="animate-spin" /> Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center text-slate-500">
        Could not load profile. Please log in again.
      </div>
    );
  }

  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  return (
    <div className="p-6 space-y-6 animate-fade-in font-['Inter'] bg-slate-50 min-h-screen">
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-[14px] font-[600]">{toast}</p>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0">
              <h3 className="text-[18px] font-[800] text-slate-900">Edit Profile</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              {[
                { key: "name", label: "Full Name" },
                { key: "phone", label: "Phone" },
                { key: "department", label: "Department" },
                { key: "location", label: "Location" },
                { key: "timezone", label: "Timezone" },
                { key: "language", label: "Language" },
                { key: "dateOfBirth", label: "Date of Birth" },
                { key: "gender", label: "Gender" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
                  <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10" />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Skills (comma-separated)</label>
                <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="React, Node.js, MongoDB" />
              </div>
              <button disabled={submitting} type="submit"
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-60 text-white font-[800] h-12 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Edit size={16} />}
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-[700] text-[#111827]">My Profile</h1>
          <div className="text-[13px] text-slate-500 font-medium mt-1">
            <span className="cursor-pointer hover:text-slate-800">Dashboard</span> &gt; <span className="text-slate-800 font-semibold">Profile</span>
          </div>
        </div>
        <button
          onClick={() => setIsEditOpen(true)}
          className="bg-[#6366F1] text-white px-5 h-[40px] rounded-[8px] text-[14px] font-[600] flex items-center gap-2 hover:bg-[#4F46E5] transition-all shadow-lg shadow-indigo-500/20"
        >
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-[140px] bg-gradient-to-r from-[#4F46E5] to-[#818CF8] relative overflow-hidden flex items-end" />
            <div className="px-6 pb-6 relative flex flex-col items-center text-center">
              <div className="relative -mt-[56px] mb-4">
                <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg relative z-10">
                  <img src={avatarUrl(profile.name)} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="absolute bottom-1 right-1 w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center text-white shadow-md border-2 border-white hover:bg-[#4F46E5] transition-colors z-20"
                >
                  <Edit size={14} />
                </button>
              </div>
              <h2 className="text-[22px] font-bold text-[#111827]">{profile.name}</h2>
              <div className="mt-2 mb-3">
                <span className="bg-[#EEF2FF] text-[#6366F1] px-4 py-1.5 rounded-full text-[12px] font-bold">{profile.roleLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mb-6">
                <span className={`w-2 h-2 rounded-full ${profile.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                {profile.status === "Active" ? "Online" : profile.status}
              </div>

              <div className="w-full space-y-4 text-[13px] text-slate-600 bg-slate-50 rounded-xl p-4 text-left">
                <div className="flex items-center gap-3"><Mail size={16} className="text-[#6366F1]" /> {profile.email}</div>
                <div className="flex items-center gap-3"><Phone size={16} className="text-[#6366F1]" /> {profile.phone || "—"}</div>
                <div className="flex items-center gap-3"><Building size={16} className="text-[#6366F1]" /> {profile.department || "—"}</div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-[#6366F1]" /> {profile.location}</div>
                <div className="flex items-center gap-3"><Calendar size={16} className="text-[#6366F1]" /> Joined on {profile.joinedDate}</div>
                <div className="flex items-center gap-3"><Clock size={16} className="text-[#6366F1]" /> Last login: {profile.lastLogin}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Projects", value: profile.stats?.projects ?? 0, sub: "Active Projects", Icon: Calendar, color: "indigo" },
              { label: "Tasks Completed", value: profile.stats?.tasksCompleted ?? 0, sub: "Approved", Icon: CheckCircle2, color: "emerald" },
              { label: "Hours Logged", value: `${profile.stats?.hoursLogged ?? 0}h`, sub: "This Month", Icon: Clock, color: "amber" },
              { label: "Achievements", value: profile.stats?.achievements ?? 0, sub: "Badges Earned", Icon: Trophy, color: "blue" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-${s.color}-50 flex items-center justify-center text-${s.color}-500`}>
                  <s.Icon size={24} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">{s.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[24px] font-bold text-[#111827] leading-none mt-1">{s.value}</p>
                    <p className="text-[11px] text-slate-400">{s.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 px-6 flex gap-6 overflow-x-auto">
              {[
                { key: "personal", label: "Personal Information" },
                { key: "account", label: "Account & Security" },
                { key: "activity", label: "Activity Log" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 text-[14px] font-bold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key ? "border-[#6366F1] text-[#6366F1]" : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  {[
                    ["Full Name", profile.name],
                    ["Date of Birth", profile.dateOfBirth],
                    ["Email Address", profile.email],
                    ["Gender", profile.gender],
                    ["Phone Number", profile.phone || "—"],
                    ["Location", profile.location],
                    ["Department", profile.department || "—"],
                    ["Timezone", profile.timezone],
                    ["Role", profile.roleLabel],
                    ["Language", profile.language],
                  ].map(([label, val]) => (
                    <div key={label} className="space-y-1">
                      <p className="text-[12px] font-bold text-slate-400 mb-1">{label}</p>
                      {label === "Role" ? (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-100 text-[12px] font-bold">{val}</span>
                      ) : (
                        <p className="text-[14px] font-medium text-[#111827]">{val}</p>
                      )}
                    </div>
                  ))}
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-[12px] font-bold text-slate-400">Bio</p>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{profile.bio || "No bio added yet."}</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-[12px] font-bold text-slate-400">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.length > 0 ? skills.map((skill) => (
                        <span key={skill} className="bg-[#EEF2FF] text-[#6366F1] px-4 py-1.5 rounded-full text-[12px] font-bold">{skill}</span>
                      )) : (
                        <span className="text-slate-400 text-sm">No skills listed.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "account" && (
                <div className="max-w-md space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <span className="text-[13px] font-medium text-slate-600">Email Verified</span>
                      <div className={`flex items-center gap-1.5 ${profile.emailVerified ? "text-emerald-500" : "text-amber-500"}`}>
                        <CheckCircle size={14} />
                        <span className="text-[12px] font-bold">{profile.emailVerified ? "Verified" : "Pending"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <span className="text-[13px] font-medium text-slate-600">Phone Verified</span>
                      <div className={`flex items-center gap-1.5 ${profile.phoneVerified ? "text-emerald-500" : "text-amber-500"}`}>
                        <CheckCircle size={14} />
                        <span className="text-[12px] font-bold">{profile.phoneVerified ? "Verified" : "Pending"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-slate-600">Two Factor Authentication</span>
                      <div className={`flex items-center gap-1.5 ${profile.twoFactorEnabled ? "text-emerald-500" : "text-slate-400"}`}>
                        <CheckCircle size={14} />
                        <span className="text-[12px] font-bold">{profile.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2"><Lock size={16} /> Change Password</h4>
                    {["currentPassword", "newPassword", "confirmPassword"].map((key) => (
                      <div key={key}>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          {key === "currentPassword" ? "Current Password" : key === "newPassword" ? "New Password" : "Confirm Password"}
                        </label>
                        <input type="password" required value={passwordForm[key]}
                          onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10" />
                      </div>
                    ))}
                    <button disabled={submitting} type="submit"
                      className="bg-[#6366F1] text-white px-6 h-11 rounded-xl text-[14px] font-[700] hover:bg-[#4F46E5] disabled:opacity-60 flex items-center gap-2">
                      {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-5">
                  {profile.activity?.length > 0 ? profile.activity.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                        {item.type === "LOGIN" ? <LogIn size={18} /> : <Edit3 size={18} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-slate-700">{item.action}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5">{item.time}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-[11px] text-slate-400">{item.ip}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-400 text-center py-8">No activity recorded yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
              <h3 className="text-[16px] font-bold text-[#111827] mb-6 text-center">Account Status</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-[13px] font-medium text-slate-600">Email Verified</span>
                  <div className={`flex items-center gap-1.5 ${profile.emailVerified ? "text-emerald-500" : "text-amber-500"}`}>
                    <CheckCircle size={14} /><span className="text-[12px] font-bold">{profile.emailVerified ? "Verified" : "Pending"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-[13px] font-medium text-slate-600">Phone Verified</span>
                  <div className={`flex items-center gap-1.5 ${profile.phoneVerified ? "text-emerald-500" : "text-amber-500"}`}>
                    <CheckCircle size={14} /><span className="text-[12px] font-bold">{profile.phoneVerified ? "Verified" : "Pending"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-slate-600 w-24 leading-tight">Two Factor Authentication</span>
                  <div className={`flex items-center gap-1.5 ${profile.twoFactorEnabled ? "text-emerald-500" : "text-slate-400"}`}>
                    <CheckCircle size={14} /><span className="text-[12px] font-bold">{profile.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-bold text-[#111827]">Recent Activity</h3>
                <button onClick={() => setActiveTab("activity")} className="text-[12px] font-bold text-[#6366F1] border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">View All</button>
              </div>
              <div className="space-y-5">
                {(profile.activity || []).slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                      <LogIn size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-slate-700">{item.action}</p>
                      <p className="text-[12px] text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] text-slate-400">{item.ip}</p>
                    </div>
                  </div>
                ))}
                {(!profile.activity || profile.activity.length === 0) && (
                  <p className="text-slate-400 text-sm text-center py-4">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
