const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { search = "", department = "", status = "" } = req.query;
  let data = await repo.findAll("employees");
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((e) =>
      e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.role?.toLowerCase().includes(q)
    );
  }
  if (department) data = data.filter((e) => e.department === department);
  if (status)     data = data.filter((e) => e.status === status);
  res.json({ success: true, total: data.length, data });
}));

router.get("/stats", auth, asyncHandler(async (req, res) => {
  const EMPLOYEES = await repo.findAll("employees");
  const total = EMPLOYEES.length;
  res.json({
    success: true,
    data: {
      total,
      active: EMPLOYEES.filter((e) => e.status === "Active").length,
      onLeave: EMPLOYEES.filter((e) => e.status === "On Leave").length,
      depts: [...new Set(EMPLOYEES.map((e) => e.department))].length,
      newHires: EMPLOYEES.filter((e) => e.joinDate >= "2024-01-01").length,
    },
  });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const emp = await repo.findById("employees", req.params.id);
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });
  res.json({ success: true, data: emp });
}));

router.post("/", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const { name, email, role, department, salary, phone, type } = req.body;
  if (!name || !email || !role || !department)
    return res.status(400).json({ success: false, message: "name, email, role and department are required." });
  const emp = await repo.create("employees", {
    id: await repo.nextId("employees", "EMP"),
    name, email, role, department,
    salary: salary || 0,
    phone: phone || "",
    type: type || "Permanent",
    status: "Active",
    joinDate: new Date().toISOString().slice(0, 10),
    avatar: name.split(" ").map((n) => n[0]).join("").toUpperCase(),
  });
  res.status(201).json({ success: true, message: "Employee created successfully.", data: emp });
}));

router.put("/:id", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("employees", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Employee not found." });
  const updated = await repo.replaceById("employees", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Employee updated.", data: updated });
}));

router.delete("/:id", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("employees", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Employee not found." });
  res.json({ success: true, message: "Employee removed.", data: removed });
}));

module.exports = router;
