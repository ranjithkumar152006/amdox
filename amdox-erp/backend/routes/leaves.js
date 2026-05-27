const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, type, search } = req.query;
  const all = await repo.findAll("leaves");
  let data = [...all];
  if (status) data = data.filter((l) => l.status === status);
  if (type)   data = data.filter((l) => l.type === type);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((l) => l.name?.toLowerCase().includes(q));
  }
  res.json({
    success: true, total: data.length,
    summary: {
      total: all.length,
      approved: all.filter((l) => l.status === "Approved").length,
      pending: all.filter((l) => l.status === "Pending").length,
      rejected: all.filter((l) => l.status === "Rejected").length,
    },
    data,
  });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const leave = await repo.findById("leaves", req.params.id);
  if (!leave) return res.status(404).json({ success: false, message: "Leave not found." });
  res.json({ success: true, data: leave });
}));

router.post("/", auth, asyncHandler(async (req, res) => {
  const { employeeId, name, type, from, to, days, reason } = req.body;
  if (!employeeId || !type || !from || !to)
    return res.status(400).json({ success: false, message: "employeeId, type, from, to are required." });
  const leave = await repo.create("leaves", {
    id: await repo.nextId("leaves", "LEA"),
    employeeId, name: name || employeeId, type, from, to,
    days: days || 1,
    reason: reason || "",
    status: "Pending",
    appliedOn: new Date().toISOString().slice(0, 10),
  });
  res.status(201).json({ success: true, message: "Leave application submitted.", data: leave });
}));

router.put("/:id/status", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;
  if (!["Approved", "Rejected", "Cancelled"].includes(status))
    return res.status(400).json({ success: false, message: "Invalid status." });
  const existing = await repo.findById("leaves", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Leave not found." });
  const updated = await repo.replaceById("leaves", req.params.id, {
    ...existing, status, remarks: remarks || "", reviewedBy: req.user.name,
  });
  res.json({ success: true, message: `Leave ${status.toLowerCase()}.`, data: updated });
}));

router.delete("/:id", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("leaves", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Leave not found." });
  res.json({ success: true, message: "Leave removed.", data: removed });
}));

module.exports = router;
