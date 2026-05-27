const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const all = await repo.findAll("invoices");
  let data = [...all];
  if (status) data = data.filter((i) => i.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((i) => i.client?.toLowerCase().includes(q) || i.id?.toLowerCase().includes(q));
  }
  const summary = {
    total: all.reduce((s, i) => s + (i.total || 0), 0),
    paid: all.filter((i) => i.status === "Paid").reduce((s, i) => s + (i.total || 0), 0),
    pending: all.filter((i) => i.status === "Pending").reduce((s, i) => s + (i.total || 0), 0),
    overdue: all.filter((i) => i.status === "Overdue").reduce((s, i) => s + (i.total || 0), 0),
    countPaid: all.filter((i) => i.status === "Paid").length,
    countPending: all.filter((i) => i.status === "Pending").length,
    countOverdue: all.filter((i) => i.status === "Overdue").length,
  };
  res.json({ success: true, total: data.length, summary, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const inv = await repo.findById("invoices", req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: "Invoice not found." });
  res.json({ success: true, data: inv });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { client, issue, due, amount, tax, items } = req.body;
  if (!client || !amount)
    return res.status(400).json({ success: false, message: "client and amount are required." });
  const count = await repo.count("invoices");
  const taxAmt = Number(tax) || Number(amount) * 0.1;
  const inv = await repo.create("invoices", {
    id: `INV-${1246 + count}`,
    client,
    issue: issue || new Date().toISOString().slice(0, 10),
    due: due || new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
    amount: Number(amount),
    tax: taxAmt,
    total: Number(amount) + taxAmt,
    status: "Pending",
    items: items || [],
  });
  res.status(201).json({ success: true, message: "Invoice created.", data: inv });
}));

router.put("/:id/status", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["Paid", "Pending", "Overdue", "Cancelled"].includes(status))
    return res.status(400).json({ success: false, message: "Invalid status." });
  const existing = await repo.findById("invoices", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Invoice not found." });
  const updated = await repo.replaceById("invoices", req.params.id, { ...existing, status });
  res.json({ success: true, message: `Invoice marked as ${status}.`, data: updated });
}));

module.exports = router;
