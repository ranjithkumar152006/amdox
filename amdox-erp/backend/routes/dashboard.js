const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth } = require("../middleware/auth");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function monthFromRecord(record) {
  if (record?.month && MONTHS.includes(record.month)) return record.month;
  if (record?.date) {
    const date = new Date(record.date);
    if (!Number.isNaN(date.getTime())) return MONTHS[date.getMonth()];
  }
  return MONTHS[new Date().getMonth()];
}

function timeAgo(input) {
  if (!input) return "just now";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const diffSec = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function pctTrend(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

async function buildDashboardData() {
  const [
    users,
    projects,
    transactions,
    income,
    expenses,
    invoices,
    auditLogs,
    fallbackDashboard,
  ] = await Promise.all([
    repo.findAll("users"),
    repo.findAll("projects"),
    repo.findAll("transactions"),
    repo.findAll("income"),
    repo.findAll("expenses"),
    repo.findAll("invoices"),
    repo.findAll("auditLogs"),
    repo.getDashboard(),
  ]);

  const revenueByMonth = Object.fromEntries(MONTHS.map((m) => [m, 0]));
  const expenseByMonth = Object.fromEntries(MONTHS.map((m) => [m, 0]));
  transactions
    .filter((t) => t.type === "income")
    .forEach((t) => { revenueByMonth[monthFromRecord(t)] += toNumber(t.amount); });
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => { expenseByMonth[monthFromRecord(t)] += Math.abs(toNumber(t.amount)); });
  income
    .filter((i) => i.status !== "Cancelled")
    .forEach((i) => { revenueByMonth[monthFromRecord(i)] += toNumber(i.amount); });
  expenses.forEach((e) => { expenseByMonth[monthFromRecord(e)] += toNumber(e.amount); });

  const totalRevenue = Object.values(revenueByMonth).reduce((s, n) => s + n, 0);
  const totalExpense = expenses.reduce((s, e) => s + toNumber(e.amount), 0)
    + transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(toNumber(t.amount)), 0);
  const netProfit = Math.max(0, totalRevenue - totalExpense);

  const nowMonthIdx = new Date().getMonth();
  const prevMonthIdx = (nowMonthIdx + 11) % 12;
  const currentRevenue = revenueByMonth[MONTHS[nowMonthIdx]];
  const previousRevenue = revenueByMonth[MONTHS[prevMonthIdx]];
  const currentProfit = Math.max(0, currentRevenue - totalExpense / 12);
  const previousProfit = Math.max(0, previousRevenue - totalExpense / 12);

  const activeProjects = projects.filter((p) => !["Completed", "Cancelled"].includes(p.status)).length;
  const healthyProjects = projects.filter((p) => ["Healthy", "Excellent"].includes(p.status)).length;
  const satisfaction = projects.length
    ? Math.max(70, Math.min(99, Math.round((healthyProjects / projects.length) * 100)))
    : 98;

  const recentActivity = (auditLogs.length ? auditLogs : (fallbackDashboard?.recentActivity || []))
    .slice()
    .sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")))
    .slice(0, 6)
    .map((item, index) => ({
      id: item.id || `ACT-${index + 1}`,
      user: item.user || "System",
      action: item.description || item.action || "Updated records",
      time: timeAgo(item.timestamp),
    }));

  const topProjects = (projects.length ? projects : (fallbackDashboard?.topProjects || []))
    .slice()
    .sort((a, b) => toNumber(b.progress) - toNumber(a.progress))
    .slice(0, 4)
    .map((p, index) => ({
      id: p.id || `PRJ-${index + 1}`,
      name: p.name || `Project ${index + 1}`,
      progress: Math.max(0, Math.min(100, Math.round(toNumber(p.progress)))),
      status: p.status || "Healthy",
    }));

  const monthlyRevenue = {
    labels: MONTHS,
    revenue: MONTHS.map((m) => Math.round(revenueByMonth[m])),
    expenses: MONTHS.map((m) => Math.round(expenseByMonth[m])),
  };

  return {
    stats: {
      totalRevenue: { value: Math.round(totalRevenue), trend: "up", trendValue: Math.max(0, pctTrend(currentRevenue, previousRevenue)) },
      netProfit: { value: Math.round(netProfit), trend: "up", trendValue: Math.max(0, pctTrend(currentProfit, previousProfit)) },
      activeProjects: { value: activeProjects, trend: "up", trendValue: Math.max(0, projects.length ? Number(((activeProjects / projects.length) * 100).toFixed(1)) : 0) },
      satisfaction: { value: satisfaction, trend: "up", trendValue: Math.max(0, Number((satisfaction / 10).toFixed(1))) },
      totals: {
        users: users.length,
        invoices: invoices.length,
      },
    },
    recentActivity,
    monthlyRevenue,
    topProjects,
  };
}

router.get("/", auth, asyncHandler(async (req, res) => {
  const data = await buildDashboardData();
  res.json({ success: true, data });
}));

router.get("/stats", auth, asyncHandler(async (req, res) => {
  const data = await buildDashboardData();
  res.json({ success: true, data: data?.stats });
}));

router.get("/recent-activity", auth, asyncHandler(async (req, res) => {
  const data = await buildDashboardData();
  res.json({ success: true, data: data?.recentActivity });
}));

router.get("/monthly-revenue", auth, asyncHandler(async (req, res) => {
  const data = await buildDashboardData();
  res.json({ success: true, data: data?.monthlyRevenue });
}));

router.get("/top-projects", auth, asyncHandler(async (req, res) => {
  const data = await buildDashboardData();
  res.json({ success: true, data: data?.topProjects });
}));

module.exports = router;
