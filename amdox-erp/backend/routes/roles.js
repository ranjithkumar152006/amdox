const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const data = await repo.findAll("roles");
  res.json({ success: true, total: data.length, data });
}));

router.get("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const role = await repo.findById("roles", req.params.id);
  if (!role) return res.status(404).json({ success: false, message: "Role not found." });
  res.json({ success: true, data: role });
}));

router.post("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { name, description, permissions } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Role name is required." });
  const all = await repo.findAll("roles");
  if (all.find((r) => r.name?.toLowerCase() === name.toLowerCase()))
    return res.status(409).json({ success: false, message: "Role already exists." });
  const role = await repo.create("roles", {
    id: await repo.nextId("roles", "ROL"),
    name, description: description || "",
    permissions: permissions || [],
    userCount: 0,
  });
  res.status(201).json({ success: true, message: "Role created.", data: role });
}));

router.put("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("roles", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Role not found." });
  const updated = await repo.replaceById("roles", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Role updated.", data: updated });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("roles", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Role not found." });
  if (existing.name === "Super Admin")
    return res.status(400).json({ success: false, message: "Cannot delete Super Admin role." });
  const removed = await repo.deleteById("roles", req.params.id);
  res.json({ success: true, message: "Role removed.", data: removed });
}));

module.exports = router;
