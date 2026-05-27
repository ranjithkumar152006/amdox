const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const data = await repo.findAll("accounts");
  const totalBalance = data.reduce((s, a) => s + (a.balance || 0), 0);
  res.json({ success: true, total: data.length, totalBalance, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const acc = await repo.findById("accounts", req.params.id);
  if (!acc) return res.status(404).json({ success: false, message: "Account not found." });
  res.json({ success: true, data: acc });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { name, bank, accNo, balance, type } = req.body;
  if (!name || !bank)
    return res.status(400).json({ success: false, message: "name and bank are required." });
  const acc = await repo.create("accounts", {
    id: await repo.nextId("accounts", "ACC"),
    name, bank,
    accNo: accNo || "**** 0000",
    balance: Number(balance) || 0,
    type: type || "Current",
    status: "Active",
  });
  res.status(201).json({ success: true, message: "Account added.", data: acc });
}));

router.put("/:id", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("accounts", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Account not found." });
  const updated = await repo.replaceById("accounts", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Account updated.", data: updated });
}));

module.exports = router;
