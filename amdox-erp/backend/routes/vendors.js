const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  let data = await repo.findAll("vendors");
  if (category) data = data.filter((v) => v.category === category);
  if (status)   data = data.filter((v) => v.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((v) =>
      v.name?.toLowerCase().includes(q) || v.contact?.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, total: data.length, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const vendor = await repo.findById("vendors", req.params.id);
  if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found." });
  res.json({ success: true, data: vendor });
}));

router.post("/", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const { name, contact, phone, category, country, rating } = req.body;
  if (!name || !category)
    return res.status(400).json({ success: false, message: "name and category are required." });

  const vendor = await repo.create("vendors", {
    id: await repo.nextId("vendors", "VND"),
    name, contact: contact || "", phone: phone || "",
    category, country: country || "N/A",
    status: "Active",
    rating: Number(rating) || 3,
    totalOrders: 0,
  });
  res.status(201).json({ success: true, message: "Vendor created.", data: vendor });
}));

router.put("/:id", auth, requireRole("admin", "finance"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("vendors", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Vendor not found." });
  const updated = await repo.replaceById("vendors", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Vendor updated.", data: updated });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("vendors", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Vendor not found." });
  res.json({ success: true, message: "Vendor removed.", data: removed });
}));

module.exports = router;
