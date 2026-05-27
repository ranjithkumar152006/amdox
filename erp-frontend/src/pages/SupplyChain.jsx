import { Layers, Truck, Package, Globe, BarChart3, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import Card from "../components/Card";

export default function SupplyChain() {
  return (
    <div className="p-6 space-y-8 animate-fade-in font-['Inter']">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-[700] text-[#111827] leading-[1.2]">Supply Chain Intelligence</h1>
        <p className="text-[14px] text-[#6B7280] font-[400] mt-1">Manage global logistics, vendor relations, and warehouse optimization.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Active Shipments" value="48" trend="up" trendValue="8" Icon={Truck} color="blue" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Global Warehouses" value="12" trend="up" trendValue="1" Icon={Globe} color="emerald" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Pending Orders" value="124" trend="down" trendValue="12" Icon={Clock} color="amber" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Supply Risks" value="02" trend="up" trendValue="1" Icon={AlertTriangle} color="rose" />
        </div>
      </div>

      {/* Logistics Tracking */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[16px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-[16px] font-[700] text-[#111827]">Live Logistics Tracking</h2>
            <span className="flex items-center gap-2 text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              14 Routes Active
            </span>
          </div>
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Globe size={64} className="opacity-10 animate-spin-slow" />
            <p className="font-medium">Interactive Global Logistics Map</p>
            <p className="text-sm opacity-60">Synchronizing with GPS fleet data...</p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 bg-white rounded-[16px] border border-slate-200 shadow-sm p-6">
          <h2 className="text-[16px] font-[700] text-[#111827] mb-6">Vendor Performance</h2>
          <div className="space-y-6">
            {[
              { name: "Global Logistics Ltd", score: 98, status: "Excellent" },
              { name: "Prime Cargo Solutions", score: 85, status: "Good" },
              { name: "Swift Delivery Co", score: 72, status: "Warning" },
            ].map((v, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-bold text-slate-700">{v.name}</span>
                  <span className={`text-[11px] font-black uppercase tracking-widest ${
                    v.status === 'Excellent' ? 'text-emerald-500' : 
                    v.status === 'Good' ? 'text-blue-500' : 'text-rose-500'
                  }`}>{v.status}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      v.score > 90 ? 'bg-emerald-500' : 
                      v.score > 80 ? 'bg-blue-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${v.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
