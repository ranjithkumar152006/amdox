const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const all = await repo.findAll("payments");
  let data = [...all];
  if (status) data = data.filter((p) => p.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((p) => p.vendor?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }
  const totalPaid = all.filter((p) => p.status === "Paid").reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = all.filter((p) => p.status !== "Paid").reduce((s, p) => s + (p.amount || 0), 0);
  res.json({ success: true, total: data.length, summary: { totalPaid, totalPending }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const pay = await repo.findById("payments", req.params.id);
  if (!pay) return res.status(404).json({ success: false, message: "Payment not found." });
  res.json({ success: true, data: pay });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { vendor, description, amount, dueDate, method } = req.body;
  if (!vendor || !amount)
    return res.status(400).json({ success: false, message: "vendor and amount are required." });
  const pay = await repo.create("payments", {
    id: await repo.nextId("payments", "PAY"),
    vendor, description: description || "",
    amount: Number(amount),
    dueDate: dueDate || new Date().toISOString().slice(0, 10),
    paidDate: null,
    status: "Pending",
    method: method || null,
  });
  res.status(201).json({ success: true, message: "Payment bill created.", data: pay });
}));

router.put("/:id/pay", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("payments", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Payment not found." });
  const updated = await repo.replaceById("payments", req.params.id, {
    ...existing,
    status: "Paid",
    paidDate: new Date().toISOString().slice(0, 10),
    method: req.body.method || existing.method || "Bank Transfer",
  });
  res.json({ success: true, message: "Payment marked as paid.", data: updated });
}));

module.exports = router;
