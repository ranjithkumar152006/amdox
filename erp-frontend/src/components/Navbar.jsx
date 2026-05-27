import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { Search, Bell, Settings as SettingsIcon, LogOut, ChevronDown, CheckCircle2, AlertCircle, User, Menu, Mail } from "lucide-react";

export default function Navbar({ onMenuClick, sidebarOpen }) {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "employee");

  useEffect(() => {
    API.get("/profile")
      .then((res) => {
        const u = res.data.data;
        if (u?.name) {
          setUserName(u.name);
          localStorage.setItem("userName", u.name);
        }
        if (u?.role) {
          setUserRole(u.role);
          localStorage.setItem("userRole", u.role);
        }
      })
      .catch(() => {});
  }, []);

  const roleLabel = {
    admin: "Administrator",
    hr: "HR Manager",
    finance: "Finance Manager",
    employee: "Employee",
    it: "IT Support",
  }[userRole] || userRole;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchRealtimeFeed = async () => {
      try {
        const [activityRes, logsRes] = await Promise.all([
          API.get("/dashboard/recent-activity"),
          API.get("/audit-logs"),
        ]);

        const activity = activityRes.data?.data || [];
        const logs = logsRes.data?.data || [];

        setNotifications(activity.map((item, i) => ({
          id: item.id || `N-${i + 1}`,
          text: item.action || "New system activity",
          type: ["Critical", "Warning"].includes(item.severity) ? "alert" : "success",
          time: item.time || "just now",
        })));

        setMessages(logs.slice(0, 8).map((item, i) => ({
          id: item.id || `M-${i + 1}`,
          sender: item.user || "System",
          text: item.description || item.action || "System event",
          time: item.timestamp || "just now",
        })));
      } catch (_) {}
    };

    fetchRealtimeFeed();
    const poller = setInterval(fetchRealtimeFeed, 5000);
    return () => clearInterval(poller);
  }, []);

  const unreadCount = notifications.length;
  const unreadMessagesCount = messages.length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
  };

  return (
    <div className="bg-white sticky top-0 z-10 px-6 h-[72px] flex justify-between items-center border-b border-slate-200">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={sidebarOpen}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full border border-slate-200 w-[400px] shadow-sm">
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-slate-400 font-medium"
          />
          <Search size={18} className="text-slate-400" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors relative"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-[14px] font-[700] text-slate-800">Notifications</h3>
                {unreadCount > 0 && <span className="text-[11px] font-[600] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
                      {notif.type === 'alert' ? 
                        <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" /> : 
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <p className="text-[13px] text-slate-700 font-[500] leading-snug">{notif.text}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-[500]">{notif.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-[13px]">
                    No new notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => setNotifications([])}
                    className="w-full text-center text-[12px] font-[600] text-slate-500 hover:text-slate-700"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={toggleMessages}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors relative"
          >
            <Mail size={22} />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Messages Dropdown */}
          {showMessages && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-[14px] font-[700] text-slate-800">Messages</h3>
                {unreadMessagesCount > 0 && <span className="text-[11px] font-[600] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadMessagesCount} New</span>}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold flex-shrink-0">
                        {msg.sender.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-[13px] text-slate-900 font-[700]">{msg.sender}</p>
                          <p className="text-[10px] text-slate-400 font-[500]">{msg.time}</p>
                        </div>
                        <p className="text-[12px] text-slate-500 font-[500] line-clamp-1">{msg.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-[13px]">
                    No new messages
                  </div>
                )}
              </div>
              {messages.length > 0 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => setMessages([])}
                    className="w-full text-center text-[12px] font-[600] text-slate-500 hover:text-slate-700"
                  >
                    Clear all messages
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-[700] text-[#111827] leading-none">{userName}</p>
            <p className="text-[12px] text-slate-500 font-medium mt-1">{roleLabel}</p>
          </div>
          <div className="group relative">
            <button className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff`} alt={userName} className="w-full h-full rounded-full object-cover" />
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link 
                to="/profile"
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
              >
                <User size={16} />
                My Profile
              </Link>
              <div className="h-[1px] bg-slate-100 my-1"></div>
              <button 
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2 font-semibold"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
