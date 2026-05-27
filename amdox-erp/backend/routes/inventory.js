const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { search = "", category = "", status = "" } = req.query;
  let data = await repo.findAll("inventory");
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((p) =>
      p.name?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    );
  }
  if (category) data = data.filter((p) => p.category === category);
  if (status)   data = data.filter((p) => p.status === status);
  res.json({ success: true, total: data.length, data });
}));

router.get("/stats", auth, asyncHandler(async (req, res) => {
  const INVENTORY = await repo.findAll("inventory");
  res.json({
    success: true,
    data: {
      total: INVENTORY.length,
      inStock: INVENTORY.filter((p) => p.status === "In Stock").length,
      lowStock: INVENTORY.filter((p) => p.status === "Low Stock").length,
      outOfStock: INVENTORY.filter((p) => p.status === "Out of Stock").length,
      totalValue: INVENTORY.reduce((sum, p) => sum + (p.totalValue || 0), 0),
    },
  });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const item = await repo.findById("inventory", req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Product not found." });
  res.json({ success: true, data: item });
}));

router.post("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { name, category, sku, stock, unitPrice, supplier, reorderLevel } = req.body;
  if (!name || !category)
    return res.status(400).json({ success: false, message: "name and category are required." });
  const stockQty = parseInt(stock) || 0;
  const price = parseFloat(unitPrice) || 0;
  const product = await repo.create("inventory", {
    id: await repo.nextId("inventory", "PRD"),
    name, category,
    sku: sku || `SKU-${Date.now()}`,
    stock: stockQty,
    unitPrice: price,
    totalValue: stockQty * price,
    supplier: supplier || "N/A",
    reorderLevel: reorderLevel || 5,
    status: stockQty === 0 ? "Out of Stock" : stockQty < 10 ? "Low Stock" : "In Stock",
  });
  res.status(201).json({ success: true, message: "Product added.", data: product });
}));

router.put("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("inventory", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Product not found." });
  const updated = { ...existing, ...req.body, id: existing.id };
  const stockQty = updated.stock;
  updated.totalValue = stockQty * updated.unitPrice;
  updated.status = stockQty === 0 ? "Out of Stock" : stockQty < 10 ? "Low Stock" : "In Stock";
  const saved = await repo.replaceById("inventory", req.params.id, updated);
  res.json({ success: true, message: "Product updated.", data: saved });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("inventory", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Product not found." });
  res.json({ success: true, message: "Product removed.", data: removed });
}));

module.exports = router;
