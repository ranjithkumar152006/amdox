const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth } = require("../middleware/auth");

router.get("/finance", auth, asyncHandler(async (req, res) => {
  const INCOME = await repo.findAll("income");
  const EXPENSES = await repo.findAll("expenses");
  const INVOICES = await repo.findAll("invoices");
  const totalIncome = INCOME.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpenses = EXPENSES.reduce((s, e) => s + (e.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  res.json({
    success: true,
    data: {
      totalIncome, totalExpenses, netProfit,
      invoiceTotal: INVOICES.reduce((s, i) => s + (i.total || 0), 0),
      pendingInvoices: INVOICES.filter((i) => i.status !== "Paid").length,
      profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0,
      expenseBreakdown: EXPENSES.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {}),
    },
  });
}));

router.get("/hr", auth, asyncHandler(async (req, res) => {
  const EMPLOYEES = await repo.findAll("employees");
  const total = EMPLOYEES.length;
  res.json({
    success: true,
    data: {
      total,
      active: EMPLOYEES.filter((e) => e.status === "Active").length,
      onLeave: EMPLOYEES.filter((e) => e.status === "On Leave").length,
      deptDist: EMPLOYEES.reduce((acc, e) => { acc[e.department] = (acc[e.department] || 0) + 1; return acc; }, {}),
      typeDist: EMPLOYEES.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {}),
      avgSalary: total ? (EMPLOYEES.reduce((s, e) => s + (e.salary || 0), 0) / total).toFixed(0) : 0,
    },
  });
}));

router.get("/inventory", auth, asyncHandler(async (req, res) => {
  const INVENTORY = await repo.findAll("inventory");
  res.json({
    success: true,
    data: {
      total: INVENTORY.length,
      inStock: INVENTORY.filter((p) => p.status === "In Stock").length,
      lowStock: INVENTORY.filter((p) => p.status === "Low Stock").length,
      outOfStock: INVENTORY.filter((p) => p.status === "Out of Stock").length,
      totalValue: INVENTORY.reduce((s, p) => s + (p.totalValue || 0), 0),
      categoryDist: INVENTORY.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {}),
    },
  });
}));

router.get("/projects", auth, asyncHandler(async (req, res) => {
  const PROJECTS = await repo.findAll("projects");
  const total = PROJECTS.length;
  res.json({
    success: true,
    data: {
      total,
      totalBudget: PROJECTS.reduce((s, p) => s + (p.budget || 0), 0),
      totalSpent: PROJECTS.reduce((s, p) => s + (p.spent || 0), 0),
      avgProgress: total ? (PROJECTS.reduce((s, p) => s + (p.progress || 0), 0) / total).toFixed(1) : 0,
      statusDist: PROJECTS.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {}),
    },
  });
}));

router.get("/summary", auth, asyncHandler(async (req, res) => {
  const [income, expenses, employees, projects, inventory, invoices, transactions] = await Promise.all([
    repo.findAll("income"), repo.findAll("expenses"), repo.findAll("employees"),
    repo.findAll("projects"), repo.findAll("inventory"), repo.findAll("invoices"),
    repo.findAll("transactions"),
  ]);
  res.json({
    success: true,
    data: {
      revenue: income.reduce((s, i) => s + (i.amount || 0), 0),
      expenses: expenses.reduce((s, e) => s + (e.amount || 0), 0),
      employees: employees.length,
      projects: projects.length,
      inventory: inventory.length,
      invoices: invoices.length,
      transactions: transactions.length,
    },
  });
}));

module.exports = router;
