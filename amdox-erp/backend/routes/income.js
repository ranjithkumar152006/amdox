const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { month, category, status } = req.query;
  const all = await repo.findAll("income");
  let data = [...all];
  if (month)    data = data.filter((i) => i.month === month);
  if (category) data = data.filter((i) => i.category === category);
  if (status)   data = data.filter((i) => i.status === status);
  const totalReceived = all.filter((i) => i.status === "Received").reduce((s, i) => s + (i.amount || 0), 0);
  const totalPending = all.filter((i) => i.status === "Pending").reduce((s, i) => s + (i.amount || 0), 0);
  res.json({ success: true, total: data.length, summary: { totalReceived, totalPending }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const inc = await repo.findById("income", req.params.id);
  if (!inc) return res.status(404).json({ success: false, message: "Income record not found." });
  res.json({ success: true, data: inc });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { source, category, amount, date, month } = req.body;
  if (!source || !amount)
    return res.status(400).json({ success: false, message: "source and amount are required." });
  const inc = await repo.create("income", {
    id: await repo.nextId("income", "INC"),
    source, category: category || "General",
    amount: Number(amount),
    date: date || new Date().toISOString().slice(0, 10),
    month: month || new Date().toLocaleString("default", { month: "short" }),
    status: "Pending",
  });
  res.status(201).json({ success: true, message: "Income record created.", data: inc });
}));

router.put("/:id/status", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("income", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Income record not found." });
  const updated = await repo.replaceById("income", req.params.id, {
    ...existing, status: req.body.status || "Received",
  });
  res.json({ success: true, message: "Income status updated.", data: updated });
}));

module.exports = router;
