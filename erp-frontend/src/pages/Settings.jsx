import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Lock, Globe, Shield, Database, Smartphone, Save, CheckCircle2 } from "lucide-react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const sections = [
    { id: "profile", label: "User Profile", Icon: User, description: "Manage your personal information and preferences." },
    { id: "security", label: "Security", Icon: Lock, description: "Configure multi-factor authentication and passwords." },
    { id: "notifications", label: "Notifications", Icon: Bell, description: "Choose what alerts you receive and where." },
    { id: "regional", label: "Regional & Language", Icon: Globe, description: "Set your timezone and preferred language." },
    { id: "privacy", label: "Privacy & Permissions", Icon: Shield, description: "Manage data sharing and role permissions." },
    { id: "integrations", label: "API & Integrations", Icon: Database, description: "Connect Amdox ERP to your favorite tools." },
    { id: "mobile", label: "Mobile Access", Icon: Smartphone, description: "Manage connected mobile devices and sessions." },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-[18px] font-[700] text-[#111827] mb-6">Personal Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" defaultValue="Admin User" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" defaultValue="admin@erp.com" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Professional Bio</label>
                  <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 h-32" defaultValue="Senior Systems Administrator at Amdox Technologies." />
                </div>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-[18px] font-[700] text-[#111827] mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-700">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-lg h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-lg h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-lg h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-[18px] font-[700] text-[#111827] mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-sm font-bold text-slate-700">Email Alerts</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-sm font-bold text-slate-700">Push Notifications</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-sm font-bold text-slate-700">Weekly Summary Reports</span>
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                </div>
              </div>
            </div>
          </div>
        );
      case "regional":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-[18px] font-[700] text-[#111827] mb-6">Regional & Language</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Language</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg h-11 px-4 text-sm outline-none">
                    <option>English (United States)</option>
                    <option>Spanish (Español)</option>
                    <option>French (Français)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Timezone</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg h-11 px-4 text-sm outline-none">
                    <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option>(UTC+00:00) Greenwich Mean Time</option>
                    <option>(UTC+05:30) Indian Standard Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case "mobile":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-[18px] font-[700] text-[#111827] mb-6">Mobile Access Devices</h2>
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg flex items-center gap-4 bg-blue-50/50">
                  <Smartphone className="text-blue-600" size={24} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">iPhone 15 Pro</p>
                    <p className="text-xs text-slate-500">Last active: Just now • iOS 17.2</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Current Device</span>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 bg-white">
                  <Smartphone className="text-slate-400" size={24} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Samsung Galaxy S23</p>
                    <p className="text-xs text-slate-500">Last active: 3 days ago • Android 14</p>
                  </div>
                  <button onClick={() => showToast("Device session revoked")} className="ml-auto text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4 animate-in fade-in">
            <SettingsIcon size={48} className="opacity-20 animate-spin-slow" />
            <p className="font-medium text-slate-700">Module Configuration Interface</p>
            <p className="text-sm text-slate-500">This section is currently being synchronized with enterprise policies.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in font-['Inter'] relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[14px] font-[600]">{toast}</p>
              <p className="text-[12px] text-slate-400">Settings have been updated.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-[24px] font-[700] text-[#111827] leading-[1.2]">System Preferences</h1>
        <p className="text-[14px] text-[#6B7280] font-[400] mt-1">Configure your environment, security settings, and personal profile.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Settings Navigation */}
        <div className="col-span-12 lg:col-span-4 space-y-2">
          {sections.map((s) => (
            <button 
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                activeSection === s.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-500/50 hover:bg-slate-50'
              }`}
            >
              <s.Icon size={20} />
              <div>
                <p className="font-bold text-[14px]">{s.label}</p>
                <p className={`text-[12px] ${activeSection === s.id ? 'text-blue-100' : 'text-slate-400'}`}>{s.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[500px]">
          <div className="max-w-2xl h-full flex flex-col justify-between">
            {renderContent()}

            <div className="pt-8 border-t border-slate-100 flex justify-end gap-3 mt-auto">
               <button 
                 onClick={() => showToast("Changes discarded")}
                 className="px-6 h-11 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
               >
                 Discard Changes
               </button>
               <button 
                 onClick={() => showToast("Preferences saved successfully")}
                 className="px-6 h-11 rounded-lg text-sm font-bold bg-[#2563EB] text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
               >
                 <Save size={18} /> Save Preferences
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
