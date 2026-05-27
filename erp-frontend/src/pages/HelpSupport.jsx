import { HelpCircle, Book, MessageSquare, Phone, ExternalLink } from "lucide-react";

export default function HelpSupport() {
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen animate-fade-in font-['Inter']">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Help & Support</h1>
          <p className="text-[14px] text-slate-500 font-medium">Access documentation, submit tickets, and contact system administrators.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Contact Cards */}
        {[
          { title: "Documentation", desc: "Read guides and API docs.", Icon: Book, color: "blue", action: "View Docs" },
          { title: "IT Support Desk", desc: "Submit a technical ticket.", Icon: MessageSquare, color: "indigo", action: "Open Ticket" },
          { title: "Emergency Contact", desc: "Critical system failures only.", Icon: Phone, color: "rose", action: "Call Now" },
        ].map((c, i) => (
          <div key={i} className="col-span-12 md:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
             <div className={`w-14 h-14 rounded-2xl bg-${c.color}-50 text-${c.color}-600 flex items-center justify-center border border-${c.color}-100 mb-6 group-hover:scale-110 transition-transform`}>
                <c.Icon size={28} />
             </div>
             <h3 className="text-[18px] font-[800] text-slate-800 mb-2">{c.title}</h3>
             <p className="text-[13px] text-slate-500 font-medium mb-6">{c.desc}</p>
             <button className={`text-[13px] font-[800] text-${c.color}-600 flex items-center gap-1 group-hover:underline`}>
                {c.action} <ExternalLink size={14} />
             </button>
          </div>
        ))}

        {/* FAQs */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
           <h2 className="text-[20px] font-[800] text-slate-800 mb-8 flex items-center gap-3">
              <HelpCircle className="text-blue-600" /> Frequently Asked Questions
           </h2>
           <div className="space-y-6">
              {[
                { q: "How do I reset my password?", a: "Navigate to your Profile settings in the top right corner and click 'Change Password'. You will need to verify via email." },
                { q: "Who can approve financial transactions?", a: "Only users with the 'Finance Manager' or 'Admin' role can approve transactions exceeding $10,000." },
                { q: "Where can I find my payslips?", a: "Go to the HR portal and click on 'Payroll'. All historical payslips are available for download in PDF format." },
              ].map((faq, i) => (
                 <div key={i} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <h4 className="text-[15px] font-[700] text-slate-800 mb-2">{faq.q}</h4>
                    <p className="text-[14px] text-slate-500 leading-relaxed">{faq.a}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
