const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { department, status, fiscalYear } = req.query;
  const all = await repo.findAll("budgets");
  let data = [...all];
  if (department) data = data.filter((b) => b.department === department);
  if (status)     data = data.filter((b) => b.status === status);
  if (fiscalYear) data = data.filter((b) => b.fiscalYear === fiscalYear);
  const totalAllocated = all.reduce((s, b) => s + (b.allocated || 0), 0);
  const totalSpent = all.reduce((s, b) => s + (b.spent || 0), 0);
  const totalRemaining = all.reduce((s, b) => s + (b.remaining || 0), 0);
  res.json({ success: true, total: data.length, summary: { totalAllocated, totalSpent, totalRemaining }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const budget = await repo.findById("budgets", req.params.id);
  if (!budget) return res.status(404).json({ success: false, message: "Budget not found." });
  res.json({ success: true, data: budget });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { department, fiscalYear, allocated } = req.body;
  if (!department || !allocated)
    return res.status(400).json({ success: false, message: "department and allocated are required." });
  const budget = await repo.create("budgets", {
    id: await repo.nextId("budgets", "BGT"),
    department,
    fiscalYear: fiscalYear || "FY 2024",
    allocated: Number(allocated),
    spent: 0,
    remaining: Number(allocated),
    status: "On Track",
  });
  res.status(201).json({ success: true, message: "Budget created.", data: budget });
}));

router.put("/:id", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("budgets", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Budget not found." });
  const updated = { ...existing, ...req.body, id: existing.id };
  updated.remaining = updated.allocated - updated.spent;
  const pct = updated.remaining / updated.allocated;
  updated.status = pct > 0.2 ? "On Track" : pct > 0.05 ? "At Risk" : "Critical";
  const saved = await repo.replaceById("budgets", req.params.id, updated);
  res.json({ success: true, message: "Budget updated.", data: saved });
}));

module.exports = router;
