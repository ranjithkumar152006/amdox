const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  let data = await repo.findAll("departments");
  if (status) data = data.filter((d) => d.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((d) => d.name?.toLowerCase().includes(q) || d.head?.toLowerCase().includes(q));
  }
  res.json({ success: true, total: data.length, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const dept = await repo.findById("departments", req.params.id);
  if (!dept) return res.status(404).json({ success: false, message: "Department not found." });
  res.json({ success: true, data: dept });
}));

router.post("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { name, head, budget, location } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Department name is required." });
  const dept = await repo.create("departments", {
    id: await repo.nextId("departments", "DEP"),
    name, head: head || "TBD",
    employees: 0,
    budget: Number(budget) || 0,
    location: location || "TBD",
    status: "Active",
  });
  res.status(201).json({ success: true, message: "Department created.", data: dept });
}));

router.put("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("departments", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Department not found." });
  const updated = await repo.replaceById("departments", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Department updated.", data: updated });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("departments", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Department not found." });
  res.json({ success: true, message: "Department removed.", data: removed });
}));

module.exports = router;
