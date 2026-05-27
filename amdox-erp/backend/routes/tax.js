const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const all = await repo.findAll("tax");
  let data = [...all];
  if (status) data = data.filter((t) => t.status === status);
  if (type)   data = data.filter((t) => t.type === type);
  const totalTaxLiability = all.reduce((s, t) => s + (t.taxAmount || 0), 0);
  const totalPaid = all.reduce((s, t) => s + (t.paidAmount || 0), 0);
  res.json({ success: true, total: data.length, summary: { totalTaxLiability, totalPaid, totalDue: totalTaxLiability - totalPaid }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const record = await repo.findById("tax", req.params.id);
  if (!record) return res.status(404).json({ success: false, message: "Tax record not found." });
  res.json({ success: true, data: record });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { type, period, taxableAmount, rate, dueDate } = req.body;
  if (!type || !period || !taxableAmount || !rate)
    return res.status(400).json({ success: false, message: "type, period, taxableAmount, and rate are required." });
  const taxAmount = (Number(taxableAmount) * Number(rate)) / 100;
  const record = await repo.create("tax", {
    id: await repo.nextId("tax", "TAX"),
    type, period,
    taxableAmount: Number(taxableAmount),
    rate: Number(rate),
    taxAmount,
    paidAmount: 0,
    dueDate: dueDate || new Date().toISOString().slice(0, 10),
    status: "Pending",
  });
  res.status(201).json({ success: true, message: "Tax record created.", data: record });
}));

router.put("/:id/file", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("tax", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Tax record not found." });
  const updated = await repo.replaceById("tax", req.params.id, {
    ...existing, paidAmount: existing.taxAmount, status: "Filed",
  });
  res.json({ success: true, message: "Tax filed successfully.", data: updated });
}));

module.exports = router;
