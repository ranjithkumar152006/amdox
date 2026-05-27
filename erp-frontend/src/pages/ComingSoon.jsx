import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-fade-in font-['Inter']">
       <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 animate-bounce-in shadow-xl shadow-blue-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="M12 17v.01"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
       </div>
       <h1 className="text-[32px] font-[900] text-[#111827] tracking-tight mb-4">Module Under Construction</h1>
       <p className="text-[16px] text-slate-500 max-w-md mb-10 leading-relaxed font-medium">
          The <span className="text-blue-600 font-[800]">{title}</span> module is currently being optimized with high-fidelity analytics and real-time data sync. Stay tuned!
       </p>
       <Link 
         to="/finance" 
         className="flex items-center gap-2 px-8 py-4 bg-[#111827] text-white rounded-xl text-[14px] font-[700] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
       >
          Return to Finance Hub <ArrowRight size={18} />
       </Link>
    </div>
  );
}
