import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, Package, Wallet, Layers, Settings,
  ShieldCheck, TrendingUp, FileText, Clock, Calendar as CalendarIcon,
  ArrowRightLeft, Landmark, PieChart, Truck, ArrowDownToLine,
  ArrowUpToLine, BarChart3, FileCheck, Box, ClipboardCheck,
  FileSearch, HelpCircle, CreditCard, CheckSquare, Folder,
  Briefcase, Bell, Database, HardDrive, UserCheck, CalendarCheck,
  ChevronDown, ChevronRight, Circle
} from "lucide-react";

const financeMenuGroups = [
  {
    title: "CORE",
    items: [
      { path: "/finance", label: "Finance Hub", Icon: Wallet },
    ]
  },
  {
    title: "FINANCE PORTAL",
    items: [
      { path: "/transactions", label: "Transactions", Icon: ArrowRightLeft },
      { path: "/accounts", label: "Accounts", Icon: Landmark },
      { path: "/income", label: "Income", Icon: ArrowDownToLine },
      { path: "/expenses", label: "Expenses", Icon: ArrowUpToLine },
      { path: "/budgets", label: "Budgets", Icon: PieChart },
      { path: "/invoices", label: "Invoices", Icon: FileText },
      { path: "/payments", label: "Payments", Icon: CreditCard },
      { path: "/reports", label: "Reports", Icon: BarChart3 },
      { path: "/tax-management", label: "Tax Management", Icon: FileCheck },
      { path: "/assets", label: "Assets", Icon: Box },
      { path: "/vendors", label: "Vendors", Icon: Truck },
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      { path: "/approvals", label: "Approval Requests", Icon: ClipboardCheck, badge: 6 },
      { path: "/audit-logs", label: "Audit Logs", Icon: FileSearch },
    ]
  },
  {
    title: "SETTINGS",
    items: [
      { path: "/help", label: "Help & Support", Icon: HelpCircle },
    ]
  }
];

const adminMenuGroups = [
  {
    title: "MAIN",
    items: [
      { path: "/users", label: "Users", Icon: Users },
      { path: "/roles", label: "Roles & Permissions", Icon: UserCheck },
      { path: "/departments", label: "Departments", Icon: Briefcase },
      { path: "/hr", label: "Employees", Icon: Users },
      { path: "/attendance", label: "Attendance", Icon: CalendarCheck },
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      { 
        path: "#", 
        label: "HR Management", 
        Icon: FileCheck, 
        hasDropdown: true,
        subItems: [
          { path: "/payroll", label: "Payroll Processing" },
          { path: "/leaves", label: "Leave Management" },
          { path: "/designations", label: "Designations" },
        ]
      },
      { path: "/inventory", label: "Inventory Management", Icon: Package },
      { 
        path: "#finance", 
        label: "Finance Management", 
        Icon: Wallet, 
        hasDropdown: true,
        subItems: [
          { path: "/income", label: "Income Stream" },
          { path: "/expenses", label: "Expense Tracking" },
          { path: "/tax-management", label: "Tax Management" },
          { path: "/assets", label: "Assets Registry" }
        ]
      },
      { path: "/projects", label: "Project Management", Icon: Folder },
      { path: "/vendors", label: "Clients & Vendors", Icon: Users },
    ]
  },
  {
    title: "REPORTS",
    items: [
      { path: "/analytics", label: "Analytics", Icon: TrendingUp },
      { path: "/reports", label: "Reports", Icon: FileText },
      { path: "/audit-logs", label: "Audit Logs", Icon: FileSearch },
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { path: "/settings", label: "Settings", Icon: Settings },
      { path: "/backup", label: "Backup & Restore", Icon: ArrowDownToLine },
    ]
  }
];

