import { TrendingUp, TrendingDown, Target, Zap, PieChart, BarChart3, LineChart } from "lucide-react";
import Card from "../components/Card";

export default function Analytics() {
  return (
    <div className="p-6 space-y-8 animate-fade-in font-['Inter']">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-[700] text-[#111827] leading-[1.2]">AI Predictive Analytics</h1>
        <p className="text-[14px] text-[#6B7280] font-[400] mt-1">Harness machine learning to forecast trends and optimize business decisions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Forecast Accuracy" value="98.4%" trend="up" trendValue="2.1" Icon={Target} color="emerald" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Revenue Prediction" value="$1.2M" trend="up" trendValue="15" Icon={TrendingUp} color="blue" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Churn Risk" value="0.8%" trend="down" trendValue="0.4" Icon={TrendingDown} color="rose" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Efficiency Gain" value="+22%" trend="up" trendValue="5.2" Icon={Zap} color="amber" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm h-[400px] flex flex-col items-center justify-center text-slate-400">
           <LineChart size={48} className="mb-4 opacity-20" />
           <p className="font-medium">Market Trend Analysis Chart</p>
           <p className="text-sm opacity-60">Real-time predictive modeling active</p>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm h-[400px] flex flex-col items-center justify-center text-slate-400">
           <PieChart size={48} className="mb-4 opacity-20" />
           <p className="font-medium">Operational Distribution</p>
           <p className="text-sm opacity-60">AI Cluster segmentation</p>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-[#0b1424] rounded-[16px] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="text-amber-400" size={24} />
            AI Insight of the Day
          </h2>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Based on current supply chain velocities and inventory turnover, we recommend increasing procurement for 
            <span className="text-blue-400 font-bold ml-1">Electronics (High Demand)</span> category by 15% to avoid stockouts in Q3.
          </p>
          <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-all">
            Execute Auto-Procurement
          </button>
        </div>
      </div>
    </div>
  );
}
