const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const all = await repo.findAll("assets");
  let data = [...all];
  if (category) data = data.filter((a) => a.category === category);
  if (status)   data = data.filter((a) => a.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((a) => a.name?.toLowerCase().includes(q) || a.assignedTo?.toLowerCase().includes(q));
  }
  const totalPurchaseValue = all.reduce((s, a) => s + (a.purchaseValue || 0), 0);
  const totalCurrentValue = all.reduce((s, a) => s + (a.currentValue || 0), 0);
  res.json({ success: true, total: data.length, summary: { totalPurchaseValue, totalCurrentValue, depreciation: totalPurchaseValue - totalCurrentValue }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const asset = await repo.findById("assets", req.params.id);
  if (!asset) return res.status(404).json({ success: false, message: "Asset not found." });
  res.json({ success: true, data: asset });
}));

router.post("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { name, category, location, purchaseDate, purchaseValue, currentValue, assignedTo } = req.body;
  if (!name || !category)
    return res.status(400).json({ success: false, message: "name and category are required." });
  const asset = await repo.create("assets", {
    id: await repo.nextId("assets", "AST"),
    name, category,
    location: location || "TBD",
    purchaseDate: purchaseDate || new Date().toISOString().slice(0, 10),
    purchaseValue: Number(purchaseValue) || 0,
    currentValue: Number(currentValue) || Number(purchaseValue) || 0,
    status: "In Use",
    assignedTo: assignedTo || "Unassigned",
  });
  res.status(201).json({ success: true, message: "Asset registered.", data: asset });
}));

router.put("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("assets", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Asset not found." });
  const updated = await repo.replaceById("assets", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Asset updated.", data: updated });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("assets", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Asset not found." });
  res.json({ success: true, message: "Asset removed.", data: removed });
}));

module.exports = router;
