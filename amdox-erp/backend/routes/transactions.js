const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { type, category, status, search } = req.query;
  let data = await repo.findAll("transactions");
  if (type)     data = data.filter((t) => t.type === type);
  if (category) data = data.filter((t) => t.category === category);
  if (status)   data = data.filter((t) => t.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((t) => t.label?.toLowerCase().includes(q) || t.party?.toLowerCase().includes(q));
  }
  const totalIncome = data.filter((t) => t.type === "income").reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = data.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount || 0), 0);
  res.json({ success: true, total: data.length, summary: { totalIncome, totalExpense, net: totalIncome - totalExpense }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const txn = await repo.findById("transactions", req.params.id);
  if (!txn) return res.status(404).json({ success: false, message: "Transaction not found." });
  res.json({ success: true, data: txn });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { label, party, amount, type, category, date, paymentMethod } = req.body;
  if (!label || !amount || !type)
    return res.status(400).json({ success: false, message: "label, amount, and type are required." });
  const txn = await repo.create("transactions", {
    id: await repo.nextId("transactions", "TXN"),
    label, party: party || "N/A",
    amount: Number(amount),
    type: type === "expense" ? "expense" : "income",
    category: category || "General",
    date: date || new Date().toISOString().slice(0, 10),
    status: "Completed",
    paymentMethod: paymentMethod || "Bank Transfer",
  });
  res.status(201).json({ success: true, message: "Transaction recorded.", data: txn });
}));

module.exports = router;
