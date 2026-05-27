import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LayoutDashboard, Users, Package, Wallet, ShieldCheck, BarChart3, ChevronRight, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("userName", res.data.user.name);
        
        const redirects = {
          admin: "/",
          hr: "/hr",
          finance: "/finance"
        };
        navigate(redirects[res.data.user.role] || "/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col relative font-['Inter']">
      {/* Background Dot Pattern */}
      <div className="absolute top-10 right-10 w-40 h-40 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 0)', backgroundSize: '20px 20px' }} />

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-[1280px] w-full bg-white rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex min-h-[850px] relative border border-slate-100">
          
          {/* Left Side - Brand Hero Section */}
          <div className="hidden lg:flex flex-[1.1] relative bg-[#0b1424] overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-[200px] pointer-events-none z-10 translate-x-1">
               <svg viewBox="0 0 100 800" className="h-full fill-white preserve-aspect-none">
                  <path d="M100 0 L100 800 L0 800 C 80 400 80 400 0 0 Z" />
               </svg>
            </div>

            <div className="relative z-20 p-20 flex flex-col h-full bg-gradient-to-br from-[#0b1424] via-[#0b1424] to-blue-900/40">
              <div className="flex items-center gap-4 mb-20">
                <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
                     <path d="M12 2L2 22h4.5l2-4h7l2 4H22L12 2zm-1.5 13L12 11.5l1.5 3.5h-3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">AMDOX <span className="text-blue-500 font-black">ERP</span></h1>
              </div>

              <div className="mb-12">
                <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
                  AI-Powered <br />
                  Cloud <span className="text-blue-500 underline decoration-4 underline-offset-8">ERP</span> Suite
                </h2>
                <p className="text-slate-400 text-[17px] max-w-sm leading-relaxed">
                  One integrated platform to streamline your business operations, drive efficiency and accelerate growth.
                </p>
              </div>

              <div className="relative mt-20 h-[300px] w-full ml-[-20px]">
                <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 400 300">
                  <path d="M50 250 A 200 200 0 0 1 350 250" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
                <div className="absolute left-[20px] bottom-[20px] text-center">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-3">
                    <BarChart3 className="text-white" size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Analytics</p>
                </div>
                <div className="absolute left-[110px] bottom-[110px] text-center">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-3">
                    <Users className="text-white" size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter">HR & Payroll</p>
                </div>
                <div className="absolute left-[210px] bottom-[140px] text-center">
                  <div className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-3">
                    <Package className="text-white" size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Inventory</p>
                </div>
                <div className="absolute left-[310px] bottom-[110px] text-center">
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-3">
                    <Wallet className="text-white" size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Finance</p>
                </div>
                <div className="absolute left-[380px] bottom-[20px] text-center">
                  <div className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-3">
                    <ShieldCheck className="text-white" size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication Section */}
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="w-[400px] p-[32px] bg-white rounded-[12px] shadow-lg border border-slate-100">
              <div className="text-center mb-10">
                <h3 className="text-[24px] font-[700] text-[#111827] mb-2 leading-[1.2]">Welcome Back!</h3>
                <p className="text-[#6B7280] font-[500] text-[14px]">Sign in to continue to Amdox ERP</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-[12px] font-[600] text-[#6B7280] uppercase tracking-wider mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2563EB] transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="admin@erp.com" 
                      className="w-full bg-[#F9FAFB] border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-[8px] h-[44px] px-10 text-[14px] font-[400] transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-[600] text-[#6B7280] uppercase tracking-wider mb-2 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2563EB] transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full bg-[#F9FAFB] border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-[8px] h-[44px] px-10 text-[14px] font-[400] transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-rose-500 text-[12px] font-[600]">{error}</p>}

                <div className="flex justify-between items-center text-[13px]">
                  <label className="flex items-center gap-2 text-[#6B7280] font-[500] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#2563EB]" />
                    Remember me
                  </label>
                  <a href="#" className="text-[#2563EB] font-[600] hover:underline">Forgot Password?</a>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-[600] h-[44px] rounded-[8px] transition-all active:scale-[0.98] text-[14px]"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-8 text-center text-[13px] text-slate-500 border-t border-slate-100 pt-6">
                <p className="font-bold mb-2">Demo Accounts (Pass: 1234):</p>
                <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  <p>admin@erp.com | hr@erp.com | finance@erp.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8 text-center text-[#6B7280] text-[11px] font-[700] uppercase tracking-[0.2em]">
        © 2026 Amdox Technologies. All rights reserved.
      </div>
    </div>
  );
}