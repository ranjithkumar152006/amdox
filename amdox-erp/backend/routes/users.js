const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const stripPw = (u) => { const { password: _pw, ...safe } = u; return safe; };

router.get("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { role, status, search } = req.query;
  let data = (await repo.findAll("users")).map(stripPw);
  if (role)   data = data.filter((u) => u.role === role);
  if (status) data = data.filter((u) => u.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }
  res.json({ success: true, total: data.length, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  if (req.user.role !== "admin" && req.user.id !== req.params.id)
    return res.status(403).json({ success: false, message: "Access denied." });
  const user = await repo.findById("users", req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, data: stripPw(user) });
}));

router.post("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { name, email, password, role, department, phone } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ success: false, message: "name, email, password, and role are required." });
  if (await repo.findByEmail("users", email))
    return res.status(409).json({ success: false, message: "Email already in use." });

  const user = await repo.create("users", {
    id: await repo.nextId("users", "USR"),
    name, email,
    password: bcrypt.hashSync(password, 10),
    role, department: department || "General",
    phone: phone || "",
    status: "Active",
    lastLogin: "Never",
    avatar: name.split(" ").map((n) => n[0]).join("").toUpperCase(),
  });
  res.status(201).json({ success: true, message: "User created.", data: stripPw(user) });
}));

router.put("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("users", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "User not found." });
  const body = { ...req.body };
  if (body.password) body.password = bcrypt.hashSync(body.password, 10);
  const updated = await repo.replaceById("users", req.params.id, { ...existing, ...body, id: existing.id });
  res.json({ success: true, message: "User updated.", data: stripPw(updated) });
}));

router.put("/:id/toggle-status", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("users", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "User not found." });
  const status = existing.status === "Active" ? "Inactive" : "Active";
  await repo.updateById("users", req.params.id, { status });
  res.json({ success: true, message: `User ${status.toLowerCase()}.`, status });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id)
    return res.status(400).json({ success: false, message: "Cannot delete your own account." });
  const removed = await repo.deleteById("users", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, message: "User removed.", data: stripPw(removed) });
}));

module.exports = router;
