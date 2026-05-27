const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { department, level, search } = req.query;
  let data = await repo.findAll("designations");
  if (department) data = data.filter((d) => d.department === department);
  if (level)      data = data.filter((d) => d.level === level);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((d) => d.title?.toLowerCase().includes(q));
  }
  res.json({ success: true, total: data.length, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const des = await repo.findById("designations", req.params.id);
  if (!des) return res.status(404).json({ success: false, message: "Designation not found." });
  res.json({ success: true, data: des });
}));

router.post("/", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const { title, level, department, minSalary, maxSalary } = req.body;
  if (!title || !department)
    return res.status(400).json({ success: false, message: "title and department are required." });
  const des = await repo.create("designations", {
    id: await repo.nextId("designations", "DES"),
    title, level: level || "L1", department,
    minSalary: Number(minSalary) || 0,
    maxSalary: Number(maxSalary) || 0,
  });
  res.status(201).json({ success: true, message: "Designation created.", data: des });
}));

router.put("/:id", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("designations", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Designation not found." });
  const updated = await repo.replaceById("designations", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Designation updated.", data: updated });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("designations", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Designation not found." });
  res.json({ success: true, message: "Designation removed.", data: removed });
}));

module.exports = router;