export default function Sidebar({ isOpen = true, onNavigate }) {
  const location = useLocation();
  const role = localStorage.getItem("role") || "admin";
  const [openDropdowns, setOpenDropdowns] = useState({ "HR Management": true });
  const routeAccess = {
    "/": ["admin"],
    "/hr": ["admin", "hr"],
    "/attendance": ["admin", "hr"],
    "/payroll": ["admin", "hr"],
    "/leaves": ["admin", "hr"],
    "/departments": ["admin", "hr"],
    "/designations": ["admin", "hr"],
    "/inventory": ["admin"],
    "/finance": ["admin", "finance"],
    "/transactions": ["admin", "finance"],
    "/accounts": ["admin", "finance"],
    "/income": ["admin", "finance"],
    "/expenses": ["admin", "finance"],
    "/budgets": ["admin", "finance"],
    "/invoices": ["admin", "finance"],
    "/payments": ["admin", "finance"],
    "/reports": ["admin", "finance"],
    "/tax-management": ["admin", "finance"],
    "/assets": ["admin", "finance"],
    "/vendors": ["admin", "finance"],
    "/approvals": ["admin", "finance"],
    "/audit-logs": ["admin", "finance"],
    "/projects": ["admin"],
    "/analytics": ["admin"],
    "/users": ["admin"],
    "/roles": ["admin"],
    "/settings": ["admin"],
    "/backup": ["admin"],
    "/help": ["admin", "hr", "finance"],
    "/profile": ["admin", "hr", "finance"],
  };

  const handleNavClick = () => {
    if (onNavigate) onNavigate();
  };

  const toggleDropdown = (label, e) => {
    e.preventDefault();
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const canAccess = (path) => {
    const allowed = routeAccess[path];
    return !allowed || allowed.includes(role);
  };

  const isFinance = role === "finance";
  const sourceGroups = isFinance ? financeMenuGroups : adminMenuGroups;
  const menuGroups = sourceGroups
    .map((group) => ({
      ...group,
      items: group.items
        .map((item) => {
          if (item.subItems?.length) {
            const filteredSubItems = item.subItems.filter((sub) => canAccess(sub.path));
            return filteredSubItems.length ? { ...item, subItems: filteredSubItems } : null;
          }
          return canAccess(item.path) ? item : null;
        })
        .filter(Boolean),
    }))
    .filter((group) => group.items.length > 0);
  const isDashboardActive = location.pathname === "/";
  const portalLabel = role === "finance" ? "Finance Portal" : role === "hr" ? "HR Portal" : "Admin Portal";

  return (
    <div
      className={`fixed top-0 left-0 w-[260px] bg-[#0f172a] text-white h-screen flex flex-col border-r border-slate-800 z-30 overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-24 flex items-center gap-3 px-6 shrink-0 sticky top-0 bg-[#0f172a] z-10 pt-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Box size={20} className="text-white" />
        </div>
        <div>
           <h1 className="text-[16px] font-[800] tracking-tight leading-tight">ERP System</h1>
           <p className="text-[11px] text-slate-400 font-medium">{portalLabel}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-6">
        {!isFinance && (
          <Link
            to="/"
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-[700] mb-2 ${
              isDashboardActive 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
              : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
        )}

        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-3">{group.title}</p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              const hasSub = item.subItems && item.subItems.length > 0;
              const isOpen = openDropdowns[item.label];
              
              return (
                <div key={item.label} className="space-y-1">
                  {hasSub ? (
                    <button
                      onClick={(e) => toggleDropdown(item.label, e)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-[600] group ${
                        isOpen 
                        ? 'bg-slate-800/80 text-white shadow-sm border border-slate-700/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`${isOpen ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                           <item.Icon size={18} />
                         </div>
                         <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                           <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/20">{item.badge}</span>
                        )}
                        <ChevronDown size={14} className={`text-slate-500 group-hover:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleNavClick}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-[600] group ${
                        isActive 
                        ? 'bg-slate-800/80 text-white shadow-sm border border-slate-700/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <item.Icon size={18} className={isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400 transition-colors"} />
                         <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                           <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/20">{item.badge}</span>
                        )}
                        {item.hasDropdown && (
                           <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-400 transition-colors" />
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Sub Items Dropdown */}
                  {hasSub && isOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1 animate-fade-in">
                      {item.subItems.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-[12px] font-[600] group ${
                              isSubActive 
                              ? 'text-blue-400 bg-slate-800/40' 
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                            }`}
                          >
                            <Circle size={6} className={isSubActive ? "text-blue-500 fill-blue-500" : "text-slate-600"} />
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50 shrink-0 bg-[#0f172a]">
        <div className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group">
           {isFinance ? (
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 relative">
                <Users size={18} className="text-slate-300" />
             </div>
           ) : (
             <img src="https://i.pravatar.cc/150?img=11" alt="John Doe" className="w-10 h-10 rounded-full border-2 border-slate-700" />
           )}
           <div className="flex-1">
              <p className="text-[13px] font-[700] text-slate-200 group-hover:text-white transition-colors">
                {isFinance ? "Michael Brown" : "John Doe"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {isFinance ? "Finance Manager" : "Super Admin"}
              </p>
           </div>
           <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </div>
  );
}
