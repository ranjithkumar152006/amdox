import { Bar, Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

export default function ChartBox({ type = "bar", data: externalData }) {
  const defaultLineData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "This Year",
        data: [15000,25000,18000,35000,22000,45000,38000,52000,48000,65000,58000,75000],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true, tension: 0.4, borderWidth: 3,
        pointRadius: 4, pointBackgroundColor: "#fff",
        pointBorderColor: "#3b82f6", pointBorderWidth: 2,
      },
      {
        label: "Last Year",
        data: [12000,18000,15000,28000,18000,35000,30000,42000,38000,50000,45000,60000],
        borderColor: "#94a3b8", borderDash: [5,5],
        fill: false, tension: 0.4, borderWidth: 2, pointRadius: 0,
      },
    ],
  };

  const buildLineData = (d) => ({
    labels: d.labels,
    datasets: [
      {
        label: "Revenue",
        data: d.revenue,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true, tension: 0.4, borderWidth: 3,
        pointRadius: 4, pointBackgroundColor: "#fff",
        pointBorderColor: "#3b82f6", pointBorderWidth: 2,
      },
      {
        label: "Expenses",
        data: d.expenses,
        borderColor: "#94a3b8", borderDash: [5,5],
        fill: false, tension: 0.4, borderWidth: 2, pointRadius: 0,
      },
    ],
  });

  const lineData = externalData ? buildLineData(externalData) : defaultLineData;

  const doughnutData = {
    labels: ["Operations","Marketing","Purchases","Human Resources","Other"],
    datasets: [{
      data: [45,20,15,12,8],
      backgroundColor: ["#3b82f6","#6366f1","#10b981","#f59e0b","#64748b"],
      borderWidth: 0, hoverOffset: 10,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === "doughnut",
        position: "bottom",
        labels: {
          usePointStyle: true, padding: 20,
          font: { size: 11, family: "'Inter', sans-serif", weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: "#1e293b", padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 }, cornerRadius: 8, displayColors: true,
      },
    },
    scales: type === "line" ? {
      y: { grid: { display: true, color: "#f1f5f9" }, ticks: { color: "#94a3b8", font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 11 } } },
    } : {},
  };

  return (
    <div className="h-72 w-full">
      {type === "line"     && <Line     data={lineData}     options={options} />}
      {type === "doughnut" && <Doughnut data={doughnutData} options={options} />}
      {type === "bar"      && <Bar      data={lineData}     options={options} />}
    </div>
  );
}
