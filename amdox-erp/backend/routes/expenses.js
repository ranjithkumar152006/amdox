const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, category, search } = req.query;
  let data = await repo.findAll("expenses");
  if (status)   data = data.filter((e) => e.status === status);
  if (category) data = data.filter((e) => e.category === category);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((e) => e.description?.toLowerCase().includes(q));
  }
  const totalApproved = data.filter((e) => e.status === "Approved").reduce((s, e) => s + e.amount, 0);
  const totalPending  = data.filter((e) => e.status === "Pending").reduce((s, e) => s + e.amount, 0);
  res.json({ success: true, total: data.length, summary: { totalApproved, totalPending }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const exp = await repo.findById("expenses", req.params.id);
  if (!exp) return res.status(404).json({ success: false, message: "Expense not found." });
  res.json({ success: true, data: exp });
}));

router.post("/", auth, asyncHandler(async (req, res) => {
  const { description, category, amount, date, receipt } = req.body;
  if (!description || !amount || !category)
    return res.status(400).json({ success: false, message: "description, amount, and category are required." });

  const exp = await repo.create("expenses", {
    id: await repo.nextId("expenses", "EXP"),
    description, category,
    amount: Number(amount),
    date: date || new Date().toISOString().slice(0, 10),
    approvedBy: null,
    status: "Pending",
    receipt: receipt || false,
  });
  res.status(201).json({ success: true, message: "Expense claim submitted.", data: exp });
}));

router.put("/:id/approve", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("expenses", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Expense not found." });
  const updated = await repo.replaceById("expenses", req.params.id, {
    ...existing, status: "Approved", approvedBy: req.user.name,
  });
  res.json({ success: true, message: "Expense approved.", data: updated });
}));

router.put("/:id/reject", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("expenses", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Expense not found." });
  const updated = await repo.replaceById("expenses", req.params.id, { ...existing, status: "Rejected" });
  res.json({ success: true, message: "Expense rejected.", data: updated });
}));

module.exports = router;
